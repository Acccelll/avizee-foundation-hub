/**
 * Funções de servidor do CMS editorial.
 * Wrapper fino: somente declarações; a lógica vive em `editorial.server.ts`.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { authorize } from "@/catalog/guard.server";
import {
  cancelArticleSchedule,
  changeArticleStatus,
  contentDashboard,
  exportSocialVariant,
  getArticleAdmin,
  listArticlesAdmin,
  listAuthors,
  listEditorialCategories,
  saveArticle,
  saveAuthor,
  saveSocialVariant,
  scheduleArticle,
} from "@/content/editorial.server";
import { CONTENT_STATUSES } from "@/content/workflow";
import { SOCIAL_CHANNELS } from "@/content/social";

const idInput = z.object({ id: z.string().uuid() });

const filters = z.object({
  search: z.string().trim().max(120).nullable().optional(),
  status: z.enum(CONTENT_STATUSES).nullable().optional(),
  categoryId: z.string().uuid().nullable().optional(),
  page: z.number().int().min(1).max(500).optional(),
});

const articleInput = z.object({
  id: z.string().uuid().nullable().optional(),
  title: z.string().trim().min(5).max(200),
  slug: z.string().trim().max(180).nullable().optional(),
  subtitle: z.string().trim().max(300).nullable().optional(),
  excerpt: z.string().trim().max(600).nullable().optional(),
  categoryId: z.string().uuid().nullable().optional(),
  authorId: z.string().uuid().nullable().optional(),
  technicalReviewerId: z.string().uuid().nullable().optional(),
  seoTitle: z.string().trim().max(120).nullable().optional(),
  seoDescription: z.string().trim().max(200).nullable().optional(),
  noindex: z.boolean().optional(),
  internalNotes: z.string().trim().max(2000).nullable().optional(),
  blocks: z.unknown(),
  references: z
    .array(
      z.object({
        label: z.string().trim().min(2).max(200),
        url: z.string().trim().max(500).nullable().optional(),
        note: z.string().trim().max(300).nullable().optional(),
      }),
    )
    .max(30)
    .optional(),
  note: z.string().trim().max(300).nullable().optional(),
});

const statusInput = z.object({
  id: z.string().uuid(),
  to: z.enum(CONTENT_STATUSES),
  note: z.string().trim().max(500).nullable().optional(),
});

const scheduleInput = z.object({
  id: z.string().uuid(),
  scheduledAt: z.string().datetime({ offset: true }),
  note: z.string().trim().max(500).nullable().optional(),
});

const cancelScheduleInput = z.object({
  id: z.string().uuid(),
  note: z.string().trim().max(500).nullable().optional(),
});

const socialInput = z.object({
  articleId: z.string().uuid(),
  channel: z.enum(SOCIAL_CHANNELS),
  headline: z.string().trim().max(200),
  caption: z.string().trim().max(3000),
  hashtags: z.array(z.string().trim().max(60)).max(30).default([]),
  callToAction: z.string().trim().max(200).nullable().optional(),
  ready: z.boolean().optional(),
});

const exportInput = z.object({
  articleId: z.string().uuid(),
  channel: z.enum(SOCIAL_CHANNELS),
  articleUrl: z.string().trim().max(500).nullable().optional(),
});

const authorInput = z.object({
  id: z.string().uuid().nullable().optional(),
  displayName: z.string().trim().min(3).max(120),
  roleTitle: z.string().trim().max(120).nullable().optional(),
  bio: z.string().trim().max(600).nullable().optional(),
  isActive: z.boolean().optional(),
});

export const fetchContentDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => contentDashboard(await authorize(context, "content.read")));

export const fetchEditorialCategories = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) =>
    listEditorialCategories(await authorize(context, "content.read")),
  );

export const fetchAuthors = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => listAuthors(await authorize(context, "content.read")));

export const fetchAdminArticles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => filters.parse(input ?? {}))
  .handler(async ({ context, data }) =>
    listArticlesAdmin(await authorize(context, "content.read"), data),
  );

export const fetchAdminArticle = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => idInput.parse(input))
  .handler(async ({ context, data }) =>
    getArticleAdmin(await authorize(context, "content.read"), data.id),
  );

export const upsertArticle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => articleInput.parse(input))
  .handler(async ({ context, data }) =>
    saveArticle(await authorize(context, "content.write"), data),
  );

export const transitionArticle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => statusInput.parse(input))
  .handler(async ({ context, data }) =>
    changeArticleStatus(await authorize(context, "content.read"), data),
  );

export const scheduleContentArticle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => scheduleInput.parse(input))
  .handler(async ({ context, data }) =>
    scheduleArticle(await authorize(context, "content.publish"), data),
  );

export const cancelContentArticleSchedule = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => cancelScheduleInput.parse(input))
  .handler(async ({ context, data }) =>
    cancelArticleSchedule(await authorize(context, "content.publish"), data),
  );

export const upsertSocialVariant = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => socialInput.parse(input))
  .handler(async ({ context, data }) =>
    saveSocialVariant(await authorize(context, "content.manage_social_variants"), data),
  );

export const exportSocialText = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => exportInput.parse(input))
  .handler(async ({ context, data }) =>
    exportSocialVariant(await authorize(context, "content.export_social"), data),
  );

export const upsertAuthor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => authorInput.parse(input))
  .handler(async ({ context, data }) =>
    saveAuthor(await authorize(context, "content.manage_authors"), data),
  );