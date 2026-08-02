-- ============================================================
-- Etapa 6 — Migration 03: núcleo do catálogo
-- ============================================================

CREATE TYPE public.review_status AS ENUM (
  'DRAFT','UNDER_REVIEW','BLOCKED_BY_CODE','BLOCKED_BY_IDENTITY',
  'BLOCKED_BY_BRAND','BLOCKED_BY_RIGHTS','READY_TO_PUBLISH'
);

CREATE TYPE public.publication_status AS ENUM (
  'NOT_PUBLISHED','PUBLISHED','UNPUBLISHED','ARCHIVED'
);

CREATE TYPE public.image_status AS ENUM (
  'APROVADA','APROVADA_PARA_FAMILIA','PENDENTE_MARCA_VISIVEL','PENDENTE_BAIXA_QUALIDADE',
  'PENDENTE_IMAGEM_INCORRETA','PENDENTE_DIREITO_DE_USO','SEM_IMAGEM','NAO_PUBLICAR',
  'PENDENTE_IDENTIFICACAO'
);

CREATE TYPE public.rights_status AS ENUM (
  'OWNED','AUTHORIZED_BY_SUPPLIER','LICENSED','RIGHTS_UNCONFIRMED','RESTRICTED','EXPIRED','DO_NOT_PUBLISH'
);

CREATE TYPE public.spec_value_type AS ENUM (
  'TEXT','NUMBER','DECIMAL','MEASURE','CAPACITY','ENUM_SINGLE','ENUM_MULTI','BOOLEAN','REFERENCE'
);

CREATE TYPE public.staging_status AS ENUM (
  'PENDING_REVIEW','MISSING_IDENTITY','CODE_CONFLICT','NAME_REVIEW','BRAND_REVIEW',
  'IMAGE_REVIEW','RIGHTS_REVIEW','TAXONOMY_REVIEW','DUPLICATE_SUSPECTED','REJECTED',
  'READY_FOR_CANONICALIZATION'
);

CREATE TYPE public.import_job_status AS ENUM (
  'UPLOADED','VALIDATING','DRY_RUN_COMPLETE','FAILED','EXECUTING','EXECUTED','ROLLED_BACK'
);

CREATE TYPE public.code_type AS ENUM ('PUBLIC_SKU','ORIGINAL','LEGACY','ALIAS','INTERNAL');

-- ------------------------------------------------------------
-- Helpers de política
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.can_read_catalog(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_any_role(_user_id, ARRAY['ADMINISTRADOR','GESTOR_DE_CATALOGO','EDITOR','REVISOR_TECNICO','AUDITOR']::public.app_role[]);
$$;

CREATE OR REPLACE FUNCTION public.can_read_internal(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_any_role(_user_id, ARRAY['ADMINISTRADOR','GESTOR_DE_CATALOGO']::public.app_role[]);
$$;

REVOKE EXECUTE ON FUNCTION public.can_read_catalog(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.can_read_internal(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.can_read_catalog(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.can_read_internal(uuid) TO service_role;

-- ------------------------------------------------------------
-- Taxonomia
-- ------------------------------------------------------------
CREATE TABLE public.segments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE public.product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE public.product_subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.product_categories(id) ON DELETE RESTRICT,
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  is_public boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE public.solutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  summary text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

-- ------------------------------------------------------------
-- Famílias
-- ------------------------------------------------------------
CREATE TABLE public.product_families (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_code text UNIQUE,
  public_name text NOT NULL,
  admin_name text NOT NULL DEFAULT '',
  slug text NOT NULL UNIQUE,
  category_id uuid REFERENCES public.product_categories(id) ON DELETE RESTRICT,
  subcategory_id uuid REFERENCES public.product_subcategories(id) ON DELETE SET NULL,
  summary text,
  public_description text,
  internal_notes text,
  sort_order integer NOT NULL DEFAULT 0,
  review_status public.review_status NOT NULL DEFAULT 'DRAFT',
  publication_status public.publication_status NOT NULL DEFAULT 'NOT_PUBLISHED',
  source text,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE INDEX idx_families_category ON public.product_families (category_id);
CREATE INDEX idx_families_review ON public.product_families (review_status);
CREATE INDEX idx_families_publication ON public.product_families (publication_status);

CREATE TABLE public.family_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES public.product_families(id) ON DELETE CASCADE,
  application_id uuid NOT NULL REFERENCES public.applications(id) ON DELETE RESTRICT,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (family_id, application_id)
);
CREATE UNIQUE INDEX idx_family_primary_application
  ON public.family_applications (family_id) WHERE is_primary;

CREATE TABLE public.family_segments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES public.product_families(id) ON DELETE CASCADE,
  segment_id uuid NOT NULL REFERENCES public.segments(id) ON DELETE RESTRICT,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (family_id, segment_id)
);
CREATE UNIQUE INDEX idx_family_primary_segment
  ON public.family_segments (family_id) WHERE is_primary;

CREATE TABLE public.family_solutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES public.product_families(id) ON DELETE CASCADE,
  solution_id uuid NOT NULL REFERENCES public.solutions(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (family_id, solution_id)
);

-- ------------------------------------------------------------
-- SKUs
-- ------------------------------------------------------------
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid REFERENCES public.product_families(id) ON DELETE RESTRICT,
  public_sku text,
  public_name text NOT NULL,
  slug text UNIQUE,
  variation_label text,
  measure text,
  capacity text,
  unit text,
  internal_original_name text,
  internal_brand text,
  internal_manufacturer text,
  internal_supplier_reference text,
  internal_notes text,
  public_description text,
  is_on_request boolean NOT NULL DEFAULT false,
  review_status public.review_status NOT NULL DEFAULT 'DRAFT',
  publication_status public.publication_status NOT NULL DEFAULT 'NOT_PUBLISHED',
  source text,
  sort_order integer NOT NULL DEFAULT 0,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE UNIQUE INDEX idx_products_public_sku_valid
  ON public.products (public_sku)
  WHERE public_sku IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX idx_products_family ON public.products (family_id);
CREATE INDEX idx_products_review ON public.products (review_status);

CREATE TABLE public.product_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  code text NOT NULL,
  code_type public.code_type NOT NULL,
  source text,
  is_valid boolean NOT NULL DEFAULT true,
  is_public boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, code, code_type)
);
CREATE INDEX idx_product_codes_code ON public.product_codes (code);

CREATE TABLE public.code_conflicts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  status text NOT NULL DEFAULT 'OPEN',
  sources jsonb NOT NULL DEFAULT '[]'::jsonb,
  candidate_names jsonb NOT NULL DEFAULT '[]'::jsonb,
  impact text,
  decision text,
  decided_by uuid,
  decided_at timestamptz,
  canonical_product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_code_conflicts_status ON public.code_conflicts (status);

CREATE TABLE public.product_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  application_id uuid NOT NULL REFERENCES public.applications(id) ON DELETE RESTRICT,
  is_primary boolean NOT NULL DEFAULT false,
  is_exception boolean NOT NULL DEFAULT true,
  justification text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, application_id)
);

CREATE TABLE public.product_segments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  segment_id uuid NOT NULL REFERENCES public.segments(id) ON DELETE RESTRICT,
  is_primary boolean NOT NULL DEFAULT false,
  is_exception boolean NOT NULL DEFAULT true,
  justification text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, segment_id)
);

CREATE TABLE public.related_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  source_family_id uuid REFERENCES public.product_families(id) ON DELETE CASCADE,
  target_product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  target_family_id uuid REFERENCES public.product_families(id) ON DELETE CASCADE,
  relation_type text NOT NULL,
  origin text NOT NULL DEFAULT 'MANUAL',
  justification text,
  sort_order integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'ACTIVE',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- Especificações
-- ------------------------------------------------------------
CREATE TABLE public.units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  label text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.specification_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  label text NOT NULL,
  value_type public.spec_value_type NOT NULL,
  unit_id uuid REFERENCES public.units(id) ON DELETE SET NULL,
  enum_values text[],
  is_required boolean NOT NULL DEFAULT false,
  is_filterable boolean NOT NULL DEFAULT false,
  is_public boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  help_text text,
  synonyms text[],
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.specification_scopes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  definition_id uuid NOT NULL REFERENCES public.specification_definitions(id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.product_categories(id) ON DELETE CASCADE,
  family_id uuid REFERENCES public.product_families(id) ON DELETE CASCADE,
  is_required boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT specification_scopes_target CHECK (category_id IS NOT NULL OR family_id IS NOT NULL)
);

CREATE TABLE public.family_specifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES public.product_families(id) ON DELETE CASCADE,
  definition_id uuid NOT NULL REFERENCES public.specification_definitions(id) ON DELETE RESTRICT,
  value_text text,
  value_num numeric,
  value_bool boolean,
  value_min numeric,
  value_max numeric,
  value_enum text[],
  unit_id uuid REFERENCES public.units(id) ON DELETE SET NULL,
  source text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (family_id, definition_id)
);

CREATE TABLE public.product_specifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  definition_id uuid NOT NULL REFERENCES public.specification_definitions(id) ON DELETE RESTRICT,
  value_text text,
  value_num numeric,
  value_bool boolean,
  value_min numeric,
  value_max numeric,
  value_enum text[],
  unit_id uuid REFERENCES public.units(id) ON DELETE SET NULL,
  is_override boolean NOT NULL DEFAULT false,
  source text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, definition_id)
);

-- ------------------------------------------------------------
-- Mídia
-- ------------------------------------------------------------
CREATE TABLE public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket text NOT NULL DEFAULT 'private-media',
  private_path text NOT NULL,
  public_path text,
  original_filename text,
  mime_type text NOT NULL,
  byte_size bigint,
  width integer,
  height integer,
  sha256 text UNIQUE,
  alt_text text,
  internal_title text,
  source text,
  owner_name text,
  authorization_type text,
  rights_document_path text,
  rights_date date,
  rights_responsible uuid,
  rights_restrictions text,
  rights_valid_until date,
  rights_status public.rights_status NOT NULL DEFAULT 'RIGHTS_UNCONFIRMED',
  review_status public.image_status NOT NULL DEFAULT 'PENDENTE_IDENTIFICACAO',
  review_reason text,
  detected_brand text,
  in_quarantine boolean NOT NULL DEFAULT true,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
CREATE INDEX idx_media_review ON public.media_assets (review_status);
CREATE INDEX idx_media_rights ON public.media_assets (rights_status);

CREATE TABLE public.image_review_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_asset_id uuid NOT NULL REFERENCES public.media_assets(id) ON DELETE CASCADE,
  from_status public.image_status,
  to_status public.image_status NOT NULL,
  reason text,
  actor_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_asset_id uuid NOT NULL REFERENCES public.media_assets(id) ON DELETE RESTRICT,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  family_id uuid REFERENCES public.product_families(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'GALLERY',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT product_images_target CHECK (product_id IS NOT NULL OR family_id IS NOT NULL)
);

CREATE TABLE public.placeholder_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  family_id uuid REFERENCES public.product_families(id) ON DELETE CASCADE,
  reason text NOT NULL,
  priority text NOT NULL DEFAULT 'MEDIA',
  pending_since date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT placeholder_usage_target CHECK (product_id IS NOT NULL OR family_id IS NOT NULL)
);

-- ------------------------------------------------------------
-- Documentos
-- ------------------------------------------------------------
CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE,
  document_type text NOT NULL DEFAULT 'OUTRO',
  bucket text NOT NULL DEFAULT 'private-media',
  storage_path text NOT NULL,
  mime_type text,
  byte_size bigint,
  version text,
  language text NOT NULL DEFAULT 'pt-BR',
  document_date date,
  publication_right boolean NOT NULL DEFAULT false,
  is_indexable boolean NOT NULL DEFAULT false,
  is_historical_reference boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'PRIVATE',
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE public.product_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  family_id uuid REFERENCES public.product_families(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT product_documents_target CHECK (product_id IS NOT NULL OR family_id IS NOT NULL)
);

-- ------------------------------------------------------------
-- Fonte bruta, triagem e normalização
-- ------------------------------------------------------------
CREATE TABLE public.source_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_reference text NOT NULL,
  source_system text NOT NULL,
  raw_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  content_hash text,
  staging_status public.staging_status NOT NULL DEFAULT 'PENDING_REVIEW',
  canonical_product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  canonical_family_id uuid REFERENCES public.product_families(id) ON DELETE SET NULL,
  import_job_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source_system, source_reference)
);
CREATE INDEX idx_source_records_status ON public.source_records (staging_status);

CREATE TABLE public.source_record_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_record_id uuid NOT NULL REFERENCES public.source_records(id) ON DELETE CASCADE,
  field_name text NOT NULL,
  raw_value text,
  normalized_value text,
  is_protected boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source_record_id, field_name)
);

CREATE TABLE public.normalization_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reason public.staging_status NOT NULL,
  title text NOT NULL,
  description text,
  source_record_id uuid REFERENCES public.source_records(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  family_id uuid REFERENCES public.product_families(id) ON DELETE CASCADE,
  media_asset_id uuid REFERENCES public.media_assets(id) ON DELETE CASCADE,
  code_conflict_id uuid REFERENCES public.code_conflicts(id) ON DELETE CASCADE,
  prefix text,
  origin text,
  priority text NOT NULL DEFAULT 'MEDIA',
  status text NOT NULL DEFAULT 'OPEN',
  assignee_id uuid,
  decision text,
  evidence jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_normalization_status ON public.normalization_tasks (status, reason);

CREATE TABLE public.normalization_task_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES public.normalization_tasks(id) ON DELETE CASCADE,
  actor_id uuid,
  event_type text NOT NULL,
  comment text,
  payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- Publicação e importação
-- ------------------------------------------------------------
CREATE TABLE public.publication_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity text NOT NULL,
  entity_id uuid NOT NULL,
  from_status text,
  to_status text NOT NULL,
  actor_id uuid,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_publication_history_entity ON public.publication_history (entity, entity_id);

CREATE TABLE public.import_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  file_hash text NOT NULL,
  schema_version text NOT NULL,
  entity text NOT NULL,
  mode text NOT NULL DEFAULT 'DRY_RUN',
  status public.import_job_status NOT NULL DEFAULT 'UPLOADED',
  target_layer text NOT NULL DEFAULT 'CANONICAL',
  total_rows integer NOT NULL DEFAULT 0,
  valid_rows integer NOT NULL DEFAULT 0,
  invalid_rows integer NOT NULL DEFAULT 0,
  new_rows integer NOT NULL DEFAULT 0,
  updated_rows integer NOT NULL DEFAULT 0,
  unchanged_rows integer NOT NULL DEFAULT 0,
  blocked_rows integer NOT NULL DEFAULT 0,
  conflict_rows integer NOT NULL DEFAULT 0,
  summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  dry_run_job_id uuid REFERENCES public.import_jobs(id) ON DELETE SET NULL,
  operator_id uuid,
  confirmed_at timestamptz,
  rolled_back_at timestamptz,
  rollback_of uuid REFERENCES public.import_jobs(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_import_jobs_status ON public.import_jobs (status, created_at DESC);

CREATE TABLE public.import_job_rows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  import_job_id uuid NOT NULL REFERENCES public.import_jobs(id) ON DELETE CASCADE,
  row_number integer NOT NULL,
  source_reference text,
  entity text NOT NULL,
  outcome text NOT NULL,
  entity_id uuid,
  previous_values jsonb,
  new_values jsonb,
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_import_job_rows_job ON public.import_job_rows (import_job_id);

CREATE TABLE public.import_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  import_job_id uuid NOT NULL REFERENCES public.import_jobs(id) ON DELETE CASCADE,
  row_number integer,
  column_name text,
  error_code text NOT NULL,
  message text NOT NULL,
  severity text NOT NULL DEFAULT 'ERROR',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_import_errors_job ON public.import_errors (import_job_id);

ALTER TABLE public.source_records
  ADD CONSTRAINT source_records_import_job_fk
  FOREIGN KEY (import_job_id) REFERENCES public.import_jobs(id) ON DELETE SET NULL;

-- ------------------------------------------------------------
-- Triggers de updated_at
-- ------------------------------------------------------------
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'segments','product_categories','product_subcategories','applications','solutions',
    'product_families','products','code_conflicts','specification_definitions',
    'family_specifications','product_specifications','media_assets','documents',
    'source_records','normalization_tasks','import_jobs'
  ]
  LOOP
    EXECUTE format(
      'CREATE TRIGGER %I_set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()',
      t, t
    );
  END LOOP;
END $$;

-- ------------------------------------------------------------
-- GRANTS + RLS
-- ------------------------------------------------------------
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'segments','product_categories','product_subcategories','applications','solutions',
    'product_families','family_applications','family_segments','family_solutions',
    'products','product_codes','product_applications','product_segments','related_products',
    'units','specification_definitions','specification_scopes','family_specifications',
    'product_specifications','product_images','placeholder_usage','documents',
    'product_documents','image_review_events','publication_history','import_job_rows',
    'import_errors','normalization_task_events'
  ]
  LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (public.can_read_catalog(auth.uid()))',
      t || '_select_catalog', t
    );
  END LOOP;

  -- Tabelas com conteúdo interno sensível: leitura restrita
  FOREACH t IN ARRAY ARRAY[
    'media_assets','code_conflicts','source_records','source_record_fields',
    'normalization_tasks','import_jobs'
  ]
  LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (public.can_read_internal(auth.uid()))',
      t || '_select_internal', t
    );
  END LOOP;
END $$;