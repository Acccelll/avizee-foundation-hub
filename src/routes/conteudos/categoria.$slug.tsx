import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { PublicShell } from "@/components/public/PublicShell";
import { ArticleGrid } from "@/components/public/content/ArticleCard";
import {
  fetchArticles,
  fetchContentCategories,
  fetchContentCategory,
} from "@/content/public/public.functions";
import { buildMeta } from "@/seo/meta";

export const Route = createFileRoute("/conteudos/categoria/$slug")({
  loader: async ({ params }) => {
    const [category, list, categories] = await Promise.all([
      fetchContentCategory({ data: { slug: params.slug } }),
      fetchArticles({ data: { categoria: params.slug } }),
      fetchContentCategories(),
    ]);
    if (!category) throw notFound();
    return { category, list, categories };
  },
  head: ({ loaderData }) => {
    const category = loaderData?.category;
    return buildMeta({
      title: category ? `${category.name} — Conteúdos` : "Categoria editorial",
      description:
        category?.description ??
        "Conteúdo técnico AviZee para avicultura, organizado por categoria editorial.",
      ...(category ? { canonical: `/conteudos/categoria/${category.slug}` } : {}),
      noindex: (category?.articleCount ?? 0) === 0,
    });
  },

  component: CategoriaEditorial,
});

function CategoriaEditorial() {
  const { category, list, categories } = Route.useLoaderData();

  return (
    <PublicShell breadcrumb={[{ label: "Conteúdos", to: "/conteudos" }, { label: category.name }]}>
      <div className="container-avizee">
        <header className="max-w-3xl">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-text-muted">
            Categoria editorial
          </p>
          <h1 className="mt-2 text-[34px] font-extrabold">{category.name}</h1>
          {category.description && (
            <p className="mt-3 text-[17px] text-text-secondary">{category.description}</p>
          )}
        </header>

        <nav aria-label="Outras categorias" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {categories.map((item: { slug: string; name: string }) => (
              <li key={item.slug}>
                <Link
                  to="/conteudos/categoria/$slug"
                  params={{ slug: item.slug }}
                  className={`inline-flex h-10 items-center rounded-full border px-4 text-[14px] ${
                    item.slug === category.slug
                      ? "border-emphasis text-emphasis"
                      : "border-border text-text-secondary hover:border-emphasis"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <section aria-label={`Artigos de ${category.name}`} className="mt-10">
          {list.items.length === 0 ? (
            <p className="rounded-[12px] border border-border p-8 text-center text-[16px] text-text-secondary">
              Ainda não há conteúdo publicado nesta categoria.
            </p>
          ) : (
            <ArticleGrid articles={list.items} />
          )}
        </section>
      </div>
    </PublicShell>
  );
}
