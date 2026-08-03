import { Link, createFileRoute } from "@tanstack/react-router";

import { PublicShell } from "@/components/public/PublicShell";
import { ArticleGrid } from "@/components/public/content/ArticleCard";
import { fetchArticles, fetchContentCategories } from "@/content/public/public.functions";
import { buildMeta } from "@/seo/meta";

export interface ContentSearch {
  q?: string | undefined;
  categoria?: string | undefined;
  pagina?: number | undefined;
}

function str(value: unknown): string | undefined {
  const raw = typeof value === "string" ? value.trim() : "";
  return raw.length > 0 ? raw.slice(0, 120) : undefined;
}

export const Route = createFileRoute("/conteudos/")({
  validateSearch: (search: Record<string, unknown>): ContentSearch => {
    const pagina = Number(search["pagina"]);
    return {
      q: str(search["q"]),
      categoria: str(search["categoria"]),
      pagina: Number.isFinite(pagina) && pagina > 1 ? Math.min(200, Math.floor(pagina)) : undefined,
    };
  },
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const [list, categories] = await Promise.all([
      fetchArticles({ data: deps }),
      fetchContentCategories(),
    ]);
    return { list, categories, search: deps };
  },
  head: ({ loaderData }) => {
    const filtered = Boolean(loaderData?.search.q || loaderData?.search.categoria);
    return buildMeta({
      title: "Central de Conteúdos técnicos para avicultura",
      description:
        "Guias, boas práticas, manejo e manutenção de equipamentos: conteúdo técnico AviZee organizado em sete categorias editoriais.",
      canonical: "/conteudos",
      noindex: filtered,
    });
  },
  component: CentralDeConteudos,
});

function CentralDeConteudos() {
  const { list, categories, search } = Route.useLoaderData();
  const active = search.categoria ?? null;

  return (
    <PublicShell breadcrumb={[{ label: "Conteúdos" }]}>
      <div className="container-avizee">
        <header className="max-w-3xl">
          <h1 className="text-[34px] font-extrabold">Central de Conteúdos</h1>
          <p className="mt-3 text-[17px] text-text-secondary">
            Material técnico sobre avicultura, produzido e revisado pela equipe AviZee e
            relacionado às famílias do catálogo.
          </p>
        </header>

        <nav aria-label="Categorias editoriais" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link
                to="/conteudos"
                search={{}}
                className={`inline-flex h-10 items-center rounded-full border px-4 text-[14px] ${
                  active ? "border-border text-text-secondary" : "border-emphasis text-emphasis"
                }`}
              >
                Todas
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  to="/conteudos/categoria/$slug"
                  params={{ slug: category.slug }}
                  className="inline-flex h-10 items-center rounded-full border border-border px-4 text-[14px] text-text-secondary hover:border-emphasis"
                >
                  {category.name}
                  <span className="ml-2 text-text-muted">{category.articleCount}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <section aria-label="Artigos publicados" className="mt-10">
          {list.items.length === 0 ? (
            <div className="rounded-[12px] border border-border p-8 text-center">
              <p className="text-[17px] font-semibold">Nenhum conteúdo publicado ainda</p>
              <p className="mt-2 text-[15px] text-text-secondary">
                A Central está ativa e os primeiros materiais serão publicados após a revisão
                técnica e editorial.
              </p>
              <Link
                to="/produtos"
                className="mt-5 inline-flex h-11 items-center rounded-[8px] bg-primary px-5 text-[15px] font-semibold text-primary-foreground"
              >
                Conhecer produtos
              </Link>
            </div>
          ) : (
            <ArticleGrid articles={list.items} />
          )}
        </section>
      </div>
    </PublicShell>
  );
}
