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
          return Response.json({
            status: "ok",
            environment: cfg.APP_ENV,
            version: process.env["APP_VERSION"] ?? "0.5.0",
            checks: {
              application: "ok",
              configuration: "ok",
              // DT-02 pendente: banco ainda não provisionado nesta etapa.
              database: "not_configured",
            },
          });
        } catch {
          return Response.json({ status: "degraded" }, { status: 503 });
        }
      },
    },
  },
});
