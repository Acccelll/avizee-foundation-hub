/**
 * FASE C — plano de importação e assinatura.
 */
import { describe, expect, it } from "vitest";
import { buildPlan, planSignature, type ExistingProduct } from "@/catalog/import/plan";
import { parseDelimited, validateRows } from "@/catalog/import/schema";

const HEADER =
  "sku_publico,nome_publico,familia_slug,categoria_slug,variacao,medida,capacidade,unidade,descricao_publica,sob_consulta,codigo_original,marca_interna,observacao_interna";

const FAMILIES = ["agulhas-descartaveis", "bicos-pulverizadores"];

function rowsOf(...lines: string[]) {
  return validateRows(parseDelimited([HEADER, ...lines].join("\n")).rows).valid;
}

const existing: ExistingProduct[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    public_sku: "AG002",
    public_name: "Agulha descartável 25x10",
    family_slug: "agulhas-descartaveis",
    variation_label: "25 X 10",
    measure: "25 X 10",
    capacity: null,
    unit: null,
    public_description: null,
    is_on_request: false,
  },
];

function plan(lines: string[], allowedSkus: string[] | null = null) {
  return buildPlan({
    rows: rowsOf(...lines),
    existing,
    knownFamilySlugs: FAMILIES,
    allowedSkus,
  });
}

const CREATE_LINE = "AG001,Agulha descartável 13x45,agulhas-descartaveis,,13 X 45,13 X 45,,,,,,,";
const UNCHANGED_LINE =
  "AG002,Agulha descartável 25x10,agulhas-descartaveis,,25 X 10,25 X 10,,,,,,,";
const UPDATE_LINE =
  "AG002,Agulha descartável 25x10 nova,agulhas-descartaveis,,25 X 10,25 X 10,,,,,,,";

describe("classificação de operações", () => {
  it("classifica criação", () => {
    const p = plan([CREATE_LINE]);
    expect(p.items[0]?.operation).toBe("CREATE");
    expect(p.summary).toMatchObject({ total: 1, create: 1, update: 0, unchanged: 0, blocked: 0 });
  });

  it("classifica registro sem alteração", () => {
    expect(plan([UNCHANGED_LINE]).items[0]?.operation).toBe("UNCHANGED");
  });

  it("classifica atualização e lista os campos alterados", () => {
    const item = plan([UPDATE_LINE]).items[0];
    expect(item?.operation).toBe("UPDATE");
    expect(item?.changedFields).toContain("public_name");
  });

  it("bloqueia família inexistente", () => {
    const item = plan(["AG009,Agulha teste,familia-que-nao-existe,,,,,,,,,,"]).items[0];
    expect(item?.operation).toBe("BLOCK");
    expect(item?.blockReason).toMatch(/Família desconhecida/);
  });

  it("bloqueia marca de terceiro em nome público", () => {
    const item = plan(["AG010,Agulha walmur,agulhas-descartaveis,,,,,,,,,,"]).items[0];
    expect(item?.operation).toBe("BLOCK");
    expect(item?.blockReason).toMatch(/Marca de terceiro/);
  });

  it("bloqueia SKU fora do escopo aprovado", () => {
    const item = plan([CREATE_LINE], ["AG002"]).items[0];
    expect(item?.operation).toBe("BLOCK");
    expect(item?.blockReason).toMatch(/Fora do escopo aprovado/);
  });

  it("registra aviso quando há marca em campo interno, sem bloquear", () => {
    const item = plan(["AG011,Agulha inox 15x20,agulhas-descartaveis,,,,,,,,,walmur,"]).items[0];
    expect(item?.operation).toBe("CREATE");
    expect(item?.warnings).toContain("marca registrada em campo interno");
  });

  it("totaliza corretamente um plano misto", () => {
    const p = plan([
      CREATE_LINE,
      UPDATE_LINE.replace("AG002", "AG002"),
      "AG012,Agulha kaeso,agulhas-descartaveis,,,,,,,,,,",
    ]);
    expect(p.summary.total).toBe(3);
    expect(p.summary.create).toBe(1);
    expect(p.summary.update).toBe(1);
    expect(p.summary.blocked).toBe(1);
  });
});

describe("assinatura do plano", () => {
  it("é determinística para o mesmo arquivo", () => {
    expect(planSignature(plan([CREATE_LINE, UNCHANGED_LINE]))).toBe(
      planSignature(plan([CREATE_LINE, UNCHANGED_LINE])),
    );
  });

  it("muda quando o conteúdo muda", () => {
    expect(planSignature(plan([UNCHANGED_LINE]))).not.toBe(planSignature(plan([UPDATE_LINE])));
  });

  it("muda quando a ordem das linhas muda (assinatura amarra linha e operação)", () => {
    const a = planSignature(plan([CREATE_LINE, UNCHANGED_LINE]));
    const b = planSignature(plan([UNCHANGED_LINE, CREATE_LINE]));
    expect(a).not.toBe(b);
  });

  it("muda quando o estado do catálogo muda", () => {
    const semBase = buildPlan({
      rows: rowsOf(UNCHANGED_LINE),
      existing: [],
      knownFamilySlugs: FAMILIES,
    });
    expect(planSignature(semBase)).not.toBe(planSignature(plan([UNCHANGED_LINE])));
  });

  it("difere entre lotes diferentes", () => {
    expect(planSignature(plan([CREATE_LINE]))).not.toBe(
      planSignature(plan([CREATE_LINE, UNCHANGED_LINE])),
    );
  });

  it("carrega prefixo de versão e cardinalidade", () => {
    expect(planSignature(plan([CREATE_LINE, UNCHANGED_LINE]))).toMatch(/^v1-2-[0-9a-f]+$/);
  });
});
