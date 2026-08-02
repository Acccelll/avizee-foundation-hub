/**
 * Serialização pública (§35, §36, §50 da Etapa 6).
 * Estratégia: LISTA EXPLÍCITA DE CAMPOS PERMITIDOS. Nunca "objeto completo
 * com campos ocultos no frontend".
 */
export const PUBLIC_PRODUCT_FIELDS = [
  "public_sku",
  "public_name",
  "slug",
  "variation_label",
  "measure",
  "capacity",
  "unit",
  "public_description",
  "is_on_request",
] as const;

export const PUBLIC_FAMILY_FIELDS = [
  "public_name",
  "slug",
  "summary",
  "public_description",
] as const;

/** Campos que NUNCA podem sair para o público (teste de não vazamento). */
export const FORBIDDEN_PUBLIC_FIELDS = [
  "internal_brand",
  "internal_manufacturer",
  "internal_supplier_reference",
  "internal_original_name",
  "internal_notes",
  "admin_name",
  "cost",
  "source",
  "source_record",
  "rights_document_path",
  "detected_brand",
  "audit_log",
  "conflict_details",
  "review_status",
  "created_by",
  "updated_by",
] as const;

export interface PublicSpecification {
  code: string;
  label: string;
  value: string;
  unit: string | null;
}

export interface PublicProductView {
  public_sku: string | null;
  public_name: string;
  slug: string | null;
  variation_label: string | null;
  measure: string | null;
  capacity: string | null;
  unit: string | null;
  public_description: string | null;
  is_on_request: boolean;
  family: { public_name: string; slug: string } | null;
  category: { name: string; slug: string } | null;
  applications: string[];
  specifications: PublicSpecification[];
  image: { url: string; alt: string; is_placeholder: boolean };
}

export const PLACEHOLDER_IMAGE = {
  url: "/placeholder.svg",
  alt: "Imagem ilustrativa: fotografia oficial em preparação",
  is_placeholder: true,
} as const;

type AnyRecord = Record<string, unknown>;

function pick<T extends readonly string[]>(source: AnyRecord, fields: T) {
  const out: AnyRecord = {};
  for (const field of fields) out[field] = source[field] ?? null;
  return out;
}

/**
 * Constrói a visão pública de um SKU a partir do registro administrativo.
 * Qualquer campo não listado é descartado por construção.
 */
export function toPublicProduct(input: {
  product: AnyRecord;
  family?: AnyRecord | null;
  category?: AnyRecord | null;
  applications?: { name: string }[];
  specifications?: PublicSpecification[];
  image?: { url: string; alt: string } | null;
}): PublicProductView {
  const base = pick(input.product, PUBLIC_PRODUCT_FIELDS) as unknown as PublicProductView;
  return {
    ...base,
    is_on_request: Boolean(input.product["is_on_request"]),
    family: input.family
      ? {
          public_name: String(input.family["public_name"] ?? ""),
          slug: String(input.family["slug"] ?? ""),
        }
      : null,
    category: input.category
      ? { name: String(input.category["name"] ?? ""), slug: String(input.category["slug"] ?? "") }
      : null,
    applications: (input.applications ?? []).map((a) => a.name),
    specifications: input.specifications ?? [],
    image: input.image ? { ...input.image, is_placeholder: false } : { ...PLACEHOLDER_IMAGE },
  };
}

/** Verificação defensiva usada em testes e antes de qualquer resposta pública. */
export function findLeakedFields(payload: unknown): string[] {
  const found = new Set<string>();
  const walk = (node: unknown) => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (node && typeof node === "object") {
      for (const [key, value] of Object.entries(node)) {
        if ((FORBIDDEN_PUBLIC_FIELDS as readonly string[]).includes(key)) found.add(key);
        walk(value);
      }
    }
  };
  walk(payload);
  return [...found];
}
