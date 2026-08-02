/**
 * FASE C — serialização pública com allowlist (R-04/R-05).
 */
import { describe, expect, it } from "vitest";
import {
  FORBIDDEN_PUBLIC_FIELDS,
  PUBLIC_PRODUCT_FIELDS,
  findLeakedFields,
  toPublicProduct,
} from "@/catalog/serializer";

const admin = {
  id: "22222222-2222-4222-8222-222222222222",
  public_sku: "AG001",
  public_name: "Agulha descartável 13x45",
  slug: "agulha-descartavel-13x45",
  variation_label: "13 X 45",
  measure: "13 X 45",
  capacity: null,
  unit: "caixa",
  public_description: "Agulha descartável para vacinação.",
  is_on_request: false,
  internal_brand: "walmur",
  internal_manufacturer: "fabricante x",
  internal_supplier_reference: "REF-991",
  internal_original_name: "AGULHA DESCARTAVEL - 100 UN",
  internal_notes: "custo interno",
  cost: 12.5,
  source: "import:abc",
  source_record: { raw: "..." },
  rights_document_path: "private/doc.pdf",
  conflict_details: { code: "AG001" },
  audit_log: [{ action: "x" }],
  staging_data: { pending: true },
  private_storage_path: "private/img.jpg",
  review_status: "READY_TO_PUBLISH",
  created_by: "user",
  updated_by: "user",
};

const view = toPublicProduct({
  product: admin,
  family: {
    public_name: "Agulhas descartáveis",
    slug: "agulhas-descartaveis",
    internal_notes: "x",
  },
  category: { name: "Vacinação e aplicação", slug: "vacinacao-e-aplicacao" },
  applications: [{ name: "vacinação" }],
  specifications: [{ code: "medida", label: "Medida", value: "13 X 45", unit: null }],
});

describe("allowlist", () => {
  it("expõe exatamente os campos permitidos do produto", () => {
    for (const field of PUBLIC_PRODUCT_FIELDS) {
      expect(Object.hasOwn(view, field)).toBe(true);
    }
    const extras = Object.keys(view).filter(
      (k) =>
        !(PUBLIC_PRODUCT_FIELDS as readonly string[]).includes(k) &&
        !["family", "category", "applications", "specifications", "image"].includes(k),
    );
    expect(extras).toEqual([]);
  });

  it.each(FORBIDDEN_PUBLIC_FIELDS)("não expõe %s", (field) => {
    expect(JSON.stringify(view)).not.toContain(`"${field}"`);
  });

  it("não deixa vazar objeto relacionado inteiro", () => {
    expect(view.family).toEqual({
      public_name: "Agulhas descartáveis",
      slug: "agulhas-descartaveis",
    });
  });

  it("não contém termos internos no payload serializado", () => {
    const json = JSON.stringify(view).toLowerCase();
    expect(json).not.toContain("walmur");
    expect(json).not.toContain("fabricante x");
    expect(json).not.toContain("ref-991");
    expect(json).not.toContain("private/");
  });

  it("aplica placeholder quando não há imagem aprovada", () => {
    expect(view.image.is_placeholder).toBe(true);
  });

  it("marca imagem real como não-placeholder", () => {
    const withImage = toPublicProduct({
      product: admin,
      image: { url: "/img/ag001.jpg", alt: "Agulha" },
    });
    expect(withImage.image).toMatchObject({ is_placeholder: false, url: "/img/ag001.jpg" });
  });
});

describe("findLeakedFields", () => {
  it("não encontra vazamento na visão pública", () => {
    expect(findLeakedFields(view)).toEqual([]);
  });

  it("encontra vazamento recursivamente", () => {
    expect(findLeakedFields({ data: { items: [{ ok: 1, internal_brand: "x" }] } })).toEqual([
      "internal_brand",
    ]);
  });

  it("percorre arrays aninhados", () => {
    expect(findLeakedFields([[{ rights_document_path: "a" }]])).toEqual(["rights_document_path"]);
  });

  it("tolera valores primitivos e nulos", () => {
    expect(findLeakedFields(null)).toEqual([]);
    expect(findLeakedFields("texto")).toEqual([]);
  });
});
