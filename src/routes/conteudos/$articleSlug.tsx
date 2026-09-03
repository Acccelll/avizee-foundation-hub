import { Link, createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { Clock } from "lucide-react";

import { PublicShell } from "@/components/public/PublicShell";
import { ArticleBlocks } from "@/components/public/content/ArticleBlocks";
import { ArticleGrid, formatArticleDate } from "@/components/public/content/ArticleCard";
import { fetchArticle } from "@/content/public/public.functions";
import { fallbackToOriginalImage, responsiveImageProps } from "@/lib/responsive-image";
import { buildMeta } from "@/seo/meta";

export const Route = createFileRoute("/conteudos/$articleSlug")({
  loader: async ({ params }) => {
    const { article, redirectTo } = await fetchArticle({
      data: { slug: params.articleSlug },
    });
    // Endereço antigo continua funcionando após a troca do slug.
    if (!article && redirectTo) {
      throw redirect({
        to: "/conteudos/$articleSlug",
        params: { articleSlug: redirectTo },
        replace: true,
      });
    }
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    const article = loaderData?.article;
    if (!article) return buildMeta({ title: "Conteúdo", noindex: true });
    return buildMeta({
      title: article.seoTitle ?? article.title,
      description:
        article.seoDescription ?? article.excerpt ?? "Conteúdo técnico AviZee sobre avicultura.",
      canonical: `/conteudos/${article.slug}`,
      noindex: article.noindex,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt ?? undefined,
          articleSection: article.categoryName,
          datePublished: article.publishedAt ?? undefined,
          dateModified: article.revisedAt ?? article.publishedAt ?? undefined,
          inLanguage: "pt-BR",
          author: article.authorName
            ? { "@type": "Person", name: article.authorName }
            : { "@type": "Organization", name: "AviZee" },
          publisher: { "@type": "Organization", name: "AviZee" },
        },
        ...(article.blocks.some((b) => b.type === "faq")
          ? [
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: article.blocks
                  .filter((b): b is Extract<typeof b, { type: "faq" }> => b.type === "faq")
                  .flatMap((b) =>
                    b.items.map((item) => ({
                      "@type": "Question",
                      name: item.question,
                      acceptedAnswer: { "@type": "Answer", text: item.answer },
                    })),
                  ),
              },
            ]
          : []),
      ],
    });
  },
  component: ArtigoPublico,
});

function ArtigoPublico() {
  const { article } = Route.useLoaderData();
  const published = formatArticleDate(article.publishedAt);
  const coverProps = article.cover
    ? responsiveImageProps(article.cover.url, {
        widths: [480, 640, 768, 960, 1200],
        sizes: "(min-width: 768px) 768px, 100vw",
      })
    : {};

  return (
    <PublicShell
      breadcrumb={[
        { label: "Conteúdos", to: "/conteudos" },
        { label: article.categoryName, to: "/conteudos" },
        { label: article.title },
      ]}
    >
      <article className="container-avizee max-w-3xl">
        <p className="text-body-sm font-semibold uppercase tracking-wide text-text-muted">
          <Link to="/conteudos/categoria/$slug" params={{ slug: article.categorySlug }}>
            {article.categoryName}
          </Link>
        </p>

        <h1 className="mt-3 text-h1 font-extrabold leading-tight">{article.title}</h1>
        {article.subtitle && (
          <p className="mt-3 text-body-lg text-text-secondary">{article.subtitle}</p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-4 text-body-sm text-text-muted">
          {article.authorName && (
            <span>
              Por {article.authorName}
              {article.authorRole && ` · ${article.authorRole}`}
            </span>
          )}
          {published && <time dateTime={article.publishedAt ?? undefined}>{published}</time>}
          <span className="inline-flex items-center gap-1">
            <Clock aria-hidden="true" className="h-4 w-4" />
            {article.readingMinutes} min de leitura
          </span>
        </div>

        {article.cover && (
          <img
            src={article.cover.url}
            srcSet={coverProps.srcSet}
            sizes={coverProps.sizes}
            alt={article.cover.alt}
            width={1200}
            height={675}
            fetchPriority="high"
            onError={(event) => fallbackToOriginalImage(event, article.cover!.url)}
            className="mt-8 w-full rounded-[12px] border border-border-subtle"
          />
        )}

        <ArticleBlocks blocks={article.blocks} />

        {article.references.length > 0 && (
          <section aria-labelledby="referencias" className="mt-12">
            <h2 id="referencias" className="text-h3 font-bold">
              Referências consultadas
            </h2>
            <ul className="mt-4 space-y-2 text-body-sm text-text-secondary">
              {article.references.map(
                (
                  reference: { label: string; url: string | null; note: string | null },
                  index: number,
                ) => (
                  <li key={index}>
                    {reference.url ? (
                      <a
                        href={reference.url}
                        rel="noopener noreferrer nofollow"
                        target="_blank"
                        className="underline hover:text-emphasis"
                      >
                        {reference.label}
                      </a>
                    ) : (
                      reference.label
                    )}
                    {reference.note && <span className="text-text-muted"> — {reference.note}</span>}
                  </li>
                ),
              )}
            </ul>
          </section>
        )}

        {article.relatedFamilies.length > 0 && (
          <section aria-labelledby="familias" className="mt-12">
            <h2 id="familias" className="text-h3 font-bold">
              Produtos relacionados
            </h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {article.relatedFamilies.map(
                (family: {
                  slug: string;
                  name: string;
                  summary: string | null;
                  categorySlug: string;
                  categoryName: string;
                }) => (
                  <li key={family.slug}>
                    <Link
                      to="/produtos/$categorySlug/$familySlug"
                      params={{ categorySlug: family.categorySlug, familySlug: family.slug }}
                      className="brand-interactive block h-full rounded-[12px] border border-border p-4"
                    >
                      <span className="text-caption uppercase tracking-wide text-text-muted">
                        {family.categoryName}
                      </span>
                      <span className="mt-1 block text-h4 font-bold">{family.name}</span>
                      {family.summary && (
                        <span className="mt-1 block line-clamp-2 text-body-sm text-text-secondary">
                          {family.summary}
                        </span>
                      )}
                    </Link>
                  </li>
                ),
              )}
            </ul>
            <Link
              to="/cotacao"
              className="mt-5 inline-flex h-11 items-center rounded-[8px] bg-primary px-5 text-body-sm font-semibold text-primary-foreground"
            >
              Solicitar cotação
            </Link>
          </section>
        )}

        {article.relatedArticles.length > 0 && (
          <section aria-labelledby="relacionados" className="mt-14">
            <h2 id="relacionados" className="text-h3 font-bold">
              Leia também
            </h2>
            <div className="mt-4">
              <ArticleGrid articles={article.relatedArticles} />
            </div>
          </section>
        )}
      </article>
    </PublicShell>
  );
}
