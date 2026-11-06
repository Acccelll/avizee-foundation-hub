import { createFileRoute } from "@tanstack/react-router";

import {
  checkErpSecret,
  erpErrorResponse,
  integrationAuth,
  searchErpArticles,
  upsertErpArticle,
} from "@/integrations/erp/content.server";

const NO_STORE = { "Cache-Control": "no-store" };
const MAX_BODY_BYTES = 512 * 1024;

function rejectAuth(request: Request): Response | null {
  const result = checkErpSecret(request);
  if (result === "ok") return null;
  return Response.json(
    { ok: false, error: result === "not_configured" ? "erp_not_configured" : "unauthorized" },
    { status: result === "not_configured" ? 503 : 401, headers: NO_STORE },
  );
}

/**
 * API interna para o ERP AviZee publicar matérias na Central de Conteúdos.
 *
 * POST: cria/atualiza e (por padrão) publica uma matéria aprovada no ERP.
 * GET ?q=: busca matérias existentes (checagem de duplicidade).
 */
export const Route = createFileRoute("/api/internal/erp/materias")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const denied = rejectAuth(request);
        if (denied) return denied;
        try {
          const query = new URL(request.url).searchParams.get("q") ?? "";
          const auth = await integrationAuth();
          const items = await searchErpArticles(auth, query);
          return Response.json({ ok: true, items }, { status: 200, headers: NO_STORE });
        } catch (error) {
          return erpErrorResponse(error);
        }
      },
      POST: async ({ request }) => {
        const denied = rejectAuth(request);
        if (denied) return denied;

        const length = Number(request.headers.get("content-length") ?? "0");
        if (length > MAX_BODY_BYTES) {
          return Response.json(
            { ok: false, error: "payload_too_large" },
            { status: 413, headers: NO_STORE },
          );
        }

        let body: unknown;
        try {
          const text = await request.text();
          if (text.length > MAX_BODY_BYTES) {
            return Response.json(
              { ok: false, error: "payload_too_large" },
              { status: 413, headers: NO_STORE },
            );
          }
          body = JSON.parse(text);
        } catch {
          return Response.json(
            { ok: false, error: "invalid_json" },
            { status: 400, headers: NO_STORE },
          );
        }

        try {
          const auth = await integrationAuth();
          const result = await upsertErpArticle(auth, body);
          return Response.json({ ok: true, ...result }, { status: 200, headers: NO_STORE });
        } catch (error) {
          return erpErrorResponse(error);
        }
      },
    },
  },
});
