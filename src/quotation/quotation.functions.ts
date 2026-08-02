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
  consentContact: z.boolean(),
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

export const sendQuotation = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => submitSchema.parse(input))
  .handler(async ({ data }) => {
    const request = getRequest();
    const ip = request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const userAgent = request?.headers.get("user-agent") ?? null;
    return submitQuotation(data, { ip, userAgent });
  });
