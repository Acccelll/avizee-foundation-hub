const LOCAL_WINDOW_MS = 60_000;
const LOCAL_MAX_REQUESTS = 300;

export interface McpRateLimitBinding {
  limit(input: { key: string }): Promise<{ success: boolean }>;
}

interface McpWorkerEnv {
  MCP_RATE_LIMITER?: McpRateLimitBinding;
}

interface LocalBucket {
  startedAt: number;
  count: number;
}

const localBuckets = new Map<string, LocalBucket>();

export interface McpRateLimitOptions {
  appEnv?: string;
  now?: number;
}

export interface McpOriginOptions {
  appEnv?: string;
  publicUrl?: string;
}

export function isMcpRequestPath(pathname: string): boolean {
  return pathname === "/mcp" || pathname.startsWith("/.mcp/");
}

function workerEnv(value: unknown): McpWorkerEnv {
  if (!value || typeof value !== "object") return {};
  return value as McpWorkerEnv;
}

function actorKey(request: Request): string {
  // Em produção no Cloudflare, CF-Connecting-IP é fornecido pela borda.
  // Não usamos X-Forwarded-For, que pode ser forjado fora de uma cadeia de proxy confiável.
  const cloudflareIp = request.headers.get("cf-connecting-ip")?.trim();
  return cloudflareIp ? `ip:${cloudflareIp}` : "anonymous";
}

function blocked(status: 421 | 429 | 503, error: string): Response {
  return Response.json(
    { ok: false, error },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

/**
 * O adaptador MCP gerado pode operar atrás de proxies. Em produção, o entrypoint
 * externo limita a superfície MCP à origem canônica explicitamente configurada,
 * sem depender de X-Forwarded-Host fornecido pelo cliente.
 */
export function enforceMcpCanonicalOrigin(
  request: Request,
  options: McpOriginOptions = {},
): Response | null {
  const requestUrl = new URL(request.url);
  if (!isMcpRequestPath(requestUrl.pathname)) return null;

  const appEnv = options.appEnv ?? process.env["APP_ENV"] ?? "development";
  if (appEnv !== "production") return null;

  const publicUrl = options.publicUrl ?? process.env["APP_PUBLIC_URL"] ?? "";
  try {
    const canonicalUrl = new URL(publicUrl);
    if (canonicalUrl.protocol !== "https:") {
      return blocked(503, "mcp_origin_not_configured");
    }
    return requestUrl.origin === canonicalUrl.origin ? null : blocked(421, "invalid_origin");
  } catch {
    return blocked(503, "mcp_origin_not_configured");
  }
}

function localLimit(key: string, now: number): Response | null {
  const current = localBuckets.get(key);
  if (!current || now - current.startedAt >= LOCAL_WINDOW_MS) {
    localBuckets.set(key, { startedAt: now, count: 1 });
    return null;
  }

  if (current.count >= LOCAL_MAX_REQUESTS) {
    return blocked(429, "rate_limited");
  }

  current.count += 1;
  return null;
}

/**
 * Protege exclusivamente as superfícies MCP.
 *
 * Produção: exige um binding distribuído `MCP_RATE_LIMITER`. Ausência ou falha
 * da infraestrutura bloqueia o MCP em vez de deixá-lo sem limite.
 *
 * Development/test/preview: usa um bucket em memória apenas como proteção
 * básica do processo local; esse fallback nunca é apresentado como proteção
 * operacional distribuída.
 */
export async function enforceMcpRateLimit(
  request: Request,
  env: unknown,
  options: McpRateLimitOptions = {},
): Promise<Response | null> {
  const pathname = new URL(request.url).pathname;
  if (!isMcpRequestPath(pathname)) return null;

  const appEnv = options.appEnv ?? process.env["APP_ENV"] ?? "development";
  const binding = workerEnv(env).MCP_RATE_LIMITER;
  const key = actorKey(request);

  if (binding) {
    try {
      const result = await binding.limit({ key });
      return result.success ? null : blocked(429, "rate_limited");
    } catch {
      return blocked(503, "rate_limit_unavailable");
    }
  }

  if (appEnv === "production") {
    return blocked(503, "rate_limit_not_configured");
  }

  return localLimit(key, options.now ?? Date.now());
}

export function resetLocalMcpRateLimitForTests(): void {
  localBuckets.clear();
}
