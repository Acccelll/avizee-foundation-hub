export interface CatalogMetaSearch {
  q?: string | undefined;
  categoria?: string | undefined;
  segmento?: string | undefined;
  aplicacao?: string | undefined;
  ordem?: string | undefined;
  pagina?: number | undefined;
}

/** Filtros de descoberta são noindex e canonicalizam para a raiz do catálogo. */
export function isCatalogFiltered(search: CatalogMetaSearch): boolean {
  return Boolean(search.q || search.categoria || search.segmento || search.aplicacao);
}

/**
 * Paginação sem filtros possui canonical próprio; filtros e ordenação não criam
 * uma nova URL canônica. A URL ainda será absolutizada por buildMeta.
 */
export function catalogCanonical(search: CatalogMetaSearch): string {
  if (isCatalogFiltered(search)) return "/produtos";
  if (search.pagina && search.pagina > 1) {
    return `/produtos?pagina=${Math.floor(search.pagina)}`;
  }
  return "/produtos";
}
