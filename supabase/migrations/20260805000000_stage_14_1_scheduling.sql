-- FASE F — MIGRATION DO AGENDAMENTO
-- Adição segura ao enum content_status
ALTER TYPE public.content_status ADD VALUE IF NOT EXISTS 'SCHEDULED';

-- Adição de colunas à tabela content_articles
ALTER TABLE public.content_articles 
ADD COLUMN IF NOT EXISTS scheduled_at timestamptz,
ADD COLUMN IF NOT EXISTS scheduled_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS schedule_attempts integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_schedule_attempt_at timestamptz,
ADD COLUMN IF NOT EXISTS last_schedule_error text,
ADD COLUMN IF NOT EXISTS schedule_claimed_at timestamptz,
ADD COLUMN IF NOT EXISTS schedule_claim_token uuid,
ADD COLUMN IF NOT EXISTS schedule_lease_until timestamptz,
ADD COLUMN IF NOT EXISTS technical_reviewer_id uuid REFERENCES auth.users(id);

-- Índices para performance do worker
CREATE INDEX IF NOT EXISTS idx_articles_scheduling 
ON public.content_articles (status, scheduled_at, schedule_lease_until)
WHERE status = 'SCHEDULED';

-- Tabela de autores
CREATE TABLE IF NOT EXISTS public.content_authors (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    display_name text NOT NULL,
    role_title text,
    bio text,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid REFERENCES auth.users(id),
    updated_by uuid REFERENCES auth.users(id)
);

-- Grants para autores
GRANT SELECT ON public.content_authors TO authenticated;
GRANT ALL ON public.content_authors TO service_role;

-- RLS para autores
ALTER TABLE public.content_authors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Autores visíveis para autenticados" 
ON public.content_authors FOR SELECT TO authenticated USING (true);

CREATE POLICY "Apenas admin gere autores" 
ON public.content_authors FOR ALL TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));

-- FASE I — CLAIM ATÔMICO
CREATE OR REPLACE FUNCTION public.claim_scheduled_articles(
    worker_id uuid,
    max_batch integer,
    lease_duration interval
)
RETURNS TABLE (
    id uuid,
    title text,
    version integer,
    claim_token uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    now_ts timestamptz := now();
    token uuid := gen_random_uuid();
BEGIN
    RETURN QUERY
    WITH targets AS (
        SELECT a.id
        FROM public.content_articles a
        WHERE a.status = 'SCHEDULED'
          AND a.scheduled_at <= now_ts
          AND (a.schedule_claimed_at IS NULL OR a.schedule_lease_until <= now_ts)
        ORDER BY a.scheduled_at ASC
        LIMIT max_batch
        FOR UPDATE SKIP LOCKED
    )
    UPDATE public.content_articles a
    SET 
        schedule_claimed_at = now_ts,
        schedule_claim_token = token,
        schedule_lease_until = now_ts + lease_duration
    FROM targets
    WHERE a.id = targets.id
    RETURNING a.id, a.title, a.version, a.schedule_claim_token;
END;
$$;

-- FASE J — RPC PARA INCREMENTO DE TENTATIVAS
CREATE OR REPLACE FUNCTION public.increment_schedule_attempts(
    target_id uuid,
    error_msg text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.content_articles
    SET 
        schedule_attempts = schedule_attempts + 1,
        last_schedule_attempt_at = now(),
        last_schedule_error = error_msg,
        schedule_claimed_at = NULL,
        schedule_claim_token = NULL,
        schedule_lease_until = NULL
    WHERE id = target_id;
END;
$$;
