/**
 * SEO estrutural (§30 da Etapa 5).
 * Fora de produção TODA rota recebe noindex; não há exceção configurável.
 */
import { APP_ENV, IS_INDEXABLE } from "@/lib/env";

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
}

type MetaTag = Record<string, string>;

export function buildMeta(input: MetaInput = {}): { meta: MetaTag[]; links: MetaTag[] } {
  const title = input.title ? `${input.title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const description = input.description ?? DEFAULT_DESCRIPTION;

  const meta: MetaTag[] = [
    { title },
    { name: "description", content: description },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: "pt_BR" },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "robots",
      content: IS_INDEXABLE ? "index, follow" : "noindex, nofollow",
    },
  ];

  if (!IS_INDEXABLE) {
    meta.push({ name: "x-avizee-environment", content: APP_ENV });
  }
  if (input.provisional) {
    meta.push({ name: "x-avizee-content-status", content: "provisional-stage-05" });
  }

  const links: MetaTag[] = [];
  // Canonical só existe quando o ambiente é indexável (evita canonical de preview).
  if (input.canonical && IS_INDEXABLE) {
    links.push({ rel: "canonical", href: input.canonical });
  }

  return { meta, links };
}

/** Breadcrumb estrutural — base para JSON-LD nas etapas seguintes. */
export interface Crumb {
  label: string;
  to?: string;
}
