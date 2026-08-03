/**
 * Avaliação de saúde (§27 da Etapa 11).
 *
 * Diferencia `healthy`, `degraded` e `unavailable`. Dependência externa
 * indisponível (e-mail, storage) NÃO derruba a aplicação quando o fluxo
 * principal — catálogo público e registro de cotação — continua operando.
 */

export type CheckStatus = "healthy" | "degraded" | "unavailable" | "not_configured";
export type OverallStatus = "healthy" | "degraded" | "unavailable";

export type ComponentName =
  | "application"
  | "configuration"
  | "database"
  | "storage"
  | "authentication"
  | "outbox"
  | "email"
  | "migrations";

/** Componentes cuja falha impede o fluxo principal. */
export const CRITICAL_COMPONENTS: ComponentName[] = [
  "application",
  "configuration",
  "database",
  "migrations",
];

export type ComponentCheck = { name: ComponentName; status: CheckStatus };

export function evaluate(checks: ComponentCheck[]): OverallStatus {
  const isCritical = (c: ComponentCheck) => CRITICAL_COMPONENTS.includes(c.name);
  if (
    checks.some(
      (c) => isCritical(c) && (c.status === "unavailable" || c.status === "not_configured"),
    )
  ) {
    return "unavailable";
  }
  if (checks.some((c) => c.status === "unavailable" || c.status === "degraded")) return "degraded";
  return "healthy";
}

/** Corpo público: sem versão de dependência, host, esquema ou stack trace (§27). */
export function publicBody(status: OverallStatus, environment: string) {
  return { status, environment };
}

/** Corpo de readiness: nomes de componentes e estado, sem detalhe interno. */
export function readinessBody(checks: ComponentCheck[], environment: string) {
  return {
    status: evaluate(checks),
    environment,
    checks: Object.fromEntries(checks.map((c) => [c.name, c.status])),
  };
}

export function httpStatusFor(status: OverallStatus) {
  return status === "unavailable" ? 503 : 200;
}
