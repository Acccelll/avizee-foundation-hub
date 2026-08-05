import { describe, it, expect, vi, beforeEach } from "vitest";
import searchCatalogTool from "../../src/lib/mcp/tools/search-catalog";
import getFamilyTool from "../../src/lib/mcp/tools/get-family";
import suggestTermsTool from "../../src/lib/mcp/tools/suggest-terms";

describe("MCP Tools Hardening", () => {
  describe("search_catalog", () => {
    it("should reject excessively long search terms", async () => {
      const longTerm = "a".repeat(101);
      // We check if the Zod schema in inputSchema would catch this
      // The defineTool handler is wrapped, but we can test the logic
      const schema = (searchCatalogTool as any).inputSchema;
      const result = zSchemaParse(schema, { q: longTerm });
      expect(result.success).toBe(false);
    });

    it("should reject invalid page numbers", async () => {
      const schema = (searchCatalogTool as any).inputSchema;
      expect(zSchemaParse(schema, { pagina: 0 }).success).toBe(false);
      expect(zSchemaParse(schema, { pagina: 201 }).success).toBe(false);
    });
  });

  describe("get_family", () => {
    it("should reject excessively long slugs", async () => {
      const schema = (getFamilyTool as any).inputSchema;
      expect(zSchemaParse(schema, { categoria: "a".repeat(101), familia: "f" }).success).toBe(false);
    });
  });

  describe("suggest_terms", () => {
    it("should reject terms shorter than 2 chars", async () => {
      const schema = (suggestTermsTool as any).inputSchema;
      expect(zSchemaParse(schema, { q: "a" }).success).toBe(false);
    });
  });
});

function zSchemaParse(schema: any, data: any) {
  // Simple helper since we can't easily import the internal tool structure if it's not exported
  // But we know defineTool uses Zod
  const { z } = require("zod");
  const zodSchema = z.object(schema);
  return zodSchema.safeParse(data);
}
