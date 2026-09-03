import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ImageOff } from "lucide-react";

import { fetchFamily } from "@/catalog/public/public.functions";
import { fetchArticlesForFamily, type ArticleCardData } from "@/content/public/public.functions";
import { ArticleCard } from "@/components/public/content/ArticleCard";
import { PublicShell } from "@/components/public/PublicShell";
import { VariationTable } from "@/components/public/catalog/VariationTable";
import { fallbackToOriginalImage, responsiveImageProps } from "@/lib/responsive-image";
import { buildMeta } from "@/seo/meta";

const FAMILY_META_TITLE_MAX = 51;
const FAMILY_META_DESCRIPTION_MIN = 140;
const FAMILY_META_DESCRIPTION_MAX = 160;

function normalizeSeoText(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function truncateSeoText(value: string, maxLength: number, preferredMin = 0): string {
  const normalized = normalizeSeoText(value);
  if (normalized.length <= maxLength) return normalized;

  const candidate = normalized.slice(0, maxLength - 1);
  const wordBoundary = candidate.lastIndexOf(" ");
  const cutoff = wordBoundary >= preferredMin ? wordBoundary : maxLength - 1;
  return `${candidate.slice(0, cutoff).trimEnd()}…`;
}

function familySeoTitle(name: string): string {
  return truncateSeoText(name, FAMILY_META_TITLE_MAX, 35);
}

function familySeoDescription(family: {
  name: string;
  categoryName: string;
  summary: string | null;
}): string {
  const summary = family.summary ? normalizeSeoText(family.summary) : "";
  if (summary.length >= FAMILY_META_DESCRIPTION_MIN) {
    return truncateSeoText(summary, FAMILY_META_DESCRIPTION_MAX, FAMILY_META_DESCRIPTION_MIN);
  }

  const generated = `${family.name}: consulte variações, referências e especificações técnicas de ${family.categoryName.toLowerCase()} para avicultura e monte sua lista de cotação. Atendimento consultivo B2B da AviZee em todo o Brasil.`;
  const expanded =
    generated.length >= FAMILY_META_DESCRIPTION_MIN
      ? generated
      : `${generated} Consulte condições e especificações com nossa equipe.`;

  return truncateSeoText(expanded, FAMILY_META_DESCRIPTION_MAX, FAMILY_META_DESCRIPTION_MIN);
}

export const Route = createFileRoute("/produtos/$categorySlug/$familySlug")({
  validateSearch: (search: Record<string, unknown>): { sku?: string } => {
    const sku = typeof search["sku"] === "string" ? search["sku"].trim().slice(0, 40) : "";
    return sku ? { sku } : {};
  },
  loader: async ({ params }) => {
    const [family, articles] = await Promise.all([
      fetchFamily({
        data: { categorySlug: params.categorySlug, familySlug: params.familySlug },
      }),
      fetchArticlesForFamily({ data: { familySlug: params.familySlug } }),
    ]);
    if (!family) throw notFound();
    return { family, articles };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return buildMeta({ title: "Produto não encontrado", noindex: true });
    const { family } = loaderData;
    return buildMeta({
      title: familySeoTitle(family.name),
      description: familySeoDescription(family),
      canonical: `/produtos/${params.categorySlug}/${params.familySlug}`,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Início", item: "/" },
            { "@type": "ListItem", position: 2, name: "Produtos", item: "/produtos" },
            {
              "@type": "ListItem",
              position: 3,
              name: family.categoryName,
              item: `/produtos/${params.categorySlug}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: family.name,
              item: `/produtos/${params.categorySlug}/${params.familySlug}`,
            },
          ],
        },
        {
          // Product SEM `offers` e SEM marca de terceiro (doc 100 §3 / R-04 / R-05).
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: family.name,
          numberOfItems: family.variations.length,
          itemListElement: family.variations.map((variation, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Product",
              name: variation.name,
              sku: variation.sku,
              category: family.categoryName,
            },
          })),
        },
      ],
    });
  },
  notFoundComponent: FamiliaNaoEncontrada,
  component: FamiliaPublica,
});

function FamiliaNaoEncontrada() {
  return (
    <PublicShell breadcrumb={[{ label: "Produtos", to: "/produtos" }, { label: "Família" }]}>
      <div className="container-avizee max-w-2xl">
        <h1 className="text-h1 font-extrabold">Família não encontrada</h1>
        <p className="mt-4 text-body-lg text-text-secondary">
          Essa página não está publicada. Consulte o catálogo para ver as famílias disponíveis.
        </p>
        <Link
          to="/produtos"
          className="mt-6 inline-flex h-12 items-center rounded-[8px] bg-primary px-6 font-semibold text-primary-foreground"
        >
          Ir para o catálogo
        </Link>
      </div>
    </PublicShell>
  );
}

function FamiliaPublica() {
  const { family, articles } = Route.useLoaderData();
  const { sku } = Route.useSearch();
  const imageProps = responsiveImageProps(family.image.url, {
    widths: [320, 480, 640, 800, 1200],
    sizes: "(min-width: 1024px) 420px, 100vw",
  });

  return (
    <PublicShell
      breadcrumb={[
        { label: "Produtos", to: "/produtos" },
        { label: family.categoryName, to: `/produtos/${family.categorySlug}` },
        { label: family.name },
      ]}
    >
      <div className="container-avizee">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,420px)_1fr]">
          <div className="overflow-hidden rounded-[12px] border border-border bg-surface">
            <div className="aspect-4/3">
              {family.image.is_placeholder ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-text-muted">
                  <ImageOff aria-hidden="true" className="h-10 w-10" />
                  <span className="max-w-[70%] text-center text-body-sm">{family.image.alt}</span>
                </div>
              ) : (
                <img
                  src={family.image.url}
                  srcSet={imageProps.srcSet}
                  sizes={imageProps.sizes}
                  alt={family.image.alt}
                  width={800}
                  height={600}
                  fetchPriority="high"
                  onError={(event) => fallbackToOriginalImage(event, family.image.url)}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </div>

          <div>
            <p className="text-body-sm font-semibold uppercase tracking-widest text-emphasis">
              {family.categoryName}
            </p>
            <h1 className="mt-2 text-h1 font-extrabold">{family.name}</h1>
            {family.summary && (
              <p className="mt-4 text-body-lg text-text-secondary">{family.summary}</p>
            )}
            {family.description && (
              <p className="mt-4 text-body text-text-secondary">{family.description}</p>
            )}

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {family.applications.length > 0 && (
                <div>
                  <dt className="text-body-sm font-semibold uppercase tracking-wide text-text-muted">
                    Aplicações
                  </dt>
                  <dd className="mt-1 text-body">{family.applications.join(" · ")}</dd>
                </div>
              )}
              {family.segments.length > 0 && (
                <div>
                  <dt className="text-body-sm font-semibold uppercase tracking-wide text-text-muted">
                    Segmentos
                  </dt>
                  <dd className="mt-1 text-body">{family.segments.join(" · ")}</dd>
                </div>
              )}
              <div>
                <dt className="text-body-sm font-semibold uppercase tracking-wide text-text-muted">
                  Variações
                </dt>
                <dd className="mt-1 text-body tabular-nums">{family.variations.length}</dd>
              </div>
            </dl>

            <Link
              to="/cotacao"
              className="mt-8 inline-flex h-12 items-center rounded-[8px] bg-primary px-6 font-semibold text-primary-foreground hover:opacity-90"
            >
              Solicitar cotação desta família
            </Link>
          </div>
        </div>

        <section aria-labelledby="variacoes" className="mt-14">
          <h2 id="variacoes" className="text-h2 font-bold">
            Variações e referências
          </h2>
          <p className="mt-2 max-w-2xl text-body text-text-secondary">
            Cada linha é uma referência pública da família. Preço, marca e dados de fornecedor não
            são exibidos no site.
          </p>
          <div className="mt-6">
            <VariationTable
              variations={family.variations}
              preselected={sku}
              familyName={family.name}
              familySlug={family.slug}
              categorySlug={family.categorySlug}
            />
          </div>
        </section>

        {family.related.length > 0 && (
          <section aria-labelledby="relacionados" className="mt-14">
            <h2 id="relacionados" className="text-h2 font-bold">
              Outras famílias em {family.categoryName}
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {family.related.map(
                (item: {
                  slug: string;
                  name: string;
                  summary: string | null;
                  categorySlug: string;
                  variationCount: number;
                }) => (
                  <li key={item.slug}>
                    <Link
                      to="/produtos/$categorySlug/$familySlug"
                      params={{ categorySlug: item.categorySlug, familySlug: item.slug }}
                      className="brand-interactive flex h-full flex-col rounded-[12px] border border-border p-4"
                    >
                      <span className="text-body font-semibold">{item.name}</span>
                      <span className="mt-2 text-body-sm text-text-muted tabular-nums">
                        {item.variationCount} variações
                      </span>
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </section>
        )}

        {articles.length > 0 && (
          <section aria-labelledby="artigos-relacionados" className="mt-14 mb-14">
            <h2 id="artigos-relacionados" className="text-h2 font-bold">
              Conteúdos relacionados
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article: ArticleCardData) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PublicShell>
  );
}
