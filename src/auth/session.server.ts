/**
 * Sessão administrativa: cookie HttpOnly assinado com HMAC (§20, §32).
 * Sem segredo no bundle do cliente; sem PII no cookie além do necessário.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

import { getServerConfig } from "@/lib/env.server";
import { AppError } from "@/lib/errors";
import { localAuthProvider } from "./local-provider.server";
import type { SessionUser } from "./contract";

export const SESSION_COOKIE = "avizee_admin_session";

type Payload = { sub: string; exp: number; jti: string };

function sign(data: string) {
  return createHmac("sha256", getServerConfig().AUTH_SESSION_SECRET).update(data).digest("base64url");
}

export function createSessionCookie(userId: string) {
  const cfg = getServerConfig();
  const payload: Payload = {
    sub: userId,
    exp: Date.now() + cfg.AUTH_SESSION_TTL_MINUTES * 60_000,
    jti: crypto.randomUUID(),
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const value = `${body}.${sign(body)}`;
  const secure = cfg.APP_ENV !== "development" ? " Secure;" : "";
  return {
    value,
    header: `${SESSION_COOKIE}=${value}; Path=/; HttpOnly;${secure} SameSite=Lax; Max-Age=${cfg.AUTH_SESSION_TTL_MINUTES * 60}`,
    jti: payload.jti,
  };
}

export function clearSessionCookieHeader() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

function readCookie(request: Request): string | null {
  const raw = request.headers.get("cookie");
  if (!raw) return null;
  for (const part of raw.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === SESSION_COOKIE) return rest.join("=");
  }
  return null;
}

function verify(token: string): Payload | null {
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  const expected = sign(body);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as Payload;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Retorna o usuário da sessão ou null. Nunca lança para uso opcional. */
export async function getSessionUser(request: Request): Promise<SessionUser | null> {
  const token = readCookie(request);
  if (!token) return null;
  const payload = verify(token);
  if (!payload) return null;
  return localAuthProvider.findById(payload.sub);
}

/** Exige sessão válida — usado por toda ação administrativa no servidor. */
export async function requireSession(request: Request): Promise<SessionUser> {
  const user = await getSessionUser(request);
  if (!user) throw new AppError("UNAUTHENTICATED");
  return user;
}
