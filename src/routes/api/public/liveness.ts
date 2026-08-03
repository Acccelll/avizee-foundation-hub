import { createFileRoute } from "@tanstack/react-router";

import { publicBody } from "@/observability/health";

/**
 * Liveness (§27). Responde apenas se o processo está vivo; não consulta
 * dependências externas e não expõe detalhe interno.
 */
export const Route = createFileRoute("/api/public/liveness")({
  server: {
    handlers: {
      GET: async () =>
        Response.json(publicBody("healthy", process.env["APP_ENV"] ?? "development"), {
          headers: { "Cache-Control": "no-store" },
        }),
    },
  },
});
