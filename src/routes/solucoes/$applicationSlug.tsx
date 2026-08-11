import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { fetchCatalog, fetchFacets } from "@/catalog/public/public.functions";
import { PublicShell } from "@/components/public/PublicShell";
import { FamilyGrid } from "@/components/public/catalog/FamilyCard";
import { ArticleGrid } from "@/components/public/content/ArticleCard";
import { CTA } from "@/content/institutional";
import { fetchArticlesForFamilies } from "@/content/public/public.functions";
import { buildMeta } from "@/seo/meta";

async function loadApplicationFamilies(applicationSlug: string) {
  const first = await fetchCatalog({
    data: { aplicacao: applicationSlug, ordem: "category", pagina: 1 },
  });

  if (first.pageCount <= 1) return first.items;

  const remaining = await Promise.all(
    Array.from({ length: first.pageCount - 1 }, (_, index) =>
      fetchCatalog({
        data: { aplicacao: applicationSlug, ordem: "category", pagina: index + 2 },
      }),
    ),
  );

  return [first, ...remaining].flatMap((page) => page.items);
}

export const Route = createFileRoute("/solucoes/$applicationSlug")({
  loader: async ({ params }) => {
    const facets = await fetchFacets();
    const application = facets.applications.find((item) => item.slug === params.applicationSlug);
    if (!application) throw notFound();

    const families = await loadApplicationFamilies(application.slug);
    const articles =
      families.length > 0
        ? await fetchArticlesForFamilies({
            data: { familySlugs: families.map((family) => family.slug), limit: 3 },
          })
        : [];

    return { application, families, articles };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return buildMeta({ title: "Solução não encontrada", noindex: true });

    return buildMeta({
      title: loaderData.application.name,
      description: `Famílias e conteúdos relacionados a ${loaderData.application.name.toLowerCase()} no catálogo técnico AviZee para avicultura.`,
      canonical: `/solucoes/${params.applicationSlug}`,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Início", item: "/" },
            { "@type": "ListItem", position: 2, name: "Soluções", item: "/solucoes" },
            {
              "@type": "ListItem",
              position: 3,
              name: loaderData.application.name,
              item: `/solucoes/${params.applicationSlug}`,
            },
          ],
        },
      ],
    });
  },
  notFoundComponent: SolucaoNaoEncontrada,
  component: SolucaoPorAplicacao,
});

function SolucaoNaoEncontrada() {
  return (
    <PublicShell breadcrumb={[{ label: "Soluções", to: "/solucoes" }, { label: "Solução" }]}>
      <div className="container-avizee max-w-2xl">
        <h1 className="text-h1 font-extrabold">Solução não encontrada</h1>
        <p className="mt-4 text-body-lg text-text-secondary">
          Essa aplicação não existe ou não possui famílias publicadas no catálogo atual.
        </p>
        <Link
          to="/solucoes"
          className="mt-6 inline-flex h-12 items-center rounded-[8px] border border-border px-6 font-semibold hover:bg-surface"
        >
          Ver soluções
        </Link>
      </div>
    </PublicShell>
  );
}

function SolucaoPorAplicacao() {
  const { application, families, articles } = Route.useLoaderData();

  return (
    <PublicShell breadcrumb={[{ label: "Soluções", to: "/solucoes" }, { label: application.name }]}>
      <div className="container-avizee">
        <header className="max-w-3xl">
          <p className="text-body-sm font-semibold uppercase tracking-widest text-emphasis">
            Solução por aplicação
          </p>
          <h1 className="mt-2 text-h1 font-extrabold">{application.name}</h1>
          <p className="mt-5 text-body-lg text-text-secondary">
            As soluções organizam o catálogo pela necessidade da operação, atravessando categorias.
            Nesta página aparecem somente famílias publicadas que já possuem esta aplicação
            associada no catálogo AviZee.
          </p>
          <p className="mt-4 text-body text-text-secondary">
            {families.length}{" "}
            {families.length === 1 ? "família relacionada" : "famílias relacionadas"}.
          </p>
        </header>

        <section aria-labelledby="familias-solucao" className="mt-12">
          <h2 id="familias-solucao" className="text-h2 font-bold">
            O que costuma ser necessário
          </h2>
          <div className="mt-6">
            <FamilyGrid families={families} />
          </div>
        </section>

        {articles.length > 0 && (
          <section aria-labelledby="conteudos-solucao" className="mt-12">
            <h2 id="conteudos-solucao" className="text-h2 font-bold">
              Conteúdos sobre {application.name}
            </h2>
            <div className="mt-6">
              <ArticleGrid articles={articles} />
            </div>
          </section>
        )}

        <section
          aria-labelledby="cta-solucao"
          className="mt-12 flex flex-wrap items-center justify-between gap-6 bg-surface p-8"
        >
          <h2 id="cta-solucao" className="text-h3 font-bold">
            Precisa de orientação técnica?
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/contato"
              className="inline-flex h-12 items-center rounded-[8px] bg-primary px-6 font-semibold text-primary-foreground hover:opacity-90"
            >
              {CTA.talk}
            </Link>
            <Link
              to="/cotacao"
              className="inline-flex h-12 items-center rounded-[8px] border border-border px-6 font-semibold hover:bg-background"
            >
              {CTA.quote}
            </Link>
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
