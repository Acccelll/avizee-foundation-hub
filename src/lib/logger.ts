/**
 * Log estruturado com redação obrigatória (§34 da Etapa 5).
 * Nunca registra senha, token, cookie, cabeçalho de autorização ou segredo.
 */
export type LogLevel = "debug" | "info" | "warn" | "error";

const ORDER: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };

const REDACT_KEYS = [
  "password",
  "senha",
  "token",
  "access_token",
  "refresh_token",
  "authorization",
  "cookie",
  "set-cookie",
  "secret",
  "apikey",
  "api_key",
  "session",
  "hash",
];

const PARTIAL_KEYS = ["email", "phone", "telefone", "cnpj", "document"];

function maskEmail(value: string) {
  const [user, domain] = value.split("@");
  if (!user || !domain) return "***";
  return `${user.slice(0, 1)}***@${domain}`;
}

export function redact(value: unknown, depth = 0): unknown {
  if (depth > 4) return "[depth]";
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map((v) => redact(v, depth + 1));
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const key = k.toLowerCase();
      if (REDACT_KEYS.some((r) => key.includes(r))) {
        out[k] = "[REDACTED]";
      } else if (PARTIAL_KEYS.some((p) => key.includes(p)) && typeof v === "string") {
        out[k] = key.includes("mail") ? maskEmail(v) : `***${v.slice(-2)}`;
      } else {
        out[k] = redact(v, depth + 1);
      }
    }
    return out;
  }
  return value;
}

function emit(level: LogLevel, event: string, context: Record<string, unknown> = {}) {
  const min = (process.env["LOG_LEVEL"] as LogLevel | undefined) ?? "info";
  if (ORDER[level] < ORDER[min]) return;
  const line = JSON.stringify({
    level,
    ts: new Date().toISOString(),
    event,
    env: process.env["APP_ENV"] ?? "development",
    ...(redact(context) as Record<string, unknown>),
  });
  // Saída única e estruturada — não há console.log informal na aplicação.
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.info(line);
}

export const logger = {
  debug: (event: string, ctx?: Record<string, unknown>) => emit("debug", event, ctx),
  info: (event: string, ctx?: Record<string, unknown>) => emit("info", event, ctx),
  warn: (event: string, ctx?: Record<string, unknown>) => emit("warn", event, ctx),
  error: (event: string, ctx?: Record<string, unknown>) => emit("error", event, ctx),
};

/** Identificador de correlação por requisição/ocorrência. */
export function correlationId() {
  return crypto.randomUUID();
}
