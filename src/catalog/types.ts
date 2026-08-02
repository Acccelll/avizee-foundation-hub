/**
 * Tipos, estados e transições do catálogo (§9, §40 da Etapa 6).
 * Origem: 104-product-catalog-data-model.md.
 */
export const REVIEW_STATUSES = [
  "DRAFT",
  "UNDER_REVIEW",
  "BLOCKED_BY_CODE",
  "BLOCKED_BY_IDENTITY",
  "BLOCKED_BY_BRAND",
  "BLOCKED_BY_RIGHTS",
  "READY_TO_PUBLISH",
] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export const PUBLICATION_STATUSES = [
  "NOT_PUBLISHED",
  "PUBLISHED",
  "UNPUBLISHED",
  "ARCHIVED",
] as const;
export type PublicationStatus = (typeof PUBLICATION_STATUSES)[number];

export const IMAGE_STATUSES = [
  "APROVADA",
  "APROVADA_PARA_FAMILIA",
  "PENDENTE_MARCA_VISIVEL",
  "PENDENTE_BAIXA_QUALIDADE",
  "PENDENTE_IMAGEM_INCORRETA",
  "PENDENTE_DIREITO_DE_USO",
  "SEM_IMAGEM",
  "NAO_PUBLICAR",
  "PENDENTE_IDENTIFICACAO",
] as const;
export type ImageStatus = (typeof IMAGE_STATUSES)[number];

export const RIGHTS_STATUSES = [
  "OWNED",
  "AUTHORIZED_BY_SUPPLIER",
  "LICENSED",
  "RIGHTS_UNCONFIRMED",
  "RESTRICTED",
  "EXPIRED",
  "DO_NOT_PUBLISH",
] as const;
export type RightsStatus = (typeof RIGHTS_STATUSES)[number];

export const STAGING_STATUSES = [
  "PENDING_REVIEW",
  "MISSING_IDENTITY",
  "CODE_CONFLICT",
  "NAME_REVIEW",
  "BRAND_REVIEW",
  "IMAGE_REVIEW",
  "RIGHTS_REVIEW",
  "TAXONOMY_REVIEW",
  "DUPLICATE_SUSPECTED",
  "REJECTED",
  "READY_FOR_CANONICALIZATION",
] as const;
export type StagingStatus = (typeof STAGING_STATUSES)[number];

export const BLOCKED_REVIEW_STATUSES: ReviewStatus[] = [
  "BLOCKED_BY_CODE",
  "BLOCKED_BY_IDENTITY",
  "BLOCKED_BY_BRAND",
  "BLOCKED_BY_RIGHTS",
];

/** Transições de revisão permitidas (§40). Nada fora deste mapa é aceito. */
export const REVIEW_TRANSITIONS: Record<ReviewStatus, ReviewStatus[]> = {
  DRAFT: ["UNDER_REVIEW", "BLOCKED_BY_CODE", "BLOCKED_BY_IDENTITY", "BLOCKED_BY_BRAND", "BLOCKED_BY_RIGHTS"],
  UNDER_REVIEW: [
    "DRAFT",
    "READY_TO_PUBLISH",
    "BLOCKED_BY_CODE",
    "BLOCKED_BY_IDENTITY",
    "BLOCKED_BY_BRAND",
    "BLOCKED_BY_RIGHTS",
  ],
  BLOCKED_BY_CODE: ["UNDER_REVIEW", "DRAFT"],
  BLOCKED_BY_IDENTITY: ["UNDER_REVIEW", "DRAFT"],
  BLOCKED_BY_BRAND: ["UNDER_REVIEW", "DRAFT"],
  BLOCKED_BY_RIGHTS: ["UNDER_REVIEW", "DRAFT"],
  READY_TO_PUBLISH: ["UNDER_REVIEW", "DRAFT"],
};

export const PUBLICATION_TRANSITIONS: Record<PublicationStatus, PublicationStatus[]> = {
  NOT_PUBLISHED: ["PUBLISHED", "ARCHIVED"],
  PUBLISHED: ["UNPUBLISHED"],
  UNPUBLISHED: ["PUBLISHED", "ARCHIVED"],
  ARCHIVED: [],
};

export function canTransitionReview(from: ReviewStatus, to: ReviewStatus): boolean {
  return REVIEW_TRANSITIONS[from]?.includes(to) ?? false;
}

export function canTransitionPublication(
  from: PublicationStatus,
  to: PublicationStatus,
  reviewStatus: ReviewStatus,
): boolean {
  if (!PUBLICATION_TRANSITIONS[from]?.includes(to)) return false;
  // Registro bloqueado ou não revisado nunca vai para PUBLISHED (§40).
  if (to === "PUBLISHED" && reviewStatus !== "READY_TO_PUBLISH") return false;
  return true;
}

/** Direito de uso que autoriza aprovação de imagem (§17/§18). */
export const PUBLISHABLE_RIGHTS: RightsStatus[] = ["OWNED", "AUTHORIZED_BY_SUPPLIER", "LICENSED"];

export function canApproveImage(input: {
  rightsStatus: RightsStatus;
  source?: string | null;
  detectedBrand?: string | null;
  matchesProduct: boolean;
}): { ok: boolean; reason?: string } {
  if (!input.source) return { ok: false, reason: "origem não registrada" };
  if (!PUBLISHABLE_RIGHTS.includes(input.rightsStatus))
    return { ok: false, reason: "direito de uso não confirmado" };
  if (input.detectedBrand) return { ok: false, reason: "marca visível incompatível" };
  if (!input.matchesProduct) return { ok: false, reason: "correspondência com o produto não confirmada" };
  return { ok: true };
}
