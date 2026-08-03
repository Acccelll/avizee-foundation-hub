-- ==========================================================================
-- Etapa 10 — Central de Conteúdos e CMS editorial
-- Regras aplicadas: R-03 (sem preço), R-05 (sem marca de terceiro no público),
-- deny-by-default, auditoria, nenhuma automação de rede social.
-- ==========================================================================

CREATE TYPE public.content_status AS ENUM (
  'DRAFT',
  'IN_TECHNICAL_REVIEW',
  'IN_EDITORIAL_REVIEW',
  'CHANGES_REQUESTED',
  'READY_TO_PUBLISH',
  'PUBLISHED',
  'UNPUBLISHED',
  'ARCHIVED'
);

CREATE TYPE public.content_channel AS ENUM ('INSTAGRAM', 'LINKEDIN');
CREATE TYPE public.social_variant_status AS ENUM ('DRAFT', 'READY', 'EXPORTED');

-- ---------- Funções de permissão (security definer) ----------
CREATE OR REPLACE FUNCTION public.can_read_content(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_any_role(_user_id, ARRAY['ADMINISTRADOR','EDITOR','AUTOR','REVISOR_TECNICO','AUDITOR','GESTOR_DE_CATALOGO']::public.app_role[]);
$$;

CREATE OR REPLACE FUNCTION public.can_write_content(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_any_role(_user_id, ARRAY['ADMINISTRADOR','EDITOR','AUTOR']::public.app_role[]);
$$;

CREATE OR REPLACE FUNCTION public.can_publish_content(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_any_role(_user_id, ARRAY['ADMINISTRADOR','EDITOR']::public.app_role[]);
$$;

REVOKE EXECUTE ON FUNCTION public.can_read_content(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.can_write_content(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.can_publish_content(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.can_read_content(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.can_write_content(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.can_publish_content(uuid) TO authenticated, service_role;

-- ---------- Categorias editoriais (as 7 aprovadas — DEC-18 rejeitada) ----------
CREATE TABLE public.content_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.content_categories (slug, name, description, sort_order) VALUES
  ('guias-e-boas-praticas','Guias e boas práticas','Orientações práticas de uso, manejo e organização na avicultura.',1),
  ('vacinacao-e-aplicacao','Vacinação e aplicação','Procedimentos, cuidados e equipamentos de aplicação.',2),
  ('equipamentos-e-manutencao','Equipamentos e manutenção','Conservação, ajuste e vida útil dos equipamentos.',3),
  ('incubacao-e-manejo','Incubação e manejo','Rotinas de incubatório e manejo de plantel.',4),
  ('curiosidades-da-avicultura','Curiosidades da avicultura','Contexto, história e informações gerais do setor.',5),
  ('noticias-e-mercado','Notícias e mercado','Acompanhamento de temas do setor avícola.',6),
  ('produtos-e-aplicacoes','Produtos e aplicações','Como os itens do catálogo se aplicam a necessidades reais.',7);

-- ---------- Autores ----------
CREATE TABLE public.content_authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  display_name text NOT NULL,
  role_title text,
  bio text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ---------- Artigos ----------
CREATE TABLE public.content_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text,
  excerpt text,
  category_id uuid REFERENCES public.content_categories(id) ON DELETE RESTRICT,
  author_id uuid REFERENCES public.content_authors(id) ON DELETE SET NULL,
  technical_reviewer_id uuid REFERENCES public.content_authors(id) ON DELETE SET NULL,
  status public.content_status NOT NULL DEFAULT 'DRAFT',
  blocks jsonb NOT NULL DEFAULT '[]'::jsonb,
  cover_media_id uuid REFERENCES public.media_assets(id) ON DELETE SET NULL,
  reading_minutes int NOT NULL DEFAULT 1,
  seo_title text,
  seo_description text,
  noindex boolean NOT NULL DEFAULT false,
  requires_technical_review boolean NOT NULL DEFAULT true,
  published_at timestamptz,
  first_published_at timestamptz,
  review_note text,
  internal_notes text,
  version int NOT NULL DEFAULT 1,
  created_by uuid,
  updated_by uuid,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT content_articles_published_complete CHECK (
    status <> 'PUBLISHED' OR (
      category_id IS NOT NULL
      AND author_id IS NOT NULL
      AND excerpt IS NOT NULL AND length(btrim(excerpt)) >= 40
      AND jsonb_array_length(blocks) > 0
      AND published_at IS NOT NULL
    )
  )
);

CREATE INDEX idx_content_articles_status ON public.content_articles (status, published_at DESC);
CREATE INDEX idx_content_articles_category ON public.content_articles (category_id);

-- ---------- Versões ----------
CREATE TABLE public.content_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES public.content_articles(id) ON DELETE CASCADE,
  version int NOT NULL,
  title text NOT NULL,
  excerpt text,
  blocks jsonb NOT NULL,
  status public.content_status NOT NULL,
  note text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (article_id, version)
);

-- ---------- Referências consultadas ----------
CREATE TABLE public.content_references (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES public.content_articles(id) ON DELETE CASCADE,
  label text NOT NULL,
  url text,
  note text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------- Relação com o catálogo ----------
CREATE TABLE public.content_article_families (
  article_id uuid NOT NULL REFERENCES public.content_articles(id) ON DELETE CASCADE,
  family_id uuid NOT NULL REFERENCES public.product_families(id) ON DELETE CASCADE,
  sort_order int NOT NULL DEFAULT 0,
  PRIMARY KEY (article_id, family_id)
);

CREATE TABLE public.content_article_products (
  article_id uuid NOT NULL REFERENCES public.content_articles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sort_order int NOT NULL DEFAULT 0,
  PRIMARY KEY (article_id, product_id)
);

-- ---------- Histórico de endereços (redirecionamento) ----------
CREATE TABLE public.content_article_slugs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES public.content_articles(id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------- Eventos do fluxo editorial ----------
CREATE TABLE public.content_status_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES public.content_articles(id) ON DELETE CASCADE,
  from_status public.content_status,
  to_status public.content_status NOT NULL,
  actor_id uuid,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------- Variantes sociais (preparação manual) ----------
CREATE TABLE public.content_social_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES public.content_articles(id) ON DELETE CASCADE,
  channel public.content_channel NOT NULL,
  status public.social_variant_status NOT NULL DEFAULT 'DRAFT',
  headline text,
  caption text,
  hashtags text[] NOT NULL DEFAULT '{}'::text[],
  call_to_action text,
  image_media_id uuid REFERENCES public.media_assets(id) ON DELETE SET NULL,
  exported_at timestamptz,
  exported_by uuid,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (article_id, channel)
);

-- ---------- updated_at ----------
CREATE TRIGGER content_categories_set_updated_at BEFORE UPDATE ON public.content_categories
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER content_authors_set_updated_at BEFORE UPDATE ON public.content_authors
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER content_articles_set_updated_at BEFORE UPDATE ON public.content_articles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER content_social_variants_set_updated_at BEFORE UPDATE ON public.content_social_variants
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------- Grants (Data API) ----------
GRANT SELECT ON public.content_categories TO authenticated;
GRANT SELECT ON public.content_authors TO authenticated;
GRANT SELECT ON public.content_articles TO authenticated;
GRANT SELECT ON public.content_revisions TO authenticated;
GRANT SELECT ON public.content_references TO authenticated;
GRANT SELECT ON public.content_article_families TO authenticated;
GRANT SELECT ON public.content_article_products TO authenticated;
GRANT SELECT ON public.content_article_slugs TO authenticated;
GRANT SELECT ON public.content_status_events TO authenticated;
GRANT SELECT ON public.content_social_variants TO authenticated;

GRANT ALL ON public.content_categories TO service_role;
GRANT ALL ON public.content_authors TO service_role;
GRANT ALL ON public.content_articles TO service_role;
GRANT ALL ON public.content_revisions TO service_role;
GRANT ALL ON public.content_references TO service_role;
GRANT ALL ON public.content_article_families TO service_role;
GRANT ALL ON public.content_article_products TO service_role;
GRANT ALL ON public.content_article_slugs TO service_role;
GRANT ALL ON public.content_status_events TO service_role;
GRANT ALL ON public.content_social_variants TO service_role;

-- ---------- RLS: deny-by-default ----------
ALTER TABLE public.content_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_article_families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_article_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_article_slugs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_status_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_social_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "content_categories_read" ON public.content_categories
FOR SELECT TO authenticated USING (public.can_read_content(auth.uid()));
CREATE POLICY "content_authors_read" ON public.content_authors
FOR SELECT TO authenticated USING (public.can_read_content(auth.uid()));
CREATE POLICY "content_articles_read" ON public.content_articles
FOR SELECT TO authenticated USING (public.can_read_content(auth.uid()));
CREATE POLICY "content_revisions_read" ON public.content_revisions
FOR SELECT TO authenticated USING (public.can_read_content(auth.uid()));
CREATE POLICY "content_references_read" ON public.content_references
FOR SELECT TO authenticated USING (public.can_read_content(auth.uid()));
CREATE POLICY "content_article_families_read" ON public.content_article_families
FOR SELECT TO authenticated USING (public.can_read_content(auth.uid()));
CREATE POLICY "content_article_products_read" ON public.content_article_products
FOR SELECT TO authenticated USING (public.can_read_content(auth.uid()));
CREATE POLICY "content_article_slugs_read" ON public.content_article_slugs
FOR SELECT TO authenticated USING (public.can_read_content(auth.uid()));
CREATE POLICY "content_status_events_read" ON public.content_status_events
FOR SELECT TO authenticated USING (public.can_read_content(auth.uid()));
CREATE POLICY "content_social_variants_read" ON public.content_social_variants
FOR SELECT TO authenticated USING (public.can_read_content(auth.uid()));

-- ==========================================================================
-- Camada pública: allowlist explícita de campos (R-04 / R-05)
-- ==========================================================================
CREATE OR REPLACE VIEW public.public_articles AS
SELECT a.id,
       a.slug,
       a.title,
       a.subtitle,
       a.excerpt,
       a.blocks,
       a.reading_minutes,
       a.published_at,
       a.updated_at AS revised_at,
       a.seo_title,
       a.seo_description,
       a.noindex,
       c.slug AS category_slug,
       c.name AS category_name,
       au.display_name AS author_name,
       au.role_title AS author_role,
       m.public_path AS cover_url,
       m.alt_text AS cover_alt
FROM public.content_articles a
JOIN public.content_categories c ON c.id = a.category_id AND c.is_active
LEFT JOIN public.content_authors au ON au.id = a.author_id
LEFT JOIN public.media_assets m ON m.id = a.cover_media_id
     AND m.review_status = 'APROVADA' AND m.public_path IS NOT NULL
WHERE a.deleted_at IS NULL
  AND a.status = 'PUBLISHED'
  AND a.published_at IS NOT NULL
  AND a.published_at <= now();

CREATE OR REPLACE VIEW public.public_content_categories AS
SELECT c.slug, c.name, c.description, c.sort_order,
       (SELECT count(*)::int FROM public.public_articles pa WHERE pa.category_slug = c.slug) AS article_count
FROM public.content_categories c
WHERE c.is_active;

CREATE OR REPLACE VIEW public.public_article_references AS
SELECT r.article_id, r.label, r.url, r.note, r.sort_order
FROM public.content_references r
JOIN public.public_articles a ON a.id = r.article_id;

CREATE OR REPLACE VIEW public.public_article_relations AS
SELECT rel.article_id,
       f.slug AS family_slug,
       f.public_name AS family_name,
       f.summary AS family_summary,
       f.category_slug,
       f.category_name,
       f.variation_count,
       rel.sort_order
FROM public.content_article_families rel
JOIN public.public_articles a ON a.id = rel.article_id
JOIN public.public_families f ON f.id = rel.family_id;

CREATE OR REPLACE VIEW public.public_article_slugs AS
SELECT s.slug AS old_slug, a.slug AS current_slug
FROM public.content_article_slugs s
JOIN public.public_articles a ON a.id = s.article_id;

GRANT SELECT ON public.public_articles, public.public_content_categories,
  public.public_article_references, public.public_article_relations,
  public.public_article_slugs TO anon, authenticated, service_role;