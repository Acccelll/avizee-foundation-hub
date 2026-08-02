/**
 * FASE C — RBAC, redação de auditoria e utilitários.
 */
import { describe, expect, it } from "vitest";
import { PERMISSIONS, ROLES, ROLE_PERMISSIONS, hasPermission, isRole, permissionsFor } from "@/permissions/model";
import { diffFields, maskEmail, redactValues } from "@/lib/audit.server";

describe("modelo de permissões", () => {
  it("declara 21 permissões finas", () => {
    expect(PERMISSIONS).toHaveLength(21);
    expect(new Set(PERMISSIONS).size).toBe(21);
  });

  it("declara os 7 papéis aprovados", () => {
    expect(ROLES).toHaveLength(7);
    for (const role of ROLES) expect(ROLE_PERMISSIONS[role]).toBeDefined();
  });

  it("toda permissão atribuída existe no catálogo de permissões", () => {
    for (const perms of Object.values(ROLE_PERMISSIONS)) {
      for (const p of perms) expect(PERMISSIONS).toContain(p);
    }
  });

  it("ADMINISTRADOR concentra todas as permissões", () => {
    expect(permissionsFor(["ADMINISTRADOR"]).sort()).toEqual([...PERMISSIONS].sort());
  });

  it("todo papel tem admin.access e nenhum é vazio", () => {
    for (const role of ROLES) {
      expect(ROLE_PERMISSIONS[role].length).toBeGreaterThan(0);
      expect(ROLE_PERMISSIONS[role]).toContain("admin.access");
    }
  });

  it("menor privilégio: papéis de leitura não escrevem no catálogo", () => {
    for (const role of ["AUDITOR", "REVISOR_TECNICO", "COMERCIAL"] as const) {
      expect(hasPermission([role], "catalog.write")).toBe(false);
      expect(hasPermission([role], "import.execute")).toBe(false);
      expect(hasPermission([role], "import.rollback")).toBe(false);
    }
  });

  it("apenas ADMINISTRADOR e AUDITOR leem auditoria", () => {
    const leem = ROLES.filter((r) => hasPermission([r], "audit.read"));
    expect(leem.sort()).toEqual(["ADMINISTRADOR", "AUDITOR"]);
  });

  it("acumula permissões de múltiplos papéis", () => {
    const p = permissionsFor(["AUDITOR", "GESTOR_DE_CATALOGO"]);
    expect(p).toContain("audit.read");
    expect(p).toContain("catalog.write");
    expect(new Set(p).size).toBe(p.length);
  });

  it("rejeita papel desconhecido", () => {
    expect(isRole("ROOT")).toBe(false);
    expect(isRole("ADMINISTRADOR")).toBe(true);
    expect(permissionsFor(["ROOT" as never])).toEqual([]);
    expect(hasPermission(["ROOT" as never], "catalog.write")).toBe(false);
  });

  it("lista de papéis vazia não concede nada", () => {
    expect(permissionsFor([])).toEqual([]);
    for (const p of PERMISSIONS) expect(hasPermission([], p)).toBe(false);
  });
});

describe("redação de auditoria", () => {
  it("redige chaves sensíveis por substring", () => {
    const out = redactValues({
      password: "x",
      access_token: "y",
      client_secret: "z",
      cookie: "c",
      rights_document_path: "p",
      raw_payload: {},
      file: "f",
      public_name: "Agulha",
    });
    expect(out).toMatchObject({ public_name: "Agulha" });
    for (const k of [
      "password",
      "access_token",
      "client_secret",
      "cookie",
      "rights_document_path",
      "raw_payload",
      "file",
    ]) {
      expect(out?.[k]).toBe("[REDIGIDO]");
    }
  });

  it("é insensível a caixa", () => {
    expect(redactValues({ PASSWORD: "x" })?.["PASSWORD"]).toBe("[REDIGIDO]");
  });

  it("trata nulo", () => {
    expect(redactValues(null)).toBeNull();
  });

  it("mascara e-mail preservando domínio", () => {
    expect(maskEmail("operador@avizee.com.br")).toBe("op***@avizee.com.br");
    expect(maskEmail(null)).toBeNull();
    expect(maskEmail("sem-arroba")).toBe("[REDIGIDO]");
  });

  it("calcula diff de campos", () => {
    expect(diffFields({ a: 1, b: 2 }, { a: 1, b: 3 })).toEqual(["b"]);
    expect(diffFields(null, { a: 1, b: 2 })).toEqual(["a", "b"]);
    expect(diffFields({ a: { x: 1 } }, { a: { x: 1 } })).toEqual([]);
  });
});
