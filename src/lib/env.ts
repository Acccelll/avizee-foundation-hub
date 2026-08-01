/**
 * Ambiente da aplicação — seguro para o cliente.
 * Origem: docs/avizee/118-environment-strategy.md.
 * Somente `production` pode ser indexável (§16 da Etapa 5).
 */
export type AppEnvironment = "development" | "preview" | "staging" | "production";

const VALID: AppEnvironment[] = ["development", "preview", "staging", "production"];

function read(): AppEnvironment {
  const raw = (import.meta.env["VITE_APP_ENV"] as string | undefined)?.trim();
  if (raw && (VALID as string[]).includes(raw)) return raw as AppEnvironment;
  return import.meta.env.PROD ? "preview" : "development";
}

/** Ambiente corrente. Default seguro: nunca assume `production`. */
export const APP_ENV: AppEnvironment = read();

/** Indexação permitida apenas em produção. */
export const IS_INDEXABLE = APP_ENV === "production";

/** Rótulo curto exibido na faixa técnica de ambientes não produtivos. */
export const ENV_LABEL: Record<AppEnvironment, string> = {
  development: "Desenvolvimento",
  preview: "Preview",
  staging: "Homologação",
  production: "Produção",
};

export const APP_VERSION = (import.meta.env["VITE_APP_VERSION"] as string | undefined) ?? "0.5.0";
