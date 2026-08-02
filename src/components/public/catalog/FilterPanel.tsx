import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";

import type { CatalogFacets } from "@/catalog/public/read.server";

export interface CatalogSearch {
  q?: string | undefined;
  categoria?: string | undefined;
  segmento?: string | undefined;
  aplicacao?: string | undefined;
  ordem?: "relevance" | "name" | "category" | undefined;
  pagina?: number | undefined;
}

type Dimension = "categoria" | "segmento" | "aplicacao";

function toggle(current: CatalogSearch, dimension: Dimension, value: string): CatalogSearch {
  const next: CatalogSearch = { ...current, pagina: undefined };
  next[dimension] = current[dimension] === value ? undefined : value;
  return next;
}

function FacetGroup({
  legend,
  dimension,
  options,
  search,
}: {
  legend: string;
  dimension: Dimension;
  options: { slug: string; name: string; count: number }[];
  search: CatalogSearch;
}) {
  if (options.length === 0) return null;
  return (
    <fieldset className="border-t border-border-subtle pt-4">
      <legend className="text-[13px] font-semibold uppercase tracking-wide text-text-muted">
        {legend}
      </legend>
      <ul className="mt-3 space-y-1">
        {options.map((option) => {
          const active = search[dimension] === option.slug;
          return (
            <li key={option.slug}>
              <Link
                to="/produtos"
                search={toggle(search, dimension, option.slug)}
                aria-pressed={active}
                className={`flex min-h-11 items-center justify-between gap-3 rounded-[8px] px-3 py-2 text-[15px] hover:bg-surface ${
                  active ? "bg-surface font-semibold text-emphasis" : "text-text-secondary"
                }`}
              >
                <span>{option.name}</span>
                <span className="text-[13px] tabular-nums text-text-muted">{option.count}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

/**
 * Filtros do catálogo. Implementados como links (`?parametro=`), portanto
 * funcionam sem JavaScript e são refletidos na URL — que é `noindex,follow`
 * quando há filtro aplicado (doc 100 §5).
 */
export function FilterPanel({
  facets,
  search,
}: {
  facets: CatalogFacets;
  search: CatalogSearch;
}) {
  const hasFilters = Boolean(search.categoria || search.segmento || search.aplicacao);

  return (
    <aside aria-labelledby="filtros-titulo" className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h2 id="filtros-titulo" className="text-[16px] font-bold">
          Filtros
        </h2>
        {hasFilters && (
          <Link
            to="/produtos"
            search={{ q: search.q }}
            className="inline-flex min-h-11 items-center gap-1 text-[14px] font-semibold text-emphasis hover:underline"
          >
            <X aria-hidden="true" className="h-4 w-4" />
            Limpar filtros
          </Link>
        )}
      </div>

      <FacetGroup
        legend="Categoria"
        dimension="categoria"
        options={facets.categories.map((c) => ({ slug: c.slug, name: c.name, count: c.count }))}
        search={search}
      />
      <FacetGroup legend="Segmento" dimension="segmento" options={facets.segments} search={search} />
      <FacetGroup
        legend="Aplicação"
        dimension="aplicacao"
        options={facets.applications}
        search={search}
      />
    </aside>
  );
}
