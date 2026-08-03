import { createFileRoute, Link } from "@tanstack/react-router";

import { fetchCatalog, fetchFacets } from "@/catalog/public/public.functions";
import { PublicShell } from "@/components/public/PublicShell";
import { FamilyGrid } from "@/components/public/catalog/FamilyCard";
import { FilterPanel, type CatalogSearch } from "@/components/public/catalog/FilterPanel";
import { NoResults } from "@/components/public/catalog/NoResults";
import { Pagination } from "@/components/public/catalog/Pagination";
import { SearchBox } from "@/components/public/catalog/SearchBox";
import { buildMeta } from "@/seo/meta";

const ORDERS = ["relevance", "name", "category"] as const;

function str(value: unknown): string | undefined {
  const raw = typeof value === "string" ? value.trim() : "";
  return raw.length > 0 ? raw.slice(0, 120) : undefined;
}

export const Route = createFileRoute("/produtos/")({
  validateSearch: (search: Record<string, unknown>): CatalogSearch => {
    const ordem = ORDERS.find((o) => o === search["ordem"]);
    const pagina = Number(search["pagina"]);
    return {
      q: str(search["q"]),
      categoria: str(search["categoria"]),
      segmento: str(search["segmento"]),
      aplicacao: str(search["aplicacao"]),
      ordem,
      pagina: Number.isFinite(pagina) && pagina > 1 ? Math.min(200, Math.floor(pagina)) : undefined,
    };
  },
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const [catalog, facets] = await Promise.all([fetchCatalog({ data: deps }), fetchFacets()]);
    return { catalog, facets, search: deps };
  },
  head: ({ loaderData }) => {
    const filtered = Boolean(
      loaderData?.search.q ||
      loaderData?.search.categoria ||
      loaderData?.search.segmento ||
      loaderData?.search.aplicacao,
    );
    return buildMeta({
      title: "Catálogo de produtos para avicultura",
      description:
        "Catálogo técnico AviZee organizado por categoria, segmento e aplicação. Consulte as famílias e monte sua lista de cotação.",
      canonical: "/produtos",
      noindex: filtered,
      jsonLd: filtered
        ? []
        : [
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Início", item: "/" },
                { "@type": "ListItem", position: 2, name: "Produtos", item: "/produtos" },
              ],
            },
          ],
    });
  },
  component: CatalogoPublico,
});

function CatalogoPublico() {
  const { catalog, facets, search } = Route.useLoaderData();

  return (
    <PublicShell breadcrumb={[{ label: "Produtos" }]}>
      <div className="container-avizee">
        <header className="max-w-3xl">
          <h1 className="text-[36px] font-extrabold md:text-[44px]">Catálogo de produtos</h1>
          <p className="mt-4 text-[18px] text-text-secondary">
            {catalog.total} {catalog.total === 1 ? "família disponível" : "famílias disponíveis"}{" "}
            nas categorias publicadas. Sem preço público: você monta a lista e a equipe AviZee
            responde com a proposta.
          </p>
          <div className="mt-6 max-w-2xl">
            <SearchBox defaultValue={search.q ?? ""} />
          </div>
        </header>

        <nav aria-label="Categorias do catálogo" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {facets.categories.map((category: { slug: string; name: string; count: number }) => (
              <li key={category.slug}>
                <Link
                  to="/produtos/$categorySlug"
                  params={{ categorySlug: category.slug }}
                  className="inline-flex min-h-11 items-center rounded-full border border-border px-4 text-[15px] hover:bg-surface"
                >
                  {category.name}
                  <span className="ml-2 text-[13px] tabular-nums text-text-muted">
                    {category.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-10 grid gap-10 lg:grid-cols-[260px_1fr]">
          <FilterPanel facets={facets} search={search} />

          <section aria-label="Resultados do catálogo">
            <div
              aria-live="polite"
              className="mb-5 flex flex-wrap items-center justify-between gap-3 text-[15px] text-text-secondary"
            >
              <p>
                Página {catalog.page} de {catalog.pageCount} — {catalog.total}{" "}
                {catalog.total === 1 ? "resultado" : "resultados"}
              </p>
              <ul className="flex items-center gap-2">
                {(
                  [
                    { key: "category", label: "Por categoria" },
                    { key: "name", label: "Por nome" },
                    { key: "relevance", label: "Por relevância" },
                  ] as const
                ).map((option) => (
                  <li key={option.key}>
                    <Link
                      to="/produtos"
                      search={{ ...search, ordem: option.key, pagina: undefined }}
                      aria-pressed={
                        (search.ordem ?? (search.q ? "relevance" : "category")) === option.key
                      }
                      className={`inline-flex min-h-11 items-center rounded-[8px] border px-3 text-[14px] ${
                        (search.ordem ?? (search.q ? "relevance" : "category")) === option.key
                          ? "border-emphasis font-semibold text-emphasis"
                          : "border-border hover:bg-surface"
                      }`}
                    >
                      {option.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {catalog.items.length === 0 ? (
              <NoResults term={search.q} categories={facets.categories} />
            ) : (
              <>
                <FamilyGrid families={catalog.items} />
                <Pagination page={catalog.page} pageCount={catalog.pageCount} search={search} />
              </>
            )}
          </section>
        </div>
      </div>
    </PublicShell>
  );
}
