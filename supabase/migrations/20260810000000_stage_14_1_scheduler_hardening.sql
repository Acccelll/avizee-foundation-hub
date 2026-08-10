-- Etapa 14.1 — correção forward-only para ambientes que já aplicaram as
-- migrations iniciais do agendamento antes da consolidação no repositório.

ALTER TABLE public.content_articles
ADD COLUMN IF NOT EXISTS schedule_claimed_by uuid;

DROP POLICY IF EXISTS "Apenas admin gere autores" ON public.content_authors;
CREATE POLICY "Apenas admin gere autores"
ON public.content_authors FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'ADMINISTRADOR'))
WITH CHECK (public.has_role(auth.uid(), 'ADMINISTRADOR'));

CREATE OR REPLACE FUNCTION public.claim_scheduled_articles(
    worker_id uuid,
    max_batch integer,
    lease_duration interval
)
RETURNS TABLE (
    id uuid,
    title text,
    version integer,
    schedule_claim_token uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    now_ts timestamptz := now();
BEGIN
    RETURN QUERY
    WITH targets AS (
        SELECT a.id
        FROM public.content_articles a
        WHERE a.status = 'SCHEDULED'
          AND a.scheduled_at <= now_ts
          AND (a.schedule_claimed_at IS NULL OR a.schedule_lease_until <= now_ts)
        ORDER BY a.scheduled_at ASC, a.id ASC
        LIMIT LEAST(GREATEST(max_batch, 1), 50)
        FOR UPDATE SKIP LOCKED
    )
    UPDATE public.content_articles a
    SET
        schedule_claimed_at = now_ts,
        schedule_claim_token = gen_random_uuid(),
        schedule_claimed_by = worker_id,
        schedule_lease_until = now_ts + lease_duration
    FROM targets
    WHERE a.id = targets.id
    RETURNING a.id, a.title, a.version, a.schedule_claim_token;
END;
$$;

CREATE OR REPLACE FUNCTION public.complete_scheduled_article(
    target_id uuid,
    target_token uuid,
    published_time timestamptz
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    changed_id uuid;
BEGIN
    UPDATE public.content_articles
    SET
        status = 'PUBLISHED',
        published_at = published_time,
        first_published_at = COALESCE(first_published_at, published_time),
        scheduled_at = NULL,
        scheduled_by = NULL,
        last_schedule_attempt_at = published_time,
        last_schedule_error = NULL,
        schedule_claimed_at = NULL,
        schedule_claim_token = NULL,
        schedule_claimed_by = NULL,
        schedule_lease_until = NULL,
        updated_at = now()
    WHERE id = target_id
      AND status = 'SCHEDULED'
      AND schedule_claim_token = target_token
    RETURNING id INTO changed_id;

    IF changed_id IS NULL THEN
        RETURN false;
    END IF;

    INSERT INTO public.content_status_events (
        article_id,
        from_status,
        to_status,
        actor_id,
        note
    ) VALUES (
        target_id,
        'SCHEDULED',
        'PUBLISHED',
        NULL,
        'Publicação automática via scheduler'
    );

    RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.fail_scheduled_article(
    target_id uuid,
    target_token uuid,
    error_msg text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    changed_id uuid;
BEGIN
    UPDATE public.content_articles
    SET
        schedule_attempts = schedule_attempts + 1,
        last_schedule_attempt_at = now(),
        last_schedule_error = left(COALESCE(error_msg, 'Erro desconhecido no scheduler'), 500),
        schedule_claimed_at = NULL,
        schedule_claim_token = NULL,
        schedule_claimed_by = NULL,
        schedule_lease_until = NULL,
        updated_at = now()
    WHERE id = target_id
      AND status = 'SCHEDULED'
      AND schedule_claim_token = target_token
    RETURNING id INTO changed_id;

    RETURN changed_id IS NOT NULL;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_scheduled_articles(uuid, integer, interval) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.complete_scheduled_article(uuid, uuid, timestamptz) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fail_scheduled_article(uuid, uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_scheduled_articles(uuid, integer, interval) TO service_role;
GRANT EXECUTE ON FUNCTION public.complete_scheduled_article(uuid, uuid, timestamptz) TO service_role;
GRANT EXECUTE ON FUNCTION public.fail_scheduled_article(uuid, uuid, text) TO service_role;
