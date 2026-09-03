import { Link } from "@tanstack/react-router";
import { Clock, FileText } from "lucide-react";

import type { ArticleCardData } from "@/content/public/read.server";

export function formatArticleDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "UTC" }).format(date);
}

/** Cartão de artigo da Central de Conteúdos. Sem preço e sem marca (R-03/R-05). */
export function ArticleCard({ article }: { article: ArticleCardData }) {
  const published = formatArticleDate(article.publishedAt);

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-[12px] border border-border bg-background transition hover:border-emphasis">
      <div className="relative aspect-16/9 bg-surface">
        {article.cover ? (
          <img
            src={article.cover.url}
            alt={article.cover.alt}
            width={960}
            height={540}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-text-muted">
            <FileText aria-hidden="true" className="h-8 w-8" />
            <span className="px-4 text-center text-[12px]">Imagem em atualização</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-text-muted">
          {article.categoryName}
        </p>

        <h3 className="text-[19px] font-bold leading-snug">
          <Link
            to="/conteudos/$articleSlug"
            params={{ articleSlug: article.slug }}
            className="after:absolute after:inset-0 hover:underline"
          >
            {article.title}
          </Link>
        </h3>

        {article.excerpt && (
          <p className="line-clamp-3 text-[15px] text-text-secondary">{article.excerpt}</p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-2 text-[13px] text-text-muted">
          {published && <time dateTime={article.publishedAt ?? undefined}>{published}</time>}
          <span className="inline-flex items-center gap-1">
            <Clock aria-hidden="true" className="h-4 w-4" />
            {article.readingMinutes} min de leitura
          </span>
        </div>
      </div>
    </article>
  );
}

export function ArticleGrid({ articles }: { articles: ArticleCardData[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <li key={article.slug}>
          <ArticleCard article={article} />
        </li>
      ))}
    </ul>
  );
}
