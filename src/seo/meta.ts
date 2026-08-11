/**
 * SEO estrutural (§30 da Etapa 5).
 * Fora de produção TODA rota recebe noindex; não há exceção configurável.
 */
import { APP_ENV, IS_INDEXABLE, toAbsolutePublicUrl } from "@/lib/env";

const SITE_NAME = "AviZee";
const DEFAULT_TITLE = "AviZee — Soluções para avicultura";
const DEFAULT_DESCRIPTION =
  "Equipamentos, insumos e soluções técnicas para avicultura. Monte sua lista de cotação e fale com a equipe AviZee.";

export interface MetaInput {
  title?: string;
  description?: string;
  canonical?: string;
  /** Marca metadados provisórios de página técnica desta etapa. */
  provisional?: boolean;
  /** Página não indexável por natureza (busca, filtros, fluxos). */
  noindex?: boolean;
  /** Blocos JSON-LD já validados pela regra: sem preço, sem marca de terceiro. */
  jsonLd?: unknown[];
}

type MetaTag = Record<string, string>;
type ScriptTag = { type: string; children: string };

export function buildMeta(input: MetaInput = {}): {
  meta: MetaTag[];
  links: MetaTag[];
  scripts: ScriptTag[];
} {
  const title = input.title ? `${input.title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const description = input.description ?? DEFAULT_DESCRIPTION;
  const indexable = IS_INDEXABLE && !input.noindex;
  const canonicalUrl =
    input.canonical && IS_INDEXABLE ? toAbsolutePublicUrl(input.canonical) : null;

  if (input.canonical && IS_INDEXABLE && !canonicalUrl) {
    throw new Error(
      "VITE_APP_PUBLIC_URL deve ser uma URL HTTP(S) absoluta para gerar canonical em produção.",
    );
  }

  const meta: MetaTag[] = [
    { title },
    { name: "description", content: description },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: "pt_BR" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    {
      name: "robots",
      content: indexable
        ? "index, follow"
        : input.noindex
          ? "noindex, follow"
          : "noindex, nofollow",
    },
  ];

  if (canonicalUrl) {
    meta.push({ property: "og:url", content: canonicalUrl });
  }
  if (!IS_INDEXABLE) {
    meta.push({ name: "x-avizee-environment", content: APP_ENV });
  }
  if (input.provisional) {
    meta.push({ name: "x-avizee-content-status", content: "provisional-stage-05" });
  }

  const links: MetaTag[] = [];
  // Preview/homologação continuam sem canonical. Em produção, páginas noindex
  // (busca/filtros) também recebem canonical para a base aprovada.
  if (canonicalUrl) {
    links.push({ rel: "canonical", href: canonicalUrl });
  }

  const scripts: ScriptTag[] = (input.jsonLd ?? []).map((block) => ({
    type: "application/ld+json",
    children: JSON.stringify(block),
  }));

  return { meta, links, scripts };
}

/** Breadcrumb estrutural — base para JSON-LD nas etapas seguintes. */
export interface Crumb {
  label: string;
  to?: string;
}
