/**
 * Hash canônico do payload da cotação (Etapa 11.1 §8).
 *
 * Objetivo: vincular a idempotência ao CONTEÚDO enviado, não apenas à chave.
 * - serialização determinística (chaves ordenadas, itens ordenados);
 * - normalização de texto (trim + colapso de espaços + minúsculas onde aplicável);
 * - exclusão de valores voláteis (timestamps, correlation id, tentativa, tokens).
 *
 * Nenhum dado pessoal é registrado em log a partir daqui: apenas o digest.
 */

export interface HashableItem {
  productId: string;
  quantity: number;
  note?: string | null | undefined;
}

export interface HashablePayload {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  city?: string | null | undefined;
  stateUf?: string | null | undefined;
  message?: string | null | undefined;
  preferredChannel?: string | null | undefined;
  consentMarketing: boolean;
  items: HashableItem[];
}

/** Campos voláteis que NUNCA entram no hash. */
export const VOLATILE_FIELDS = [
  "clientRequestId",
  "elapsedMs",
  "honeypot",
  "origin",
  "correlationId",
  "attempt",
  "processedAt",
  "token",
] as const;

function normalizeText(value: string | null | undefined): string {
  return (value ?? "").normalize("NFC").replace(/\s+/g, " ").trim();
}

function normalizeLower(value: string | null | undefined): string {
  return normalizeText(value).toLowerCase();
}

/** Somente dígitos: variações de formatação não geram payload diferente. */
function normalizePhone(value: string | null | undefined): string {
  return (value ?? "").replace(/\D/g, "");
}

/** Serialização canônica e determinística do payload relevante. */
export function canonicalPayload(payload: HashablePayload): string {
  const items = payload.items
    .map((item) => ({
      productId: normalizeLower(item.productId),
      quantity: Math.trunc(item.quantity),
      note: normalizeText(item.note),
    }))
    .sort((a, b) =>
      a.productId === b.productId ? a.quantity - b.quantity : a.productId < b.productId ? -1 : 1,
    );

  // Ordem das chaves fixada explicitamente — não depende da ordem de inserção.
  const canonical = [
    ["companyName", normalizeLower(payload.companyName)],
    ["contactName", normalizeLower(payload.contactName)],
    ["contactEmail", normalizeLower(payload.contactEmail)],
    ["contactPhone", normalizePhone(payload.contactPhone)],
    ["city", normalizeLower(payload.city)],
    ["stateUf", normalizeLower(payload.stateUf)],
    ["message", normalizeText(payload.message)],
    ["preferredChannel", normalizeLower(payload.preferredChannel)],
    ["consentMarketing", payload.consentMarketing ? "1" : "0"],
    ["items", JSON.stringify(items)],
  ] as const;

  return canonical.map(([key, value]) => `${key}=${value}`).join("\n");
}

/** SHA-256 hexadecimal da forma canônica. */
export async function payloadHash(payload: HashablePayload): Promise<string> {
  const bytes = new TextEncoder().encode(canonicalPayload(payload));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
