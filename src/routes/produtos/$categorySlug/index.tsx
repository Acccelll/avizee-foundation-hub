import { createFileRoute, notFound } from "@tanstack/react-router";

import { fetchCatalog, fetchCategory } from "@/catalog/public/public.functions";
import { PublicShell } from "@/components/public/PublicShell";
import { FamilyGrid } from "@/components/public/catalog/FamilyCard";
import { buildMeta } from "@/seo/meta";

export const Route = createFileRoute("/produtos/$categorySlug/")({
  loader: async ({ params }) => {
    const category = await fetchCategory({ data: { slug: params.categorySlug } });
    if (!category) throw notFound();
    const catalog = await fetchCatalog({
      data: { categoria: params.categorySlug, ordem: "name", pagina: 1 },
    });
    return { category, catalog };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return buildMeta({ title: "Categoria não encontrada", noindex: true });
    }
    const { category } = loaderData;
    return buildMeta({
      title: `${category.name}`,
      description:
        category.description ??
        `Famílias de ${category.name.toLowerCase()} do catálogo técnico AviZee para avicultura. Consulte as variações e monte sua lista de cotação.`,
      canonical: `/produtos/${params.categorySlug}`,
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
              name: category.name,
              item: `/produtos/${params.categorySlug}`,
            },
          ],
        },
      ],
    });
  },
  notFoundComponent: CategoriaNaoEncontrada,
  component: CategoriaPublica,
});

function CategoriaNaoEncontrada() {
  return (
    <PublicShell breadcrumb={[{ label: "Produtos", to: "/produtos" }, { label: "Categoria" }]}>
      <div className="container-avizee max-w-2xl">
        <h1 className="text-h1 font-extrabold">Categoria não encontrada</h1>
        <p className="mt-4 text-body-lg text-text-secondary">
          Essa categoria não existe ou não está publicada. Volte ao catálogo para ver as categorias
          disponíveis.
        </p>
      </div>
    </PublicShell>
  );
}

function CategoriaPublica() {
  const { category, catalog } = Route.useLoaderData();

  return (
    <PublicShell breadcrumb={[{ label: "Produtos", to: "/produtos" }, { label: category.name }]}>
      <div className="container-avizee">
        <header className="max-w-3xl">
          <p className="text-body-sm font-semibold uppercase tracking-widest text-emphasis">
            Categoria
          </p>
          <h1 className="mt-2 text-h1 font-extrabold">{category.name}</h1>
          {category.description && (
            <p className="mt-4 text-body-lg text-text-secondary">{category.description}</p>
          )}
          <p className="mt-4 text-body text-text-secondary">
            {category.familyCount} famílias · {category.productCount} referências públicas.
          </p>
        </header>

        <section aria-label={`Famílias de ${category.name}`} className="mt-10">
          <FamilyGrid families={catalog.items} />
        </section>
      </div>
    </PublicShell>
  );
}
