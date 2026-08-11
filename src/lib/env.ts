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

/**
 * Normaliza uma origem pública exposta ao cliente. É propositalmente estrita:
 * somente HTTP(S), sem query/hash e sem barra final. Nenhum segredo é aceito aqui.
 */
export function normalizeClientPublicUrl(value: string | undefined): string | null {
  const raw = value?.trim();
  if (!raw) return null;

  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (url.username || url.password || url.search || url.hash) return null;
    const pathname = url.pathname.replace(/\/+$/, "");
    return `${url.origin}${pathname}`;
  } catch {
    return null;
  }
}

/** Origem pública usada apenas em metadados que precisam de URL absoluta. */
export const PUBLIC_BASE_URL = normalizeClientPublicUrl(
  import.meta.env["VITE_APP_PUBLIC_URL"] as string | undefined,
);

/** Converte caminho público ou URL HTTP(S) em URL absoluta segura. */
export function toAbsolutePublicUrl(
  value: string,
  baseUrl: string | null = PUBLIC_BASE_URL,
): string | null {
  const normalized = value.trim();
  if (!normalized) return null;

  try {
    const absolute = new URL(normalized);
    if (absolute.protocol !== "http:" && absolute.protocol !== "https:") return null;
    return absolute.toString();
  } catch {
    if (!baseUrl) return null;
    try {
      return new URL(normalized, `${baseUrl}/`).toString();
    } catch {
      return null;
    }
  }
}
