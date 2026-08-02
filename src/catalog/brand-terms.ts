/**
 * Termos de marca de terceiros identificados no acervo (R-05, §14 da Etapa 6).
 * Uso EXCLUSIVAMENTE interno: esta lista nunca é serializada para o público.
 * A validação automática NÃO substitui revisão humana.
 */
export const BRAND_TERMS: readonly string[] = [
  "walmur",
  "kaeso",
  "ecovet",
  "avimax",
  "socorex",
  "eco matic",
  "ecomatic",
  "hipodermic",
  "ideal",
  "nasco",
  "prima tech",
  "primatech",
  "vetlogic",
  "dosys",
  "eppendorf",
  "brahma",
  "lallemand",
];

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export interface BrandCheck {
  clean: boolean;
  matches: string[];
}

/** Detecta termos de marca em um valor destinado a campo público. */
export function checkBrandTerms(value: string | null | undefined): BrandCheck {
  if (!value) return { clean: true, matches: [] };
  const haystack = normalize(value);
  const matches = BRAND_TERMS.filter((term) =>
    new RegExp(`(^|[^a-z0-9])${normalize(term)}([^a-z0-9]|$)`).test(haystack),
  );
  return { clean: matches.length === 0, matches };
}

/** Campos públicos que jamais podem conter marca de terceiro. */
export const PUBLIC_TEXT_FIELDS = [
  "public_name",
  "public_description",
  "slug",
  "summary",
  "variation_label",
] as const;

export function assertNoBrandInPublicFields(record: Record<string, unknown>): string[] {
  const problems: string[] = [];
  for (const field of PUBLIC_TEXT_FIELDS) {
    const value = record[field];
    if (typeof value !== "string") continue;
    const check = checkBrandTerms(value);
    if (!check.clean) problems.push(`${field}: ${check.matches.join(", ")}`);
  }
  return problems;
}
