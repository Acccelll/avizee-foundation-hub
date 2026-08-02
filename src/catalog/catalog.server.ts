/**
 * Consultas e escritas do núcleo administrativo do catálogo.
 * Módulo server-only: nunca é importado pelo cliente.
 */
import { AppError } from "@/lib/errors";
import { audit, diffFields, type AuditAction } from "@/lib/audit.server";
import { assertNoBrandInPublicFields } from "@/catalog/brand-terms";
import {
  canApproveImage,
  canTransitionPublication,
  canTransitionReview,
  type PublicationStatus,
  type ReviewStatus,
} from "@/catalog/types";
import type { Authorized } from "@/catalog/guard.server";

type Row = Record<string, unknown>;

function unwrap<T>(result: { data: T | null; error: { message: string } | null }): T {
  if (result.error) throw new AppError("SERVICE_UNAVAILABLE", { cause: result.error.message });
  return result.data as T;
}

/* ------------------------------------------------------------------ */
/* Taxonomia                                                           */
/* ------------------------------------------------------------------ */

export async function listTaxonomy(auth: Authorized) {
  const [categories, subcategories, segments, applications, solutions] = await Promise.all([
    auth.admin.from("product_categories").select("*").order("sort_order"),
    auth.admin.from("product_subcategories").select("*").order("sort_order"),
    auth.admin.from("segments").select("*").order("sort_order"),
    auth.admin.from("applications").select("*").order("sort_order"),
    auth.admin.from("solutions").select("*").order("sort_order"),
  ]);
  return {
    categories: unwrap(categories) ?? [],
    subcategories: unwrap(subcategories) ?? [],
    segments: unwrap(segments) ?? [],
    applications: unwrap(applications) ?? [],
    solutions: unwrap(solutions) ?? [],
  };
}

/* ------------------------------------------------------------------ */
/* Famílias                                                            */
/* ------------------------------------------------------------------ */

export interface FamilyFilters {
  search?: string | null;
  categoryId?: string | null;
  reviewStatus?: string | null;
  publicationStatus?: string | null;
  page?: number;
}

const PAGE_SIZE = 25;

export async function listFamilies(auth: Authorized, filters: FamilyFilters) {
  const page = Math.max(1, filters.page ?? 1);
  let query = auth.admin
    .from("product_families")
    .select("*, product_categories(name, slug)", { count: "exact" })
    .is("deleted_at", null);

  if (filters.search) query = query.ilike("public_name", `%${filters.search}%`);
  if (filters.categoryId) query = query.eq("category_id", filters.categoryId);
  if (filters.reviewStatus) query = query.eq("review_status", filters.reviewStatus);
  if (filters.publicationStatus) query = query.eq("publication_status", filters.publicationStatus);

  const result = await query
    .order("public_name")
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (result.error) throw new AppError("SERVICE_UNAVAILABLE", { cause: result.error.message });
  return { rows: (result.data ?? []) as Row[], total: result.count ?? 0, page, pageSize: PAGE_SIZE };
}

export async function getFamily(auth: Authorized, id: string) {
  const family = unwrap(
    await auth.admin
      .from("product_families")
      .select("*, product_categories(id, name), product_subcategories(id, name)")
      .eq("id", id)
      .maybeSingle(),
  ) as Row | null;
  if (!family) throw new AppError("NOT_FOUND", { entity: "product_families" });

  const [products, applications, segments, specs] = await Promise.all([
    auth.admin
      .from("products")
      .select("id, public_sku, public_name, review_status, publication_status, variation_label")
      .eq("family_id", id)
      .is("deleted_at", null)
      .order("public_sku"),
    auth.admin.from("family_applications").select("application_id, is_primary").eq("family_id", id),
    auth.admin.from("family_segments").select("segment_id, is_primary").eq("family_id", id),
    auth.admin
      .from("family_specifications")
      .select("*, specification_definitions(code, label, value_type, unit_id)")
      .eq("family_id", id),
  ]);

  return {
    family,
    products: (products.data ?? []) as Row[],
    applications: (applications.data ?? []) as Row[],
    segments: (segments.data ?? []) as Row[],
    specifications: (specs.data ?? []) as Row[],
  };
}

export async function upsertFamily(
  auth: Authorized,
  input: Row & { id?: string | null },
): Promise<{ id: string }> {
  const problems = assertNoBrandInPublicFields(input);
  if (problems.length > 0) throw new AppError("VALIDATION", { problems });

  const { id, ...values } = input;
  let before: Row | null = null;
  if (id) {
    before = unwrap(
      await auth.admin.from("product_families").select("*").eq("id", id).maybeSingle(),
    ) as Row | null;
    if (!before) throw new AppError("NOT_FOUND", { entity: "product_families" });
  }

  const payload = { ...values, updated_by: auth.userId, updated_at: new Date().toISOString() };
  const result = id
    ? await auth.admin.from("product_families").update(payload).eq("id", id).select("id").single()
    : await auth.admin
        .from("product_families")
        .insert({ ...payload, created_by: auth.userId })
        .select("id")
        .single();
  const saved = unwrap(result) as { id: string };

  await audit(auth.admin, {
    actorId: auth.userId,
    actorEmail: auth.email,
    action: id ? "catalog.update" : "catalog.create",
    entity: "product_families",
    entityId: saved.id,
    changedFields: diffFields(before, values),
    previousValues: before,
    newValues: values,
  });
  return saved;
}

/* ------------------------------------------------------------------ */
/* SKUs                                                                */
/* ------------------------------------------------------------------ */

export interface ProductFilters extends FamilyFilters {
  familyId?: string | null;
  withoutImage?: boolean;
  blockedOnly?: boolean;
}

export async function listProducts(auth: Authorized, filters: ProductFilters) {
  const page = Math.max(1, filters.page ?? 1);
  let query = auth.admin
    .from("products")
    .select("*, product_families(id, public_name, slug)", { count: "exact" })
    .is("deleted_at", null);

  if (filters.search) {
    const term = `%${filters.search}%`;
    query = query.or(`public_name.ilike.${term},public_sku.ilike.${term}`);
  }
  if (filters.familyId) query = query.eq("family_id", filters.familyId);
  if (filters.reviewStatus) query = query.eq("review_status", filters.reviewStatus);
  if (filters.publicationStatus) query = query.eq("publication_status", filters.publicationStatus);
  if (filters.blockedOnly) query = query.like("review_status", "BLOCKED%");

  const result = await query
    .order("public_sku")
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (result.error) throw new AppError("SERVICE_UNAVAILABLE", { cause: result.error.message });
  return { rows: (result.data ?? []) as Row[], total: result.count ?? 0, page, pageSize: PAGE_SIZE };
}

export async function getProduct(auth: Authorized, id: string) {
  const product = unwrap(
    await auth.admin
      .from("products")
      .select("*, product_families(id, public_name, slug, category_id)")
      .eq("id", id)
      .maybeSingle(),
  ) as Row | null;
  if (!product) throw new AppError("NOT_FOUND", { entity: "products" });

  const [codes, specs, images, applications, segments, documents] = await Promise.all([
    auth.admin.from("product_codes").select("*").eq("product_id", id).order("code_type"),
    auth.admin
      .from("product_specifications")
      .select("*, specification_definitions(code, label, value_type, is_public)")
      .eq("product_id", id),
    auth.admin
      .from("product_images")
      .select("*, media_assets(id, alt_text, review_status, rights_status, public_path, internal_title)")
      .eq("product_id", id)
      .order("sort_order"),
    auth.admin.from("product_applications").select("*").eq("product_id", id),
    auth.admin.from("product_segments").select("*").eq("product_id", id),
    auth.admin.from("product_documents").select("*, documents(title, status)").eq("product_id", id),
  ]);

  return {
    product,
    codes: (codes.data ?? []) as Row[],
    specifications: (specs.data ?? []) as Row[],
    images: (images.data ?? []) as Row[],
    applications: (applications.data ?? []) as Row[],
    segments: (segments.data ?? []) as Row[],
    documents: (documents.data ?? []) as Row[],
  };
}

export async function upsertProduct(
  auth: Authorized,
  input: Row & { id?: string | null },
): Promise<{ id: string }> {
  const problems = assertNoBrandInPublicFields(input);
  if (problems.length > 0) throw new AppError("VALIDATION", { problems });

  const { id, ...values } = input;
  let before: Row | null = null;
  if (id) {
    before = unwrap(await auth.admin.from("products").select("*").eq("id", id).maybeSingle()) as Row | null;
    if (!before) throw new AppError("NOT_FOUND", { entity: "products" });
  }

  const payload = { ...values, updated_by: auth.userId, updated_at: new Date().toISOString() };
  const result = id
    ? await auth.admin.from("products").update(payload).eq("id", id).select("id").single()
    : await auth.admin
        .from("products")
        .insert({ ...payload, created_by: auth.userId })
        .select("id")
        .single();
  const saved = unwrap(result) as { id: string };

  const changed = diffFields(before, values);
  await audit(auth.admin, {
    actorId: auth.userId,
    actorEmail: auth.email,
    action: id ? "catalog.update" : "catalog.create",
    entity: "products",
    entityId: saved.id,
    changedFields: changed,
    previousValues: before,
    newValues: values,
  });
  if (changed.includes("public_name")) {
    await audit(auth.admin, {
      actorId: auth.userId,
      action: "catalog.name.change",
      entity: "products",
      entityId: saved.id,
      previousValues: { public_name: before?.["public_name"] ?? null },
      newValues: { public_name: values["public_name"] },
    });
  }
  return saved;
}

/* ------------------------------------------------------------------ */
/* Estados                                                             */
/* ------------------------------------------------------------------ */

const ENTITY_TABLES = ["products", "product_families"] as const;
type EntityTable = (typeof ENTITY_TABLES)[number];

export async function changeStatus(
  auth: Authorized,
  input: {
    entity: EntityTable;
    id: string;
    reviewStatus?: ReviewStatus;
    publicationStatus?: PublicationStatus;
    reason?: string | null;
  },
) {
  const current = unwrap(
    await auth.admin
      .from(input.entity)
      .select("id, review_status, publication_status")
      .eq("id", input.id)
      .maybeSingle(),
  ) as { review_status: ReviewStatus; publication_status: PublicationStatus } | null;
  if (!current) throw new AppError("NOT_FOUND", { entity: input.entity });

  const nextReview = input.reviewStatus ?? current.review_status;
  const nextPublication = input.publicationStatus ?? current.publication_status;

  if (input.reviewStatus && !canTransitionReview(current.review_status, input.reviewStatus)) {
    throw new AppError("VALIDATION", {
      message: `Transição de revisão não permitida: ${current.review_status} → ${input.reviewStatus}`,
    });
  }
  if (
    input.publicationStatus &&
    !canTransitionPublication(current.publication_status, input.publicationStatus, nextReview)
  ) {
    throw new AppError("VALIDATION", {
      message: `Transição de publicação não permitida: ${current.publication_status} → ${input.publicationStatus}`,
    });
  }

  unwrap(
    await auth.admin
      .from(input.entity)
      .update({
        review_status: nextReview,
        publication_status: nextPublication,
        updated_by: auth.userId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.id)
      .select("id")
      .single(),
  );

  await auth.admin.from("publication_history").insert({
    entity: input.entity,
    entity_id: input.id,
    from_status: `${current.review_status}/${current.publication_status}`,
    to_status: `${nextReview}/${nextPublication}`,
    actor_id: auth.userId,
    reason: input.reason ?? null,
  });

  const action: AuditAction = input.publicationStatus
    ? input.publicationStatus === "PUBLISHED"
      ? "catalog.publish"
      : "catalog.unpublish"
    : "catalog.status.change";

  await audit(auth.admin, {
    actorId: auth.userId,
    actorEmail: auth.email,
    action,
    entity: input.entity,
    entityId: input.id,
    changedFields: ["review_status", "publication_status"],
    previousValues: current,
    newValues: { review_status: nextReview, publication_status: nextPublication },
    context: { reason: input.reason ?? null },
  });

  return { review_status: nextReview, publication_status: nextPublication };
}

/* ------------------------------------------------------------------ */
/* Mídia                                                               */
/* ------------------------------------------------------------------ */

export async function listMedia(
  auth: Authorized,
  filters: { reviewStatus?: string | null; search?: string | null; page?: number },
) {
  const page = Math.max(1, filters.page ?? 1);
  let query = auth.admin.from("media_assets").select("*", { count: "exact" }).is("deleted_at", null);
  if (filters.reviewStatus) query = query.eq("review_status", filters.reviewStatus);
  if (filters.search) query = query.ilike("internal_title", `%${filters.search}%`);
  const result = await query
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (result.error) throw new AppError("SERVICE_UNAVAILABLE", { cause: result.error.message });
  return { rows: (result.data ?? []) as Row[], total: result.count ?? 0, page, pageSize: PAGE_SIZE };
}

export async function reviewMedia(
  auth: Authorized,
  input: { id: string; toStatus: string; reason?: string | null; matchesProduct?: boolean },
) {
  const asset = unwrap(
    await auth.admin.from("media_assets").select("*").eq("id", input.id).maybeSingle(),
  ) as Row | null;
  if (!asset) throw new AppError("NOT_FOUND", { entity: "media_assets" });

  if (input.toStatus === "APROVADA" || input.toStatus === "APROVADA_PARA_FAMILIA") {
    const verdict = canApproveImage({
      rightsStatus: asset["rights_status"] as never,
      source: asset["source"] as string | null,
      detectedBrand: asset["detected_brand"] as string | null,
      matchesProduct: input.matchesProduct ?? false,
    });
    if (!verdict.ok) throw new AppError("VALIDATION", { message: `Aprovação negada: ${verdict.reason}` });
    if (!asset["alt_text"]) throw new AppError("VALIDATION", { message: "Texto alternativo obrigatório" });
  }

  unwrap(
    await auth.admin
      .from("media_assets")
      .update({
        review_status: input.toStatus,
        review_reason: input.reason ?? null,
        in_quarantine: !["APROVADA", "APROVADA_PARA_FAMILIA"].includes(input.toStatus),
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.id)
      .select("id")
      .single(),
  );

  await auth.admin.from("image_review_events").insert({
    media_asset_id: input.id,
    from_status: asset["review_status"],
    to_status: input.toStatus,
    reason: input.reason ?? null,
    actor_id: auth.userId,
  });

  await audit(auth.admin, {
    actorId: auth.userId,
    actorEmail: auth.email,
    action: "media.status.change",
    entity: "media_assets",
    entityId: input.id,
    previousValues: { review_status: asset["review_status"] },
    newValues: { review_status: input.toStatus },
    context: { reason: input.reason ?? null },
  });

  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* Governança                                                          */
/* ------------------------------------------------------------------ */

export async function listNormalizationTasks(
  auth: Authorized,
  filters: { status?: string | null; reason?: string | null; page?: number },
) {
  const page = Math.max(1, filters.page ?? 1);
  let query = auth.admin.from("normalization_tasks").select("*", { count: "exact" });
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.reason) query = query.eq("reason", filters.reason);
  const result = await query
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (result.error) throw new AppError("SERVICE_UNAVAILABLE", { cause: result.error.message });
  return { rows: (result.data ?? []) as Row[], total: result.count ?? 0, page, pageSize: PAGE_SIZE };
}

export async function updateNormalizationTask(
  auth: Authorized,
  input: { id: string; status?: string; decision?: string | null; comment?: string | null },
) {
  const before = unwrap(
    await auth.admin.from("normalization_tasks").select("*").eq("id", input.id).maybeSingle(),
  ) as Row | null;
  if (!before) throw new AppError("NOT_FOUND", { entity: "normalization_tasks" });

  unwrap(
    await auth.admin
      .from("normalization_tasks")
      .update({
        status: input.status ?? before["status"],
        decision: input.decision ?? before["decision"],
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.id)
      .select("id")
      .single(),
  );

  await auth.admin.from("normalization_task_events").insert({
    task_id: input.id,
    actor_id: auth.userId,
    event_type: input.status ?? "COMMENT",
    comment: input.comment ?? null,
  });

  await audit(auth.admin, {
    actorId: auth.userId,
    action: "normalization.update",
    entity: "normalization_tasks",
    entityId: input.id,
    previousValues: { status: before["status"], decision: before["decision"] },
    newValues: { status: input.status, decision: input.decision },
  });
  return { ok: true };
}

export async function listConflicts(auth: Authorized, status?: string | null) {
  let query = auth.admin.from("code_conflicts").select("*").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  return (unwrap(await query) ?? []) as Row[];
}

export async function resolveConflict(
  auth: Authorized,
  input: { id: string; decision: string; canonicalProductId?: string | null },
) {
  const before = unwrap(
    await auth.admin.from("code_conflicts").select("*").eq("id", input.id).maybeSingle(),
  ) as Row | null;
  if (!before) throw new AppError("NOT_FOUND", { entity: "code_conflicts" });

  unwrap(
    await auth.admin
      .from("code_conflicts")
      .update({
        status: "RESOLVED",
        decision: input.decision,
        canonical_product_id: input.canonicalProductId ?? null,
        decided_by: auth.userId,
        decided_at: new Date().toISOString(),
      })
      .eq("id", input.id)
      .select("id")
      .single(),
  );

  await audit(auth.admin, {
    actorId: auth.userId,
    actorEmail: auth.email,
    action: "conflict.resolve",
    entity: "code_conflicts",
    entityId: input.id,
    previousValues: { status: before["status"] },
    newValues: { status: "RESOLVED", decision: input.decision },
  });
  return { ok: true };
}

export async function listAuditLogs(
  auth: Authorized,
  filters: { entity?: string | null; action?: string | null; page?: number },
) {
  const page = Math.max(1, filters.page ?? 1);
  let query = auth.admin.from("audit_logs").select("*", { count: "exact" });
  if (filters.entity) query = query.eq("entity", filters.entity);
  if (filters.action) query = query.eq("action", filters.action);
  const result = await query
    .order("occurred_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (result.error) throw new AppError("SERVICE_UNAVAILABLE", { cause: result.error.message });
  return { rows: (result.data ?? []) as Row[], total: result.count ?? 0, page, pageSize: PAGE_SIZE };
}

export async function catalogDashboard(auth: Authorized) {
  const count = async (table: string, apply?: (q: never) => never) => {
    let query = auth.admin.from(table).select("id", { count: "exact", head: true });
    if (apply) query = apply(query as never);
    const { count: total } = await query;
    return total ?? 0;
  };

  const [families, products, blocked, pendingMedia, tasks, conflicts] = await Promise.all([
    count("product_families"),
    count("products"),
    count("products", ((q: { like: (a: string, b: string) => unknown }) =>
      q.like("review_status", "BLOCKED%")) as never),
    count("media_assets", ((q: { like: (a: string, b: string) => unknown }) =>
      q.like("review_status", "PENDENTE%")) as never),
    count("normalization_tasks", ((q: { eq: (a: string, b: string) => unknown }) =>
      q.eq("status", "OPEN")) as never),
    count("code_conflicts", ((q: { eq: (a: string, b: string) => unknown }) =>
      q.eq("status", "OPEN")) as never),
  ]);

  return { families, products, blocked, pendingMedia, tasks, conflicts };
}
