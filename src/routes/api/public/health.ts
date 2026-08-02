import { createFileRoute } from "@tanstack/react-router";

import { getServerConfig } from "@/lib/env.server";

/**
 * Health check público (§33). Não revela versão de dependência, host interno,
 * estrutura de banco nem stack trace.
 */
export const Route = createFileRoute("/api/public/health")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const cfg = getServerConfig();
          const url = process.env["SUPABASE_URL"];
          const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
          let database = "not_configured";
          if (url && key) {
            try {
              const probe = await fetch(`${url}/auth/v1/health`, {
                headers: { apikey: key },
                signal: AbortSignal.timeout(3000),
              });
              database = probe.ok ? "ok" : "degraded";
            } catch {
              database = "degraded";
            }
          }
          return Response.json({
            status: database === "degraded" ? "degraded" : "ok",
            environment: cfg.APP_ENV,
            version: process.env["APP_VERSION"] ?? "0.6.0",
            checks: { application: "ok", configuration: "ok", database },
          });
        } catch {
          return Response.json({ status: "degraded" }, { status: 503 });
        }
      },
    },
  },
});
