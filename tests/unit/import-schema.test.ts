/**
 * FASE C — schema, parser e proteção contra formula injection.
 */
import { describe, expect, it } from "vitest";
import {
  IMPORT_SCHEMA_VERSION,
  parseDelimited,
  sanitizeCell,
  validateHeader,
  validateRows,
} from "@/catalog/import/schema";

const HEADER =
  "sku_publico,nome_publico,familia_slug,categoria_slug,variacao,medida,capacidade,unidade,descricao_publica,sob_consulta,codigo_original,marca_interna,observacao_interna";

function file(...rows: string[]) {
  return [HEADER, ...rows].join("\n");
}

describe("versão do contrato", () => {
  it("expõe versão semântica estável", () => {
    expect(IMPORT_SCHEMA_VERSION).toBe("1.0.0");
  });
});

describe("cabeçalho", () => {
  it("aceita cabeçalho completo", () => {
    expect(validateHeader(parseDelimited(file()).header)).toEqual([]);
  });

  it("recusa cabeçalho sem coluna obrigatória", () => {
    const errors = validateHeader(["sku_publico", "nome_publico"]);
    expect(errors.map((e) => e.column)).toEqual(["familia_slug"]);
  });

  it("recusa arquivo vazio", () => {
    const parsed = parseDelimited("");
    expect(parsed.rows).toHaveLength(0);
    expect(validateHeader(parsed.header).length).toBeGreaterThan(0);
  });

  it("ignora coluna desconhecida sem quebrar as obrigatórias", () => {
    const errors = validateHeader([...parseDelimited(file()).header, "coluna_inventada"]);
    expect(errors).toEqual([]);
  });
});

describe("linhas", () => {
  it("valida linha correta", () => {
    const { valid, errors } = validateRows(
      parseDelimited(file("AG001,Agulha descartável 13x45,agulhas-descartaveis,,,13 x 45,,,,,,,"))
        .rows,
    );
    expect(errors).toEqual([]);
    expect(valid[0]?.data.sku_publico).toBe("AG001");
    expect(valid[0]?.line).toBe(2);
  });

  it("recusa SKU vazio e nome curto na mesma linha (múltiplos erros)", () => {
    const { valid, errors } = validateRows(parseDelimited(file(",ab,fam,,,,,,,,,,")).rows);
    expect(valid).toHaveLength(0);
    expect(errors.length).toBeGreaterThanOrEqual(2);
    expect(errors.map((e) => e.column)).toContain("sku_publico");
    expect(errors.map((e) => e.column)).toContain("nome_publico");
  });

  it("recusa família ausente", () => {
    const { errors } = validateRows(parseDelimited(file("AG001,Agulha teste,,,,,,,,,,,")).rows);
    expect(errors.some((e) => e.column === "familia_slug")).toBe(true);
  });

  it("recusa SKU duplicado no arquivo", () => {
    const { valid, errors } = validateRows(
      parseDelimited(file("AG001,Agulha um,fam-a,,,,,,,,,,", "ag001,Agulha dois,fam-a,,,,,,,,,,"))
        .rows,
    );
    expect(valid).toHaveLength(1);
    expect(errors[0]?.message).toMatch(/duplicado/i);
  });

  it("normaliza booleano sob_consulta", () => {
    const { valid } = validateRows(
      parseDelimited(
        file("AG001,Agulha um,fam-a,,,,,,,SIM,,,", "AG002,Agulha dois,fam-a,,,,,,,,,,"),
      ).rows,
    );
    expect(valid[0]?.data.sob_consulta).toBe(true);
    expect(valid[1]?.data.sob_consulta).toBe(false);
  });

  it("converte campo vazio em nulo, não em string vazia", () => {
    const { valid } = validateRows(parseDelimited(file("AG001,Agulha um,fam-a,,,,,,,,,,")).rows);
    expect(valid[0]?.data.medida).toBeNull();
  });

  it("recusa nome público acima do limite", () => {
    const { errors } = validateRows(
      parseDelimited(file(`AG001,${"a".repeat(201)},fam-a,,,,,,,,,,`)).rows,
    );
    expect(errors.some((e) => e.column === "nome_publico")).toBe(true);
  });
});

describe("parser", () => {
  it("respeita aspas duplas e vírgulas internas", () => {
    const { rows } = parseDelimited(
      file('AG001,"Agulha, 13x45",fam-a,,,,,,"Descrição com ""aspas""",,,,'),
    );
    expect(rows[0]?.["nome_publico"]).toBe("Agulha, 13x45");
    expect(rows[0]?.["descricao_publica"]).toBe('Descrição com "aspas"');
  });

  it("remove BOM e linhas em branco", () => {
    const { header, rows } = parseDelimited(`\uFEFF${HEADER}\n\n\nAG001,Agulha,fam-a,,,,,,,,,,\n`);
    expect(header[0]).toBe("sku_publico");
    expect(rows).toHaveLength(1);
  });
});

describe("formula injection", () => {
  const perigosos = [
    "=1+1",
    "+1+1",
    "-1+1",
    "@SUM(A1)",
    "\t=cmd",
    "\r=cmd",
    '   =HYPERLINK("http://x")',
    "=cmd|'/c calc'!A1",
  ];

  it.each(perigosos)("neutraliza %j", (value) => {
    const out = sanitizeCell(value);
    expect(out.startsWith("'")).toBe(true);
    expect(/^[=+\-@\t\r]/.test(out)).toBe(false);
  });

  it("não altera valor legítimo", () => {
    expect(sanitizeCell(" Agulha 13x45 ")).toBe("Agulha 13x45");
    expect(sanitizeCell("13 X 45")).toBe("13 X 45");
  });

  it("neutraliza também no parser, célula a célula", () => {
    const { rows } = parseDelimited(file("=AG001,=cmd,fam-a,,,,,,,,,,"));
    expect(rows[0]?.["sku_publico"]).toBe("'=AG001");
    expect(rows[0]?.["nome_publico"]).toBe("'=cmd");
  });

  it("neutraliza no cabeçalho", () => {
    const { header } = parseDelimited("=sku_publico,nome_publico\nA,B");
    expect(header[0]).toBe("'=sku_publico");
  });
});
