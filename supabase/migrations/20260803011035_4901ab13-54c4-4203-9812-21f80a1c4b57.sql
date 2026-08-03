CREATE OR REPLACE FUNCTION public.submit_quotation(p jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_client_request_id uuid := (p ->> 'client_request_id')::uuid;
  v_payload_hash text := p ->> 'payload_hash';
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
    IF v_payload_hash IS NOT NULL
       AND v_existing.payload_hash IS NOT NULL
       AND v_existing.payload_hash <> v_payload_hash THEN
      RAISE EXCEPTION 'IDEMPOTENCY_CONFLICT' USING ERRCODE = 'P0001';
    END IF;
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

  BEGIN
    INSERT INTO public.quotations (
      protocol, client_request_id, payload_hash, company_name, contact_name, contact_email,
      contact_phone, city, state_uf, message, preferred_channel, ip_hash, user_agent_hash
    ) VALUES (
      v_protocol, v_client_request_id, v_payload_hash,
      p ->> 'company_name', p ->> 'contact_name', p ->> 'contact_email',
      p ->> 'contact_phone', p ->> 'city', p ->> 'state_uf', p ->> 'message',
      p ->> 'preferred_channel', v_ip_hash, p ->> 'user_agent_hash'
    ) RETURNING id INTO v_id;
  EXCEPTION WHEN unique_violation THEN
    -- Corrida entre requisições concorrentes: a perdedora devolve o protocolo da vencedora.
    SELECT * INTO v_existing FROM public.quotations WHERE client_request_id = v_client_request_id;
    IF NOT FOUND THEN
      RAISE;
    END IF;
    IF v_payload_hash IS NOT NULL
       AND v_existing.payload_hash IS NOT NULL
       AND v_existing.payload_hash <> v_payload_hash THEN
      RAISE EXCEPTION 'IDEMPOTENCY_CONFLICT' USING ERRCODE = 'P0001';
    END IF;
    RETURN jsonb_build_object('protocol', v_existing.protocol, 'idempotent', true,
                              'created_at', v_existing.created_at);
  END;

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

  INSERT INTO public.outbox_messages (message_type, quotation_id, dedupe_key, payload, status)
  VALUES
    ('QUOTATION_INTERNAL_NOTICE', v_id, v_id::text || ':internal',
     jsonb_build_object('protocol', v_protocol, 'item_count', v_pos), 'PENDING'),
    ('QUOTATION_CONFIRMATION', v_id, v_id::text || ':confirmation',
     jsonb_build_object('protocol', v_protocol, 'item_count', v_pos), 'PENDING')
  ON CONFLICT DO NOTHING;

  RETURN jsonb_build_object('protocol', v_protocol, 'idempotent', false, 'id', v_id);
END;
$function$;