-- Fechamento pós-merge pré-Etapa 15 — hardening de privilégios: funções internas e índice de busca

-- 1) Funções operacionais internas: somente service_role
REVOKE ALL ON FUNCTION public.claim_outbox_messages(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.complete_outbox_message(uuid, uuid, text, integer, timestamptz, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.release_expired_outbox_leases() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.claim_scheduled_articles(uuid, integer, interval) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.refresh_public_search_index() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.audit_release_cohort(text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.schema_readiness() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.claim_outbox_messages(text, integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.complete_outbox_message(uuid, uuid, text, integer, timestamptz, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.release_expired_outbox_leases() TO service_role;
GRANT EXECUTE ON FUNCTION public.claim_scheduled_articles(uuid, integer, interval) TO service_role;
GRANT EXECUTE ON FUNCTION public.refresh_public_search_index() TO service_role;
GRANT EXECUTE ON FUNCTION public.audit_release_cohort(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.schema_readiness() TO service_role;

-- Alguns ambientes que receberam uma versão intermediária do scheduler podem conter
-- esta função residual. Ela não faz parte do schema reproduzível atual; quando existir,
-- permanece restrita ao service_role sem quebrar o replay em banco limpo.
DO $$
BEGIN
  IF to_regprocedure('public.increment_schedule_attempts(uuid,text)') IS NOT NULL THEN
    EXECUTE 'REVOKE ALL ON FUNCTION public.increment_schedule_attempts(uuid, text) FROM PUBLIC, anon, authenticated';
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.increment_schedule_attempts(uuid, text) TO service_role';
  END IF;
END
$$;

-- 2) Verificadores de papel: apenas usuários autenticados (usados nas policies)
REVOKE ALL ON FUNCTION public.can_read_quotations(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.can_read_quotations(uuid) TO authenticated, service_role;

-- 3) Índice materializado fora da API pública (acesso só via search_public_catalog)
REVOKE ALL ON public.public_search_index FROM anon, authenticated;
GRANT SELECT ON public.public_search_index TO service_role;
