import { createFileRoute } from "@tanstack/react-router";

import { getServerConfig } from "@/lib/env.server";
import { httpStatusFor, readinessBody, type ComponentCheck } from "@/observability/health";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Readiness (Etapa 11.1 §23/§24).
 *
 * - `database` executa CONSULTA REAL ao PostgreSQL (não `/auth/v1/health`);
 * - `migrations` compara o estado real do esquema com a versão esperada;
 * - `configuration` falha quando um segredo obrigatório está ausente;
 * - nenhuma tabela, SQL, URL interna, segredo ou stack é exposto.
 */
export const EXPECTED_SCHEMA_VERSION = "11.1";

/** Chaves que precisam ser verdadeiras no diagnóstico do esquema. */
export const REQUIRED_SCHEMA_CHECKS = [
  "quotations_payload_hash",
  "outbox_claim_columns",
  "outbox_states",
  "claim_function",
  "complete_function",
  "release_cohort_table",
  "quotations_rls",
] as const;

export function evaluateSchema(report: Record<string, unknown> | null): ComponentCheck["status"] {
  if (!report) return "unavailable";
  if (report["expected_version"] !== EXPECTED_SCHEMA_VERSION) return "unavailable";
  return REQUIRED_SCHEMA_CHECKS.every((key) => report[key] === true) ? "healthy" : "unavailable";
}

export const Route = createFileRoute("/api/public/readiness")({
  server: {
    handlers: {
      GET: async () => {
        let configuration: ComponentCheck["status"] = "healthy";
        let environment = process.env["APP_ENV"] ?? "development";
        let emailProvider = "null";
        try {
          const cfg = getServerConfig();
          environment = cfg.APP_ENV;
          emailProvider = cfg.EMAIL_PROVIDER;
        } catch {
          // Inclui ausência de QUOTATION_HASH_SALT ou APP_PUBLIC_URL (§11/§14).
          configuration = "unavailable";
        }

        let database: ComponentCheck["status"] = "not_configured";
        let migrations: ComponentCheck["status"] = "not_configured";
        let outbox: ComponentCheck["status"] = "not_configured";

        if (process.env["SUPABASE_URL"] && process.env["SUPABASE_SERVICE_ROLE_KEY"]) {
          try {
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            const admin = supabaseAdmin as any;

            // Consulta real de leitura no PostgreSQL.
            const probe = await admin
              .from("product_categories")
              .select("id", { count: "exact", head: true });
            database = probe.error ? "unavailable" : "healthy";

            const schema = await admin.rpc("schema_readiness");
            migrations = schema.error
              ? "unavailable"
              : evaluateSchema(schema.data as Record<string, unknown>);

            const queue = await admin
              .from("outbox_messages")
              .select("id", { count: "exact", head: true })
              .in("status", ["PENDING", "RETRY_SCHEDULED"]);
            outbox = queue.error ? "degraded" : "healthy";
          } catch {
            database = "unavailable";
            migrations = "unavailable";
            outbox = "unavailable";
          }
        }

        const checks: ComponentCheck[] = [
          { name: "application", status: "healthy" },
          { name: "configuration", status: configuration },
          { name: "database", status: database },
          {
            name: "authentication",
            status: process.env["SUPABASE_URL"] ? "configured" : "not_configured",
          },
          // Storage real ainda não homologado (bloqueio documentado §25).
          { name: "storage", status: "degraded" },
          { name: "outbox", status: outbox },
          // DEP-T1 pendente: provider de e-mail real ainda não aprovado.
          { name: "email", status: emailProvider === "null" ? "not_configured" : "degraded" },
          { name: "migrations", status: migrations },
        ];

        const body = readinessBody(checks, environment);
        return Response.json(body, {
          status: httpStatusFor(body.status),
          headers: { "Cache-Control": "no-store" },
        });
      },
    },
  },
});
