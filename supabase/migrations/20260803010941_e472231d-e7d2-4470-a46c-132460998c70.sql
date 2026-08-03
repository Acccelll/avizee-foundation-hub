-- ETAPA 11.1 — migration corretiva
ALTER TYPE public.outbox_status ADD VALUE IF NOT EXISTS 'PROCESSING';
ALTER TYPE public.outbox_status ADD VALUE IF NOT EXISTS 'RETRY_SCHEDULED';
ALTER TYPE public.outbox_status ADD VALUE IF NOT EXISTS 'DELIVERED';
ALTER TYPE public.outbox_status ADD VALUE IF NOT EXISTS 'CANCELLED';

ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS payload_hash text;
CREATE INDEX IF NOT EXISTS quotations_payload_hash_idx ON public.quotations (payload_hash);

ALTER TABLE public.outbox_messages
  ADD COLUMN IF NOT EXISTS worker_id text,
  ADD COLUMN IF NOT EXISTS claim_token uuid,
  ADD COLUMN IF NOT EXISTS claimed_at timestamptz,
  ADD COLUMN IF NOT EXISTS lease_until timestamptz;

CREATE INDEX IF NOT EXISTS outbox_messages_claim_idx
  ON public.outbox_messages (status, next_attempt_at);

CREATE TABLE IF NOT EXISTS public.public_release_cohort (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_code text NOT NULL DEFAULT 'V1-31-97',
  entity text NOT NULL CHECK (entity IN ('FAMILY','PRODUCT')),
  entity_id uuid NOT NULL,
  approved_by uuid,
  approval_reference text NOT NULL DEFAULT 'D-052/D-053',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (cohort_code, entity, entity_id)
);

GRANT SELECT ON public.public_release_cohort TO authenticated;
GRANT ALL ON public.public_release_cohort TO service_role;
ALTER TABLE public.public_release_cohort ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cohort_read_internal" ON public.public_release_cohort
  FOR SELECT TO authenticated USING (public.can_read_catalog(auth.uid()));

DROP TRIGGER IF EXISTS set_public_release_cohort_updated_at ON public.public_release_cohort;
CREATE TRIGGER set_public_release_cohort_updated_at
  BEFORE UPDATE ON public.public_release_cohort
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Semeia a coorte aprovada a partir do que já está publicado (31 famílias / 97 SKUs).
INSERT INTO public.public_release_cohort (entity, entity_id)
SELECT 'FAMILY', f.id FROM public.product_families f
WHERE f.publication_status = 'PUBLISHED' AND f.deleted_at IS NULL
ON CONFLICT DO NOTHING;

INSERT INTO public.public_release_cohort (entity, entity_id)
SELECT 'PRODUCT', p.id FROM public.products p
WHERE p.publication_status = 'PUBLISHED' AND p.deleted_at IS NULL
ON CONFLICT DO NOTHING;

-- Auditoria da coorte: publicado fora da coorte aprovada.
CREATE OR REPLACE FUNCTION public.audit_release_cohort(p_cohort text DEFAULT 'V1-31-97')
RETURNS TABLE(entity text, entity_id uuid, issue text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT 'FAMILY'::text, f.id, 'PUBLICADO_FORA_DA_COORTE'::text
    FROM public.product_families f
   WHERE f.publication_status = 'PUBLISHED' AND f.deleted_at IS NULL
     AND NOT EXISTS (SELECT 1 FROM public.public_release_cohort c
                      WHERE c.cohort_code = p_cohort AND c.entity = 'FAMILY' AND c.entity_id = f.id)
  UNION ALL
  SELECT 'PRODUCT'::text, p.id, 'PUBLICADO_FORA_DA_COORTE'::text
    FROM public.products p
   WHERE p.publication_status = 'PUBLISHED' AND p.deleted_at IS NULL
     AND NOT EXISTS (SELECT 1 FROM public.public_release_cohort c
                      WHERE c.cohort_code = p_cohort AND c.entity = 'PRODUCT' AND c.entity_id = p.id)
$$;

-- Claim atômico da outbox (FOR UPDATE SKIP LOCKED).
CREATE OR REPLACE FUNCTION public.claim_outbox_messages(
  p_worker_id text,
  p_limit integer DEFAULT 20,
  p_lease_seconds integer DEFAULT 120
)
RETURNS TABLE(id uuid, message_type text, quotation_id uuid, attempts integer,
              max_attempts integer, claim_token uuid, dedupe_key text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_token uuid := gen_random_uuid();
BEGIN
  RETURN QUERY
  WITH candidates AS (
    SELECT m.id
      FROM public.outbox_messages m
     WHERE (
             m.status::text IN ('PENDING','FAILED','RETRY_SCHEDULED')
             AND m.next_attempt_at <= now()
           )
        OR (
             m.status::text = 'PROCESSING'
             AND m.lease_until IS NOT NULL
             AND m.lease_until < now()
           )
     ORDER BY m.next_attempt_at, m.created_at
     LIMIT GREATEST(1, LEAST(COALESCE(p_limit, 20), 100))
     FOR UPDATE SKIP LOCKED
  )
  UPDATE public.outbox_messages m
     SET status = 'PROCESSING',
         worker_id = p_worker_id,
         claim_token = v_token,
         claimed_at = now(),
         lease_until = now() + make_interval(secs => GREATEST(10, COALESCE(p_lease_seconds, 120))),
         updated_at = now()
    FROM candidates c
   WHERE m.id = c.id
  RETURNING m.id, m.message_type, m.quotation_id, m.attempts,
            m.max_attempts, m.claim_token, m.dedupe_key;
END;
$$;

-- Conclusão do claim: só o dono do claim_token pode finalizar.
CREATE OR REPLACE FUNCTION public.complete_outbox_message(
  p_id uuid,
  p_claim_token uuid,
  p_status text,
  p_attempts integer,
  p_next_attempt_at timestamptz DEFAULT NULL,
  p_last_error text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_rows integer;
BEGIN
  IF p_status NOT IN ('DELIVERED','RETRY_SCHEDULED','FAILED','DEAD_LETTER','SIMULATED','CANCELLED') THEN
    RAISE EXCEPTION 'INVALID_OUTBOX_STATUS';
  END IF;

  UPDATE public.outbox_messages
     SET status = p_status::public.outbox_status,
         attempts = COALESCE(p_attempts, attempts),
         next_attempt_at = COALESCE(p_next_attempt_at, next_attempt_at),
         last_error = LEFT(COALESCE(p_last_error, ''), 200),
         processed_at = CASE WHEN p_status IN ('DELIVERED','SIMULATED','CANCELLED') THEN now() ELSE processed_at END,
         claim_token = NULL,
         lease_until = NULL,
         updated_at = now()
   WHERE id = p_id
     AND claim_token = p_claim_token;

  GET DIAGNOSTICS v_rows = ROW_COUNT;
  RETURN v_rows = 1;
END;
$$;

-- Recolocação de leases vencidos (operação de manutenção).
CREATE OR REPLACE FUNCTION public.release_expired_outbox_leases()
RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_rows integer;
BEGIN
  UPDATE public.outbox_messages
     SET status = 'RETRY_SCHEDULED', claim_token = NULL, lease_until = NULL,
         worker_id = NULL, updated_at = now()
   WHERE status::text = 'PROCESSING'
     AND lease_until IS NOT NULL
     AND lease_until < now();
  GET DIAGNOSTICS v_rows = ROW_COUNT;
  RETURN v_rows;
END;
$$;
