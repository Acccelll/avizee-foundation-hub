-- ============================================================
-- Etapa 8 — Lista de cotação, registro transacional e outbox
-- Nenhuma coluna de preço, desconto, frete, total ou estoque.
-- ============================================================

CREATE TYPE public.quotation_status AS ENUM (
  'RECEIVED','IN_REVIEW','WAITING_INFORMATION','IN_SERVICE',
  'RESPONDED','CONVERTED','CLOSED','SPAM','CANCELLED'
);

CREATE TYPE public.quotation_event_type AS ENUM (
  'CREATED','STATUS_CHANGE','ASSIGNMENT','NOTE','NOTIFICATION'
);

CREATE TYPE public.outbox_status AS ENUM ('PENDING','SENT','FAILED','DEAD_LETTER','SIMULATED');

-- ---------- Papel de leitura comercial ----------
CREATE OR REPLACE FUNCTION public.can_read_quotations(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_any_role(_user_id, ARRAY['ADMINISTRADOR','COMERCIAL']::public.app_role[]);
$$;

-- ---------- Protocolo não enumerável ----------
CREATE OR REPLACE FUNCTION public.generate_quotation_protocol()
RETURNS text LANGUAGE plpgsql VOLATILE SET search_path = public AS $$
DECLARE
  alphabet text := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  candidate text;
  i int;
  attempts int := 0;
BEGIN
  LOOP
    candidate := 'AVZ-' || to_char(now(), 'YYYY') || '-';
    FOR i IN 1..8 LOOP
      candidate := candidate || substr(alphabet, 1 + floor(random() * 32)::int, 1);
    END LOOP;
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.quotations WHERE protocol = candidate);
    attempts := attempts + 1;
    IF attempts > 20 THEN
      RAISE EXCEPTION 'não foi possível gerar protocolo único';
    END IF;
  END LOOP;
  RETURN candidate;
END;
$$;

-- ---------- Cotações ----------
CREATE TABLE public.quotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  protocol text NOT NULL UNIQUE,
  client_request_id uuid NOT NULL UNIQUE,
  status public.quotation_status NOT NULL DEFAULT 'RECEIVED',
  company_name text NOT NULL,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text NOT NULL,
  city text,
  state_uf text,
  message text,
  preferred_channel text,
  assigned_to uuid,
  assigned_at timestamptz,
  item_count integer NOT NULL DEFAULT 0,
  unavailable_item_count integer NOT NULL DEFAULT 0,
  last_event_at timestamptz NOT NULL DEFAULT now(),
  responded_at timestamptz,
  closed_at timestamptz,
  anonymized_at timestamptz,
  ip_hash text,
  user_agent_hash text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT quotations_uf_len CHECK (state_uf IS NULL OR char_length(state_uf) = 2)
);

CREATE INDEX idx_quotations_status ON public.quotations (status, created_at DESC);
CREATE INDEX idx_quotations_assigned ON public.quotations (assigned_to);
CREATE INDEX idx_quotations_created ON public.quotations (created_at DESC);

CREATE TRIGGER quotations_set_updated_at
BEFORE UPDATE ON public.quotations
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------- Itens (snapshot histórico) ----------
CREATE TABLE public.quotation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id uuid NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  family_id uuid REFERENCES public.product_families(id) ON DELETE SET NULL,
  snapshot_sku text NOT NULL,
  snapshot_name text NOT NULL,
  snapshot_variation text,
  snapshot_family text,
  snapshot_category text,
  quantity integer NOT NULL,
  note text,
  was_available boolean NOT NULL DEFAULT true,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT quotation_items_quantity_range CHECK (quantity BETWEEN 1 AND 999999),
  CONSTRAINT quotation_items_note_len CHECK (note IS NULL OR char_length(note) <= 300)
);

CREATE INDEX idx_quotation_items_quotation ON public.quotation_items (quotation_id, position);

-- ---------- Origem ----------
CREATE TABLE public.quotation_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id uuid NOT NULL UNIQUE REFERENCES public.quotations(id) ON DELETE CASCADE,
  origin_page text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------- Eventos (histórico imutável) ----------
CREATE TABLE public.quotation_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id uuid NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
  event_type public.quotation_event_type NOT NULL,
  from_status public.quotation_status,
  to_status public.quotation_status,
  actor_id uuid,
  actor_label text,
  internal_note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_quotation_events_quotation ON public.quotation_events (quotation_id, created_at);

CREATE OR REPLACE FUNCTION public.quotation_events_immutable()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  RAISE EXCEPTION 'quotation_events é imutável';
END;
$$;

CREATE TRIGGER quotation_events_no_update
BEFORE UPDATE OR DELETE ON public.quotation_events
FOR EACH ROW EXECUTE FUNCTION public.quotation_events_immutable();

-- ---------- Consentimentos ----------
CREATE TABLE public.consent_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id uuid REFERENCES public.quotations(id) ON DELETE CASCADE,
  subject_email text,
  purpose text NOT NULL,
  legal_basis text NOT NULL,
  policy_version text NOT NULL,
  consent_text text NOT NULL,
  accepted boolean NOT NULL,
  accepted_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);

CREATE INDEX idx_consent_records_quotation ON public.consent_records (quotation_id);

-- ---------- Outbox ----------
CREATE TABLE public.outbox_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_type text NOT NULL,
  quotation_id uuid REFERENCES public.quotations(id) ON DELETE CASCADE,
  dedupe_key text UNIQUE,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status public.outbox_status NOT NULL DEFAULT 'PENDING',
  attempts integer NOT NULL DEFAULT 0,
  max_attempts integer NOT NULL DEFAULT 5,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  last_error text,
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_outbox_pending ON public.outbox_messages (status, next_attempt_at);
CREATE INDEX idx_outbox_quotation ON public.outbox_messages (quotation_id);

CREATE TRIGGER outbox_messages_set_updated_at
BEFORE UPDATE ON public.outbox_messages
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------- Antiabuso ----------
CREATE TABLE public.quotation_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_quotation_rate_limits ON public.quotation_rate_limits (ip_hash, created_at DESC);

-- ---------- Grants (Data API) ----------
GRANT SELECT ON public.quotations TO authenticated;
GRANT SELECT ON public.quotation_items TO authenticated;
GRANT SELECT ON public.quotation_sources TO authenticated;
GRANT SELECT ON public.quotation_events TO authenticated;
GRANT SELECT ON public.consent_records TO authenticated;
GRANT SELECT ON public.outbox_messages TO authenticated;
GRANT ALL ON public.quotations TO service_role;
GRANT ALL ON public.quotation_items TO service_role;
GRANT ALL ON public.quotation_sources TO service_role;
GRANT ALL ON public.quotation_events TO service_role;
GRANT ALL ON public.consent_records TO service_role;
GRANT ALL ON public.outbox_messages TO service_role;
GRANT ALL ON public.quotation_rate_limits TO service_role;

ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outbox_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_rate_limits ENABLE ROW LEVEL SECURITY;

-- Deny-by-default: anônimo não tem GRANT nem política. Somente leitura comercial.
CREATE POLICY "quotations_read_commercial" ON public.quotations
FOR SELECT TO authenticated USING (public.can_read_quotations(auth.uid()));

CREATE POLICY "quotation_items_read_commercial" ON public.quotation_items
FOR SELECT TO authenticated USING (public.can_read_quotations(auth.uid()));

CREATE POLICY "quotation_sources_read_commercial" ON public.quotation_sources
FOR SELECT TO authenticated USING (public.can_read_quotations(auth.uid()));

CREATE POLICY "quotation_events_read_commercial" ON public.quotation_events
FOR SELECT TO authenticated USING (public.can_read_quotations(auth.uid()));

CREATE POLICY "consent_records_read_admin" ON public.consent_records
FOR SELECT TO authenticated
USING (public.has_any_role(auth.uid(), ARRAY['ADMINISTRADOR','AUDITOR']::public.app_role[]));

CREATE POLICY "outbox_read_admin" ON public.outbox_messages
FOR SELECT TO authenticated
USING (public.has_any_role(auth.uid(), ARRAY['ADMINISTRADOR','AUDITOR','COMERCIAL']::public.app_role[]));

-- ---------- Registro transacional ----------
CREATE OR REPLACE FUNCTION public.submit_quotation(p jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_client_request_id uuid := (p ->> 'client_request_id')::uuid;
  v_ip_hash text := p ->> 'ip_hash';
  v_existing public.quotations%ROWTYPE;
  v_id uuid;
  v_protocol text;
  v_items jsonb := COALESCE(p -> 'items', '[]'::jsonb);
  v_item jsonb;
  v_pos int := 0;
  v_unavailable int := 0;
  v_recent int;
BEGIN
  SELECT * INTO v_existing FROM public.quotations WHERE client_request_id = v_client_request_id;
  IF FOUND THEN
    RETURN jsonb_build_object('protocol', v_existing.protocol, 'idempotent', true,
                              'created_at', v_existing.created_at);
  END IF;

  IF v_ip_hash IS NOT NULL THEN
    SELECT count(*) INTO v_recent FROM public.quotation_rate_limits
     WHERE ip_hash = v_ip_hash AND created_at > now() - interval '10 minutes';
    IF v_recent >= 5 THEN
      RAISE EXCEPTION 'RATE_LIMITED' USING ERRCODE = 'P0001';
    END IF;
    SELECT count(*) INTO v_recent FROM public.quotation_rate_limits
     WHERE ip_hash = v_ip_hash AND created_at > now() - interval '1 day';
    IF v_recent >= 20 THEN
      RAISE EXCEPTION 'RATE_LIMITED' USING ERRCODE = 'P0001';
    END IF;
    INSERT INTO public.quotation_rate_limits (ip_hash) VALUES (v_ip_hash);
  END IF;

  IF jsonb_array_length(v_items) = 0 OR jsonb_array_length(v_items) > 50 THEN
    RAISE EXCEPTION 'INVALID_ITEMS' USING ERRCODE = 'P0001';
  END IF;

  v_protocol := public.generate_quotation_protocol();

  INSERT INTO public.quotations (
    protocol, client_request_id, company_name, contact_name, contact_email,
    contact_phone, city, state_uf, message, preferred_channel, ip_hash, user_agent_hash
  ) VALUES (
    v_protocol, v_client_request_id,
    p ->> 'company_name', p ->> 'contact_name', p ->> 'contact_email',
    p ->> 'contact_phone', p ->> 'city', p ->> 'state_uf', p ->> 'message',
    p ->> 'preferred_channel', v_ip_hash, p ->> 'user_agent_hash'
  ) RETURNING id INTO v_id;

  FOR v_item IN SELECT * FROM jsonb_array_elements(v_items) LOOP
    v_pos := v_pos + 1;
    IF COALESCE((v_item ->> 'was_available')::boolean, true) = false THEN
      v_unavailable := v_unavailable + 1;
    END IF;
    INSERT INTO public.quotation_items (
      quotation_id, product_id, family_id, snapshot_sku, snapshot_name,
      snapshot_variation, snapshot_family, snapshot_category, quantity, note,
      was_available, position
    ) VALUES (
      v_id,
      NULLIF(v_item ->> 'product_id','')::uuid,
      NULLIF(v_item ->> 'family_id','')::uuid,
      v_item ->> 'snapshot_sku',
      v_item ->> 'snapshot_name',
      v_item ->> 'snapshot_variation',
      v_item ->> 'snapshot_family',
      v_item ->> 'snapshot_category',
      (v_item ->> 'quantity')::int,
      NULLIF(v_item ->> 'note',''),
      COALESCE((v_item ->> 'was_available')::boolean, true),
      v_pos
    );
  END LOOP;

  UPDATE public.quotations
     SET item_count = v_pos, unavailable_item_count = v_unavailable
   WHERE id = v_id;

  INSERT INTO public.quotation_sources (
    quotation_id, origin_page, referrer, utm_source, utm_medium, utm_campaign
  ) VALUES (
    v_id, p ->> 'origin_page', p ->> 'referrer',
    p ->> 'utm_source', p ->> 'utm_medium', p ->> 'utm_campaign'
  );

  INSERT INTO public.consent_records (
    quotation_id, subject_email, purpose, legal_basis, policy_version, consent_text, accepted
  )
  SELECT v_id, p ->> 'contact_email',
         c ->> 'purpose', c ->> 'legal_basis', c ->> 'policy_version',
         c ->> 'consent_text', COALESCE((c ->> 'accepted')::boolean, false)
    FROM jsonb_array_elements(COALESCE(p -> 'consents', '[]'::jsonb)) AS c;

  INSERT INTO public.quotation_events (quotation_id, event_type, to_status, actor_label)
  VALUES (v_id, 'CREATED', 'RECEIVED', 'solicitante');

  INSERT INTO public.outbox_messages (message_type, quotation_id, dedupe_key, payload)
  VALUES
    ('QUOTATION_INTERNAL_NOTICE', v_id, v_id::text || ':internal',
     jsonb_build_object('protocol', v_protocol, 'item_count', v_pos)),
    ('QUOTATION_CONFIRMATION', v_id, v_id::text || ':confirmation',
     jsonb_build_object('protocol', v_protocol, 'item_count', v_pos));

  RETURN jsonb_build_object('protocol', v_protocol, 'idempotent', false, 'id', v_id);
END;
$$;

REVOKE ALL ON FUNCTION public.submit_quotation(jsonb) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.submit_quotation(jsonb) FROM anon;
REVOKE ALL ON FUNCTION public.submit_quotation(jsonb) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.submit_quotation(jsonb) TO service_role;