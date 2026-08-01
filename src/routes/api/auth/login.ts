import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { localAuthProvider } from "@/auth/local-provider.server";
import { createSessionCookie } from "@/auth/session.server";
import { audit, originFrom } from "@/lib/audit.server";
import { AppError, toAppError } from "@/lib/errors";
import { getServerConfig } from "@/lib/env.server";

const bodySchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(1).max(200),
});

/** Rate limiting em memória (§32). Substituível por store compartilhado. */
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60_000;

function checkRate(key: string, max: number) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  entry.count += 1;
  if (entry.count > max) throw new AppError("RATE_LIMITED");
}

export const Route = createFileRoute("/api/auth/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const origin = originFrom(request);
        try {
          const cfg = getServerConfig();
          const parsed = bodySchema.safeParse(await request.json());
          // Falha de formato responde igual a credencial inválida: sem enumeração.
          if (!parsed.success) throw new AppError("UNAUTHENTICATED");

          checkRate(`${origin}:${parsed.data.email.toLowerCase()}`, cfg.AUTH_MAX_ATTEMPTS);

          const result = await localAuthProvider.verifyCredentials(
            parsed.data.email,
            parsed.data.password,
          );

          if (!result.ok || !result.user) {
            audit({
              actorId: null,
              action: "auth.login.failure",
              entity: "session",
              entityId: null,
              result: "failure",
              origin,
              context: { email: parsed.data.email },
            });
            throw new AppError("UNAUTHENTICATED");
          }

          const cookie = createSessionCookie(result.user.id);
          audit({
            actorId: result.user.id,
            action: "auth.login.success",
            entity: "session",
            entityId: cookie.jti,
            result: "success",
            origin,
          });

          return Response.json(
            { user: { id: result.user.id, name: result.user.name, roles: result.user.roles } },
            { headers: { "set-cookie": cookie.header } },
          );
        } catch (error) {
          const appError = toAppError(error);
          if (appError.code === "RATE_LIMITED") {
            audit({
              actorId: null,
              action: "auth.rate_limited",
              entity: "session",
              entityId: null,
              result: "failure",
              origin,
            });
          }
          return appError.toResponse();
        }
      },
    },
  },
});
