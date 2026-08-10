import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { logger } from "@/lib/logger";

export interface RetentionRunResult {
  anonymized: number;
  protocols: string[];
}

/**
 * Executa um lote da política aprovada de retenção de cotações/leads.
 * A seleção, o lock e a anonimização são atômicos no RPC do banco.
 */
export async function processQuotationRetention(limit = 100): Promise<RetentionRunResult> {
  const boundedLimit = Math.max(1, Math.min(Math.trunc(limit), 1000));
  const { data, error } = await supabaseAdmin.rpc("anonymize_expired_quotations", {
    p_limit: boundedLimit,
  });

  if (error) {
    logger.error("privacy.retention.failure", { code: error.code ?? null });
    throw new Error("Falha ao executar retenção de cotações.");
  }

  const rows = (data ?? []) as Array<{ id: string; protocol: string }>;
  logger.info("privacy.retention.completed", { anonymized: rows.length });

  return {
    anonymized: rows.length,
    protocols: rows.map((row) => row.protocol),
  };
}
