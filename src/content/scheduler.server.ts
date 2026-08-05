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
  const claimToken = crypto.randomUUID();

  // 1. Claim atômico de artigos agendados vencidos
  const { data: claimed, error: claimError } = await admin
    .from("content_articles")
    .update({ 
      schedule_claimed_at: now, 
      schedule_claim_token: claimToken 
    })
    .eq("status", "SCHEDULED")
    .lte("scheduled_at", now)
    .is("schedule_claimed_at", null)
    .select("id, title, version");

  if (claimError) throw new AppError("SERVICE_UNAVAILABLE", { cause: claimError.message });
  if (!claimed || claimed.length === 0) return { published: 0, failures: 0 };

  let published = 0;
  let failures = 0;

  // 2. Processar cada claim
  for (const article of claimed) {
    try {
      const { error: publishError } = await admin
        .from("content_articles")
        .update({ 
          status: "PUBLISHED",
          published_at: now,
          schedule_claimed_at: null,
          schedule_claim_token: null,
          last_schedule_attempt_at: now,
          schedule_attempts: 0 // Resetar ao ter sucesso
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
        actorId: "00000000-0000-0000-0000-000000000000", // System
        actorEmail: "system@avizee.com.br",
        action: "content.publish.auto",
        entity: "content_articles",
        entityId: article.id,
        newValues: { status: "PUBLISHED", version: article.version },
      });

      published++;
    } catch (err: any) {
      failures++;
      await admin
        .from("content_articles")
        .update({ 
          schedule_claimed_at: null,
          schedule_claim_token: null,
          last_schedule_attempt_at: now,
          last_schedule_error: err.message,
          schedule_attempts: admin.rpc('increment_attempts', { article_id: article.id }) // Simulando incremento
        })
        .eq("id", article.id);
    }
  }

  return { published, failures };
}
