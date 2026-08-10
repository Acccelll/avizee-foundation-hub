/**
 * Processador de agendamento editorial (Etapa 14.1).
 * Claims e conclusão são protegidos por token individual e lease no banco.
 */
import { createClient } from "@supabase/supabase-js";

import { blocksSchema, checkContentCompliance, relatedFamilySlugs } from "@/content/blocks";
import { AppError } from "@/lib/errors";
import { audit } from "@/lib/audit.server";

type ClaimedArticle = {
  id: string;
  title: string;
  version: number;
  schedule_claim_token: string;
};

function schedulerClient() {
  const url = process.env["SUPABASE_URL"];
  const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !serviceKey) {
    throw new AppError("SERVICE_UNAVAILABLE", { cause: "scheduler-config-missing" });
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function assertClaimStillPublishable(
  admin: ReturnType<typeof schedulerClient>,
  articleId: string,
  claimToken: string,
) {
  const { data, error } = await admin
    .from("content_articles")
    .select(
      "id, title, excerpt, blocks, category_id, author_id, requires_technical_review, technical_reviewer_id, status, schedule_claim_token",
    )
    .eq("id", articleId)
    .eq("status", "SCHEDULED")
    .eq("schedule_claim_token", claimToken)
    .limit(1);

  if (error || !data?.[0]) {
    throw new Error("claim-indisponivel");
  }

  const article = data[0];
  const parsed = blocksSchema.safeParse(article.blocks ?? []);
  const blocks = parsed.success ? parsed.data : [];
  const issues = checkContentCompliance({
    title: String(article.title ?? ""),
    excerpt: (article.excerpt ?? null) as string | null,
    blocks,
  });

  if (!parsed.success) issues.push({ code: "STRUCTURE", detail: "blocos inválidos" });
  if (!article.category_id) issues.push({ code: "STRUCTURE", detail: "categoria obrigatória" });
  if (!article.author_id) issues.push({ code: "STRUCTURE", detail: "autor obrigatório" });
  if (article.requires_technical_review && !article.technical_reviewer_id) {
    issues.push({ code: "STRUCTURE", detail: "revisor técnico obrigatório" });
  }
  if (!article.excerpt || String(article.excerpt).trim().length < 40) {
    issues.push({ code: "STRUCTURE", detail: "resumo com pelo menos 40 caracteres" });
  }

  const relationSlugs = relatedFamilySlugs(blocks);
  if (relationSlugs.length > 0) {
    const families = await admin.from("public_families").select("slug").in("slug", relationSlugs);
    if (families.error) throw new Error("catalogo-publico-indisponivel");
    const existing = new Set((families.data ?? []).map((family) => family.slug));
    const unknown = relationSlugs.filter((slug) => !existing.has(slug));
    if (unknown.length > 0) {
      issues.push({ code: "STRUCTURE", detail: "família relacionada indisponível" });
    }
  }

  if (issues.length > 0) throw new Error("conformidade-editorial-invalida");
}

export async function processEditorialSchedule(options?: { maxBatch?: number }) {
  const admin = schedulerClient();
  const workerId = crypto.randomUUID();
  const maxBatch = Math.min(50, Math.max(1, options?.maxBatch ?? 10));

  const { data: claimed, error: claimError } = await admin.rpc("claim_scheduled_articles", {
    worker_id: workerId,
    max_batch: maxBatch,
    lease_duration: "10 minutes",
  });

  if (claimError) throw new AppError("SERVICE_UNAVAILABLE", { cause: "scheduler-claim-failed" });
  const articles = (claimed ?? []) as ClaimedArticle[];
  if (articles.length === 0) return { processed: 0, published: 0, failures: 0 };

  let published = 0;
  let failures = 0;

  for (const article of articles) {
    const claimToken = article.schedule_claim_token;
    try {
      await assertClaimStillPublishable(admin, article.id, claimToken);
      const publishedAt = new Date().toISOString();
      const completion = await admin.rpc("complete_scheduled_article", {
        target_id: article.id,
        target_token: claimToken,
        published_time: publishedAt,
      });

      if (completion.error || completion.data !== true) {
        throw new Error("claim-perdido-na-conclusao");
      }

      await audit(admin, {
        actorId: null,
        actorEmail: null,
        action: "content.publish",
        entity: "content_articles",
        entityId: article.id,
        origin: "content-scheduler",
        previousValues: { status: "SCHEDULED" },
        newValues: { status: "PUBLISHED", version: article.version, published_at: publishedAt },
      });
      published += 1;
    } catch {
      failures += 1;
      await admin.rpc("fail_scheduled_article", {
        target_id: article.id,
        target_token: claimToken,
        error_msg: "scheduler-publication-failed",
      });
    }
  }

  return { processed: articles.length, published, failures };
}
