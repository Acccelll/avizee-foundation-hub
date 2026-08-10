import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { autocomplete, catalogFacets } from "@/catalog/public/read.server";
import { listArticles, type ArticleCardData } from "@/content/public/read.server";

export type GlobalSuggestion =
  | {
      kind: "sku" | "family";
      label: string;
      sublabel: string | null;
      familySlug: string;
      sku: string | null;
    }
  | {
      kind: "solution";
      label: string;
      sublabel: string;
      applicationSlug: string;
    }
  | {
      kind: "content";
      label: string;
      sublabel: string;
      articleSlug: string;
    };

function normalized(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}

export const fetchGlobalSuggestions = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ q: z.string().trim().min(2).max(80) }).parse(input),
  )
  .handler(async ({ data }) => {
    const [catalog, facets, content] = await Promise.all([
      autocomplete(data.q),
      catalogFacets(),
      listArticles({ q: data.q, pagina: 1 }),
    ]);

    const term = normalized(data.q);
    const productSuggestions: GlobalSuggestion[] = catalog.suggestions.slice(0, 4).map((item) => ({
      kind: item.kind,
      label: item.label,
      sublabel: item.sublabel,
      familySlug: item.familySlug,
      sku: item.sku,
    }));

    const solutionSuggestions: GlobalSuggestion[] = facets.applications
      .filter((application) => normalized(`${application.name} ${application.slug}`).includes(term))
      .slice(0, 2)
      .map((application) => ({
        kind: "solution" as const,
        label: application.name,
        sublabel: "Solução",
        applicationSlug: application.slug,
      }));

    const contentSuggestions: GlobalSuggestion[] = content.items
      .slice(0, 2)
      .map((article: ArticleCardData) => ({
        kind: "content" as const,
        label: article.title,
        sublabel: article.categoryName,
        articleSlug: article.slug,
      }));

    return {
      suggestions: [...productSuggestions, ...solutionSuggestions, ...contentSuggestions],
    };
  });
