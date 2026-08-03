/**
 * Worker do transactional outbox — Etapa 11.1 §9/§10.
 *
 * Semântica declarada: AT_LEAST_ONCE + CONSUMIDOR_IDEMPOTENTE.
 * Nunca "exactly-once".
 *
 * - claim atômico via `public.claim_outbox_messages` (FOR UPDATE SKIP LOCKED);
 * - cada evento reivindicado recebe `claim_token` e `lease_until`;
 * - a conclusão só é aceita quando o `claim_token` confere;
 * - dois workers nunca entregam o mesmo evento simultaneamente;
 * - falha de notificação nunca apaga nem invalida a cotação;
 * - fora de produção nenhuma mensagem sai da aplicação (`SIMULATED`).
 */
import { getEmailProvider } from "@/services/adapters.server";
import { getServerConfig } from "@/lib/env.server";
import { logger } from "@/lib/logger";
import { increment, observe, setGauge } from "@/observability/metrics";
import { OUTBOX_BACKOFF_MINUTES, OUTBOX_LEASE_SECONDS, OUTBOX_MAX_ATTEMPTS } from "./model";
import {
  confirmationTemplate,
  internalNoticeTemplate,
  type QuotationMessageData,
} from "./templates";

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface OutboxRunResult {
  claimed: number;
  processed: number;
  sent: number;
  simulated: number;
  failed: number;
  deadLettered: number;
}

export function backoffFor(attempt: number): string {
  const minutes =
    OUTBOX_BACKOFF_MINUTES[Math.min(attempt, OUTBOX_BACKOFF_MINUTES.length) - 1] ?? 240;
  return new Date(Date.now() + minutes * 60_000).toISOString();
}

/** Identificador estável do worker corrente (sem PII). */
export function workerId(): string {
  return process.env["OUTBOX_WORKER_ID"] ?? `worker-${globalThis.crypto.randomUUID().slice(0, 8)}`;
}

async function buildMessage(
  admin: any,
  row: any,
): Promise<{ to: string; subject: string; text: string; template: string } | null> {
  const { data: quotation } = await admin
    .from("quotations")
    .select(
      "protocol, company_name, contact_name, contact_email, contact_phone, city, state_uf, message",
    )
    .eq("id", row.quotation_id)
    .maybeSingle();
  if (!quotation) return null;

  const { data: items } = await admin
    .from("quotation_items")
    .select("snapshot_sku, snapshot_name, snapshot_variation, quantity, note, was_available")
    .eq("quotation_id", row.quotation_id)
    .order("position");

  const data: QuotationMessageData = {
    protocol: quotation.protocol,
    companyName: quotation.company_name,
    contactName: quotation.contact_name,
    contactEmail: quotation.contact_email,
    contactPhone: quotation.contact_phone,
    city: quotation.city ?? null,
    stateUf: quotation.state_uf ?? null,
    message: quotation.message ?? null,
    items: (items ?? []).map((i: any) => ({
      sku: i.snapshot_sku,
      name: i.snapshot_name,
      variation: i.snapshot_variation ?? null,
      quantity: i.quantity,
      note: i.note ?? null,
      available: i.was_available,
    })),
    adminUrl: `${process.env["APP_PUBLIC_URL"] ?? ""}/admin/cotacoes`,
  };

  if (row.message_type === "QUOTATION_INTERNAL_NOTICE") {
    const to = process.env["QUOTATION_INTERNAL_EMAIL"];
    if (!to) return null;
    const tpl = internalNoticeTemplate(data);
    return { to, ...tpl, template: "quotation-internal-notice" };
  }
  if (row.message_type === "QUOTATION_CONFIRMATION") {
    const tpl = confirmationTemplate(data);
    return { to: data.contactEmail, ...tpl, template: "quotation-confirmation" };
  }
  return null;
}

/** Processa um lote reivindicado. Idempotente por linha. */
export async function processOutbox(limit = 20): Promise<OutboxRunResult> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const admin = supabaseAdmin as any;
  const { APP_ENV } = getServerConfig();
  const externalSendingEnabled = APP_ENV === "production";
  const worker = workerId();
  const startedAt = Date.now();

  const result: OutboxRunResult = {
    claimed: 0,
    processed: 0,
    sent: 0,
    simulated: 0,
    failed: 0,
    deadLettered: 0,
  };

  // 1. Claim atômico — nenhum evento é lido sem ser reservado.
  const { data: rows, error } = await admin.rpc("claim_outbox_messages", {
    p_worker_id: worker,
    p_limit: limit,
    p_lease_seconds: OUTBOX_LEASE_SECONDS,
  });

  if (error) {
    logger.error("outbox.claim.failure", { code: error.code ?? null });
    increment("outbox_failed_total", { reason: "claim" });
    return result;
  }

  result.claimed = (rows ?? []).length;

  for (const row of rows ?? []) {
    result.processed += 1;
    const attempts = (row.attempts ?? 0) + 1;
    try {
      const message = await buildMessage(admin, row);
      if (!message) throw new Error("destinatário ou template indisponível");

      if (!externalSendingEnabled) {
        // 2a. Ambiente não produtivo: entrega simulada, jamais externa.
        await admin.rpc("complete_outbox_message", {
          p_id: row.id,
          p_claim_token: row.claim_token,
          p_status: "SIMULATED",
          p_attempts: attempts,
        });
        result.simulated += 1;
      } else {
        await getEmailProvider().send({
          to: message.to,
          subject: message.subject,
          text: message.text,
          template: message.template,
        });
        await admin.rpc("complete_outbox_message", {
          p_id: row.id,
          p_claim_token: row.claim_token,
          p_status: "DELIVERED",
          p_attempts: attempts,
        });
        result.sent += 1;
      }

      increment("outbox_delivered_total", {
        outcome: externalSendingEnabled ? "delivered" : "simulated",
      });

      if (row.quotation_id) {
        await admin.from("quotation_events").insert({
          quotation_id: row.quotation_id,
          event_type: "NOTIFICATION",
          actor_label: "sistema",
          internal_note: `Notificação ${row.message_type} ${externalSendingEnabled ? "entregue" : "simulada"}.`,
        });
      }
    } catch (err) {
      const dead = attempts >= (row.max_attempts ?? OUTBOX_MAX_ATTEMPTS);
      await admin.rpc("complete_outbox_message", {
        p_id: row.id,
        p_claim_token: row.claim_token,
        p_status: dead ? "FAILED" : "RETRY_SCHEDULED",
        p_attempts: attempts,
        p_next_attempt_at: backoffFor(attempts),
        // Mensagem curta e sem dado pessoal.
        p_last_error: String((err as Error).message ?? "falha").slice(0, 200),
      });
      if (dead) result.deadLettered += 1;
      else result.failed += 1;
      increment("outbox_failed_total", { reason: dead ? "exhausted" : "retry" });
      logger.warn("outbox.attempt.failure", { messageType: row.message_type, attempts, dead });
    }
  }

  observe("outbox_processing_duration_ms", Date.now() - startedAt, { outcome: "run" });

  const { count } = await admin
    .from("outbox_messages")
    .select("id", { count: "exact", head: true })
    .in("status", ["PENDING", "RETRY_SCHEDULED"]);
  if (typeof count === "number") setGauge("outbox_pending", count);

  return result;
}

/** Libera reservas vencidas (lease expirado) para novo claim. */
export async function releaseExpiredLeases(admin: any): Promise<number> {
  const { data, error } = await admin.rpc("release_expired_outbox_leases");
  if (error) throw new Error(error.message);
  return typeof data === "number" ? data : 0;
}

/** Recolocação administrativa de uma mensagem na fila. */
export async function requeueOutboxMessage(admin: any, id: string) {
  const { error } = await admin
    .from("outbox_messages")
    .update({
      status: "PENDING",
      next_attempt_at: new Date().toISOString(),
      last_error: null,
      claim_token: null,
      lease_until: null,
      worker_id: null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
}
