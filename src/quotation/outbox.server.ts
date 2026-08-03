/**
 * Worker do transactional outbox (doc 114 §1).
 *
 * - nunca roda no caminho crítico do formulário;
 * - falha de notificação nunca apaga nem invalida a cotação;
 * - backoff exponencial, limite de tentativas e dead-letter;
 * - em ambiente não produtivo nenhuma mensagem sai da aplicação (`SIMULATED`).
 */
import { getEmailProvider } from "@/services/adapters.server";
import { getServerConfig } from "@/lib/env.server";
import { logger } from "@/lib/logger";
import { OUTBOX_BACKOFF_MINUTES, OUTBOX_MAX_ATTEMPTS } from "./model";
import {
  confirmationTemplate,
  internalNoticeTemplate,
  type QuotationMessageData,
} from "./templates";

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface OutboxRunResult {
  processed: number;
  sent: number;
  simulated: number;
  failed: number;
  deadLettered: number;
}

function backoffFor(attempt: number): string {
  const minutes =
    OUTBOX_BACKOFF_MINUTES[Math.min(attempt, OUTBOX_BACKOFF_MINUTES.length) - 1] ?? 240;
  return new Date(Date.now() + minutes * 60_000).toISOString();
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

/** Processa um lote de mensagens pendentes. Idempotente por linha. */
export async function processOutbox(limit = 20): Promise<OutboxRunResult> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const admin = supabaseAdmin as any;
  const { APP_ENV } = getServerConfig();
  const externalSendingEnabled = APP_ENV === "production";

  const { data: rows, error } = await admin
    .from("outbox_messages")
    .select("id, message_type, quotation_id, attempts, max_attempts")
    .in("status", ["PENDING", "FAILED"])
    .lte("next_attempt_at", new Date().toISOString())
    .order("next_attempt_at")
    .limit(limit);

  if (error) {
    logger.error("outbox.read.failure", { code: error.code ?? null });
    return { processed: 0, sent: 0, simulated: 0, failed: 0, deadLettered: 0 };
  }

  const result: OutboxRunResult = {
    processed: 0,
    sent: 0,
    simulated: 0,
    failed: 0,
    deadLettered: 0,
  };

  for (const row of rows ?? []) {
    result.processed += 1;
    const attempts = (row.attempts ?? 0) + 1;
    try {
      const message = await buildMessage(admin, row);
      if (!message) throw new Error("destinatário ou template indisponível");

      if (!externalSendingEnabled) {
        await admin
          .from("outbox_messages")
          .update({
            status: "SIMULATED",
            attempts,
            processed_at: new Date().toISOString(),
            last_error: null,
          })
          .eq("id", row.id);
        result.simulated += 1;
      } else {
        await getEmailProvider().send({
          to: message.to,
          subject: message.subject,
          text: message.text,
          template: message.template,
        });
        await admin
          .from("outbox_messages")
          .update({
            status: "SENT",
            attempts,
            processed_at: new Date().toISOString(),
            last_error: null,
          })
          .eq("id", row.id);
        result.sent += 1;
      }

      if (row.quotation_id) {
        await admin.from("quotation_events").insert({
          quotation_id: row.quotation_id,
          event_type: "NOTIFICATION",
          actor_label: "sistema",
          internal_note: `Notificação ${row.message_type} ${externalSendingEnabled ? "enviada" : "simulada"}.`,
        });
      }
    } catch (err) {
      const dead = attempts >= (row.max_attempts ?? OUTBOX_MAX_ATTEMPTS);
      await admin
        .from("outbox_messages")
        .update({
          status: dead ? "DEAD_LETTER" : "FAILED",
          attempts,
          next_attempt_at: backoffFor(attempts),
          // Mensagem curta e sem dado pessoal.
          last_error: String((err as Error).message ?? "falha").slice(0, 200),
        })
        .eq("id", row.id);
      if (dead) result.deadLettered += 1;
      else result.failed += 1;
      logger.warn("outbox.attempt.failure", { messageType: row.message_type, attempts, dead });
    }
  }

  return result;
}

/** Recolocação administrativa de uma mensagem na fila. */
export async function requeueOutboxMessage(admin: any, id: string) {
  const { error } = await admin
    .from("outbox_messages")
    .update({ status: "PENDING", next_attempt_at: new Date().toISOString(), last_error: null })
    .eq("id", id);
  if (error) throw new Error(error.message);
}
