/**
 * Integração ERP AviZee → Central de Conteúdos.
 *
 * O ERP envia matérias já aprovadas pelo usuário responsável (revisão técnica
 * feita fora do site, no ERP ou na conversa com o Claude). Este módulo:
 *
 * 1. autentica a chamada por segredo compartilhado (`ERP_CONTENT_SECRET`);
 * 2. age como um usuário técnico real (`ERP_INTEGRATION_USER_ID`), cujos papéis
 *    (EDITOR + REVISOR_TECNICO) são lidos do banco — nenhuma permissão é
 *    concedida em código;
 * 3. valida a matéria com as MESMAS regras do painel (blocos, termos de marca,
 *    termos proibidos, campos obrigatórios) ANTES de alterar qualquer estado;
 * 4. percorre a máquina de estados editorial existente até `PUBLISHED`,
 *    registrando quem aprovou em cada evento.
 *
 * Fontes chegam apenas com o nome (sem URL), conforme a política editorial.
 */
import { z } from "zod";

import { AppError } from "@/lib/errors";
import { loadRoles, requirePermission } from "@/auth/authorize.server";
import type { Authorized } from "@/catalog/guard.server";
import { blocksSchema, sanitizeText, slugify } from "@/content/blocks";
import {
  assertPublicationReady,
  changeArticleStatus,
  saveArticle,
  saveAuthor,
} from "@/content/editorial.server";
import { isEditable, type ContentStatus } from "@/content/workflow";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any>;

export const ERP_ACTOR_LABEL = "ERP AviZee";

/* ------------------------------------------------------------------ */
/* Autenticação                                                        */
/* ------------------------------------------------------------------ */

export function safeEqual(left: string, right: string): boolean {
  if (left.length !== right.length || left.length === 0) return false;
  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return diff === 0;
}

export type ErpAuthResult = "ok" | "not_configured" | "unauthorized";

export function checkErpSecret(request: Request): ErpAuthResult {
  const secret = process.env["ERP_CONTENT_SECRET"] ?? "";
  if (secret.length < 32) return "not_configured";
  const authorization = request.headers.get("authorization") ?? "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  return safeEqual(token, secret) ? "ok" : "unauthorized";
}

const uuid = z.string().uuid();

/** Contexto do usuário técnico da integração, com papéis lidos do banco. */
export async function integrationAuth(): Promise<Authorized> {
  const parsed = uuid.safeParse(process.env["ERP_INTEGRATION_USER_ID"] ?? "");
  if (!parsed.success) {
    throw new AppError("SERVICE_UNAVAILABLE", { cause: "erp-integration-user-nao-configurado" });
  }
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const admin = supabaseAdmin as unknown as Authorized["admin"];
  const roles = await loadRoles(admin, parsed.data);
  return {
    supabase: admin,
    admin,
    userId: parsed.data,
    roles,
    email: null,
  };
}

/* ------------------------------------------------------------------ */
/* Contrato                                                            */
/* ------------------------------------------------------------------ */

const personSchema = z.object({
  name: z.string().trim().min(3).max(120),
  roleTitle: z.string().trim().max(120).nullable().optional(),
});

export const erpArticleSchema = z.object({
  /** Id do artigo no site, devolvido pela publicação anterior (atualização). */
  articleId: uuid.nullable().optional(),
  /** Id da matéria no ERP — só para rastreabilidade nas notas internas. */
  externalId: z.string().trim().min(1).max(80),
  title: z.string().trim().min(5).max(200),
  subtitle: z.string().trim().max(300).nullable().optional(),
  slug: z.string().trim().max(160).nullable().optional(),
  excerpt: z.string().trim().min(40).max(600),
  categorySlug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]{3,80}$/),
  seoTitle: z.string().trim().max(120).nullable().optional(),
  seoDescription: z.string().trim().max(200).nullable().optional(),
  blocks: z.array(z.unknown()).min(1).max(200),
  /** Somente nomes de fonte — URLs nunca chegam ao site. */
  sources: z.array(z.string().trim().min(2).max(160)).min(1).max(20),
  author: personSchema,
  /** Quem aprovou a matéria (revisão técnica). */
  approvedBy: personSchema,
  verificationNotes: z.string().trim().max(4000).nullable().optional(),
  publish: z.boolean().default(true),
});

export type ErpArticleInput = z.infer<typeof erpArticleSchema>;

/* ------------------------------------------------------------------ */
/* Apoio                                                               */
/* ------------------------------------------------------------------ */

function unwrap<T>(result: { data: T | null; error: { message: string } | null }): T {
  if (result.error) throw new AppError("SERVICE_UNAVAILABLE", { cause: result.error.message });
  return result.data as T;
}

async function resolveCategoryId(auth: Authorized, slug: string): Promise<string> {
  const rows = unwrap<Row[]>(
    await auth.admin
      .from("content_categories")
      .select("id")
      .eq("slug", slug)
      .eq("is_active", true)
      .limit(1),
  );
  const id = rows?.[0]?.["id"] as string | undefined;
  if (!id) throw new AppError("VALIDATION_ERROR", { cause: `categoria-invalida:${slug}` });
  return id;
}

/** Encontra o autor pelo nome exibido (sem diferenciar caixa) ou cria. */
async function resolveAuthorId(
  auth: Authorized,
  person: z.infer<typeof personSchema>,
  fallbackRole: string,
): Promise<string> {
  const name = sanitizeText(person.name);
  const rows = unwrap<Row[]>(
    await auth.admin
      .from("content_authors")
      .select("id, is_active")
      .ilike(
        "display_name",
        name.replace(/[%_\\]/g, (c) => `\\${c}`),
      )
      .limit(1),
  );
  const found = rows?.[0];
  if (found) {
    if (!found["is_active"]) {
      throw new AppError("VALIDATION_ERROR", { cause: `autor-inativo:${name}` });
    }
    return found["id"] as string;
  }
  requirePermission(auth.roles, "content.manage_authors");
  const created = await saveAuthor(auth, {
    displayName: name,
    roleTitle: person.roleTitle ?? fallbackRole,
  });
  return String(created.id);
}

async function loadArticle(auth: Authorized, column: "id" | "slug", value: string) {
  const rows = unwrap<Row[]>(
    await auth.admin
      .from("content_articles")
      .select("*")
      .eq(column, value)
      .is("deleted_at", null)
      .limit(1),
  );
  return rows?.[0] ?? null;
}

/**
 * Caminho até um estado editável, a partir do estado atual.
 * Matéria publicada sai do ar só durante a atualização (mesma requisição).
 */
export function pathToEditable(status: ContentStatus): ContentStatus[] | null {
  if (isEditable(status)) return [];
  switch (status) {
    case "READY_TO_PUBLISH":
      return ["CHANGES_REQUESTED"];
    case "PUBLISHED":
      return ["UNPUBLISHED", "READY_TO_PUBLISH", "CHANGES_REQUESTED"];
    case "UNPUBLISHED":
      return ["READY_TO_PUBLISH", "CHANGES_REQUESTED"];
    default:
      // SCHEDULED e ARCHIVED exigem decisão humana no painel.
      return null;
  }
}

/** Caminho de um estado editável até a publicação. */
export function pathToPublished(status: ContentStatus): ContentStatus[] {
  switch (status) {
    case "DRAFT":
    case "CHANGES_REQUESTED":
      return ["IN_TECHNICAL_REVIEW", "IN_EDITORIAL_REVIEW", "READY_TO_PUBLISH", "PUBLISHED"];
    case "IN_TECHNICAL_REVIEW":
      return ["IN_EDITORIAL_REVIEW", "READY_TO_PUBLISH", "PUBLISHED"];
    case "IN_EDITORIAL_REVIEW":
      return ["READY_TO_PUBLISH", "PUBLISHED"];
    default:
      return [];
  }
}

export function articlePublicUrl(slug: string): string | null {
  const base = (process.env["APP_PUBLIC_URL"] ?? "").replace(/\/+$/, "");
  return /^https?:\/\//.test(base) ? `${base}/conteudos/${slug}` : null;
}

/* ------------------------------------------------------------------ */
/* Operação principal                                                  */
/* ------------------------------------------------------------------ */

export async function upsertErpArticle(auth: Authorized, raw: unknown) {
  const parsed = erpArticleSchema.safeParse(raw);
  if (!parsed.success) {
    const fields = [...new Set(parsed.error.issues.map((issue) => issue.path.join(".")))];
    throw new AppError("VALIDATION_ERROR", { cause: `payload-invalido:${fields.join(",")}` });
  }
  const input = parsed.data;

  requirePermission(auth.roles, "content.write");
  if (input.publish) {
    requirePermission(auth.roles, "content.submit_review");
    requirePermission(auth.roles, "content.technical_review");
    requirePermission(auth.roles, "content.editorial_review");
    requirePermission(auth.roles, "content.publish");
  }

  const blocks = blocksSchema.safeParse(input.blocks);
  if (!blocks.success) {
    const where = [...new Set(blocks.error.issues.map((issue) => issue.path.join(".")))];
    throw new AppError("VALIDATION_ERROR", { cause: `blocos-invalidos:${where.join(",")}` });
  }

  const slug = slugify(input.slug?.trim() || input.title);
  const categoryId = await resolveCategoryId(auth, input.categorySlug);

  // Localiza a matéria existente: pelo id do site ou pelo slug, desde que
  // tenha sido criada por esta integração (evita sobrescrever artigo do painel).
  let existing = input.articleId ? await loadArticle(auth, "id", input.articleId) : null;
  if (input.articleId && !existing)
    throw new AppError("NOT_FOUND", { cause: "artigo-inexistente" });
  if (!existing) {
    const bySlug = await loadArticle(auth, "slug", slug);
    if (bySlug) {
      if (bySlug["created_by"] !== auth.userId) {
        throw new AppError("CONFLICT", { cause: `slug-em-uso:${slug}` });
      }
      existing = bySlug;
    }
  }

  const steps = existing ? pathToEditable(existing["status"] as ContentStatus) : [];
  if (steps === null) {
    throw new AppError("CONFLICT", { cause: `estado-nao-atualizavel:${existing?.["status"]}` });
  }
  if (!input.publish && steps.length > 0) {
    // Atualizar sem publicar tiraria do ar uma matéria publicada.
    throw new AppError("CONFLICT", { cause: "atualizacao-de-publicada-exige-publish" });
  }

  const authorId = await resolveAuthorId(auth, input.author, "Equipe AviZee");
  const reviewerId = await resolveAuthorId(auth, input.approvedBy, "Revisão técnica");

  const approval = `Aprovado por ${sanitizeText(input.approvedBy.name)} via ${ERP_ACTOR_LABEL}`;
  const internalNotes = [`ERP: matéria ${input.externalId}`, approval, input.verificationNotes]
    .filter(Boolean)
    .join("\n\n");

  // Pré-validação completa ANTES de mexer no estado de um artigo publicado.
  if (input.publish) {
    await assertPublicationReady(auth, {
      title: input.title,
      excerpt: input.excerpt,
      blocks: blocks.data,
      category_id: categoryId,
      author_id: authorId,
      technical_reviewer_id: reviewerId,
      requires_technical_review: true,
    });
  }

  const articleId = existing?.["id"] as string | undefined;
  if (articleId) {
    for (const to of steps) {
      await changeArticleStatus(auth, {
        id: articleId,
        to,
        note: `Atualização enviada pelo ${ERP_ACTOR_LABEL}`,
      });
    }
  }

  const saved = await saveArticle(auth, {
    id: articleId ?? null,
    title: input.title,
    slug,
    subtitle: input.subtitle ?? null,
    excerpt: input.excerpt,
    categoryId,
    authorId,
    technicalReviewerId: reviewerId,
    seoTitle: input.seoTitle ?? null,
    seoDescription: input.seoDescription ?? null,
    internalNotes,
    blocks: blocks.data,
    references: input.sources.map((label) => ({ label })),
    note: approval,
  });

  let status: ContentStatus = existing
    ? ((steps.at(-1) ?? existing["status"]) as ContentStatus)
    : "DRAFT";
  if (input.publish) {
    for (const to of pathToPublished(status)) {
      await changeArticleStatus(auth, { id: saved.id, to, note: approval });
      status = to;
    }
  }

  return {
    articleId: saved.id,
    slug: saved.slug,
    version: saved.version,
    status,
    url: status === "PUBLISHED" ? articlePublicUrl(saved.slug) : null,
    unknownFamilies: saved.unknownFamilies,
  };
}

/* ------------------------------------------------------------------ */
/* Consultas de apoio (categorias, famílias, duplicidade)              */
/* ------------------------------------------------------------------ */

export async function erpReferenceData(auth: Authorized) {
  requirePermission(auth.roles, "content.read");
  const [categories, families] = await Promise.all([
    auth.admin
      .from("content_categories")
      .select("slug, name, description")
      .eq("is_active", true)
      .order("sort_order"),
    auth.admin
      .from("public_families")
      .select("slug, public_name, category_slug, category_name")
      .order("public_name"),
  ]);
  return {
    categories: unwrap<Row[]>(categories) ?? [],
    families: (unwrap<Row[]>(families) ?? []).map((family) => ({
      slug: family["slug"],
      name: family["public_name"],
      categorySlug: family["category_slug"],
      categoryName: family["category_name"],
    })),
  };
}

export async function searchErpArticles(auth: Authorized, query: string) {
  requirePermission(auth.roles, "content.read");
  const term = sanitizeText(query).slice(0, 80);
  if (term.length < 2) throw new AppError("VALIDATION_ERROR", { cause: "busca-curta" });
  const pattern = `%${term.replace(/[%_\\]/g, (c) => `\\${c}`)}%`;
  const rows = unwrap<Row[]>(
    await auth.admin
      .from("content_articles")
      .select("id, slug, title, status, published_at, updated_at")
      .is("deleted_at", null)
      .or(`title.ilike.${pattern},slug.ilike.${pattern},excerpt.ilike.${pattern}`)
      .order("updated_at", { ascending: false })
      .limit(20),
  );
  return (rows ?? []).map((row) => ({
    articleId: row["id"],
    slug: row["slug"],
    title: row["title"],
    status: row["status"],
    publishedAt: row["published_at"],
    url: row["status"] === "PUBLISHED" ? articlePublicUrl(row["slug"]) : null,
  }));
}

/** Resposta de erro da API interna: inclui a causa de negócio (sem segredo). */
export function erpErrorResponse(error: unknown): Response {
  const appError = error instanceof AppError ? error : new AppError("INTERNAL_ERROR");
  const cause = appError.internal?.["cause"];
  const exposeCause =
    ["VALIDATION_ERROR", "CONFLICT", "NOT_FOUND"].includes(appError.code) &&
    typeof cause === "string";
  return Response.json(
    {
      ok: false,
      error: appError.code,
      cause: exposeCause ? cause : undefined,
      occurrenceId: appError.occurrenceId,
    },
    { status: appError.status, headers: { "Cache-Control": "no-store" } },
  );
}
