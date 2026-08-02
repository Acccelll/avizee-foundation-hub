create or replace function public.search_public_catalog(
  q text default null, p_category text default null, p_segment text default null,
  p_application text default null, p_family text default null,
  p_sort text default 'relevance', p_limit int default 12, p_offset int default 0
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
                  when extensions.word_similarity((select norm from n), i.name_norm) >= 0.45 then 2
                  when extensions.similarity(i.name_norm, (select norm from n)) > 0.35 then 1
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

grant execute on function public.search_public_catalog(text, text, text, text, text, text, int, int) to anon, authenticated, service_role;