/**
 * CMS editorial — consultas e escritas administrativas (Etapa 10).
 * Módulo server-only: nunca importado pelo cliente.
 *
 * Toda escrita chega aqui já autorizada (`authorize()`), grava com o cliente
 * privilegiado, cria versão imutável e registra auditoria.
 */
import { AppError } from "@/lib/errors";
import { audit, diffFields } from "@/lib/audit.server";
import {
  blocksSchema,
  checkContentCompliance,
  readingMinutes,
  relatedFamilySlugs,
  sanitizeText,
  slugify,
  type ContentBlock,
} from "@/content/blocks";
import { findTransition, isEditable, type ContentStatus } from "@/content/workflow";
import {
  CHANNEL_LIMITS,
  normalizeHashtags,
  validateSocialDraft,
  renderSocialExport,
  type SocialChannel,
} from "@/content/social";
import { requirePermission } from "@/auth/authorize.server";
import type { Authorized } from "@/catalog/guard.server";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any>;

const PAGE_SIZE = 20;

function unwrap<T>(result: { data: T | null; error: { message: string } | null }): T {
  if (result.error) throw new AppError("SERVICE_UNAVAILABLE", { cause: result.error.message });
  return result.data as T;
}

/* ------------------------------------------------------------------ */
/* Leitura                                                             */
/* ------------------------------------------------------------------ */

export async function contentDashboard(auth: Authorized) {
  const rows = unwrap<Row[]>(
    await auth.supabase.from("content_articles").select("status").is("deleted_at", null),
  );
  const byStatus: Record<string, number> = {};
  for (const row of rows ?? []) byStatus[row["status"]] = (byStatus[row["status"]] ?? 0) + 1;
  return { total: rows?.length ?? 0, byStatus };
}

export async function listEditorialCategories(auth: Authorized) {
  return (
    unwrap<Row[]>(
      await auth.supabase
        .from("content_categories")
        .select("id, slug, name, description, sort_order, is_active")
        .order("sort_order"),
    ) ?? []
  );
}

export async function listAuthors(auth: Authorized) {
  return (
    unwrap<Row[]>(
      await auth.supabase
        .from("content_authors")
        .select("id, display_name, role_title, bio, is_active")
        .order("display_name"),
    ) ?? []
  );
}

export interface ArticleFilters {
  search?: string | null | undefined;
  status?: string | null | undefined;
  categoryId?: string | null | undefined;
  page?: number | undefined;
}

export async function listArticlesAdmin(auth: Authorized, filters: ArticleFilters) {
  const page = Math.max(1, filters.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  let builder = auth.supabase
    .from("content_articles")
    .select(
      "id, slug, title, status, category_id, author_id, reading_minutes, published_at, updated_at, version",
      { count: "exact" },
    )
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });

  if (filters.status) builder = builder.eq("status", filters.status);
  if (filters.categoryId) builder = builder.eq("category_id", filters.categoryId);
  if (filters.search && filters.search.trim().length >= 2) {
    const term = filters.search.trim().replace(/[%,()]/g, " ");
    builder = builder.or(`title.ilike.%${term}%,slug.ilike.%${term}%`);
  }

  const result = await builder.range(from, from + PAGE_SIZE - 1);
  if (result.error) throw new AppError("SERVICE_UNAVAILABLE", { cause: result.error.message });
  const total = Number(result.count ?? 0);
  return {
    items: result.data ?? [],
    total,
    page,
    pageSize: PAGE_SIZE,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getArticleAdmin(auth: Authorized, id: string) {
  const rows = unwrap<Row[]>(
    await auth.supabase.from("content_articles").select("*").eq("id", id).limit(1),
  );
  const article = rows?.[0];
  if (!article) throw new AppError("NOT_FOUND");

  const [revisions, references, families, events, social] = await Promise.all([
    auth.supabase
      .from("content_revisions")
      .select("id, version, title, status, note, created_at")
      .eq("article_id", id)
      .order("version", { ascending: false })
      .limit(20),
    auth.supabase
      .from("content_references")
      .select("id, label, url, note, sort_order")
      .eq("article_id", id)
      .order("sort_order"),
    auth.supabase.from("content_article_families").select("family_id").eq("article_id", id),
    auth.supabase
      .from("content_status_events")
      .select("id, from_status, to_status, note, created_at")
      .eq("article_id", id)
      .order("created_at", { ascending: false })
      .limit(30),
    auth.supabase.from("content_social_variants").select("*").eq("article_id", id),
  ]);

  const blocks = blocksSchema.safeParse(article["blocks"] ?? []);

  return {
    article,
    blocks: blocks.success ? blocks.data : [],
    blocksValid: blocks.success,
    compliance: checkContentCompliance({
      title: String(article["title"] ?? ""),
      excerpt: (article["excerpt"] ?? null) as string | null,
      blocks: blocks.success ? blocks.data : [],
    }),
    revisions: unwrap<Row[]>(revisions) ?? [],
    references: unwrap<Row[]>(references) ?? [],
    familyIds: (unwrap<Row[]>(families) ?? []).map((r) => r["family_id"] as string),
    events: unwrap<Row[]>(events) ?? [],
    socialVariants: unwrap<Row[]>(social) ?? [],
  };
}

/* ------------------------------------------------------------------ */
/* Escrita                                                             */
/* ------------------------------------------------------------------ */

export interface ArticleInput {
  id?: string | null | undefined;
  title: string;
  slug?: string | null | undefined;
  subtitle?: string | null | undefined;
  excerpt?: string | null | undefined;
  categoryId?: string | null | undefined;
  authorId?: string | null | undefined;
  technicalReviewerId?: string | null | undefined;
  seoTitle?: string | null | undefined;
  seoDescription?: string | null | undefined;
  noindex?: boolean | undefined;
  internalNotes?: string | null | undefined;
  blocks?: unknown;
  references?:
    | { label: string; url?: string | null | undefined; note?: string | null | undefined }[]
    | undefined;
  note?: string | null | undefined;
}

export interface ScheduleArticleInput {
  id: string;
  scheduledAt: string;
  note?: string | null | undefined;
}

function clean(value: string | null | undefined): string | null {
  if (value == null) return null;
  const text = sanitizeText(value);
  return text.length === 0 ? null : text;
}

async function syncFamilyRelations(auth: Authorized, articleId: string, blocks: ContentBlock[]) {
  const slugs = relatedFamilySlugs(blocks);
  await auth.admin.from("content_article_families").delete().eq("article_id", articleId);
  if (slugs.length === 0) return [];
  const families =
    unwrap<Row[]>(await auth.admin.from("public_families").select("id, slug").in("slug", slugs)) ??
    [];
  if (families.length > 0) {
    await auth.admin.from("content_article_families").insert(
      slugs.flatMap((slug, index) => {
        const family = families.find((f) => f["slug"] === slug);
        return family
          ? [{ article_id: articleId, family_id: family["id"], sort_order: index }]
          : [];
      }),
    );
  }
  return slugs.filter((slug) => !families.some((f) => f["slug"] === slug));
}

async function syncReferences(
  auth: Authorized,
  articleId: string,
  references: ArticleInput["references"],
) {
  if (!references) return;
  await auth.admin.from("content_references").delete().eq("article_id", articleId);
  const rows = references
    .map((r, index) => ({
      article_id: articleId,
      label: clean(r.label),
      url: clean(r.url ?? null),
      note: clean(r.note ?? null),
      sort_order: index,
    }))
    .filter((r) => r.label);
  if (rows.length > 0) await auth.admin.from("content_references").insert(rows);
}

async function assertPublicationReady(auth: Authorized, article: Row) {
  const parsed = blocksSchema.safeParse(article["blocks"] ?? []);
  const blocks = parsed.success ? parsed.data : [];
  const issues = checkContentCompliance({
    title: String(article["title"] ?? ""),
    excerpt: (article["excerpt"] ?? null) as string | null,
    blocks,
  });

  if (!parsed.success) issues.push({ code: "STRUCTURE", detail: "blocos inválidos" });
  if (!article["category_id"]) issues.push({ code: "STRUCTURE", detail: "categoria obrigatória" });
  if (!article["author_id"]) issues.push({ code: "STRUCTURE", detail: "autor obrigatório" });
  if (article["requires_technical_review"] && !article["technical_reviewer_id"]) {
    issues.push({ code: "STRUCTURE", detail: "revisor técnico obrigatório" });
  }
  if (!article["excerpt"] || String(article["excerpt"]).trim().length < 40) {
    issues.push({ code: "STRUCTURE", detail: "resumo com pelo menos 40 caracteres" });
  }

  const relationSlugs = relatedFamilySlugs(blocks);
  if (relationSlugs.length > 0) {
    const families =
      unwrap<Row[]>(
        await auth.admin.from("public_families").select("slug").in("slug", relationSlugs),
      ) ?? [];
    const unknown = relationSlugs.filter(
      (slug) => !families.some((family) => family["slug"] === slug),
    );
    if (unknown.length > 0) {
      issues.push({
        code: "STRUCTURE",
        detail: `família relacionada inválida: ${unknown.join(", ")}`,
      });
    }
  }

  if (issues.length > 0) {
    throw new AppError("VALIDATION_ERROR", {
      cause: `conformidade:${issues.map((issue) => `${issue.code}(${issue.detail})`).join("; ")}`,
    });
  }
}

async function statusEvent(
  auth: Authorized,
  input: { articleId: string; from: ContentStatus; to: ContentStatus; note?: string | null | undefined },
) {
  const { error } = await auth.admin.from("content_status_events").insert({
    article_id: input.articleId,
    from_status: input.from,
    to_status: input.to,
    actor_id: auth.userId,
    note: clean(input.note),
  });
  if (error) throw new AppError("SERVICE_UNAVAILABLE", { cause: error.message });
}

export async function saveArticle(auth: Authorized, input: ArticleInput) {
  const parsed = blocksSchema.safeParse(input.blocks ?? []);
  if (!parsed.success) {
    throw new AppError("VALIDATION_ERROR", { cause: "blocos-invalidos" });
  }
  const blocks = parsed.data;

  const title = sanitizeText(input.title);
  if (title.length < 5) throw new AppError("VALIDATION_ERROR", { cause: "titulo-curto" });

  let previous: Row | null = null;
  if (input.id) {
    const rows = unwrap<Row[]>(
      await auth.supabase.from("content_articles").select("*").eq("id", input.id).limit(1),
    );
    previous = rows?.[0] ?? null;
    if (!previous) throw new AppError("NOT_FOUND");
    if (!isEditable(previous["status"] as ContentStatus)) {
      throw new AppError("CONFLICT", { cause: "artigo-nao-editavel" });
    }
  }

  const slug = slugify(input.slug?.trim() || title);
  if (slug.length < 3) throw new AppError("VALIDATION_ERROR", { cause: "slug-invalido" });

  const payload: Row = {
    title,
    slug,
    subtitle: clean(input.subtitle),
    excerpt: clean(input.excerpt),
    category_id: input.categoryId ?? null,
    author_id: input.authorId ?? null,
    technical_reviewer_id: input.technicalReviewerId ?? null,
    seo_title: clean(input.seoTitle),
    seo_description: clean(input.seoDescription),
    noindex: Boolean(input.noindex),
    internal_notes: clean(input.internalNotes),
    blocks,
    reading_minutes: readingMinutes(blocks),
    updated_by: auth.userId,
  };

  let articleId: string;
  let version: number;

  if (previous) {
    version = Number(previous["version"] ?? 1) + 1;
    articleId = previous["id"] as string;
    unwrap<Row[]>(
      await auth.admin
        .from("content_articles")
        .update({ ...payload, version })
        .eq("id", articleId)
        .select("id"),
    );
    if (previous["slug"] !== slug) {
      await auth.admin
        .from("content_article_slugs")
        .upsert({ article_id: articleId, slug: previous["slug"] }, { onConflict: "slug" });
      await audit(auth.admin, {
        actorId: auth.userId,
        actorEmail: auth.email,
        action: "content.slug.change",
        entity: "content_articles",
        entityId: articleId,
        previousValues: { slug: previous["slug"] },
        newValues: { slug },
      });
    }
  } else {
    version = 1;
    const inserted = unwrap<Row[]>(
      await auth.admin
        .from("content_articles")
        .insert({ ...payload, version, status: "DRAFT", created_by: auth.userId })
        .select("id"),
    );
    articleId = inserted[0]?.["id"] as string;
  }

  await auth.admin.from("content_revisions").insert({
    article_id: articleId,
    version,
    title,
    excerpt: payload["excerpt"],
    blocks,
    status: previous ? previous["status"] : "DRAFT",
    note: clean(input.note),
    created_by: auth.userId,
  });

  const unknownFamilies = await syncFamilyRelations(auth, articleId, blocks);
  await syncReferences(auth, articleId, input.references);

  await audit(auth.admin, {
    actorId: auth.userId,
    actorEmail: auth.email,
    action: previous ? "content.update" : "content.create",
    entity: "content_articles",
    entityId: articleId,
    changedFields: previous ? diffFields(previous, payload) : Object.keys(payload),
    newValues: { slug, title, version },
  });

  return {
    id: articleId,
    slug,
    version,
    unknownFamilies,
    compliance: checkContentCompliance({ title, excerpt: payload["excerpt"], blocks }),
  };
}

export async function scheduleArticle(auth: Authorized, input: ScheduleArticleInput) {
  requirePermission(auth.roles, "content.publish");
  const scheduledAt = new Date(input.scheduledAt);
  if (Number.isNaN(scheduledAt.getTime()) || scheduledAt.getTime() <= Date.now()) {
    throw new AppError("VALIDATION_ERROR", { cause: "agendamento-deve-ser-futuro" });
  }

  const rows = unwrap<Row[]>(
    await auth.supabase.from("content_articles").select("*").eq("id", input.id).limit(1),
  );
  const article = rows?.[0];
  if (!article) throw new AppError("NOT_FOUND");
  if (article["status"] !== "READY_TO_PUBLISH") {
    throw new AppError("CONFLICT", { cause: "artigo-nao-esta-pronto-para-agendar" });
  }

  await assertPublicationReady(auth, article);

  const patch: Row = {
    status: "SCHEDULED",
    scheduled_at: scheduledAt.toISOString(),
    scheduled_by: auth.userId,
    schedule_attempts: 0,
    last_schedule_attempt_at: null,
    last_schedule_error: null,
    schedule_claimed_at: null,
    schedule_claim_token: null,
    schedule_lease_until: null,
    review_note: clean(input.note),
    updated_by: auth.userId,
  };
  const updated = unwrap<Row[]>(
    await auth.admin
      .from("content_articles")
      .update(patch)
      .eq("id", input.id)
      .eq("status", "READY_TO_PUBLISH")
      .select("id"),
  );
  if ((updated ?? []).length !== 1) {
    throw new AppError("CONFLICT", { cause: "estado-alterado-durante-agendamento" });
  }

  await statusEvent(auth, {
    articleId: input.id,
    from: "READY_TO_PUBLISH",
    to: "SCHEDULED",
    note: input.note,
  });
  await audit(auth.admin, {
    actorId: auth.userId,
    actorEmail: auth.email,
    action: "content.status.change",
    entity: "content_articles",
    entityId: input.id,
    previousValues: { status: "READY_TO_PUBLISH" },
    newValues: { status: "SCHEDULED", scheduled_at: scheduledAt.toISOString() },
  });

  return { id: input.id, status: "SCHEDULED" as const, scheduledAt: scheduledAt.toISOString() };
}

export async function cancelArticleSchedule(
  auth: Authorized,
  input: { id: string; note?: string | null | undefined },
) {
  requirePermission(auth.roles, "content.publish");
  const rows = unwrap<Row[]>(
    await auth.supabase
      .from("content_articles")
      .select("status, scheduled_at")
      .eq("id", input.id)
      .limit(1),
  );
  const article = rows?.[0];
  if (!article) throw new AppError("NOT_FOUND");
  if (article["status"] !== "SCHEDULED") {
    throw new AppError("CONFLICT", { cause: "artigo-nao-esta-agendado" });
  }

  const updated = unwrap<Row[]>(
    await auth.admin
      .from("content_articles")
      .update({
        status: "READY_TO_PUBLISH",
        scheduled_at: null,
        scheduled_by: null,
        schedule_attempts: 0,
        last_schedule_attempt_at: null,
        last_schedule_error: null,
        schedule_claimed_at: null,
        schedule_claim_token: null,
        schedule_lease_until: null,
        review_note: clean(input.note),
        updated_by: auth.userId,
      })
      .eq("id", input.id)
      .eq("status", "SCHEDULED")
      .select("id"),
  );
  if ((updated ?? []).length !== 1) {
    throw new AppError("CONFLICT", { cause: "estado-alterado-durante-cancelamento" });
  }

  await statusEvent(auth, {
    articleId: input.id,
    from: "SCHEDULED",
    to: "READY_TO_PUBLISH",
    note: input.note,
  });
  await audit(auth.admin, {
    actorId: auth.userId,
    actorEmail: auth.email,
    action: "content.status.change",
    entity: "content_articles",
    entityId: input.id,
    previousValues: { status: "SCHEDULED", scheduled_at: article["scheduled_at"] },
    newValues: { status: "READY_TO_PUBLISH", scheduled_at: null },
  });

  return { id: input.id, status: "READY_TO_PUBLISH" as const };
}

export async function changeArticleStatus(
  auth: Authorized,
  input: { id: string; to: ContentStatus; note?: string | null | undefined },
) {
  const rows = unwrap<Row[]>(
    await auth.supabase.from("content_articles").select("*").eq("id", input.id).limit(1),
  );
  const article = rows?.[0];
  if (!article) throw new AppError("NOT_FOUND");

  const from = article["status"] as ContentStatus;
  if (input.to === "SCHEDULED" || from === "SCHEDULED") {
    throw new AppError("CONFLICT", { cause: "use-operacao-especifica-de-agendamento" });
  }

  const transition = findTransition(from, input.to);
  if (!transition)
    throw new AppError("CONFLICT", { cause: `transicao-invalida:${from}->${input.to}` });

  requirePermission(auth.roles, transition.permission);
  if (transition.requiresCompliance) await assertPublicationReady(auth, article);

  const patch: Row = { status: input.to, updated_by: auth.userId, review_note: clean(input.note) };
  if (input.to === "PUBLISHED") {
    patch["published_at"] = new Date().toISOString();
    if (!article["first_published_at"]) patch["first_published_at"] = patch["published_at"];
  }
  if (input.to === "UNPUBLISHED" || input.to === "ARCHIVED") {
    patch["published_at"] = null;
  }

  const updated = unwrap<Row[]>(
    await auth.admin
      .from("content_articles")
      .update(patch)
      .eq("id", input.id)
      .eq("status", from)
      .select("id"),
  );
  if ((updated ?? []).length !== 1) {
    throw new AppError("CONFLICT", { cause: "estado-alterado-durante-transicao" });
  }

  await statusEvent(auth, { articleId: input.id, from, to: input.to, note: input.note });

  const action =
    input.to === "PUBLISHED"
      ? "content.publish"
      : input.to === "UNPUBLISHED"
        ? "content.unpublish"
        : input.to === "ARCHIVED"
          ? "content.archive"
          : "content.status.change";

  await audit(auth.admin, {
    actorId: auth.userId,
    actorEmail: auth.email,
    action,
    entity: "content_articles",
    entityId: input.id,
    previousValues: { status: from },
    newValues: { status: input.to },
  });

  return { id: input.id, status: input.to };
}

/* ------------------------------------------------------------------ */
/* Variantes sociais — preparação manual, sem postagem automática      */
/* ------------------------------------------------------------------ */

export async function saveSocialVariant(
  auth: Authorized,
  input: {
    articleId: string;
    channel: SocialChannel;
    headline: string;
    caption: string;
    hashtags: string[];
    callToAction?: string | null | undefined;
    ready?: boolean | undefined;
  },
) {
  const draft = {
    channel: input.channel,
    headline: sanitizeText(input.headline).slice(0, CHANNEL_LIMITS[input.channel].headline),
    caption: sanitizeText(input.caption),
    hashtags: normalizeHashtags(input.hashtags ?? [], input.channel),
    callToAction: sanitizeText(input.callToAction ?? ""),
  };

  const issues = validateSocialDraft(draft);
  if (input.ready && issues.length > 0) {
    throw new AppError("VALIDATION_ERROR", {
      cause: `social:${issues.map((i) => `${i.field}(${i.detail})`).join("; ")}`,
    });
  }

  const compliance = checkContentCompliance({
    title: draft.headline,
    excerpt: draft.caption,
    blocks: [{ type: "paragraph", text: draft.caption || "conteudo" }],
  }).filter((i) => i.code !== "STRUCTURE");
  if (compliance.length > 0) {
    throw new AppError("VALIDATION_ERROR", {
      cause: `social-conformidade:${compliance.map((i) => i.detail).join("; ")}`,
    });
  }

  unwrap<Row[]>(
    await auth.admin
      .from("content_social_variants")
      .upsert(
        {
          article_id: input.articleId,
          channel: input.channel,
          status: input.ready ? "READY" : "DRAFT",
          headline: draft.headline,
          caption: draft.caption,
          hashtags: draft.hashtags,
          call_to_action: draft.callToAction || null,
          updated_by: auth.userId,
          created_by: auth.userId,
        },
        { onConflict: "article_id,channel" },
      )
      .select("id"),
  );

  await audit(auth.admin, {
    actorId: auth.userId,
    actorEmail: auth.email,
    action: "social.variant.update",
    entity: "content_social_variants",
    entityId: input.articleId,
    newValues: { channel: input.channel, status: input.ready ? "READY" : "DRAFT" },
  });

  return { issues };
}

/**
 * Marca a variante como exportada e devolve o texto para cópia manual.
 * Não existe chamada de rede a nenhuma plataforma: a publicação é humana.
 */
export async function exportSocialVariant(
  auth: Authorized,
  input: { articleId: string; channel: SocialChannel; articleUrl?: string | null | undefined },
) {
  const rows = unwrap<Row[]>(
    await auth.supabase
      .from("content_social_variants")
      .select("*")
      .eq("article_id", input.articleId)
      .eq("channel", input.channel)
      .limit(1),
  );
  const variant = rows?.[0];
  if (!variant) throw new AppError("NOT_FOUND");
  if (variant["status"] === "DRAFT") {
    throw new AppError("CONFLICT", { cause: "variante-nao-esta-pronta" });
  }

  const text = renderSocialExport(
    {
      channel: input.channel,
      headline: String(variant["headline"] ?? ""),
      caption: String(variant["caption"] ?? ""),
      hashtags: (variant["hashtags"] ?? []) as string[],
      callToAction: String(variant["call_to_action"] ?? ""),
    },
    input.articleUrl ?? null,
  );

  await auth.admin
    .from("content_social_variants")
    .update({
      status: "EXPORTED",
      exported_at: new Date().toISOString(),
      exported_by: auth.userId,
    })
    .eq("id", variant["id"]);

  await audit(auth.admin, {
    actorId: auth.userId,
    actorEmail: auth.email,
    action: "social.variant.export",
    entity: "content_social_variants",
    entityId: String(variant["id"]),
    newValues: { channel: input.channel },
  });

  return { text };
}

/* ------------------------------------------------------------------ */
/* Autores                                                             */
/* ------------------------------------------------------------------ */

export async function saveAuthor(
  auth: Authorized,
  input: {
    id?: string | null | undefined;
    displayName: string;
    roleTitle?: string | null | undefined;
    bio?: string | null | undefined;
    isActive?: boolean | undefined;
  },
) {
  const payload = {
    display_name: sanitizeText(input.displayName),
    role_title: clean(input.roleTitle),
    bio: clean(input.bio),
    is_active: input.isActive ?? true,
  };
  if (payload.display_name.length < 3) {
    throw new AppError("VALIDATION_ERROR", { cause: "nome-curto" });
  }

  const result = input.id
    ? await auth.admin.from("content_authors").update(payload).eq("id", input.id).select("id")
    : await auth.admin.from("content_authors").insert(payload).select("id");
  const rows = unwrap<Row[]>(result);

  await audit(auth.admin, {
    actorId: auth.userId,
    actorEmail: auth.email,
    action: "content.author.change",
    entity: "content_authors",
    entityId: String(rows?.[0]?.["id"] ?? input.id ?? ""),
    newValues: payload,
  });

  return { id: rows?.[0]?.["id"] ?? input.id };
}
