/**
 * Auditoria persistente (§38 da Etapa 6) — quita DV-05-06.
 * Grava em `public.audit_logs` (imutável) e também em log estruturado.
 * Nunca grava segredo, arquivo completo ou documento de direitos em texto aberto.
 */
import { logger } from "@/lib/logger";
import type { AuditWriter } from "@/lib/supabase-types";
import type { SessionUser } from "@/auth/contract";

export type AuditAction =
  | "auth.login.success"
  | "auth.login.failure"
  | "auth.logout"
  | "auth.rate_limited"
  | "user.role.change"
  | "settings.change"
  | "catalog.create"
  | "catalog.update"
  | "catalog.archive"
  | "catalog.publish"
  | "catalog.unpublish"
  | "catalog.code.change"
  | "catalog.name.change"
  | "catalog.status.change"
  | "taxonomy.change"
  | "spec.definition.change"
  | "media.upload"
  | "media.status.change"
  | "media.rights.change"
  | "media.link"
  | "document.change"
  | "conflict.resolve"
  | "normalization.update"
  | "import.dry_run"
  | "import.execute"
  | "import.rollback";

export interface AuditEntry {
  actorId: string | null;
  actorEmail?: string | null;
  action: AuditAction;
  entity: string;
  entityId?: string | null;
  result?: "success" | "failure";
  origin?: string;
  changedFields?: string[];
  previousValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  context?: Record<string, unknown>;
}

const SENSITIVE_KEYS = [
  "password",
  "token",
  "secret",
  "cookie",
  "rights_document_path",
  "raw_payload",
  "file",
];

export function redactValues(
  values: Record<string, unknown> | null | undefined,
): Record<string, unknown> | null {
  if (!values) return null;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    out[key] = SENSITIVE_KEYS.some((k) => key.toLowerCase().includes(k)) ? "[REDIGIDO]" : value;
  }
  return out;
}

export function maskEmail(email?: string | null): string | null {
  if (!email) return null;
  const [user, domain] = email.split("@");
  if (!domain || !user) return "[REDIGIDO]";
  return `${user.slice(0, 2)}***@${domain}`;
}

/** Persiste a entrada. `client` deve ser um cliente com permissão de escrita. */
export async function audit(client: AuditWriter, entry: AuditEntry): Promise<void> {
  const row = {
    actor_id: entry.actorId,
    actor_email_masked: maskEmail(entry.actorEmail),
    action: entry.action,
    entity: entry.entity,
    entity_id: entry.entityId ?? null,
    result: entry.result ?? "success",
    origin: entry.origin ?? null,
    changed_fields: entry.changedFields ?? null,
    previous_values: redactValues(entry.previousValues),
    new_values: redactValues(entry.newValues),
    context: entry.context ?? null,
  };

  logger.info("audit", { ...row, occurredAt: new Date().toISOString() });

  const { error } = await client.from("audit_logs").insert(row);
  if (error) {
    // Auditoria nunca pode ser silenciada: registra a falha explicitamente.
    logger.error("audit.persist.failure", { action: entry.action, entity: entry.entity });
  }
}

export function actorFrom(user: SessionUser | null) {
  return user?.id ?? null;
}

export function originFrom(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

/** Calcula os campos alterados entre dois objetos, para o log de auditoria. */
export function diffFields(
  before: Record<string, unknown> | null,
  after: Record<string, unknown>,
): string[] {
  if (!before) return Object.keys(after);
  return Object.keys(after).filter(
    (key) => JSON.stringify(before[key]) !== JSON.stringify(after[key]),
  );
}
