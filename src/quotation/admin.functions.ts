/**
 * Funções de servidor do painel comercial (Etapa 8).
 * Wrapper fino: autorização + delegação para `admin.server.ts`.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { authorize } from "@/catalog/guard.server";
import {
  addQuotationNote,
  assignQuotation,
  changeQuotationStatus,
  getQuotation,
  listOutboxMessages,
  listQuotations,
  quotationDashboard,
  retryOutbox,
} from "@/quotation/admin.server";
import { QUOTATION_STATUSES } from "@/quotation/model";

const idInput = z.object({ id: z.string().uuid() });

export const fetchQuotations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        status: z.enum(QUOTATION_STATUSES).nullable().optional(),
        search: z.string().trim().max(120).nullable().optional(),
        assigned: z.enum(["mine", "none"]).nullable().optional(),
        page: z.number().int().min(1).max(500).optional(),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ context, data }) =>
    listQuotations(await authorize(context, "quotation.read"), data),
  );

export const fetchQuotationDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => quotationDashboard(await authorize(context, "quotation.read")));

export const fetchQuotation = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => idInput.parse(input))
  .handler(async ({ context, data }) =>
    getQuotation(await authorize(context, "quotation.read"), data.id),
  );

export const updateQuotationStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        toStatus: z.enum(QUOTATION_STATUSES),
        note: z.string().trim().max(2000).nullable().optional(),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) =>
    changeQuotationStatus(await authorize(context, "quotation.write"), data),
  );

export const setQuotationOwner = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid(), userId: z.string().uuid().nullable() }).parse(input),
  )
  .handler(async ({ context, data }) =>
    assignQuotation(await authorize(context, "quotation.assign"), data),
  );

export const addInternalNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid(), note: z.string().trim().min(2).max(2000) }).parse(input),
  )
  .handler(async ({ context, data }) =>
    addQuotationNote(await authorize(context, "quotation.write"), data),
  );

export const fetchOutbox = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ status: z.string().max(20).nullable().optional() }).parse(input ?? {}),
  )
  .handler(async ({ context, data }) =>
    listOutboxMessages(await authorize(context, "quotation.read"), data.status ?? null),
  );

export const requeueNotification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => idInput.parse(input))
  .handler(async ({ context, data }) =>
    retryOutbox(await authorize(context, "outbox.manage"), data.id),
  );
