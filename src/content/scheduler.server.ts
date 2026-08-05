/**
 * Processador de agendamento editorial (Etapa 14).
 * Executa claim atômico e publica artigos agendados.
 */
import { createClient } from "@supabase/supabase-js";
import { AppError } from "@/lib/errors";
import { audit } from "@/lib/audit.server";

const SUPABASE_URL = process.env["SUPABASE_URL"]!;
const SUPABASE_SERVICE_ROLE_KEY = process.env["SUPABASE_SERVICE_ROLE_KEY"]!;

export async function processEditorialSchedule() {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new AppError("SERVICE_UNAVAILABLE", { cause: "missing-service-key" });
  }

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const now = new Date().toISOString();
  const workerId = crypto.randomUUID();

  // 1. Claim atômico de artigos agendados vencidos usando RPC real
  const { data: claimed, error: claimError } = await admin.rpc("claim_scheduled_articles", {
    worker_id: workerId,
    max_batch: 10,
    lease_duration: "10 minutes",
  });

  if (claimError) throw new AppError("SERVICE_UNAVAILABLE", { cause: claimError.message });
  const articles = (claimed ?? []) as any[];
  if (articles.length === 0) return { published: 0, failures: 0 };

  let published = 0;
  let failures = 0;

  // 2. Processar cada claim
  for (const article of articles) {
    const claimToken = article.schedule_claim_token;
    try {
      const { error: publishError } = await admin
        .from("content_articles")
        .update({ 
          status: "PUBLISHED",
          published_at: now,
          schedule_claimed_at: null,
          schedule_claim_token: null,
          schedule_lease_until: null,
          last_schedule_attempt_at: now,
          schedule_attempts: 0
        })
        .eq("id", article.id)
        .eq("schedule_claim_token", claimToken);

      if (publishError) throw publishError;

      // Registrar evento de status
      await admin.from("content_status_events").insert({
        article_id: article.id,
        from_status: "SCHEDULED",
        to_status: "PUBLISHED",
        note: "Publicação automática via scheduler",
      });

      await audit(admin, {
        actorId: null,
        actorEmail: "system@avizee.com.br",
        action: "content.publish",
        entity: "content_articles",
        entityId: article.id,
        newValues: { status: "PUBLISHED", version: article.version },
      });

      published++;
    } catch (err: any) {
      failures++;
      await admin.rpc("increment_schedule_attempts", {
        target_id: article.id,
        error_msg: err.message || "Erro desconhecido no scheduler",
      });
    }
  }

  return { published, failures };
}
