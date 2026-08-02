/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Tipo de cliente Supabase usado nas camadas de servidor do catálogo.
 * O esquema gerado ainda não cobre as tabelas administrativas criadas na
 * Etapa 6, por isso a tipagem estrutural permissiva — a validação real
 * acontece em Zod, nas constraints do banco e nas políticas RLS.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

export type AnyClient = SupabaseClient<any, any, any>;

export interface AuditWriter {
  from: (table: string) => {
    insert: (rows: any) => PromiseLike<{ error: unknown }>;
  };
}
