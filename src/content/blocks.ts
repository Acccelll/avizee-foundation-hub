/**
 * Editor estruturado por blocos (Etapa 10).
 *
 * Decisão de arquitetura: o conteúdo NÃO é HTML arbitrário. Cada artigo é uma
 * lista fechada de blocos tipados, validados e higienizados no servidor antes
 * de qualquer gravação. Isso elimina a superfície de XSS por construção e
 * mantém a renderização pública 100% em componentes React.
 *
 * Regras aplicadas: R-03 (sem preço), R-05 (sem marca de terceiro em campo
 * público), R-11 (sem promessa logística) e WCAG 2.2 AA (imagem exige texto
 * alternativo; tabela exige cabeçalho).
 */
import { z } from "zod";

import { checkBrandTerms } from "@/catalog/brand-terms";

/** Tipos de bloco permitidos. Qualquer outro valor é rejeitado. */
export const BLOCK_TYPES = [
  "heading",
  "paragraph",
  "list",
  "quote",
  "image",
  "callout",
  "table",
  "faq",
  "product_relation",
  "divider",
] as const;

export type BlockType = (typeof BLOCK_TYPES)[number];

/* ------------------------------------------------------------------ */
/* Higienização de texto                                               */
/* ------------------------------------------------------------------ */

/**
 * Remove marcação, entidades perigosas e controle invisível.
 * Nunca produz HTML: o texto sai como texto puro e é renderizado como texto.
 */
export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/&(?:#x?[0-9a-f]+|[a-z]+);/gi, " ")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .trim();
}

const SAFE_URL = /^https:\/\/[^\s<>"']+$/i;

/** Só URL https absoluta. `javascript:`, `data:` e relativa são rejeitadas. */
export function sanitizeUrl(input: string | null | undefined): string | null {
  if (!input) return null;
  const value = input.trim();
  return SAFE_URL.test(value) ? value : null;
}

const text = (max: number) =>
  z
    .string()
    .transform(sanitizeText)
    .pipe(z.string().min(1).max(max));

const optionalText = (max: number) =>
  z
    .string()
    .transform(sanitizeText)
    .pipe(z.string().max(max))
    .transform((v) => (v.length === 0 ? null : v))
    .nullable()
    .optional();

/* ------------------------------------------------------------------ */
/* Esquema dos blocos                                                  */
/* ------------------------------------------------------------------ */

const headingBlock = z.object({
  type: z.literal("heading"),
  // H1 é sempre o título do artigo: o corpo começa em H2 (hierarquia WCAG).
  level: z.union([z.literal(2), z.literal(3)]),
  text: text(160),
});

const paragraphBlock = z.object({
  type: z.literal("paragraph"),
  text: text(2000),
});

const listBlock = z.object({
  type: z.literal("list"),
  ordered: z.boolean().default(false),
  items: z.array(text(500)).min(1).max(30),
});

const quoteBlock = z.object({
  type: z.literal("quote"),
  text: text(600),
  attribution: optionalText(160),
});

const imageBlock = z.object({
  type: z.literal("image"),
  mediaId: z.string().uuid().nullable().optional(),
  url: z
    .string()
    .transform((v) => sanitizeUrl(v))
    .nullable()
    .optional(),
  // Acessibilidade obrigatória: sem texto alternativo o bloco não é aceito.
  alt: text(300),
  caption: optionalText(300),
  credit: optionalText(160),
});

const calloutBlock = z.object({
  type: z.literal("callout"),
  tone: z.enum(["info", "warning"]).default("info"),
  title: optionalText(120),
  text: text(800),
});

const tableBlock = z.object({
  type: z.literal("table"),
  caption: optionalText(200),
  headers: z.array(text(80)).min(1).max(6),
  rows: z.array(z.array(text(200)).min(1).max(6)).min(1).max(40),
});

const faqBlock = z.object({
  type: z.literal("faq"),
  items: z
    .array(z.object({ question: text(200), answer: text(1200) }))
    .min(1)
    .max(15),
});

/** Relação com o catálogo: guarda apenas o slug público da família. */
const productRelationBlock = z.object({
  type: z.literal("product_relation"),
  familySlug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]{3,160}$/, "slug inválido"),
  note: optionalText(300),
});

const dividerBlock = z.object({ type: z.literal("divider") });

export const blockSchema = z.discriminatedUnion("type", [
  headingBlock,
  paragraphBlock,
  listBlock,
  quoteBlock,
  imageBlock,
  calloutBlock,
  tableBlock,
  faqBlock,
  productRelationBlock,
  dividerBlock,
]);

export const blocksSchema = z.array(blockSchema).max(200);

export type ContentBlock = z.infer<typeof blockSchema>;

/* ------------------------------------------------------------------ */
/* Utilidades derivadas                                                */
/* ------------------------------------------------------------------ */

/** Texto corrido do artigo — base para leitura, resumo e verificação de marca. */
export function blocksToPlainText(blocks: ContentBlock[]): string {
  const parts: string[] = [];
  for (const block of blocks) {
    switch (block.type) {
      case "heading":
      case "paragraph":
        parts.push(block.text);
        break;
      case "quote":
        parts.push(block.text, block.attribution ?? "");
        break;
      case "list":
        parts.push(...block.items);
        break;
      case "callout":
        parts.push(block.title ?? "", block.text);
        break;
      case "image":
        parts.push(block.alt, block.caption ?? "", block.credit ?? "");
        break;
      case "table":
        parts.push(block.caption ?? "", ...block.headers, ...block.rows.flat());
        break;
      case "faq":
        for (const item of block.items) parts.push(item.question, item.answer);
        break;
      case "product_relation":
        parts.push(block.note ?? "");
        break;
      default:
        break;
    }
  }
  return parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

/** Tempo de leitura em minutos (200 palavras/min, mínimo 1). */
export function readingMinutes(blocks: ContentBlock[]): number {
  const words = blocksToPlainText(blocks).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Slugs de família citados pelos blocos — usados para materializar a relação. */
export function relatedFamilySlugs(blocks: ContentBlock[]): string[] {
  return [
    ...new Set(
      blocks
        .filter((b): b is Extract<ContentBlock, { type: "product_relation" }> =>
          b.type === "product_relation",
        )
        .map((b) => b.familySlug),
    ),
  ];
}

/** Vocabulário proibido em conteúdo público (R-03, R-11 e e-commerce). */
export const FORBIDDEN_CONTENT_TERMS = [
  "comprar",
  "carrinho",
  "checkout",
  "finalizar compra",
  "preço",
  "preco",
  "r$",
  "frete grátis",
  "frete gratis",
  "entrega em 24h",
  "pronta entrega",
  "estoque disponível",
  "estoque disponivel",
  "promoção",
  "promocao",
  "desconto",
] as const;

export interface ContentIssue {
  code: "BRAND_TERM" | "FORBIDDEN_TERM" | "STRUCTURE";
  detail: string;
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/**
 * Conformidade editorial: marca de terceiro, vocabulário proibido e estrutura
 * mínima. Retorna a lista de problemas — vazio significa apto a publicar.
 */
export function checkContentCompliance(input: {
  title: string;
  excerpt?: string | null;
  blocks: ContentBlock[];
}): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const corpus = [input.title, input.excerpt ?? "", blocksToPlainText(input.blocks)].join(" ");

  const brand = checkBrandTerms(corpus);
  if (!brand.clean) {
    issues.push({ code: "BRAND_TERM", detail: brand.matches.join(", ") });
  }

  const haystack = normalize(corpus);
  const forbidden = FORBIDDEN_CONTENT_TERMS.filter((term) => haystack.includes(normalize(term)));
  if (forbidden.length > 0) {
    issues.push({ code: "FORBIDDEN_TERM", detail: forbidden.join(", ") });
  }

  if (input.blocks.length === 0) {
    issues.push({ code: "STRUCTURE", detail: "artigo sem blocos" });
  }
  if (!input.blocks.some((b) => b.type === "paragraph")) {
    issues.push({ code: "STRUCTURE", detail: "artigo sem parágrafo de texto" });
  }
  const headingJump = input.blocks.some(
    (b, index) =>
      b.type === "heading" &&
      b.level === 3 &&
      !input.blocks.slice(0, index).some((p) => p.type === "heading" && p.level === 2),
  );
  if (headingJump) {
    issues.push({ code: "STRUCTURE", detail: "H3 antes de qualquer H2 (hierarquia inválida)" });
  }

  return issues;
}

/** Normaliza um slug público de artigo. */
export function slugify(value: string): string {
  return normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160);
}
