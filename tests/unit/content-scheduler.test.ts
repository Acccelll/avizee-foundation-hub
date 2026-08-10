import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  audit: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({ createClient: mocks.createClient }));
vi.mock("@/lib/audit.server", () => ({ audit: mocks.audit }));

import { processEditorialSchedule } from "@/content/scheduler.server";

function articleBuilder(article: Record<string, unknown>) {
  const chain = {
    select: vi.fn(),
    eq: vi.fn(),
    limit: vi.fn(),
  };
  chain.select.mockReturnValue(chain);
  chain.eq.mockReturnValue(chain);
  chain.limit.mockResolvedValue({ data: [article], error: null });
  return chain;
}

function validArticle(overrides: Record<string, unknown> = {}) {
  return {
    id: "00000000-0000-4000-8000-000000000001",
    title: "Boas práticas de manejo em aviários",
    excerpt: "Orientações técnicas para manejo, inspeção e rotina operacional em aviários.",
    blocks: [
      {
        type: "paragraph",
        text: "A rotina técnica deve considerar inspeção visual, limpeza e registro das condições observadas.",
      },
    ],
    category_id: "00000000-0000-4000-8000-000000000010",
    author_id: "00000000-0000-4000-8000-000000000011",
    requires_technical_review: false,
    technical_reviewer_id: null,
    status: "SCHEDULED",
    schedule_claim_token: "00000000-0000-4000-8000-000000000099",
    ...overrides,
  };
}

describe("scheduler editorial", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env["SUPABASE_URL"] = "https://example.supabase.co";
    process.env["SUPABASE_SERVICE_ROLE_KEY"] = "test-service-role";
  });

  it("encerra sem escrita quando não há artigos elegíveis", async () => {
    const admin = {
      rpc: vi.fn().mockResolvedValue({ data: [], error: null }),
      from: vi.fn(),
    };
    mocks.createClient.mockReturnValue(admin);

    await expect(processEditorialSchedule()).resolves.toEqual({
      processed: 0,
      published: 0,
      failures: 0,
    });
    expect(admin.rpc).toHaveBeenCalledWith("claim_scheduled_articles", expect.any(Object));
    expect(mocks.audit).not.toHaveBeenCalled();
  });

  it("conclui publicação somente com o token individual do claim", async () => {
    const token = "00000000-0000-4000-8000-000000000099";
    const rpc = vi.fn(async (name: string) => {
      if (name === "claim_scheduled_articles") {
        return {
          data: [
            {
              id: "00000000-0000-4000-8000-000000000001",
              title: "Boas práticas de manejo em aviários",
              version: 3,
              schedule_claim_token: token,
            },
          ],
          error: null,
        };
      }
      if (name === "complete_scheduled_article") return { data: true, error: null };
      return { data: false, error: null };
    });
    const admin = {
      rpc,
      from: vi.fn(() => articleBuilder(validArticle({ schedule_claim_token: token }))),
    };
    mocks.createClient.mockReturnValue(admin);

    const result = await processEditorialSchedule();

    expect(result).toEqual({ processed: 1, published: 1, failures: 0 });
    expect(rpc).toHaveBeenCalledWith(
      "complete_scheduled_article",
      expect.objectContaining({
        target_id: "00000000-0000-4000-8000-000000000001",
        target_token: token,
      }),
    );
    expect(rpc).not.toHaveBeenCalledWith("fail_scheduled_article", expect.anything());
    expect(mocks.audit).toHaveBeenCalledWith(
      admin,
      expect.objectContaining({ origin: "content-scheduler", action: "content.publish" }),
    );
  });

  it("mantém agendado e registra falha quando a conformidade final não é satisfeita", async () => {
    const token = "00000000-0000-4000-8000-000000000099";
    const rpc = vi.fn(async (name: string) => {
      if (name === "claim_scheduled_articles") {
        return {
          data: [
            {
              id: "00000000-0000-4000-8000-000000000001",
              title: "Boas práticas de manejo em aviários",
              version: 4,
              schedule_claim_token: token,
            },
          ],
          error: null,
        };
      }
      if (name === "fail_scheduled_article") return { data: true, error: null };
      if (name === "complete_scheduled_article") return { data: true, error: null };
      return { data: null, error: null };
    });
    const invalid = validArticle({
      requires_technical_review: true,
      technical_reviewer_id: null,
      schedule_claim_token: token,
    });
    const admin = {
      rpc,
      from: vi.fn(() => articleBuilder(invalid)),
    };
    mocks.createClient.mockReturnValue(admin);

    const result = await processEditorialSchedule();

    expect(result).toEqual({ processed: 1, published: 0, failures: 1 });
    expect(rpc).toHaveBeenCalledWith("fail_scheduled_article", {
      target_id: "00000000-0000-4000-8000-000000000001",
      target_token: token,
      error_msg: "scheduler-publication-failed",
    });
    expect(rpc).not.toHaveBeenCalledWith("complete_scheduled_article", expect.anything());
    expect(mocks.audit).not.toHaveBeenCalled();
  });
});
