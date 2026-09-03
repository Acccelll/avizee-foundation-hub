-- OWASP SEC-06 — remove o parâmetro de identidade dos helpers editoriais.
-- O usuário autenticado só pode consultar a própria capacidade via auth.uid().

CREATE OR REPLACE FUNCTION public.can_read_content()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_any_role(
    auth.uid(),
    ARRAY['ADMINISTRADOR','EDITOR','AUTOR','REVISOR_TECNICO','AUDITOR','GESTOR_DE_CATALOGO']::public.app_role[]
  );
$$;

CREATE OR REPLACE FUNCTION public.can_write_content()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_any_role(
    auth.uid(),
    ARRAY['ADMINISTRADOR','EDITOR','AUTOR']::public.app_role[]
  );
$$;

CREATE OR REPLACE FUNCTION public.can_publish_content()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_any_role(
    auth.uid(),
    ARRAY['ADMINISTRADOR','EDITOR']::public.app_role[]
  );
$$;

REVOKE ALL ON FUNCTION public.can_read_content() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.can_write_content() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.can_publish_content() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.can_read_content() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.can_write_content() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.can_publish_content() TO authenticated, service_role;

ALTER POLICY "content_categories_read" ON public.content_categories
  USING (public.can_read_content());
ALTER POLICY "content_authors_read" ON public.content_authors
  USING (public.can_read_content());
ALTER POLICY "content_articles_read" ON public.content_articles
  USING (public.can_read_content());
ALTER POLICY "content_revisions_read" ON public.content_revisions
  USING (public.can_read_content());
ALTER POLICY "content_references_read" ON public.content_references
  USING (public.can_read_content());
ALTER POLICY "content_article_families_read" ON public.content_article_families
  USING (public.can_read_content());
ALTER POLICY "content_article_products_read" ON public.content_article_products
  USING (public.can_read_content());
ALTER POLICY "content_article_slugs_read" ON public.content_article_slugs
  USING (public.can_read_content());
ALTER POLICY "content_status_events_read" ON public.content_status_events
  USING (public.can_read_content());
ALTER POLICY "content_social_variants_read" ON public.content_social_variants
  USING (public.can_read_content());

-- As versões antigas recebiam UUID arbitrário e permitiam sondagem de papéis.
REVOKE ALL ON FUNCTION public.can_read_content(uuid) FROM PUBLIC, anon, authenticated, service_role;
REVOKE ALL ON FUNCTION public.can_write_content(uuid) FROM PUBLIC, anon, authenticated, service_role;
REVOKE ALL ON FUNCTION public.can_publish_content(uuid) FROM PUBLIC, anon, authenticated, service_role;
DROP FUNCTION public.can_read_content(uuid);
DROP FUNCTION public.can_write_content(uuid);
DROP FUNCTION public.can_publish_content(uuid);
