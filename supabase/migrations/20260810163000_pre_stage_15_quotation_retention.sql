-- Fechamento pré-Etapa 15 — política aprovada de retenção de cotações/leads.
-- Decisão do usuário: 24 meses após a última interação comercial.
--
-- Regras:
-- - nunca remove a cotação nem seus itens técnicos; preserva histórico agregado;
-- - somente situações terminais e não convertidas entram na automação;
-- - CONVERTED e situações operacionais permanecem fora para evitar apagar relação ativa;
-- - execução em lotes com FOR UPDATE SKIP LOCKED;
-- - idempotente por anonymized_at;
-- - histórico imutável de eventos permanece intacto e segue política própria de auditoria;
-- - funções disponíveis apenas para service_role.

CREATE OR REPLACE FUNCTION public.list_expired_quotation_candidates(
  p_before timestamptz DEFAULT (now() - interval '24 months'),
  p_limit integer DEFAULT 100
)
RETURNS TABLE(id uuid, protocol text, status public.quotation_status, last_event_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT q.id, q.protocol, q.status, q.last_event_at
    FROM public.quotations q
   WHERE q.anonymized_at IS NULL
     AND q.last_event_at < p_before
     AND q.status IN ('RESPONDED','CLOSED','CANCELLED','SPAM')
   ORDER BY q.last_event_at, q.id
   LIMIT GREATEST(1, LEAST(COALESCE(p_limit, 100), 1000));
$$;

CREATE OR REPLACE FUNCTION public.anonymize_expired_quotations(
  p_before timestamptz DEFAULT (now() - interval '24 months'),
  p_limit integer DEFAULT 100
)
RETURNS TABLE(id uuid, protocol text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH candidates AS (
    SELECT q.id
      FROM public.quotations q
     WHERE q.anonymized_at IS NULL
       AND q.last_event_at < p_before
       AND q.status IN ('RESPONDED','CLOSED','CANCELLED','SPAM')
     ORDER BY q.last_event_at, q.id
     LIMIT GREATEST(1, LEAST(COALESCE(p_limit, 100), 1000))
     FOR UPDATE SKIP LOCKED
  ), anonymized AS (
    UPDATE public.quotations q
       SET company_name = '[ANONIMIZADO]',
           contact_name = '[ANONIMIZADO]',
           contact_email = '',
           contact_phone = '',
           message = NULL,
           preferred_channel = NULL,
           ip_hash = NULL,
           user_agent_hash = NULL,
           anonymized_at = now(),
           updated_at = now()
      FROM candidates c
     WHERE q.id = c.id
     RETURNING q.id, q.protocol
  ), scrub_items AS (
    UPDATE public.quotation_items i
       SET note = NULL
      FROM anonymized a
     WHERE i.quotation_id = a.id
     RETURNING i.quotation_id
  ), scrub_sources AS (
    UPDATE public.quotation_sources s
       SET referrer = NULL
      FROM anonymized a
     WHERE s.quotation_id = a.id
     RETURNING s.quotation_id
  ), scrub_consents AS (
    UPDATE public.consent_records c
       SET subject_email = NULL
      FROM anonymized a
     WHERE c.quotation_id = a.id
     RETURNING c.quotation_id
  ), audit_rows AS (
    INSERT INTO public.audit_logs (
      actor_id,
      actor_email_masked,
      action,
      entity,
      entity_id,
      result,
      origin,
      changed_fields,
      context
    )
    SELECT
      NULL,
      NULL,
      'quotation.retention.anonymize',
      'quotations',
      a.id::text,
      'success',
      'retention-worker',
      ARRAY[
        'company_name','contact_name','contact_email','contact_phone','message',
        'preferred_channel','ip_hash','user_agent_hash','anonymized_at'
      ]::text[],
      jsonb_build_object('policy', '24_months_after_last_commercial_interaction')
    FROM anonymized a
    RETURNING entity_id
  )
  SELECT a.id, a.protocol FROM anonymized a;
END;
$$;

REVOKE ALL ON FUNCTION public.list_expired_quotation_candidates(timestamptz, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.anonymize_expired_quotations(timestamptz, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.list_expired_quotation_candidates(timestamptz, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.anonymize_expired_quotations(timestamptz, integer) TO service_role;
