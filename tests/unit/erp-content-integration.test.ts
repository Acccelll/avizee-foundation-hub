import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  saveArticle: vi.fn(),
  changeArticleStatus: vi.fn(),
  saveAuthor: vi.fn(),
  assertPublicationReady: vi.fn(),
}));

vi.mock("@/content/editorial.server", () => mocks);

import {
  checkErpSecret,
  erpErrorResponse,
  pathToEditable,
  pathToPublished,
  upsertErpArticle,
} from "@/integrations/erp/content.server";
import { AppError } from "@/lib/errors";
import type { Authorized } from "@/catalog/guard.server";

const SECRET = "s".repeat(40);
const INTEGRATION_USER = "00000000-0000-4000-8000-0000000000aa";
const ARTICLE_ID = "00000000-0000-4000-8000-000000000001";

type Tables = Record<string, Record<string, unknown>[]>;

/** Cliente falso: devolve as linhas da tabela filtradas por eq/ilike simples. */
function fakeClient(tables: Tables) {
  return {
    from(table: string) {
      let rows = [...(tables[table] ?? [])];
      const chain: Record<string, unknown> = {};
      const self = () => chain;
      Object.assign(chain, {
        select: self,
        order: self,
        is: self,
        or: self,
        eq: (column: string, value: unknown) => {
          rows = rows.filter((row) => row[column] === value);
          return chain;
        },
        ilike: (column: string, value: string) => {
          rows = rows.filter(
            (row) => String(row[column]).toLowerCase() === value.replace(/\\/g, "").toLowerCase(),
          );
          return chain;
        },
        limit: () => Promise.resolve({ data: rows, error: null }),
        then: (resolve: (value: unknown) => unknown) => resolve({ data: rows, error: null }),
      });
      return chain;
    },
  };
}

function authWith(tables: Tables, roles = ["EDITOR", "REVISOR_TECNICO"]): Authorized {
  const client = fakeClient(tables) as unknown as Authorized["admin"];
  return {
    supabase: client,
    admin: client,
    userId: INTEGRATION_USER,
    roles: roles as Authorized["roles"],
    email: null,
  };
}

function baseTables(overrides: Partial<Tables> = {}): Tables {
  return {
    content_categories: [{ id: "cat-1", slug: "guias-e-boas-praticas", is_active: true }],
    content_authors: [
      { id: "author-1", display_name: "Equipe AviZee", is_active: true },
      { id: "reviewer-1", display_name: "Maria Revisora", is_active: true },
    ],
    content_articles: [],
    ...overrides,
  };
}

function payload(overrides: Record<string, unknown> = {}) {
  return {
    externalId: "erp-123",
    title: "Como limpar bebedouros nipple",
    excerpt: "Passo a passo para higienizar linhas de bebedouros nipple com segurança no aviário.",
    categorySlug: "guias-e-boas-praticas",
    blocks: [
      { type: "paragraph", text: "A limpeza das linhas de bebedouro reduz a carga microbiana." },
    ],
    sources: ["Embrapa Suínos e Aves"],
    author: { name: "Equipe AviZee" },
    approvedBy: { name: "Maria Revisora" },
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.saveArticle.mockResolvedValue({
    id: ARTICLE_ID,
    slug: "como-limpar-bebedouros-nipple",
    version: 1,
    unknownFamilies: [],
  });
  mocks.changeArticleStatus.mockResolvedValue({});
  mocks.assertPublicationReady.mockResolvedValue(undefined);
  vi.stubEnv("APP_PUBLIC_URL", "https://www.avizee.com.br");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("ERP → site: autenticação", () => {
  it("recusa quando o segredo não está configurado ou é curto", () => {
    vi.stubEnv("ERP_CONTENT_SECRET", "curto");
    const request = new Request("https://x/api", { headers: { authorization: "Bearer curto" } });
    expect(checkErpSecret(request)).toBe("not_configured");
  });

  it("recusa token incorreto e aceita o correto", () => {
    vi.stubEnv("ERP_CONTENT_SECRET", SECRET);
    const wrong = new Request("https://x/api", { headers: { authorization: "Bearer errado" } });
    const right = new Request("https://x/api", { headers: { authorization: `Bearer ${SECRET}` } });
    expect(checkErpSecret(wrong)).toBe("unauthorized");
    expect(checkErpSecret(new Request("https://x/api"))).toBe("unauthorized");
    expect(checkErpSecret(right)).toBe("ok");
  });
});

describe("ERP → site: caminhos da máquina de estados", () => {
  it("leva estados editáveis até a publicação", () => {
    expect(pathToPublished("DRAFT")).toEqual([
      "IN_TECHNICAL_REVIEW",
      "IN_EDITORIAL_REVIEW",
      "READY_TO_PUBLISH",
      "PUBLISHED",
    ]);
    expect(pathToPublished("IN_EDITORIAL_REVIEW")).toEqual(["READY_TO_PUBLISH", "PUBLISHED"]);
  });

  it("devolve publicada para edição e bloqueia agendada e arquivada", () => {
    expect(pathToEditable("DRAFT")).toEqual([]);
    expect(pathToEditable("PUBLISHED")).toEqual([
      "UNPUBLISHED",
      "READY_TO_PUBLISH",
      "CHANGES_REQUESTED",
    ]);
    expect(pathToEditable("SCHEDULED")).toBeNull();
    expect(pathToEditable("ARCHIVED")).toBeNull();
  });
});

describe("ERP → site: publicação", () => {
  it("cria e publica uma matéria nova, registrando quem aprovou", async () => {
    const result = await upsertErpArticle(authWith(baseTables()), payload());

    expect(mocks.assertPublicationReady).toHaveBeenCalledOnce();
    const saved = mocks.saveArticle.mock.calls[0]?.[1];
    expect(saved).toMatchObject({
      id: null,
      categoryId: "cat-1",
      authorId: "author-1",
      technicalReviewerId: "reviewer-1",
      references: [{ label: "Embrapa Suínos e Aves" }],
    });
    expect(saved.internalNotes).toContain("Aprovado por Maria Revisora");
    expect(mocks.changeArticleStatus.mock.calls.map((call) => call[1].to)).toEqual([
      "IN_TECHNICAL_REVIEW",
      "IN_EDITORIAL_REVIEW",
      "READY_TO_PUBLISH",
      "PUBLISHED",
    ]);
    expect(result).toMatchObject({
      articleId: ARTICLE_ID,
      status: "PUBLISHED",
      url: "https://www.avizee.com.br/conteudos/como-limpar-bebedouros-nipple",
    });
  });

  it("valida antes de tirar do ar uma matéria publicada", async () => {
    mocks.assertPublicationReady.mockRejectedValue(
      new AppError("VALIDATION_ERROR", { cause: "conformidade:BRAND" }),
    );
    const tables = baseTables({
      content_articles: [
        {
          id: ARTICLE_ID,
          slug: "como-limpar-bebedouros-nipple",
          status: "PUBLISHED",
          created_by: INTEGRATION_USER,
        },
      ],
    });

    await expect(
      upsertErpArticle(authWith(tables), payload({ articleId: ARTICLE_ID })),
    ).rejects.toMatchObject({ code: "VALIDATION_ERROR" });
    expect(mocks.changeArticleStatus).not.toHaveBeenCalled();
    expect(mocks.saveArticle).not.toHaveBeenCalled();
  });

  it("atualiza matéria publicada passando pelo fluxo editorial", async () => {
    const tables = baseTables({
      content_articles: [
        {
          id: ARTICLE_ID,
          slug: "como-limpar-bebedouros-nipple",
          status: "PUBLISHED",
          created_by: INTEGRATION_USER,
        },
      ],
    });
    await upsertErpArticle(authWith(tables), payload({ articleId: ARTICLE_ID }));

    expect(mocks.changeArticleStatus.mock.calls.map((call) => call[1].to)).toEqual([
      "UNPUBLISHED",
      "READY_TO_PUBLISH",
      "CHANGES_REQUESTED",
      "IN_TECHNICAL_REVIEW",
      "IN_EDITORIAL_REVIEW",
      "READY_TO_PUBLISH",
      "PUBLISHED",
    ]);
    expect(mocks.saveArticle.mock.calls[0]?.[1].id).toBe(ARTICLE_ID);
  });

  it("não sobrescreve artigo do painel com o mesmo slug", async () => {
    const tables = baseTables({
      content_articles: [
        {
          id: ARTICLE_ID,
          slug: "como-limpar-bebedouros-nipple",
          status: "DRAFT",
          created_by: "outro",
        },
      ],
    });
    await expect(upsertErpArticle(authWith(tables), payload())).rejects.toMatchObject({
      code: "CONFLICT",
    });
    expect(mocks.saveArticle).not.toHaveBeenCalled();
  });

  it("recusa categoria inexistente e payload sem fonte", async () => {
    await expect(
      upsertErpArticle(authWith(baseTables()), payload({ categorySlug: "nao-existe" })),
    ).rejects.toMatchObject({ code: "VALIDATION_ERROR" });
    await expect(
      upsertErpArticle(authWith(baseTables()), payload({ sources: [] })),
    ).rejects.toMatchObject({ code: "VALIDATION_ERROR" });
  });

  it("exige os papéis de publicação do usuário técnico", async () => {
    await expect(
      upsertErpArticle(authWith(baseTables(), ["AUTOR"]), payload()),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});

describe("ERP → site: respostas de erro", () => {
  it("expõe a causa de validação, mas não a de falha interna", async () => {
    const validation = await erpErrorResponse(
      new AppError("VALIDATION_ERROR", { cause: "categoria-invalida:x" }),
    ).json();
    expect(validation).toMatchObject({ ok: false, cause: "categoria-invalida:x" });

    const internal = await erpErrorResponse(
      new AppError("SERVICE_UNAVAILABLE", { cause: "relation does not exist" }),
    ).json();
    expect(internal.cause).toBeUndefined();
  });
});
