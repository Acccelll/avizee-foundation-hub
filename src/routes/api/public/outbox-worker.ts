import { createFileRoute } from "@tanstack/react-router";

import { processOutbox } from "@/quotation/outbox.server";
import { logger } from "@/lib/logger";

/**
 * Worker do outbox (doc 114 §1). Endpoint público por prefixo, protegido por
 * segredo compartilhado: destinado a agendador (pg_cron / scheduler externo).
 * Não recebe nem devolve dado pessoal.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function run(request: Request) {
  const secret = process.env["OUTBOX_WORKER_SECRET"];
  if (!secret) {
    return new Response("Worker não configurado", { status: 503 });
  }
  const provided = request.headers.get("x-outbox-secret") ?? "";
  if (!timingSafeEqual(provided, secret)) {
    logger.warn("outbox.worker.unauthorized");
    return new Response("Não autorizado", { status: 401 });
  }

  const result = await processOutbox(20);
  logger.info("outbox.worker.run", { ...result });
  return Response.json({ ok: true, ...result });
}

export const Route = createFileRoute("/api/public/outbox-worker")({
  server: {
    handlers: {
      POST: async ({ request }) => run(request),
    },
  },
});
