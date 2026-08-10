import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { logger } from "@/lib/logger";

export interface RetentionRunResult {
  anonymized: number;
  protocols: string[];
}

interface RetentionRpcError {
  code?: string | null;
}

interface RetentionRpcClient {
  rpc(
    name: "anonymize_expired_quotations",
    params: { p_limit: number },
  ): Promise<{
    data: Array<{ id: string; protocol: string }> | null;
    error: RetentionRpcError | null;
  }>;
}

/**
 * Executa um lote da política aprovada de retenção de cotações/leads.
 * A seleção, o lock e a anonimização são atômicos no RPC do banco.
 */
export async function processQuotationRetention(limit = 100): Promise<RetentionRunResult> {
  const boundedLimit = Math.max(1, Math.min(Math.trunc(limit), 1000));
  const retentionClient = supabaseAdmin as unknown as RetentionRpcClient;
  const { data, error } = await retentionClient.rpc("anonymize_expired_quotations", {
    p_limit: boundedLimit,
  });

  if (error) {
    logger.error("privacy.retention.failure", { code: error.code ?? null });
    throw new Error("Falha ao executar retenção de cotações.");
  }

  const rows = data ?? [];
  logger.info("privacy.retention.completed", { anonymized: rows.length });

  return {
    anonymized: rows.length,
    protocols: rows.map((row) => row.protocol),
  };
}
