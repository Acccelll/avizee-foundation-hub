import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ImageOff } from "lucide-react";

import { fetchFamily } from "@/catalog/public/public.functions";
import { PublicShell } from "@/components/public/PublicShell";
import { VariationTable } from "@/components/public/catalog/VariationTable";
import { buildMeta } from "@/seo/meta";

export const Route = createFileRoute("/produtos/$categorySlug/$familySlug")({
  validateSearch: (search: Record<string, unknown>): { sku?: string } => {
    const sku = typeof search["sku"] === "string" ? search["sku"].trim().slice(0, 40) : "";
    return sku ? { sku } : {};
  },
  loader: async ({ params }) => {
    const family = await fetchFamily({
      data: { categorySlug: params.categorySlug, familySlug: params.familySlug },
    });
    if (!family) throw notFound();
    return { family };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return buildMeta({ title: "Produto não encontrado", noindex: true });
    const { family } = loaderData;
    const description =
      family.summary ??
      `${family.name}: ${family.variations.length} variações públicas no catálogo técnico AviZee. Consulte referências e monte sua lista de cotação.`;
    return buildMeta({
      title: `${family.name} | ${family.categoryName}`,
      description: description.slice(0, 158),
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
        <h1 className="text-[32px] font-extrabold">Família não encontrada</h1>
        <p className="mt-4 text-[17px] text-text-secondary">
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
  const { family } = Route.useLoaderData();
  const { sku } = Route.useSearch();

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
                  <span className="max-w-[70%] text-center text-[13px]">{family.image.alt}</span>
                </div>
              ) : (
                <img
                  src={family.image.url}
                  alt={family.image.alt}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </div>

          <div>
            <p className="text-[13px] font-semibold uppercase tracking-widest text-emphasis">
              {family.categoryName}
            </p>
            <h1 className="mt-2 text-[34px] font-extrabold md:text-[40px]">{family.name}</h1>
            {family.summary && (
              <p className="mt-4 text-[18px] text-text-secondary">{family.summary}</p>
            )}
            {family.description && (
              <p className="mt-4 text-[16px] text-text-secondary">{family.description}</p>
            )}

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {family.applications.length > 0 && (
                <div>
                  <dt className="text-[13px] font-semibold uppercase tracking-wide text-text-muted">
                    Aplicações
                  </dt>
                  <dd className="mt-1 text-[16px]">{family.applications.join(" · ")}</dd>
                </div>
              )}
              {family.segments.length > 0 && (
                <div>
                  <dt className="text-[13px] font-semibold uppercase tracking-wide text-text-muted">
                    Segmentos
                  </dt>
                  <dd className="mt-1 text-[16px]">{family.segments.join(" · ")}</dd>
                </div>
              )}
              <div>
                <dt className="text-[13px] font-semibold uppercase tracking-wide text-text-muted">
                  Variações
                </dt>
                <dd className="mt-1 text-[16px] tabular-nums">{family.variations.length}</dd>
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
          <h2 id="variacoes" className="text-[24px] font-bold">
            Variações e referências
          </h2>
          <p className="mt-2 max-w-2xl text-[16px] text-text-secondary">
            Cada linha é uma referência pública da família. Preço, marca e dados de fornecedor não
            são exibidos no site.
          </p>
          <div className="mt-6">
            <VariationTable variations={family.variations} preselected={sku} />
          </div>
        </section>

        {family.related.length > 0 && (
          <section aria-labelledby="relacionados" className="mt-14">
            <h2 id="relacionados" className="text-[24px] font-bold">
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
                      className="flex h-full flex-col rounded-[12px] border border-border p-4 hover:border-emphasis"
                    >
                      <span className="text-[16px] font-semibold">{item.name}</span>
                      <span className="mt-2 text-[14px] text-text-muted tabular-nums">
                        {item.variationCount} variações
                      </span>
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </section>
        )}
      </div>
    </PublicShell>
  );
}
