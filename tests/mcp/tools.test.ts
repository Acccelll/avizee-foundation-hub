import { describe, it, expect, vi } from "vitest";
import searchCatalogTool from "@/lib/mcp/tools/search-catalog";
import getFamilyTool from "@/lib/mcp/tools/get-family";
import suggestTermsTool from "@/lib/mcp/tools/suggest-terms";

describe("MCP Tools - Hardening & Contracts", () => {
  it("search_catalog should reject long strings", async () => {
    const longString = "a".repeat(101);
    // O zod deve lançar erro na validação do inputSchema
    // O defineTool usa o zod para validar o payload antes do handler
    try {
      await (searchCatalogTool as any).inputSchema.parseAsync({ q: longString });
      expect.fail("Should have thrown zod error for q length");
    } catch (e: any) {
      expect(e.issues[0].code).toBe("too_big");
    }
  });

  it("get_family should reject long slugs", async () => {
    try {
      await (getFamilyTool as any).inputSchema.parseAsync({ categoria: "cat", familia: "a".repeat(101) });
      expect.fail("Should have thrown zod error for familia length");
    } catch (e: any) {
      expect(e.issues[0].code).toBe("too_big");
    }
  });

  it("suggest_terms should reject short queries", async () => {
    try {
      await (suggestTermsTool as any).inputSchema.parseAsync({ q: "a" });
      expect.fail("Should have thrown zod error for q min length");
    } catch (e: any) {
      expect(e.issues[0].code).toBe("too_small");
    }
  });
});
