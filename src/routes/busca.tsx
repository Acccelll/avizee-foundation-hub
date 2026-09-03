import { createFileRoute, Link } from "@tanstack/react-router";

import { fetchCatalog, fetchFacets } from "@/catalog/public/public.functions";
import { PublicShell } from "@/components/public/PublicShell";
import { FamilyGrid } from "@/components/public/catalog/FamilyCard";
import { NoResults } from "@/components/public/catalog/NoResults";
import { SearchBox } from "@/components/public/catalog/SearchBox";
import { ArticleGrid } from "@/components/public/content/ArticleCard";
import { fetchArticles } from "@/content/public/public.functions";
import { buildMeta } from "@/seo/meta";

function normalized(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}

export const Route = createFileRoute("/busca")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? search["q"].trim().slice(0, 120) : "",
  }),
  loaderDeps: ({ search }) => ({ q: search.q }),
  loader: async ({ deps }) => {
    const facetsPromise = fetchFacets();
    if (!deps.q) {
      const facets = await facetsPromise;
      return {
        q: "",
        catalog: null,
        content: null,
        solutions: [] as typeof facets.applications,
        facets,
      };
    }

    const contentPromise =
      deps.q.length >= 2
        ? fetchArticles({ data: { q: deps.q, pagina: 1 } })
        : Promise.resolve({ items: [], total: 0, page: 1, pageSize: 9, pageCount: 1 });

    const [facets, catalog, content] = await Promise.all([
      facetsPromise,
      fetchCatalog({ data: { q: deps.q, ordem: "relevance", pagina: 1 } }),
      contentPromise,
    ]);

    const term = normalized(deps.q);
    const solutions =
      term.length >= 2
        ? facets.applications.filter((application) =>
            normalized(`${application.name} ${application.slug}`).includes(term),
          )
        : [];

    return { q: deps.q, catalog, content, solutions, facets };
  },
  head: () =>
    // Página de busca nunca é indexável (doc 106 §5).
    buildMeta({
      title: "Busca",
      description:
        "Busque produtos, soluções por aplicação e conteúdos publicados da AviZee em uma única consulta.",
      noindex: true,
    }),
  component: BuscaPublica,
});

function BuscaPublica() {
  const { q, catalog, content, solutions, facets } = Route.useLoaderData();
  const exact = catalog?.items.find((item: { matchedSku: string | null }) => item.matchedSku);
  const total = (catalog?.total ?? 0) + (content?.total ?? 0) + solutions.length;

  return (
    <PublicShell breadcrumb={[{ label: "Busca" }]}>
      <div className="container-avizee max-w-4xl">
        <h1 className="text-[32px] font-extrabold">Busca</h1>
        <div className="mt-6">
          <SearchBox defaultValue={q} autoFocusOnMount />
        </div>

        {!q && (
          <p className="mt-8 text-[16px] text-text-secondary">
            Digite um nome, uma aplicação, um conteúdo ou uma referência pública (por exemplo,{" "}
            <span className="font-semibold tabular-nums">AG011</span>) para começar.
          </p>
        )}

        {q && catalog && content && (
          <section aria-live="polite" className="mt-10">
            <p className="text-[16px] text-text-secondary">
              {total} {total === 1 ? "resultado" : "resultados"} para{" "}
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

            {total === 0 ? (
              <div className="mt-6">
                <NoResults term={q} categories={facets.categories} />
              </div>
            ) : (
              <div className="mt-8 space-y-12">
                {catalog.items.length > 0 && (
                  <section aria-labelledby="resultados-produtos">
                    <h2 id="resultados-produtos" className="text-[24px] font-bold">
                      Produtos
                    </h2>
                    <p className="mt-2 text-[14px] text-text-muted">
                      {catalog.total}{" "}
                      {catalog.total === 1 ? "família encontrada" : "famílias encontradas"}
                    </p>
                    <div className="mt-6">
                      <FamilyGrid families={catalog.items} />
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

                {solutions.length > 0 && (
                  <section aria-labelledby="resultados-solucoes">
                    <h2 id="resultados-solucoes" className="text-[24px] font-bold">
                      Soluções
                    </h2>
                    <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {solutions.map((application: { slug: string; name: string; count: number }) => (
                        <li key={application.slug}>
                          <Link
                            to="/solucoes/$applicationSlug"
                            params={{ applicationSlug: application.slug }}
                            className="flex h-full flex-col rounded-[12px] border border-border p-5 hover:border-emphasis"
                          >
                            <span className="text-[18px] font-semibold">{application.name}</span>
                            <span className="mt-3 text-[14px] text-text-muted tabular-nums">
                              {application.count} famílias no catálogo
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {content.items.length > 0 && (
                  <section aria-labelledby="resultados-conteudos">
                    <h2 id="resultados-conteudos" className="text-[24px] font-bold">
                      Conteúdos
                    </h2>
                    <p className="mt-2 text-[14px] text-text-muted">
                      {content.total}{" "}
                      {content.total === 1 ? "artigo encontrado" : "artigos encontrados"}
                    </p>
                    <div className="mt-6">
                      <ArticleGrid articles={content.items} />
                    </div>
                    {content.pageCount > 1 && (
                      <Link
                        to="/conteudos"
                        search={{ q }}
                        className="mt-8 inline-flex h-12 items-center rounded-[8px] border border-border px-6 font-semibold hover:bg-surface"
                      >
                        Ver todos os conteúdos encontrados
                      </Link>
                    )}
                  </section>
                )}
              </div>
            )}
          </section>
        )}
      </div>
    </PublicShell>
  );
}
