/**
 * Planejamento da importação (§27 da Etapa 6).
 * Função pura: recebe linhas válidas + estado atual e devolve o plano.
 * Nada é gravado aqui — a simulação obrigatória usa exatamente este resultado.
 */
import { checkBrandTerms } from "@/catalog/brand-terms";
import type { ImportRow } from "./schema";

export type PlanOperation = "CREATE" | "UPDATE" | "UNCHANGED" | "BLOCK";

export interface ExistingProduct {
  id: string;
  public_sku: string;
  public_name: string;
  family_slug: string | null;
  variation_label: string | null;
  measure: string | null;
  capacity: string | null;
  unit: string | null;
  public_description: string | null;
  is_on_request: boolean;
}

export interface PlanItem {
  line: number;
  sku: string;
  operation: PlanOperation;
  productId: string | null;
  changedFields: string[];
  blockReason: string | null;
  warnings: string[];
  data: ImportRow;
}

export interface PlanSummary {
  total: number;
  create: number;
  update: number;
  unchanged: number;
  blocked: number;
  warnings: number;
}

export interface ImportPlan {
  items: PlanItem[];
  summary: PlanSummary;
}

const COMPARABLE: { field: keyof ExistingProduct; from: keyof ImportRow }[] = [
  { field: "public_name", from: "nome_publico" },
  { field: "variation_label", from: "variacao" },
  { field: "measure", from: "medida" },
  { field: "capacity", from: "capacidade" },
  { field: "unit", from: "unidade" },
  { field: "public_description", from: "descricao_publica" },
];

export function buildPlan(input: {
  rows: { line: number; data: ImportRow }[];
  existing: ExistingProduct[];
  knownFamilySlugs: string[];
  allowedSkus?: string[] | null;
}): ImportPlan {
  const bySku = new Map(input.existing.map((p) => [p.public_sku.toUpperCase(), p]));
  const families = new Set(input.knownFamilySlugs);
  const allowed = input.allowedSkus ? new Set(input.allowedSkus.map((s) => s.toUpperCase())) : null;

  const items = input.rows.map<PlanItem>(({ line, data }) => {
    const sku = data.sku_publico.toUpperCase();
    const warnings: string[] = [];
    let blockReason: string | null = null;

    if (allowed && !allowed.has(sku)) {
      blockReason = "Fora do escopo aprovado (31 famílias / 97 SKUs)";
    }
    if (!families.has(data.familia_slug)) {
      blockReason ??= `Família desconhecida: ${data.familia_slug}`;
    }
    const brand = checkBrandTerms(data.nome_publico);
    if (!brand.clean) {
      blockReason ??= `Marca de terceiro no nome público: ${brand.matches.join(", ")}`;
    }
    if (data.marca_interna) warnings.push("marca registrada em campo interno");

    const existing = bySku.get(sku) ?? null;

    if (blockReason) {
      return {
        line,
        sku,
        operation: "BLOCK",
        productId: existing?.id ?? null,
        changedFields: [],
        blockReason,
        warnings,
        data,
      };
    }

    if (!existing) {
      return {
        line,
        sku,
        operation: "CREATE",
        productId: null,
        changedFields: ["public_sku", "public_name", "family_slug"],
        blockReason: null,
        warnings,
        data,
      };
    }

    const changedFields: string[] = [];
    for (const { field, from } of COMPARABLE) {
      const next = (data[from] ?? null) as string | null;
      const current = (existing[field] ?? null) as string | null;
      if ((next ?? "") !== (current ?? "")) changedFields.push(String(field));
    }
    if (existing.family_slug !== data.familia_slug) changedFields.push("family_slug");
    if (existing.is_on_request !== Boolean(data.sob_consulta)) changedFields.push("is_on_request");

    return {
      line,
      sku,
      operation: changedFields.length > 0 ? "UPDATE" : "UNCHANGED",
      productId: existing.id,
      changedFields,
      blockReason: null,
      warnings,
      data,
    };
  });

  return { items, summary: summarize(items) };
}

export function summarize(items: PlanItem[]): PlanSummary {
  return {
    total: items.length,
    create: items.filter((i) => i.operation === "CREATE").length,
    update: items.filter((i) => i.operation === "UPDATE").length,
    unchanged: items.filter((i) => i.operation === "UNCHANGED").length,
    blocked: items.filter((i) => i.operation === "BLOCK").length,
    warnings: items.reduce((total, i) => total + i.warnings.length, 0),
  };
}

/** Assinatura estável do plano: a execução só ocorre se bater com a simulação (§28). */
export function planSignature(plan: ImportPlan): string {
  const payload = plan.items
    .map((i) => `${i.line}|${i.sku}|${i.operation}|${i.changedFields.slice().sort().join(",")}`)
    .join("\n");
  let hash = 5381;
  for (let i = 0; i < payload.length; i += 1) hash = ((hash << 5) + hash + payload.charCodeAt(i)) >>> 0;
  return `v1-${plan.items.length}-${hash.toString(16)}`;
}
