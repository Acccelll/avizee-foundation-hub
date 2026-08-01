/**
 * Auditoria (§22 da Etapa 5).
 * DT-02 pendente: a persistência definitiva em `audit_logs` (Postgres) só pode
 * ser criada após aprovação do banco. Nesta etapa o registro é emitido em log
 * estruturado, com a MESMA forma do registro aprovado em 101/102.
 */
import { logger } from "@/lib/logger";
import type { SessionUser } from "@/auth/contract";

export type AuditAction =
  | "auth.login.success"
  | "auth.login.failure"
  | "auth.logout"
  | "auth.rate_limited"
  | "user.create"
  | "user.role.change"
  | "permission.change"
  | "settings.change"
  | "content.publish";

export interface AuditEntry {
  actorId: string | null;
  action: AuditAction;
  entity: string;
  entityId: string | null;
  result: "success" | "failure";
  origin: string;
  context?: Record<string, unknown>;
}

export function audit(entry: AuditEntry) {
  logger.info("audit", {
    ...entry,
    occurredAt: new Date().toISOString(),
    // O logger redige senha, token, cookie e mascara e-mail automaticamente.
  });
}

export function actorFrom(user: SessionUser | null) {
  return user?.id ?? null;
}

export function originFrom(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}
