/**
 * Contrato versionado do arquivo de importação (§26–§29 da Etapa 6).
 * Alterar este contrato exige nova versão — arquivos fora da versão são recusados.
 */
import { z } from "zod";

export const IMPORT_SCHEMA_VERSION = "1.0.0";

export const IMPORT_COLUMNS = [
  "sku_publico",
  "nome_publico",
  "familia_slug",
  "categoria_slug",
  "variacao",
  "medida",
  "capacidade",
  "unidade",
  "descricao_publica",
  "sob_consulta",
  "codigo_original",
  "marca_interna",
  "observacao_interna",
] as const;

export type ImportColumn = (typeof IMPORT_COLUMNS)[number];

const optionalText = z
  .string()
  .trim()
  .max(500)
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .optional();

export const importRowSchema = z.object({
  sku_publico: z.string().trim().min(1, "SKU público obrigatório").max(64),
  nome_publico: z.string().trim().min(3, "Nome público obrigatório").max(200),
  familia_slug: z.string().trim().min(1, "Família obrigatória").max(120),
  categoria_slug: optionalText,
  variacao: optionalText,
  medida: optionalText,
  capacidade: optionalText,
  unidade: optionalText,
  descricao_publica: optionalText,
  sob_consulta: z
    .string()
    .trim()
    .transform((v) => ["sim", "true", "1"].includes(v.toLowerCase()))
    .optional()
    .default("nao"),
  codigo_original: optionalText,
  marca_interna: optionalText,
  observacao_interna: optionalText,
});

export type ImportRow = z.infer<typeof importRowSchema>;

/** Neutraliza injeção de fórmula em CSV/planilha (§29). */
export function sanitizeCell(value: string): string {
  const trimmed = value.replace(/^\uFEFF/, "").trim();
  return /^[=+\-@\t\r]/.test(trimmed) ? `'${trimmed}` : trimmed;
}

export interface ParsedFile {
  header: string[];
  rows: Record<string, string>[];
}

/** Parser CSV mínimo com suporte a aspas duplas. Não executa nada do arquivo. */
export function parseDelimited(content: string, delimiter = ","): ParsedFile {
  const lines: string[][] = [];
  let field = "";
  let row: string[] = [];
  let quoted = false;

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];
    if (quoted) {
      if (char === '"' && content[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') quoted = true;
    else if (char === delimiter) {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      lines.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    lines.push(row);
  }

  const [headerLine = [], ...body] = lines.filter((l) => l.some((c) => c.trim() !== ""));
  const header = headerLine.map((h) => sanitizeCell(h).toLowerCase());
  const rows = body.map((cells) => {
    const record: Record<string, string> = {};
    header.forEach((key, index) => {
      record[key] = sanitizeCell(cells[index] ?? "");
    });
    return record;
  });
  return { header, rows };
}

export interface RowError {
  line: number;
  column: string | null;
  message: string;
}

export interface ValidationOutcome {
  valid: { line: number; data: ImportRow }[];
  errors: RowError[];
}

export function validateHeader(header: string[]): RowError[] {
  const missing = IMPORT_COLUMNS.filter(
    (column) => !header.includes(column) && column !== "categoria_slug",
  ).filter((column) =>
    ["sku_publico", "nome_publico", "familia_slug"].includes(column),
  );
  return missing.map((column) => ({
    line: 1,
    column,
    message: `Coluna obrigatória ausente: ${column}`,
  }));
}

export function validateRows(rows: Record<string, string>[]): ValidationOutcome {
  const valid: ValidationOutcome["valid"] = [];
  const errors: RowError[] = [];
  const seenSkus = new Map<string, number>();

  rows.forEach((raw, index) => {
    const line = index + 2;
    const parsed = importRowSchema.safeParse(raw);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        errors.push({
          line,
          column: String(issue.path[0] ?? ""),
          message: issue.message,
        });
      }
      return;
    }
    const sku = parsed.data.sku_publico.toUpperCase();
    const previous = seenSkus.get(sku);
    if (previous) {
      errors.push({
        line,
        column: "sku_publico",
        message: `SKU duplicado no arquivo (também na linha ${previous})`,
      });
      return;
    }
    seenSkus.set(sku, line);
    valid.push({ line, data: parsed.data });
  });

  return { valid, errors };
}
