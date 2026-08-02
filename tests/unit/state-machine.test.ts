/**
 * FASE C — máquina de estados e regras de aprovação de imagem.
 */
import { describe, expect, it } from "vitest";
import {
  BLOCKED_REVIEW_STATUSES,
  PUBLICATION_STATUSES,
  PUBLICATION_TRANSITIONS,
  REVIEW_STATUSES,
  REVIEW_TRANSITIONS,
  canApproveImage,
  canTransitionPublication,
  canTransitionReview,
} from "@/catalog/types";
import { ROLE_PERMISSIONS, hasPermission } from "@/permissions/model";

describe("transições de revisão", () => {
  it("aceita todas as transições declaradas", () => {
    for (const from of REVIEW_STATUSES) {
      for (const to of REVIEW_TRANSITIONS[from]) {
        expect(canTransitionReview(from, to)).toBe(true);
      }
    }
  });

  it("recusa todas as transições não declaradas", () => {
    for (const from of REVIEW_STATUSES) {
      for (const to of REVIEW_STATUSES) {
        if (REVIEW_TRANSITIONS[from].includes(to)) continue;
        expect(canTransitionReview(from, to)).toBe(false);
      }
    }
  });

  it("não permite pular de DRAFT direto para READY_TO_PUBLISH", () => {
    expect(canTransitionReview("DRAFT", "READY_TO_PUBLISH")).toBe(false);
  });

  it("não permite sair de bloqueio direto para apto a publicar", () => {
    for (const blocked of BLOCKED_REVIEW_STATUSES) {
      expect(canTransitionReview(blocked, "READY_TO_PUBLISH")).toBe(false);
    }
  });
});

describe("transições de publicação", () => {
  it("aceita as transições declaradas quando o registro está apto", () => {
    for (const from of PUBLICATION_STATUSES) {
      for (const to of PUBLICATION_TRANSITIONS[from]) {
        expect(canTransitionPublication(from, to, "READY_TO_PUBLISH")).toBe(true);
      }
    }
  });

  it("recusa publicar registro bloqueado", () => {
    for (const blocked of BLOCKED_REVIEW_STATUSES) {
      expect(canTransitionPublication("NOT_PUBLISHED", "PUBLISHED", blocked)).toBe(false);
    }
  });

  it("recusa publicar registro apenas em revisão", () => {
    expect(canTransitionPublication("NOT_PUBLISHED", "PUBLISHED", "UNDER_REVIEW")).toBe(false);
    expect(canTransitionPublication("NOT_PUBLISHED", "PUBLISHED", "DRAFT")).toBe(false);
  });

  it("arquivamento é terminal", () => {
    expect(PUBLICATION_TRANSITIONS.ARCHIVED).toEqual([]);
    expect(canTransitionPublication("ARCHIVED", "PUBLISHED", "READY_TO_PUBLISH")).toBe(false);
  });

  it("não permite republicar diretamente de PUBLISHED", () => {
    expect(canTransitionPublication("PUBLISHED", "ARCHIVED", "READY_TO_PUBLISH")).toBe(false);
  });
});

describe("aprovação de imagem", () => {
  const base = {
    rightsStatus: "OWNED" as const,
    source: "produção própria",
    detectedBrand: null,
    matchesProduct: true,
  };

  it("aprova imagem própria, sem marca e correspondente", () => {
    expect(canApproveImage(base).ok).toBe(true);
  });

  it("recusa sem direito confirmado", () => {
    expect(canApproveImage({ ...base, rightsStatus: "RIGHTS_UNCONFIRMED" })).toMatchObject({
      ok: false,
    });
    expect(canApproveImage({ ...base, rightsStatus: "DO_NOT_PUBLISH" }).ok).toBe(false);
    expect(canApproveImage({ ...base, rightsStatus: "EXPIRED" }).ok).toBe(false);
  });

  it("recusa sem origem registrada", () => {
    expect(canApproveImage({ ...base, source: null }).ok).toBe(false);
  });

  it("recusa com marca visível detectada", () => {
    expect(canApproveImage({ ...base, detectedBrand: "walmur" }).ok).toBe(false);
  });

  it("recusa quando não corresponde ao produto", () => {
    expect(canApproveImage({ ...base, matchesProduct: false }).ok).toBe(false);
  });
});

describe("transições por papel", () => {
  it("apenas papéis com catalog.publish podem publicar", () => {
    expect(hasPermission(["GESTOR_DE_CATALOGO"], "catalog.publish")).toBe(true);
    expect(hasPermission(["ADMINISTRADOR"], "catalog.publish")).toBe(true);
    for (const role of ["AUTOR", "REVISOR_TECNICO", "COMERCIAL", "AUDITOR"] as const) {
      expect(hasPermission([role], "catalog.publish")).toBe(false);
    }
  });

  it("nenhum papel além de ADMINISTRADOR gerencia usuários", () => {
    for (const [role, perms] of Object.entries(ROLE_PERMISSIONS)) {
      if (role === "ADMINISTRADOR") continue;
      expect(perms).not.toContain("users.manage");
    }
  });
});
