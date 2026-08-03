/**
 * Registro transacional da Lista de Cotação (Etapa 8).
 *
 * Invariantes:
 * - o servidor é a autoridade: tudo é revalidado, nada vem do cliente por confiança;
 * - reconciliação obrigatória contra o catálogo público antes de gravar;
 * - cotação, itens, origem, consentimentos, evento inicial e outbox são gravados
 *   na MESMA transação (função `public.submit_quotation`);
 * - nenhum e-mail é enviado no caminho crítico (doc 114 §1);
 * - nenhum valor monetário, frete, prazo ou estoque é calculado ou gravado.
 */
import { AppError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { reconcileProducts } from "@/catalog/public/read.server";
import {
  CONSENT_POLICY_VERSION,
  CONSENT_TEXT_CONTACT,
  CONSENT_TEXT_MARKETING,
  MIN_FILL_TIME_MS,
  QUOTE_MAX_ITEMS,
  clampQuantity,
  type ReconciledItem,
} from "./model";

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface RawQuoteItem {
  productId: string;
  quantity: number;
  note?: string | null | undefined;
  /** Rótulos guardados no navegador; usados só quando o item saiu do ar. */
  fallbackSku?: string | null | undefined;
  fallbackName?: string | null | undefined;
}

/**
 * Reconcilia a lista contra o catálogo publicado. Item despublicado NÃO é
 * removido nem bloqueia o envio: é sinalizado como indisponível (doc 107 §5).
 */
export async function reconcileList(items: RawQuoteItem[]): Promise<{
  items: ReconciledItem[];
  unavailable: number;
}> {
  const trimmed = items.slice(0, QUOTE_MAX_ITEMS);
  const known = await reconcileProducts(trimmed.map((i) => i.productId));
  const byId = new Map(known.map((k) => [k.productId, k]));

  const reconciled: ReconciledItem[] = trimmed.map((item) => {
    const match = byId.get(item.productId);
    const note = (item.note ?? "").trim().slice(0, 300) || null;
    if (!match) {
      return {
        productId: item.productId,
        familyId: null,
        sku: item.fallbackSku ?? "—",
        name: item.fallbackName ?? "Item indisponível para cotação",
        familyName: null,
        familySlug: null,
        categorySlug: null,
        categoryName: null,
        variation: null,
        quantity: clampQuantity(item.quantity),
        note,
        available: false,
      };
    }
    return {
      productId: match.productId,
      familyId: match.familyId,
      sku: match.sku,
      name: match.name,
      familyName: match.familyName,
      familySlug: match.familySlug,
      categorySlug: match.categorySlug,
      categoryName: match.categoryName,
      variation: match.variation,
      quantity: clampQuantity(item.quantity),
      note,
      available: true,
    };
  });

  return { items: reconciled, unavailable: reconciled.filter((i) => !i.available).length };
}

export interface SubmitInput {
  clientRequestId: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  city?: string | null | undefined;
  stateUf?: string | null | undefined;
  message?: string | null | undefined;
  preferredChannel?: string | null | undefined;
  consentContact: boolean;
  consentMarketing: boolean;
  items: RawQuoteItem[];
  /** Antiabuso: campo invisível, tem de chegar vazio. */
  honeypot?: string | null | undefined;
  /** Antiabuso: milissegundos entre abrir e enviar o formulário. */
  elapsedMs?: number | undefined;
  origin?:
    | {
        page?: string | null | undefined;
        referrer?: string | null | undefined;
        utmSource?: string | null | undefined;
        utmMedium?: string | null | undefined;
        utmCampaign?: string | null | undefined;
      }
    | undefined;
}

/** Hash irreversível de IP/user-agent (base legal: legítimo interesse, doc 113). */
async function hashValue(value: string | null | undefined): Promise<string | null> {
  if (!value) return null;
  const salt = process.env["QUOTATION_HASH_SALT"] ?? "avizee-antiabuse";
  const bytes = new TextEncoder().encode(`${salt}:${value}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export interface RequestFingerprint {
  ip?: string | null | undefined;
  userAgent?: string | null | undefined;
}

export interface SubmitResult {
  protocol: string;
  idempotent: boolean;
  itemCount: number;
  unavailableCount: number;
}

export async function submitQuotation(
  input: SubmitInput,
  fingerprint: RequestFingerprint = {},
): Promise<SubmitResult> {
  // 1. Antiabuso — recusa silenciosa não é usada: o erro é genérico e auditável.
  if (input.honeypot && input.honeypot.trim().length > 0) {
    logger.warn("quotation.honeypot");
    throw new AppError("VALIDATION_ERROR", { cause: "honeypot" });
  }
  if (typeof input.elapsedMs === "number" && input.elapsedMs < MIN_FILL_TIME_MS) {
    logger.warn("quotation.too_fast");
    throw new AppError("VALIDATION_ERROR", { cause: "min-fill-time" });
  }
  if (!input.consentContact) {
    throw new AppError("VALIDATION_ERROR", { cause: "consent-required" });
  }

  // 2. Reconciliação obrigatória (servidor decide o snapshot gravado).
  const { items, unavailable } = await reconcileList(input.items);
  if (items.length === 0) {
    throw new AppError("VALIDATION_ERROR", { cause: "empty-list" });
  }
  if (items.every((i) => !i.available)) {
    throw new AppError(
      "VALIDATION_ERROR",
      { cause: "all-unavailable" },
      "Todos os itens da lista saíram de publicação. Atualize a lista antes de enviar.",
    );
  }

  const [ipHash, uaHash] = await Promise.all([
    hashValue(fingerprint.ip ?? null),
    hashValue(fingerprint.userAgent ?? null),
  ]);

  const payload = {
    client_request_id: input.clientRequestId,
    company_name: input.companyName,
    contact_name: input.contactName,
    contact_email: input.contactEmail,
    contact_phone: input.contactPhone,
    city: input.city ?? null,
    state_uf: input.stateUf ?? null,
    message: input.message ?? null,
    preferred_channel: input.preferredChannel ?? null,
    ip_hash: ipHash,
    user_agent_hash: uaHash,
    origin_page: input.origin?.page ?? null,
    referrer: input.origin?.referrer ?? null,
    utm_source: input.origin?.utmSource ?? null,
    utm_medium: input.origin?.utmMedium ?? null,
    utm_campaign: input.origin?.utmCampaign ?? null,
    items: items.map((item) => ({
      product_id: item.available ? item.productId : null,
      family_id: item.familyId,
      snapshot_sku: item.sku,
      snapshot_name: item.name,
      snapshot_variation: item.variation,
      snapshot_family: item.familyName,
      snapshot_category: item.categoryName,
      quantity: item.quantity,
      note: item.note,
      was_available: item.available,
    })),
    consents: [
      {
        purpose: "Resposta à solicitação de cotação",
        legal_basis: "Procedimentos preliminares a pedido do titular",
        policy_version: CONSENT_POLICY_VERSION,
        consent_text: CONSENT_TEXT_CONTACT,
        accepted: true,
      },
      {
        purpose: "Comunicações técnicas e comerciais",
        legal_basis: "Consentimento",
        policy_version: CONSENT_POLICY_VERSION,
        consent_text: CONSENT_TEXT_MARKETING,
        accepted: Boolean(input.consentMarketing),
      },
    ],
  };

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await (supabaseAdmin as any).rpc("submit_quotation", { p: payload });

  if (error) {
    const message = String(error.message ?? "");
    if (message.includes("RATE_LIMITED")) throw new AppError("RATE_LIMITED");
    if (message.includes("INVALID_ITEMS"))
      throw new AppError("VALIDATION_ERROR", { cause: "items" });
    logger.error("quotation.submit.failure", { code: error.code ?? null });
    // Banco indisponível: nenhum protocolo falso é devolvido; a lista fica com o cliente.
    throw new AppError("SERVICE_UNAVAILABLE", { cause: "quotation-persist" });
  }

  const result = (data ?? {}) as { protocol?: string; idempotent?: boolean };
  if (!result.protocol) throw new AppError("SERVICE_UNAVAILABLE", { cause: "quotation-protocol" });

  logger.info("quotation.submitted", {
    protocol: result.protocol,
    idempotent: Boolean(result.idempotent),
    itemCount: items.length,
    unavailable,
  });

  return {
    protocol: result.protocol,
    idempotent: Boolean(result.idempotent),
    itemCount: items.length,
    unavailableCount: unavailable,
  };
}
