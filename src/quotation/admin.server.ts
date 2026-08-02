/**
 * Painel comercial (Etapa 8) — leitura e operação de cotações.
 *
 * - autorização verificada ANTES de qualquer acesso privilegiado;
 * - histórico imutável: toda mudança gera `quotation_events` + auditoria;
 * - nenhum campo de preço existe; nenhuma ação altera o catálogo.
 */
import { AppError } from "@/lib/errors";
import { audit } from "@/lib/audit.server";
import { maskEmail } from "@/lib/audit.server";
import { canTransition, type QuotationStatus } from "./model";
import type { Authorized } from "@/catalog/guard.server";
import { requeueOutboxMessage } from "./outbox.server";

/* eslint-disable @typescript-eslint/no-explicit-any */

const PAGE_SIZE = 20;

export interface QuotationFilters {
  status?: string | null | undefined;
  search?: string | null | undefined;
  assigned?: string | null | undefined;
  page?: number | undefined;
}

export async function listQuotations(ctx: Authorized, filters: QuotationFilters) {
  const page = Math.max(1, filters.page ?? 1);
  let query = (ctx.supabase as any)
    .from("quotations")
    .select(
      "id, protocol, status, company_name, contact_name, city, state_uf, item_count, unavailable_item_count, assigned_to, created_at, updated_at",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.assigned === "mine") query = query.eq("assigned_to", ctx.userId);
  if (filters.assigned === "none") query = query.is("assigned_to", null);
  if (filters.search) {
    const term = filters.search.trim().replace(/[%,]/g, "");
    if (term) query = query.or(`protocol.ilike.%${term}%,company_name.ilike.%${term}%`);
  }

  const { data, error, count } = await query;
  if (error) throw new AppError("SERVICE_UNAVAILABLE", { cause: error.message });

  return {
    items: (data ?? []).map((row: any) => ({
      id: row.id,
      protocol: row.protocol,
      status: row.status as QuotationStatus,
      companyName: row.company_name,
      contactName: row.contact_name,
      location: [row.city, row.state_uf].filter(Boolean).join(" / ") || null,
      itemCount: row.item_count,
      unavailableItemCount: row.unavailable_item_count,
      assignedTo: row.assigned_to ?? null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })),
    total: count ?? 0,
    page,
    pageSize: PAGE_SIZE,
    pageCount: Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE)),
  };
}

export async function quotationDashboard(ctx: Authorized) {
  const statuses: QuotationStatus[] = ["RECEIVED", "IN_REVIEW", "WAITING_INFORMATION", "IN_SERVICE"];
  const [open, mine, pendingOutbox, deadLetter] = await Promise.all([
    (ctx.supabase as any).from("quotations").select("id", { count: "exact", head: true }).in("status", statuses),
    (ctx.supabase as any).from("quotations").select("id", { count: "exact", head: true }).eq("assigned_to", ctx.userId),
    (ctx.supabase as any).from("outbox_messages").select("id", { count: "exact", head: true }).in("status", ["PENDING", "FAILED"]),
    (ctx.supabase as any).from("outbox_messages").select("id", { count: "exact", head: true }).eq("status", "DEAD_LETTER"),
  ]);

  return {
    open: open.count ?? 0,
    mine: mine.count ?? 0,
    pendingNotifications: pendingOutbox.count ?? 0,
    deadLetter: deadLetter.count ?? 0,
  };
}

export async function getQuotation(ctx: Authorized, id: string) {
  const { data: quotation, error } = await (ctx.supabase as any)
    .from("quotations")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new AppError("SERVICE_UNAVAILABLE", { cause: error.message });
  if (!quotation) throw new AppError("NOT_FOUND");

  const [items, events, source, outbox] = await Promise.all([
    (ctx.supabase as any)
      .from("quotation_items")
      .select("id, snapshot_sku, snapshot_name, snapshot_variation, snapshot_family, snapshot_category, quantity, note, was_available, product_id, position")
      .eq("quotation_id", id)
      .order("position"),
    (ctx.supabase as any)
      .from("quotation_events")
      .select("id, event_type, from_status, to_status, actor_label, internal_note, created_at")
      .eq("quotation_id", id)
      .order("created_at"),
    (ctx.supabase as any)
      .from("quotation_sources")
      .select("origin_page, referrer, utm_source, utm_medium, utm_campaign")
      .eq("quotation_id", id)
      .maybeSingle(),
    (ctx.supabase as any)
      .from("outbox_messages")
      .select("id, message_type, status, attempts, next_attempt_at, processed_at, last_error")
      .eq("quotation_id", id)
      .order("created_at"),
  ]);

  return {
    id: quotation.id,
    protocol: quotation.protocol,
    status: quotation.status as QuotationStatus,
    companyName: quotation.company_name,
    contactName: quotation.contact_name,
    contactEmail: quotation.contact_email,
    contactPhone: quotation.contact_phone,
    city: quotation.city ?? null,
    stateUf: quotation.state_uf ?? null,
    message: quotation.message ?? null,
    preferredChannel: quotation.preferred_channel ?? null,
    assignedTo: quotation.assigned_to ?? null,
    itemCount: quotation.item_count,
    unavailableItemCount: quotation.unavailable_item_count,
    createdAt: quotation.created_at,
    updatedAt: quotation.updated_at,
    items: (items.data ?? []).map((row: any) => ({
      id: row.id,
      sku: row.snapshot_sku,
      name: row.snapshot_name,
      variation: row.snapshot_variation ?? null,
      family: row.snapshot_family ?? null,
      category: row.snapshot_category ?? null,
      quantity: row.quantity,
      note: row.note ?? null,
      wasAvailable: row.was_available,
      stillPublished: Boolean(row.product_id),
    })),
    events: (events.data ?? []).map((row: any) => ({
      id: row.id,
      type: row.event_type,
      fromStatus: row.from_status ?? null,
      toStatus: row.to_status ?? null,
      actorLabel: row.actor_label ?? null,
      note: row.internal_note ?? null,
      createdAt: row.created_at,
    })),
    source: source.data ?? null,
    notifications: (outbox.data ?? []).map((row: any) => ({
      id: row.id,
      type: row.message_type,
      status: row.status,
      attempts: row.attempts,
      nextAttemptAt: row.next_attempt_at,
      processedAt: row.processed_at ?? null,
      lastError: row.last_error ?? null,
    })),
  };
}

async function currentStatus(ctx: Authorized, id: string): Promise<QuotationStatus> {
  const { data } = await (ctx.supabase as any)
    .from("quotations")
    .select("status")
    .eq("id", id)
    .maybeSingle();
  if (!data) throw new AppError("NOT_FOUND");
  return data.status as QuotationStatus;
}

export async function changeQuotationStatus(
  ctx: Authorized,
  input: { id: string; toStatus: QuotationStatus; note?: string | null | undefined },
) {
  const from = await currentStatus(ctx, input.id);
  if (from === input.toStatus) return { status: from, changed: false };
  if (!canTransition(from, input.toStatus)) {
    throw new AppError(
      "CONFLICT",
      { from, to: input.toStatus },
      `Transição não permitida a partir da situação atual.`,
    );
  }

  const patch: Record<string, unknown> = {
    status: input.toStatus,
    last_event_at: new Date().toISOString(),
  };
  if (input.toStatus === "RESPONDED") patch["responded_at"] = new Date().toISOString();
  if (input.toStatus === "CLOSED" || input.toStatus === "CANCELLED") {
    patch["closed_at"] = new Date().toISOString();
  }

  const { error } = await (ctx.admin as any).from("quotations").update(patch).eq("id", input.id);
  if (error) throw new AppError("SERVICE_UNAVAILABLE", { cause: error.message });

  await (ctx.admin as any).from("quotation_events").insert({
    quotation_id: input.id,
    event_type: "STATUS_CHANGE",
    from_status: from,
    to_status: input.toStatus,
    actor_id: ctx.userId,
    actor_label: maskEmail(ctx.email),
    internal_note: input.note?.trim() || null,
  });

  await audit(ctx.admin as any, {
    actorId: ctx.userId,
    actorEmail: ctx.email,
    action: "quotation.status.change",
    entity: "quotations",
    entityId: input.id,
    previousValues: { status: from },
    newValues: { status: input.toStatus },
    changedFields: ["status"],
  });

  return { status: input.toStatus, changed: true };
}

export async function assignQuotation(
  ctx: Authorized,
  input: { id: string; userId: string | null },
) {
  const { error } = await (ctx.admin as any)
    .from("quotations")
    .update({
      assigned_to: input.userId,
      assigned_at: input.userId ? new Date().toISOString() : null,
    })
    .eq("id", input.id);
  if (error) throw new AppError("SERVICE_UNAVAILABLE", { cause: error.message });

  await (ctx.admin as any).from("quotation_events").insert({
    quotation_id: input.id,
    event_type: "ASSIGNMENT",
    actor_id: ctx.userId,
    actor_label: maskEmail(ctx.email),
    internal_note: input.userId ? "Responsável definido." : "Responsável removido.",
  });

  await audit(ctx.admin as any, {
    actorId: ctx.userId,
    actorEmail: ctx.email,
    action: "quotation.assign",
    entity: "quotations",
    entityId: input.id,
    newValues: { assigned_to: input.userId },
    changedFields: ["assigned_to"],
  });

  return { assignedTo: input.userId };
}

export async function addQuotationNote(ctx: Authorized, input: { id: string; note: string }) {
  const note = input.note.trim();
  if (note.length < 2) throw new AppError("VALIDATION_ERROR", { cause: "note" });

  const { error } = await (ctx.admin as any).from("quotation_events").insert({
    quotation_id: input.id,
    event_type: "NOTE",
    actor_id: ctx.userId,
    actor_label: maskEmail(ctx.email),
    internal_note: note.slice(0, 2000),
  });
  if (error) throw new AppError("SERVICE_UNAVAILABLE", { cause: error.message });

  await audit(ctx.admin as any, {
    actorId: ctx.userId,
    actorEmail: ctx.email,
    action: "quotation.note.add",
    entity: "quotations",
    entityId: input.id,
  });

  return { added: true };
}

export async function listOutboxMessages(ctx: Authorized, status?: string | null) {
  let query = (ctx.supabase as any)
    .from("outbox_messages")
    .select("id, message_type, quotation_id, status, attempts, next_attempt_at, processed_at, last_error, created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw new AppError("SERVICE_UNAVAILABLE", { cause: error.message });
  return (data ?? []).map((row: any) => ({
    id: row.id,
    type: row.message_type,
    quotationId: row.quotation_id ?? null,
    status: row.status,
    attempts: row.attempts,
    nextAttemptAt: row.next_attempt_at,
    processedAt: row.processed_at ?? null,
    lastError: row.last_error ?? null,
    createdAt: row.created_at,
  }));
}

export async function retryOutbox(ctx: Authorized, id: string) {
  await requeueOutboxMessage(ctx.admin as any, id);
  await audit(ctx.admin as any, {
    actorId: ctx.userId,
    actorEmail: ctx.email,
    action: "outbox.requeue",
    entity: "outbox_messages",
    entityId: id,
  });
  return { requeued: true };
}
