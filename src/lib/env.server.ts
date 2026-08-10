/**
 * Configuração de servidor com validação fail-fast.
 * Nenhum segredo é exposto ao bundle do cliente (§23 da Etapa 5).
 *
 * Etapa 11.1:
 *  §11 — `QUOTATION_HASH_SALT` obrigatório fora de desenvolvimento (sem fallback fixo);
 *  §13 — `APP_ENV` é a fonte canônica de ambiente; `VITE_APP_ENV` é derivado/validado;
 *  §14 — `APP_PUBLIC_URL` absoluta, sem barra final, HTTPS fora de desenvolvimento.
 */
import { z } from "zod";

/** Ambientes permitidos (§13). `test` existe apenas para a suíte automatizada. */
export const APP_ENVIRONMENTS = [
  "development",
  "preview",
  "staging",
  "production",
  "test",
] as const;
export type AppEnv = (typeof APP_ENVIRONMENTS)[number];

const schema = z.object({
  APP_ENV: z.enum(APP_ENVIRONMENTS).default("development"),
  APP_PUBLIC_URL: z.string().trim().optional(),
  AUTH_SESSION_TTL_MINUTES: z.coerce.number().int().positive().default(480),
  AUTH_MAX_ATTEMPTS: z.coerce.number().int().positive().default(5),
  QUOTATION_HASH_SALT: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || val.length >= 32, { message: "Deve ter pelo menos 32 caracteres" }),
  EMAIL_PROVIDER: z.enum(["null", "log", "resend"]).default("log"),
  RESEND_API_KEY: z.string().trim().optional(),
  RESEND_FROM: z.string().trim().optional(),
  EMAIL_REPLY_TO: z.string().trim().email().optional(),
  STORAGE_PROVIDER: z.enum(["null", "local"]).default("local"),
  CAPTCHA_PROVIDER: z.enum(["null"]).default("null"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

export type ServerConfig = z.infer<typeof schema> & {
  QUOTATION_HASH_SALT: string;
  APP_PUBLIC_URL: string;
};

/** Sal explicitamente local — aceito somente em desenvolvimento e teste. */
export const DEV_ONLY_QUOTATION_SALT = "avizee-dev-only-quotation-salt";
const DEV_PUBLIC_URL = "http://localhost:8080";

/** Ambientes em que segredos e URL pública são obrigatórios. */
export function requiresStrictConfig(env: AppEnv) {
  return env === "preview" || env === "staging" || env === "production";
}

/** Normaliza a URL pública: absoluta, sem barra final (§14). */
export function normalizePublicUrl(raw: string): string {
  const url = new URL(raw);
  const normalized = `${url.protocol}//${url.host}${url.pathname}`.replace(/\/+$/, "");
  return normalized;
}

let cached: ServerConfig | null = null;

export function getServerConfig(): ServerConfig {
  if (cached) return cached;

  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    // Mensagem sem valores: apenas nomes de variáveis inválidas.
    const fields = Object.keys(parsed.error.flatten().fieldErrors).join(", ");
    throw new Error(`Configuração inválida. Variáveis com problema: ${fields}`);
  }

  const cfg = parsed.data;
  const strict = requiresStrictConfig(cfg.APP_ENV);

  // §11 — nenhum fallback embutido fora de desenvolvimento/teste.
  if (!cfg.QUOTATION_HASH_SALT) {
    if (strict) {
      throw new Error(
        "Configuração ausente: QUOTATION_HASH_SALT é obrigatória fora de desenvolvimento.",
      );
    }
    cfg.QUOTATION_HASH_SALT = DEV_ONLY_QUOTATION_SALT;
  }

  // Provider aprovado: quando selecionado, configuração completa é obrigatória.
  if (cfg.EMAIL_PROVIDER === "resend") {
    const missing = [
      !cfg.RESEND_API_KEY ? "RESEND_API_KEY" : null,
      !cfg.RESEND_FROM ? "RESEND_FROM" : null,
      !cfg.EMAIL_REPLY_TO ? "EMAIL_REPLY_TO" : null,
    ].filter(Boolean);
    if (missing.length > 0) {
      throw new Error(`Configuração ausente para Resend: ${missing.join(", ")}`);
    }
  }

  // §14 — URL pública canônica.
  let publicUrl = cfg.APP_PUBLIC_URL;
  if (!publicUrl) {
    if (strict) {
      throw new Error("Configuração ausente: APP_PUBLIC_URL é obrigatória fora de desenvolvimento.");
    }
    publicUrl = DEV_PUBLIC_URL;
  }
  let normalized: string;
  try {
    normalized = normalizePublicUrl(publicUrl);
  } catch {
    throw new Error("Configuração inválida. Variáveis com problema: APP_PUBLIC_URL");
  }
  if (cfg.APP_ENV === "production" && !normalized.startsWith("https://")) {
    throw new Error("Configuração inválida. Variáveis com problema: APP_PUBLIC_URL");
  }

  cached = { ...cfg, APP_PUBLIC_URL: normalized } as ServerConfig;
  return cached;
}

/** Apenas para a suíte automatizada: força releitura de `process.env`. */
export function resetServerConfigCache() {
  cached = null;
}

export function isProductionEnv() {
  return getServerConfig().APP_ENV === "production";
}

/**
 * §13 — coerência entre a fonte canônica e o valor público.
 * Divergência é erro de configuração, não é corrigida silenciosamente.
 */
export function assertEnvironmentCoherence(serverEnv: string, publicEnv: string | undefined) {
  if (!publicEnv) return;
  if (serverEnv !== publicEnv) {
    throw new Error(
      "Configuração inconsistente: APP_ENV e VITE_APP_ENV declaram ambientes diferentes.",
    );
  }
}
