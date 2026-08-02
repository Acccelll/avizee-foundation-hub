create extension if not exists unaccent with schema extensions;
create extension if not exists pg_trgm with schema extensions;

create or replace function public.avz_unaccent(t text) returns text
language sql immutable parallel safe set search_path = extensions, public as $$
  select extensions.unaccent('extensions.unaccent'::regdictionary, coalesce(t, ''))
$$;

create or replace function public.avz_norm_text(t text) returns text
language sql immutable parallel safe set search_path = public as $$
  select btrim(regexp_replace(lower(public.avz_unaccent(coalesce(t, ''))), '[^a-z0-9]+', ' ', 'g'))
$$;

create or replace function public.avz_norm_code(t text) returns text
language sql immutable parallel safe set search_path = public as $$
  select regexp_replace(lower(public.avz_unaccent(coalesce(t, ''))), '[^a-z0-9]', '', 'g')
$$;

insert into public.publication_history (entity, entity_id, from_status, to_status, reason)
select 'product_families', id, review_status::text || '/' || publication_status::text,
       'READY_TO_PUBLISH/PUBLISHED', 'Etapa 7 - publicacao do lote canonico em homologacao'
from public.product_families
where deleted_at is null and publication_status <> 'PUBLISHED';

update public.product_families
set review_status = 'READY_TO_PUBLISH', publication_status = 'PUBLISHED', updated_at = now()
where deleted_at is null and publication_status <> 'PUBLISHED';

insert into public.publication_history (entity, entity_id, from_status, to_status, reason)
select 'products', id, review_status::text || '/' || publication_status::text,
       'READY_TO_PUBLISH/PUBLISHED', 'Etapa 7 - publicacao do lote canonico em homologacao'
from public.products
where deleted_at is null and publication_status <> 'PUBLISHED'
  and public_sku is not null and review_status::text not like 'BLOCKED%';

update public.products
set review_status = 'READY_TO_PUBLISH', publication_status = 'PUBLISHED', updated_at = now()
where deleted_at is null and publication_status <> 'PUBLISHED'
  and public_sku is not null and review_status::text not like 'BLOCKED%';

create or replace view public.public_products as
select p.id, p.public_sku, p.public_name, p.slug, p.variation_label, p.measure, p.capacity,
       p.unit, p.public_description, p.is_on_request, p.sort_order,
       p.family_id, f.slug as family_slug, f.public_name as family_name,
       c.slug as category_slug, c.name as category_name
from public.products p
join public.product_families f on f.id = p.family_id
join public.product_categories c on c.id = f.category_id
where p.deleted_at is null
  and p.publication_status = 'PUBLISHED'
  and p.review_status::text not like 'BLOCKED%'
  and p.public_sku is not null
  and p.public_name is not null
  and f.deleted_at is null
  and f.publication_status = 'PUBLISHED'
  and f.slug is not null
  and c.is_active
  and not exists (
    select 1 from public.code_conflicts cc
    where cc.code = p.public_sku and cc.status <> 'RESOLVED'
  );

create or replace view public.public_families as
select f.id, f.slug, f.public_name, f.summary, f.public_description, f.sort_order,
       c.slug as category_slug, c.name as category_name,
       coalesce((select array_agg(s.name order by fs.is_primary desc, s.sort_order)
                 from public.family_segments fs join public.segments s on s.id = fs.segment_id
                 where fs.family_id = f.id), '{}'::text[]) as segments,
       coalesce((select array_agg(s.slug order by fs.is_primary desc, s.sort_order)
                 from public.family_segments fs join public.segments s on s.id = fs.segment_id
                 where fs.family_id = f.id), '{}'::text[]) as segment_slugs,
       coalesce((select array_agg(a.name order by fa.is_primary desc, a.sort_order)
                 from public.family_applications fa join public.applications a on a.id = fa.application_id
                 where fa.family_id = f.id), '{}'::text[]) as applications,
       coalesce((select array_agg(a.slug order by fa.is_primary desc, a.sort_order)
                 from public.family_applications fa join public.applications a on a.id = fa.application_id
                 where fa.family_id = f.id), '{}'::text[]) as application_slugs,
       (select a.name from public.family_applications fa
          join public.applications a on a.id = fa.application_id
         where fa.family_id = f.id and fa.is_primary
         order by a.sort_order limit 1) as primary_application,
       (select count(*)::int from public.public_products pp where pp.family_id = f.id) as variation_count
from public.product_families f
join public.product_categories c on c.id = f.category_id
where f.deleted_at is null
  and f.publication_status = 'PUBLISHED'
  and f.review_status::text not like 'BLOCKED%'
  and f.slug is not null
  and f.public_name is not null
  and c.is_active;

create or replace view public.public_categories as
select c.id, c.slug, c.name, c.description, c.sort_order,
       (select count(*)::int from public.public_families f where f.category_slug = c.slug) as family_count,
       (select count(*)::int from public.public_products p where p.category_slug = c.slug) as product_count
from public.product_categories c
where c.is_active and c.deleted_at is null;

create or replace view public.public_media as
select pi.id, pi.product_id, pi.family_id, pi.role, pi.sort_order,
       m.public_path as url, m.alt_text, m.width, m.height
from public.product_images pi
join public.media_assets m on m.id = pi.media_asset_id
where m.deleted_at is null
  and m.in_quarantine = false
  and m.review_status in ('APROVADA', 'APROVADA_PARA_FAMILIA')
  and m.rights_status in ('OWNED', 'AUTHORIZED_BY_SUPPLIER', 'LICENSED')
  and m.public_path is not null;

create or replace view public.public_documents as
select pd.id, pd.product_id, pd.family_id, pd.sort_order,
       d.title, d.slug, d.document_type, d.storage_path as url, d.mime_type, d.byte_size,
       d.version, d.language, d.document_date
from public.product_documents pd
join public.documents d on d.id = pd.document_id
where d.deleted_at is null
  and d.status = 'PUBLISHED'
  and d.publication_right = true
  and d.bucket = 'public-documents';

create or replace view public.public_specifications as
select ps.product_id, null::uuid as family_id, sd.code, sd.label, sd.display_order,
       coalesce(ps.value_text, ps.value_num::text, ps.value_bool::text,
                array_to_string(ps.value_enum, ', ')) as value,
       u.code as unit
from public.product_specifications ps
join public.specification_definitions sd on sd.id = ps.definition_id
left join public.units u on u.id = ps.unit_id
where sd.is_public and sd.is_active
union all
select null::uuid, fs.family_id, sd.code, sd.label, sd.display_order,
       coalesce(fs.value_text, fs.value_num::text, fs.value_bool::text,
                array_to_string(fs.value_enum, ', ')) as value,
       u.code as unit
from public.family_specifications fs
join public.specification_definitions sd on sd.id = fs.definition_id
left join public.units u on u.id = fs.unit_id
where sd.is_public and sd.is_active;

drop materialized view if exists public.public_search_index;
create materialized view public.public_search_index as
select f.id as family_id, f.slug as family_slug, f.public_name, f.summary,
       f.category_slug, f.category_name, f.segments, f.segment_slugs,
       f.applications, f.application_slugs, f.sort_order, f.variation_count,
       coalesce(array(select p.public_sku from public.public_products p
                       where p.family_id = f.id order by p.public_sku), '{}'::text[]) as skus,
       public.avz_norm_text(f.public_name) as name_norm,
       setweight(to_tsvector('portuguese', public.avz_norm_text(f.public_name)), 'A')
       || setweight(to_tsvector('simple',
            coalesce((select string_agg(public.avz_norm_code(p.public_sku), ' ')
                        from public.public_products p where p.family_id = f.id), '')), 'A')
       || setweight(to_tsvector('portuguese', public.avz_norm_text(
            f.category_name || ' ' || array_to_string(f.applications, ' ')
            || ' ' || array_to_string(f.segments, ' '))), 'B')
       || setweight(to_tsvector('portuguese', public.avz_norm_text(
            coalesce((select string_agg(concat_ws(' ', p.public_name, p.variation_label,
                                                  p.measure, p.capacity, p.unit), ' ')
                        from public.public_products p where p.family_id = f.id), ''))), 'C')
       || setweight(to_tsvector('portuguese', public.avz_norm_text(
            coalesce(f.summary, '') || ' ' || coalesce(f.public_description, ''))), 'D') as tsv
from public.public_families f;

create unique index public_search_index_pk on public.public_search_index (family_id);
create index public_search_index_tsv on public.public_search_index using gin (tsv);
create index public_search_index_trgm on public.public_search_index
  using gin (name_norm extensions.gin_trgm_ops);

create or replace function public.refresh_public_search_index()
returns void language plpgsql security definer set search_path = public as $$
begin
  refresh materialized view concurrently public.public_search_index;
end;
$$;

create or replace function public.search_public_catalog(
  q text default null,
  p_category text default null,
  p_segment text default null,
  p_application text default null,
  p_family text default null,
  p_sort text default 'relevance',
  p_limit int default 12,
  p_offset int default 0
)
returns table (
  family_id uuid, family_slug text, public_name text, summary text,
  category_slug text, category_name text, segments text[], applications text[],
  variation_count int, skus text[], matched_sku text, rank real, total_count bigint
)
language sql stable security definer set search_path = public, extensions as $$
  with n as (
    select nullif(btrim(coalesce(q, '')), '') as raw,
           public.avz_norm_text(nullif(btrim(coalesce(q, '')), '')) as norm,
           public.avz_norm_code(nullif(btrim(coalesce(q, '')), '')) as code
  ),
  base as (
    select i.*,
      (select s from unnest(i.skus) s
        where public.avz_norm_code(s) = (select code from n) limit 1) as matched_sku,
      case
        when (select norm from n) is null or (select norm from n) = '' then 0::real
        else coalesce(ts_rank_cd(i.tsv,
               websearch_to_tsquery('portuguese', (select norm from n))), 0)::real
             + (case
                  when exists (select 1 from unnest(i.skus) s
                                where public.avz_norm_code(s) = (select code from n)) then 100
                  when (select code from n) <> ''
                       and exists (select 1 from unnest(i.skus) s
                                    where public.avz_norm_code(s) like (select code from n) || '%') then 50
                  when i.name_norm = (select norm from n) then 20
                  when i.name_norm like (select norm from n) || '%' then 10
                  when i.name_norm like '%' || (select norm from n) || '%' then 6
                  when extensions.similarity(i.name_norm, (select norm from n)) > 0.35 then 2
                  else 0
                end)::real
      end as rank
    from public.public_search_index i
  ),
  filtered as (
    select * from base
    where (p_category is null or category_slug = p_category)
      and (p_segment is null or p_segment = any(segment_slugs))
      and (p_application is null or p_application = any(application_slugs))
      and (p_family is null or family_slug = p_family)
      and ((select norm from n) is null or (select norm from n) = '' or rank > 0)
  )
  select family_id, family_slug, public_name, summary, category_slug, category_name,
         segments, applications, variation_count, skus, matched_sku, rank,
         count(*) over () as total_count
  from filtered
  order by
    (case when p_sort = 'relevance' then rank else 0 end) desc,
    (case when p_sort = 'name' then public_name end) asc nulls last,
    (case when p_sort = 'category' then category_name end) asc nulls last,
    sort_order asc, public_name asc
  limit greatest(1, least(coalesce(p_limit, 12), 48))
  offset greatest(0, coalesce(p_offset, 0))
$$;

create or replace function public.public_autocomplete(q text, p_limit int default 8)
returns table (kind text, label text, sublabel text, family_slug text, sku text)
language sql stable security definer set search_path = public, extensions as $$
  with n as (
    select public.avz_norm_text(q) as norm, public.avz_norm_code(q) as code
  ),
  sku_hits as (
    select 'sku'::text as kind, p.public_sku as label, p.public_name as sublabel,
           p.family_slug, p.public_sku as sku,
           case when public.avz_norm_code(p.public_sku) = n.code then 0 else 1 end as ord
    from public.public_products p, n
    where n.code <> '' and public.avz_norm_code(p.public_sku) like n.code || '%'
  ),
  family_hits as (
    select 'family'::text as kind, f.public_name as label, f.category_name as sublabel,
           f.slug as family_slug, null::text as sku, 2 as ord
    from public.public_families f, n
    where n.norm <> '' and public.avz_norm_text(f.public_name) like '%' || n.norm || '%'
  )
  select kind, label, sublabel, family_slug, sku
  from (select * from sku_hits union all select * from family_hits) s
  order by ord, label
  limit greatest(1, least(coalesce(p_limit, 8), 12))
$$;

grant select on public.public_products, public.public_families, public.public_categories,
  public.public_media, public.public_documents, public.public_specifications,
  public.public_search_index to anon, authenticated, service_role;

grant execute on function public.search_public_catalog(text, text, text, text, text, text, int, int) to anon, authenticated, service_role;
grant execute on function public.public_autocomplete(text, int) to anon, authenticated, service_role;
grant execute on function public.refresh_public_search_index() to authenticated, service_role;
revoke execute on function public.refresh_public_search_index() from anon;