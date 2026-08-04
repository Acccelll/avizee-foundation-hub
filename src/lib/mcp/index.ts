import { defineMcp } from "@lovable.dev/mcp-js";

import getFamilyTool from "./tools/get-family";
import listCategoriesTool from "./tools/list-categories";
import listFacetsTool from "./tools/list-facets";
import searchCatalogTool from "./tools/search-catalog";
import suggestTermsTool from "./tools/suggest-terms";

export default defineMcp({
  name: "avizee-foundation",
  title: "AviZee Foundation",
  version: "0.1.0",
  instructions:
    "Ferramentas de leitura do catálogo público B2B da AviZee (equipamentos, componentes e peças para avicultura). " +
    "Use `list_facets` ou `list_categories` para descobrir os slugs, `search_catalog` para localizar famílias, " +
    "`suggest_terms` para completar termos ou códigos e `get_family` para o detalhe com variações e especificações. " +
    "O catálogo não possui preços, estoque, prazos nem marcas de terceiros: a conversão é sempre por Lista de Cotação.",
  tools: [searchCatalogTool, listCategoriesTool, listFacetsTool, getFamilyTool, suggestTermsTool],
});
