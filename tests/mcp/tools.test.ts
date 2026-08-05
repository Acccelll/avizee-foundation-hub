import { describe, it, expect } from "vitest";
import { z } from "zod";
import searchCatalogTool from "@/lib/mcp/tools/search-catalog";
import getFamilyTool from "@/lib/mcp/tools/get-family";
import suggestTermsTool from "@/lib/mcp/tools/suggest-terms";

describe("MCP Tools - Hardening & Contracts", () => {
  it("search_catalog should reject long strings", async () => {
    const longString = "a".repeat(101);
    const schema = z.object((searchCatalogTool as any).inputSchema);
    const result = await schema.safeParseAsync({ q: longString });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].code).toBe("too_big");
    }
  });

  it("get_family should reject long slugs", async () => {
    const schema = z.object((getFamilyTool as any).inputSchema);
    const result = await schema.safeParseAsync({ categoria: "cat", familia: "a".repeat(101) });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].code).toBe("too_big");
    }
  });

  it("suggest_terms should reject short queries", async () => {
    const schema = z.object((suggestTermsTool as any).inputSchema);
    const result = await schema.safeParseAsync({ q: "a" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].code).toBe("too_small");
    }
  });
});
