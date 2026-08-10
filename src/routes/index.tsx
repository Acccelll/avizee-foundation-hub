import { createFileRoute, Link } from "@tanstack/react-router";
import { Boxes, Headset, Zap } from "lucide-react";

import { fetchCatalog, fetchCategories, fetchFacets } from "@/catalog/public/public.functions";
import { PublicShell } from "@/components/public/PublicShell";
import { FamilyGrid } from "@/components/public/catalog/FamilyCard";
import { SearchBox } from "@/components/public/catalog/SearchBox";
import { fetchArticles, type ArticleCardData } from "@/content/public/public.functions";
import { ArticleCard } from "@/components/public/content/ArticleCard";
import {
  CTA,
  DIFFERENTIATORS,
  FEATURED_LIMIT,
  FEATURED_MIN,
  NATIONAL_COVERAGE,
  POSITIONING,
  QUOTATION_STEPS,
} from "@/content/institutional";
import { buildMeta } from "@/seo/meta";

interface HomeCategory {
  slug: string;
  name: string;
  description: string | null;
  familyCount: number;
}

interface HomeApplication {
  slug: string;
  name: string;
  count: number;
}

const DIFF_ICON = { variedade: Boxes, agilidade: Zap, consultivo: Headset } as const;

export const Route = createFileRoute("/")({
  loader: async () => {
    const [categories, facets, catalog, articles] = await Promise.all([
      fetchCategories(),
      fetchFacets(),
      fetchCatalog({ data: { ordem: "category", pagina: 1 } }),
      fetchArticles({ data: { pagina: 1 } }),
    ]);
    return {
      categories,
      applications: facets.applications.slice(0, 6),
      featured: catalog.items.slice(0, FEATURED_LIMIT),
      publishable: catalog.total,
      recentArticles: articles.items.slice(0, 3),
    };
  },
  head: () =>
    buildMeta({
      title: "Equipamentos e soluções para avicultura",
      description:
        "AviZee: equipamentos, componentes, peças de reposição e soluções para avicultura, com atendimento consultivo B2B por lista de cotação em todo o Brasil.",
      canonical: "/",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "AviZee",
          description: POSITIONING.statement,
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "AviZee",
          inLanguage: "pt-BR",
        },
      ],
    }),
  component: Home,
});

function Home() {
  const { categories, applications, featured, publishable, recentArticles } = Route.useLoaderData();
  const showFeatured = publishable >= FEATURED_MIN && featured.length >= FEATURED_MIN;
  const showArticles = recentArticles.length > 0;

  return (
    <PublicShell>
      {/* 1 — Hero + proposta de valor + CTA duplo */}
      <section aria-labelledby="hero" className="container-avizee">
        <div className="max-w-3xl">
          <p className="text-[14px] font-semibold uppercase tracking-widest text-emphasis">
            {POSITIONING.eyebrow}
          </p>
          <h1 id="hero" className="mt-3 text-[36px] font-extrabold leading-tight md:text-[48px]">
            {POSITIONING.headline}
          </h1>
          <p className="mt-5 text-[18px] text-text-secondary">{POSITIONING.statement}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/produtos"
              className="inline-flex h-12 items-center rounded-[8px] bg-primary px-6 font-semibold text-primary-foreground hover:opacity-90"
            >
              {CTA.catalog}
            </Link>
            <Link
              to="/cotacao"
              className="inline-flex h-12 items-center rounded-[8px] border border-border px-6 font-semibold hover:bg-surface"
            >
              {CTA.quote}
            </Link>
          </div>
        </div>
      </section>

      {/* 2 — Busca por nome ou código */}
      <section aria-labelledby="busca-home" className="container-avizee mt-12">
        <h2 id="busca-home" className="sr-only">
          Buscar no catálogo
        </h2>
        <div className="max-w-2xl">
          <SearchBox />
        </div>
      </section>

      {/* 3 — As 6 categorias */}
      <section aria-labelledby="categorias" className="container-avizee mt-16">
        <h2 id="categorias" className="text-[26px] font-bold">
          Nossas categorias
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(categories as HomeCategory[]).map((category) => (
            <li key={category.slug}>
              <Link
                to="/produtos/$categorySlug"
                params={{ categorySlug: category.slug }}
                className="flex h-full flex-col rounded-[12px] border border-border p-5 hover:border-emphasis"
              >
                <span className="text-[18px] font-semibold">{category.name}</span>
                {category.description && (
                  <span className="mt-2 line-clamp-2 text-[15px] text-text-secondary">
                    {category.description}
                  </span>
                )}
                <span className="mt-4 text-[13px] text-text-muted tabular-nums">
                  {category.familyCount} famílias
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 4 — Soluções por necessidade */}
      {applications.length > 0 && (
        <section aria-labelledby="solucoes-home" className="container-avizee mt-16">
          <h2 id="solucoes-home" className="text-[26px] font-bold">
            Soluções por necessidade
          </h2>
          <p className="mt-2 max-w-2xl text-[16px] text-text-secondary">
            Encontre o que costuma ser necessário em cada aplicação da produção avícola.
          </p>
          <ul className="mt-6 flex flex-wrap gap-3">
            {(applications as HomeApplication[]).map((application) => (
              <li key={application.slug}>
                <Link
                  to="/produtos"
                  search={{ aplicacao: application.slug }}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[15px] font-medium hover:border-emphasis"
                >
                  {application.name}
                  <span className="text-[13px] text-text-muted tabular-nums">
                    {application.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/solucoes" className="mt-5 inline-block font-semibold underline">
            Ver todas as soluções
          </Link>
        </section>
      )}

      {/* 5 — Diferenciais */}
      <section aria-labelledby="diferenciais" className="container-avizee mt-16">
        <h2 id="diferenciais" className="text-[26px] font-bold">
          Por que a AviZee
        </h2>
        <ul className="mt-6 grid gap-6 md:grid-cols-3">
          {DIFFERENTIATORS.map((item) => {
            const Icon = DIFF_ICON[item.id];
            return (
              <li key={item.id} className="rounded-[12px] border border-border p-5">
                <Icon aria-hidden="true" className="h-7 w-7 text-emphasis" />
                <h3 className="mt-3 text-[18px] font-semibold">{item.title}</h3>
                <p className="mt-2 text-[15px] text-text-secondary">{item.description}</p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 6 — Famílias em destaque (oculto com menos de 4 famílias publicáveis) */}
      {showFeatured && (
        <section aria-labelledby="destaques" className="container-avizee mt-16">
          <h2 id="destaques" className="text-[26px] font-bold">
            Famílias em destaque
          </h2>
          <div className="mt-6">
            <FamilyGrid families={featured} />
          </div>
        </section>
      )}

      {/* 7 — Como funciona a cotação */}
      <section aria-labelledby="cotacao-home" className="container-avizee mt-16">
        <h2 id="cotacao-home" className="text-[26px] font-bold">
          Como funciona a cotação
        </h2>
        <ol className="mt-6 grid gap-6 md:grid-cols-3">
          {QUOTATION_STEPS.map((step) => (
            <li key={step.step} className="rounded-[12px] border border-border p-5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[16px] font-bold text-primary-foreground tabular-nums">
                {step.step}
              </span>
              <h3 className="mt-3 text-[18px] font-semibold">{step.title}</h3>
              <p className="mt-2 text-[15px] text-text-secondary">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 8 — Conteúdos recentes: só aparece quando houver artigos publicados */}
      {showArticles && (
        <section aria-labelledby="artigos-home" className="container-avizee mt-16">
          <div className="flex items-end justify-between">
            <h2 id="artigos-home" className="text-[26px] font-bold">
              Conteúdos recentes
            </h2>
            <Link to="/conteudos" className="font-semibold underline">
              Ver todos
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentArticles.map((article: ArticleCardData) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* 9 — Atendimento em todo o Brasil */}
      <section
        aria-labelledby="atendimento"
        className="container-avizee mt-16 rounded-[12px] border border-border bg-surface p-8"
      >
        <h2 id="atendimento" className="text-[24px] font-bold">
          {NATIONAL_COVERAGE.title}
        </h2>
        <p className="mt-3 max-w-2xl text-[16px] text-text-secondary">
          {NATIONAL_COVERAGE.description}
        </p>
      </section>

      {/* 10 — CTA final */}
      <section aria-labelledby="cta-final" className="container-avizee mt-16">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-[12px] bg-inverse p-8 text-inverse-foreground">
          <h2 id="cta-final" className="text-[24px] font-bold">
            Pronto para montar sua cotação?
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/cotacao"
              className="inline-flex h-12 items-center rounded-[8px] bg-background px-6 font-semibold text-text-primary hover:opacity-90"
            >
              {CTA.quote}
            </Link>
            <Link
              to="/contato"
              className="inline-flex h-12 items-center rounded-[8px] border border-white/30 px-6 font-semibold hover:bg-white/10"
            >
              {CTA.talk}
            </Link>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
