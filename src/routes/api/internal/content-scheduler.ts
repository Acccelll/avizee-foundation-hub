import { createFileRoute } from "@tanstack/react-router";

import { processEditorialSchedule } from "@/content/scheduler.server";

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

export const Route = createFileRoute("/api/internal/content-scheduler")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["CONTENT_SCHEDULER_SECRET"] ?? "";
        if (secret.length < 32) {
          return Response.json(
            { ok: false, error: "scheduler_not_configured" },
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
          const result = await processEditorialSchedule();
          return Response.json(
            { ok: true, ...result },
            { status: 200, headers: { "Cache-Control": "no-store" } },
          );
        } catch {
          return Response.json(
            { ok: false, error: "scheduler_unavailable" },
            { status: 503, headers: { "Cache-Control": "no-store" } },
          );
        }
      },
    },
  },
});
