/**
 * Verificação final de não vazamento sobre o catálogo canônico (§24 da Etapa 6.1).
 * Percorre todos os registros ativos, aplica o serializador público e procura
 * termos de marca (R-05) e nomes de campos internos no JSON resultante.
 */
import { createClient } from "@supabase/supabase-js";

import { checkBrandTerms } from "@/catalog/brand-terms";
import { serializePublicProduct, serializePublicFamily } from "@/catalog/serializer";

const INTERNAL_KEYS = [
  "internal_brand",
  "internal_manufacturer",
  "internal_supplier_reference",
  "internal_notes",
  "internal_original_name",
  "created_by",
  "updated_by",
  "source",
  "price",
  "preco",
];

function required(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Variável ausente: ${name}`);
  return v;
}

const service = createClient(required("SUPABASE_URL"), required("SUPABASE_SERVICE_ROLE_KEY"), {
  auth: { persistSession: false, autoRefreshToken: false },
});

const findings: { entidade: string; id: string; problema: string }[] = [];

const { data: products } = await service.from("products").select("*").is("deleted_at", null);
for (const row of products ?? []) {
  const publicJson = JSON.stringify(serializePublicProduct(row as never));
  for (const key of INTERNAL_KEYS) {
    if (publicJson.includes(`"${key}"`)) {
      findings.push({ entidade: "product", id: row["public_sku"], problema: `campo ${key}` });
    }
  }
  for (const field of ["public_name", "public_description", "slug", "variation_label"]) {
    const check = checkBrandTerms(row[field] as string | null);
    if (!check.clean) {
      findings.push({
        entidade: "product",
        id: row["public_sku"],
        problema: `marca em ${field}: ${check.matches.join(",")}`,
      });
    }
  }
}

const { data: families } = await service
  .from("product_families")
  .select("*")
  .is("deleted_at", null);
for (const row of families ?? []) {
  const publicJson = JSON.stringify(serializePublicFamily(row as never));
  for (const key of INTERNAL_KEYS) {
    if (publicJson.includes(`"${key}"`)) {
      findings.push({ entidade: "family", id: row["slug"], problema: `campo ${key}` });
    }
  }
  for (const field of ["public_name", "public_description", "slug", "summary"]) {
    const check = checkBrandTerms(row[field] as string | null);
    if (!check.clean) {
      findings.push({
        entidade: "family",
        id: row["slug"],
        problema: `marca em ${field}: ${check.matches.join(",")}`,
      });
    }
  }
}

const { data: codes } = await service.from("product_codes").select("code,is_public");
const publicCodes = (codes ?? []).filter((c) => c["is_public"]).length;

console.log(
  JSON.stringify(
    {
      produtosVerificados: products?.length ?? 0,
      familiasVerificadas: families?.length ?? 0,
      codigosPublicos: publicCodes,
      ocorrencias: findings.length,
      detalhes: findings.slice(0, 30),
    },
    null,
    2,
  ),
);
if (findings.length > 0) process.exit(1);
