/**
 * Configuração de servidor com validação fail-fast.
 * Nenhum segredo é exposto ao bundle do cliente (§23 da Etapa 5).
 */
import { z } from "zod";

const schema = z.object({
  APP_ENV: z.enum(["development", "preview", "staging", "production"]).default("development"),
  AUTH_SESSION_SECRET: z.string().min(32).optional(),
  AUTH_SESSION_TTL_MINUTES: z.coerce.number().int().positive().default(480),
  AUTH_MAX_ATTEMPTS: z.coerce.number().int().positive().default(5),
  EMAIL_PROVIDER: z.enum(["null", "log"]).default("log"),
  STORAGE_PROVIDER: z.enum(["null", "local"]).default("local"),
  CAPTCHA_PROVIDER: z.enum(["null"]).default("null"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

export type ServerConfig = z.infer<typeof schema> & { AUTH_SESSION_SECRET: string };

/** Segredo de desenvolvimento — NUNCA aceito em homologação/produção. */
const DEV_ONLY_SESSION_SECRET = "avizee-development-only-session-secret-0001";

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
  const isProdLike = cfg.APP_ENV === "staging" || cfg.APP_ENV === "production";

  if (!cfg.AUTH_SESSION_SECRET) {
    if (isProdLike) {
      throw new Error("Configuração ausente: AUTH_SESSION_SECRET é obrigatória fora de desenvolvimento/preview.");
    }
    cfg.AUTH_SESSION_SECRET = DEV_ONLY_SESSION_SECRET;
  }

  cached = cfg as ServerConfig;
  return cached;
}

export function isProductionEnv() {
  return getServerConfig().APP_ENV === "production";
}
