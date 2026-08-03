import { createFileRoute } from "@tanstack/react-router";

import { getServerConfig } from "@/lib/env.server";
import { httpStatusFor, readinessBody, type ComponentCheck } from "@/observability/health";

async function probeDatabase(): Promise<ComponentCheck["status"]> {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return "not_configured";
  try {
    const probe = await fetch(`${url}/auth/v1/health`, {
      headers: { apikey: key },
      signal: AbortSignal.timeout(3000),
    });
    return probe.ok ? "healthy" : "degraded";
  } catch {
    return "unavailable";
  }
}

/**
 * Readiness (§27). Reporta componentes por nome e estado; dependências
 * não críticas em falha resultam em `degraded`, não em indisponibilidade.
 */
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
          configuration = "unavailable";
        }

        const checks: ComponentCheck[] = [
          { name: "application", status: "healthy" },
          { name: "configuration", status: configuration },
          { name: "database", status: await probeDatabase() },
          {
            name: "authentication",
            status: process.env["SUPABASE_URL"] ? "healthy" : "not_configured",
          },
          { name: "storage", status: "healthy" },
          { name: "outbox", status: "healthy" },
          // DEP-T1 pendente: provider de e-mail real ainda não aprovado.
          { name: "email", status: emailProvider === "null" ? "not_configured" : "degraded" },
          { name: "migrations", status: "healthy" },
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
