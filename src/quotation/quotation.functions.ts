/**
 * Funções de servidor PÚBLICAS da Lista de Cotação (Etapa 8).
 * Wrapper fino: apenas validação Zod e delegação para `quotation.server.ts`.
 */
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

import { reconcileList, submitQuotation } from "@/quotation/quotation.server";
import { BRAZIL_UFS, QUOTE_MAX_ITEMS, QUOTE_MAX_QUANTITY, QUOTE_NOTE_MAX } from "@/quotation/model";

const itemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(QUOTE_MAX_QUANTITY),
  note: z.string().trim().max(QUOTE_NOTE_MAX).nullable().optional(),
  fallbackSku: z.string().trim().max(64).nullable().optional(),
  fallbackName: z.string().trim().max(200).nullable().optional(),
});

const listSchema = z.object({ items: z.array(itemSchema).max(QUOTE_MAX_ITEMS) });

export const reconcileQuoteList = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => listSchema.parse(input ?? { items: [] }))
  .handler(async ({ data }) => reconcileList(data.items));

const submitSchema = z.object({
  clientRequestId: z.string().uuid(),
  companyName: z.string().trim().min(2).max(160),
  contactName: z.string().trim().min(2).max(160),
  contactEmail: z.string().trim().email().max(180),
  contactPhone: z.string().trim().min(8).max(40),
  city: z.string().trim().max(120).nullable().optional(),
  stateUf: z.enum(BRAZIL_UFS).nullable().optional(),
  message: z.string().trim().max(2000).nullable().optional(),
  preferredChannel: z.enum(["email", "telefone", "whatsapp"]).nullable().optional(),
  // §6 — aceito por compatibilidade; não é condição de envio.
  consentContact: z.boolean().optional(),
  consentMarketing: z.boolean().default(false),
  items: z.array(itemSchema).min(1).max(QUOTE_MAX_ITEMS),
  honeypot: z.string().max(200).nullable().optional(),
  elapsedMs: z.number().int().min(0).max(86_400_000).optional(),
  origin: z
    .object({
      page: z.string().trim().max(300).nullable().optional(),
      referrer: z.string().trim().max(300).nullable().optional(),
      utmSource: z.string().trim().max(120).nullable().optional(),
      utmMedium: z.string().trim().max(120).nullable().optional(),
      utmCampaign: z.string().trim().max(120).nullable().optional(),
    })
    .optional(),
});

const STRICT_IP_ENVS = new Set(["preview", "staging", "production"]);
const MISSING_TRUSTED_CLIENT_IP = "missing-trusted-client-ip";

/**
 * Identidade de rede usada exclusivamente para antiabuso.
 * Em Cloudflare, `cf-connecting-ip` é preenchido pela borda e é a fonte de
 * confiança adotada pelo projeto. Nunca usamos X-Forwarded-For como identidade,
 * pois o cliente pode influenciá-lo fora de uma cadeia de proxy confiável.
 *
 * Em ambientes estritos, a ausência do header falha fechado: todas as
 * requisições sem identidade confiável compartilham o mesmo bucket em vez de
 * desativar silenciosamente o rate limit do banco.
 */
export function trustedClientIp(request: Request | undefined): string | null {
  const cloudflareIp = request?.headers.get("cf-connecting-ip")?.trim();
  if (cloudflareIp) return cloudflareIp;

  const appEnv = process.env["APP_ENV"] ?? "development";
  if (STRICT_IP_ENVS.has(appEnv)) return MISSING_TRUSTED_CLIENT_IP;

  const localProxyIp = request?.headers.get("x-real-ip")?.trim();
  return localProxyIp || null;
}

export const sendQuotation = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => submitSchema.parse(input))
  .handler(async ({ data }) => {
    const request = getRequest();
    const ip = trustedClientIp(request);
    const userAgent = request?.headers.get("user-agent") ?? null;
    return submitQuotation(data, { ip, userAgent });
  });
