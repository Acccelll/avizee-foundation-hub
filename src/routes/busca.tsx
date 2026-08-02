import { createFileRoute, Link } from "@tanstack/react-router";

import { fetchCatalog, fetchFacets } from "@/catalog/public/public.functions";
import { PublicShell } from "@/components/public/PublicShell";
import { FamilyGrid } from "@/components/public/catalog/FamilyCard";
import { NoResults } from "@/components/public/catalog/NoResults";
import { SearchBox } from "@/components/public/catalog/SearchBox";
import { buildMeta } from "@/seo/meta";

export const Route = createFileRoute("/busca")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? search["q"].trim().slice(0, 120) : "",
  }),
  loaderDeps: ({ search }) => ({ q: search.q }),
  loader: async ({ deps }) => {
    if (!deps.q) return { q: "", catalog: null, facets: await fetchFacets() };
    const [catalog, facets] = await Promise.all([
      fetchCatalog({ data: { q: deps.q, ordem: "relevance", pagina: 1 } }),
      fetchFacets(),
    ]);
    return { q: deps.q, catalog, facets };
  },
  head: () =>
    // Página de busca nunca é indexável (doc 106 §5).
    buildMeta({
      title: "Busca no catálogo",
      description:
        "Busque por nome, aplicação ou referência pública no catálogo técnico AviZee para avicultura.",
      noindex: true,
    }),
  component: BuscaPublica,
});

function BuscaPublica() {
  const { q, catalog, facets } = Route.useLoaderData();
  const exact = catalog?.items.find((item: { matchedSku: string | null }) => item.matchedSku);

  return (
    <PublicShell breadcrumb={[{ label: "Produtos", to: "/produtos" }, { label: "Busca" }]}>
      <div className="container-avizee max-w-4xl">
        <h1 className="text-[32px] font-extrabold">Busca no catálogo</h1>
        <div className="mt-6">
          <SearchBox defaultValue={q} autoFocusOnMount />
        </div>

        {!q && (
          <p className="mt-8 text-[16px] text-text-secondary">
            Digite um termo, uma aplicação ou uma referência pública (por exemplo,{" "}
            <span className="font-semibold tabular-nums">AG011</span>) para começar.
          </p>
        )}

        {q && catalog && (
          <section aria-live="polite" className="mt-10">
            <p className="text-[16px] text-text-secondary">
              {catalog.total} {catalog.total === 1 ? "resultado" : "resultados"} para{" "}
              <span className="font-semibold">“{q}”</span>
            </p>

            {exact?.matchedSku && (
              <p
                role="status"
                className="mt-4 rounded-[8px] border border-border p-4 text-[15px]"
                style={{ backgroundColor: "var(--feedback-info-bg)" }}
              >
                Referência <span className="font-semibold tabular-nums">{exact.matchedSku}</span>{" "}
                localizada na família{" "}
                <Link
                  to="/produtos/$categorySlug/$familySlug"
                  params={{ categorySlug: exact.categorySlug, familySlug: exact.slug }}
                  search={{ sku: exact.matchedSku }}
                  className="font-semibold underline"
                >
                  {exact.name}
                </Link>
                .
              </p>
            )}

            <div className="mt-6">
              {catalog.items.length === 0 ? (
                <NoResults term={q} categories={facets.categories} />
              ) : (
                <FamilyGrid families={catalog.items} />
              )}
            </div>

            {catalog.pageCount > 1 && (
              <Link
                to="/produtos"
                search={{ q }}
                className="mt-8 inline-flex h-12 items-center rounded-[8px] border border-border px-6 font-semibold hover:bg-surface"
              >
                Ver todos os resultados no catálogo
              </Link>
            )}
          </section>
        )}
      </div>
    </PublicShell>
  );
}
