import { createFileRoute } from "@tanstack/react-router";

import {
  checkErpSecret,
  erpErrorResponse,
  erpReferenceData,
  integrationAuth,
} from "@/integrations/erp/content.server";

const NO_STORE = { "Cache-Control": "no-store" };

/** Categorias editoriais ativas e famílias públicas do catálogo, para o ERP. */
export const Route = createFileRoute("/api/internal/erp/referencias")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const result = checkErpSecret(request);
        if (result !== "ok") {
          return Response.json(
            {
              ok: false,
              error: result === "not_configured" ? "erp_not_configured" : "unauthorized",
            },
            { status: result === "not_configured" ? 503 : 401, headers: NO_STORE },
          );
        }
        try {
          const auth = await integrationAuth();
          const data = await erpReferenceData(auth);
          return Response.json({ ok: true, ...data }, { status: 200, headers: NO_STORE });
        } catch (error) {
          return erpErrorResponse(error);
        }
      },
    },
  },
});
