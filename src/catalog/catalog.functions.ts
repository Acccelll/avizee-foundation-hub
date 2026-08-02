/**
 * Funções de servidor do núcleo administrativo do catálogo.
 * Wrapper fino: somente declarações; a lógica vive em `catalog.server.ts`.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { authorize } from "@/catalog/guard.server";
import {
  catalogDashboard,
  changeStatus,
  getFamily,
  getProduct,
  listConflicts,
  listAuditLogs,
  listFamilies,
  listMedia,
  listNormalizationTasks,
  listProducts,
  listTaxonomy,
  resolveConflict,
  reviewMedia,
  updateNormalizationTask,
  upsertFamily,
  upsertProduct,
} from "@/catalog/catalog.server";
import { PUBLICATION_STATUSES, REVIEW_STATUSES } from "@/catalog/types";

const listFilters = z.object({
  search: z.string().trim().max(120).nullable().optional(),
  categoryId: z.string().uuid().nullable().optional(),
  familyId: z.string().uuid().nullable().optional(),
  reviewStatus: z.string().max(40).nullable().optional(),
  publicationStatus: z.string().max(40).nullable().optional(),
  blockedOnly: z.boolean().optional(),
  page: z.number().int().min(1).max(1000).optional(),
});

const idInput = z.object({ id: z.string().uuid() });

export const fetchDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => catalogDashboard(await authorize(context, "catalog.read")));

export const fetchTaxonomy = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => listTaxonomy(await authorize(context, "catalog.read")));

export const fetchFamilies = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => listFilters.parse(input ?? {}))
  .handler(async ({ context, data }) =>
    listFamilies(await authorize(context, "catalog.read"), data),
  );

export const fetchFamily = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => idInput.parse(input))
  .handler(async ({ context, data }) =>
    getFamily(await authorize(context, "catalog.read"), data.id),
  );

const familyInput = z.object({
  id: z.string().uuid().nullable().optional(),
  public_name: z.string().trim().min(3).max(200),
  admin_name: z.string().trim().max(200).nullable().optional(),
  slug: z.string().trim().min(3).max(160),
  category_id: z.string().uuid().nullable().optional(),
  subcategory_id: z.string().uuid().nullable().optional(),
  summary: z.string().trim().max(600).nullable().optional(),
  public_description: z.string().trim().max(4000).nullable().optional(),
  internal_notes: z.string().trim().max(4000).nullable().optional(),
});

export const saveFamily = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => familyInput.parse(input))
  .handler(async ({ context, data }) =>
    upsertFamily(await authorize(context, "catalog.write"), data),
  );

export const fetchProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => listFilters.parse(input ?? {}))
  .handler(async ({ context, data }) =>
    listProducts(await authorize(context, "catalog.read"), data),
  );

export const fetchProduct = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => idInput.parse(input))
  .handler(async ({ context, data }) =>
    getProduct(await authorize(context, "catalog.read"), data.id),
  );

const productInput = z.object({
  id: z.string().uuid().nullable().optional(),
  family_id: z.string().uuid(),
  public_sku: z.string().trim().min(1).max(64),
  public_name: z.string().trim().min(3).max(200),
  slug: z.string().trim().max(160).nullable().optional(),
  variation_label: z.string().trim().max(160).nullable().optional(),
  measure: z.string().trim().max(80).nullable().optional(),
  capacity: z.string().trim().max(80).nullable().optional(),
  unit: z.string().trim().max(40).nullable().optional(),
  public_description: z.string().trim().max(4000).nullable().optional(),
  is_on_request: z.boolean().optional(),
  internal_brand: z.string().trim().max(120).nullable().optional(),
  internal_manufacturer: z.string().trim().max(160).nullable().optional(),
  internal_supplier_reference: z.string().trim().max(160).nullable().optional(),
  internal_original_name: z.string().trim().max(300).nullable().optional(),
  internal_notes: z.string().trim().max(4000).nullable().optional(),
});

export const saveProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => productInput.parse(input))
  .handler(async ({ context, data }) =>
    upsertProduct(await authorize(context, "catalog.write"), data),
  );

const statusInput = z.object({
  entity: z.enum(["products", "product_families"]),
  id: z.string().uuid(),
  reviewStatus: z.enum(REVIEW_STATUSES).optional(),
  publicationStatus: z.enum(PUBLICATION_STATUSES).optional(),
  reason: z.string().trim().max(500).nullable().optional(),
});

export const updateStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => statusInput.parse(input))
  .handler(async ({ context, data }) =>
    changeStatus(
      await authorize(context, data.publicationStatus ? "catalog.publish" : "catalog.write"),
      data,
    ),
  );

export const fetchMedia = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => listFilters.parse(input ?? {}))
  .handler(async ({ context, data }) => listMedia(await authorize(context, "media.read"), data));

const mediaReviewInput = z.object({
  id: z.string().uuid(),
  toStatus: z.string().min(3).max(40),
  reason: z.string().trim().max(500).nullable().optional(),
  matchesProduct: z.boolean().optional(),
});

export const reviewMediaAsset = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => mediaReviewInput.parse(input))
  .handler(async ({ context, data }) =>
    reviewMedia(await authorize(context, "media.approve"), data),
  );

export const fetchNormalizationTasks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        status: z.string().max(40).nullable().optional(),
        reason: z.string().max(60).nullable().optional(),
        page: z.number().int().min(1).optional(),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ context, data }) =>
    listNormalizationTasks(await authorize(context, "catalog.read"), data),
  );

export const saveNormalizationTask = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.string().max(40).optional(),
        decision: z.string().max(500).nullable().optional(),
        comment: z.string().max(1000).nullable().optional(),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) =>
    updateNormalizationTask(await authorize(context, "catalog.write"), data),
  );

export const fetchConflicts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ status: z.string().max(40).nullable().optional() }).parse(input ?? {}),
  )
  .handler(async ({ context, data }) =>
    listConflicts(await authorize(context, "catalog.read"), data.status),
  );

export const decideConflict = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        decision: z.string().trim().min(3).max(500),
        canonicalProductId: z.string().uuid().nullable().optional(),
      })
      .parse(input),
  )
  .handler(async ({ context, data }) =>
    resolveConflict(await authorize(context, "conflict.resolve"), data),
  );

export const fetchAuditLogs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        entity: z.string().max(60).nullable().optional(),
        action: z.string().max(60).nullable().optional(),
        page: z.number().int().min(1).optional(),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ context, data }) =>
    listAuditLogs(await authorize(context, "audit.read"), data),
  );
