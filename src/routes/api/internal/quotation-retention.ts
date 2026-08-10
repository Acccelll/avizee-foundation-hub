import { createFileRoute } from "@tanstack/react-router";

import { processQuotationRetention } from "@/privacy/retention.server";

function safeEqual(left: string, right: string): boolean {
  if (left.length !== right.length || left.length === 0) return false;
  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return diff === 0;
}

function bearerToken(request: Request): string {
  const authorization = request.headers.get("authorization") ?? "";
  return authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
}

export const Route = createFileRoute("/api/internal/quotation-retention")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["RETENTION_WORKER_SECRET"] ?? "";
        if (secret.length < 32) {
          return Response.json(
            { ok: false, error: "retention_not_configured" },
            { status: 503, headers: { "Cache-Control": "no-store" } },
          );
        }

        if (!safeEqual(bearerToken(request), secret)) {
          return Response.json(
            { ok: false, error: "unauthorized" },
            { status: 401, headers: { "Cache-Control": "no-store" } },
          );
        }

        try {
          const result = await processQuotationRetention();
          return Response.json(
            { ok: true, ...result },
            { status: 200, headers: { "Cache-Control": "no-store" } },
          );
        } catch {
          return Response.json(
            { ok: false, error: "retention_unavailable" },
            { status: 503, headers: { "Cache-Control": "no-store" } },
          );
        }
      },
    },
  },
});
