CREATE OR REPLACE FUNCTION public.schema_readiness()
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'expected_version', '11.1',
    'quotations_payload_hash', EXISTS (
      SELECT 1 FROM information_schema.columns
       WHERE table_schema='public' AND table_name='quotations' AND column_name='payload_hash'),
    'outbox_claim_columns', (
      SELECT count(*) = 4 FROM information_schema.columns
       WHERE table_schema='public' AND table_name='outbox_messages'
         AND column_name IN ('worker_id','claim_token','claimed_at','lease_until')),
    'outbox_states', (
      SELECT count(*) = 6 FROM unnest(enum_range(NULL::public.outbox_status)) e
       WHERE e::text IN ('PENDING','PROCESSING','RETRY_SCHEDULED','DELIVERED','FAILED','CANCELLED')),
    'claim_function', EXISTS (
      SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
       WHERE n.nspname='public' AND p.proname='claim_outbox_messages'),
    'complete_function', EXISTS (
      SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
       WHERE n.nspname='public' AND p.proname='complete_outbox_message'),
    'release_cohort_table', EXISTS (
      SELECT 1 FROM information_schema.tables
       WHERE table_schema='public' AND table_name='public_release_cohort'),
    'quotations_rls', (
      SELECT relrowsecurity FROM pg_class WHERE oid='public.quotations'::regclass)
  )
$$;

REVOKE ALL ON FUNCTION public.schema_readiness() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.schema_readiness() TO service_role;
GRANT EXECUTE ON FUNCTION public.schema_readiness() TO authenticated;
