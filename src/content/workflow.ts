/**
 * Fluxo editorial da Central de Conteúdos (Etapa 10).
 *
 * Máquina de estados explícita: nenhuma transição implícita, nenhuma
 * publicação direta a partir de rascunho. Cada transição declara a permissão
 * exigida, para que a verificação aconteça sempre no servidor.
 */
import type { Permission } from "@/permissions/model";

export const CONTENT_STATUSES = [
  "DRAFT",
  "IN_TECHNICAL_REVIEW",
  "IN_EDITORIAL_REVIEW",
  "CHANGES_REQUESTED",
  "READY_TO_PUBLISH",
  "PUBLISHED",
  "UNPUBLISHED",
  "ARCHIVED",
] as const;

export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export const CONTENT_STATUS_LABEL: Record<ContentStatus, string> = {
  DRAFT: "Rascunho",
  IN_TECHNICAL_REVIEW: "Em revisão técnica",
  IN_EDITORIAL_REVIEW: "Em revisão editorial",
  CHANGES_REQUESTED: "Ajustes solicitados",
  READY_TO_PUBLISH: "Pronto para publicar",
  PUBLISHED: "Publicado",
  UNPUBLISHED: "Despublicado",
  ARCHIVED: "Arquivado",
};

export interface Transition {
  from: ContentStatus;
  to: ContentStatus;
  permission: Permission;
  /** Exige conformidade editorial integral (sem marca, sem termo proibido). */
  requiresCompliance: boolean;
  label: string;
}

export const TRANSITIONS: readonly Transition[] = [
  {
    from: "DRAFT",
    to: "IN_TECHNICAL_REVIEW",
    permission: "content.submit_review",
    requiresCompliance: false,
    label: "Enviar para revisão técnica",
  },
  {
    from: "CHANGES_REQUESTED",
    to: "IN_TECHNICAL_REVIEW",
    permission: "content.submit_review",
    requiresCompliance: false,
    label: "Reenviar para revisão técnica",
  },
  {
    from: "IN_TECHNICAL_REVIEW",
    to: "IN_EDITORIAL_REVIEW",
    permission: "content.technical_review",
    requiresCompliance: false,
    label: "Aprovar tecnicamente",
  },
  {
    from: "IN_TECHNICAL_REVIEW",
    to: "CHANGES_REQUESTED",
    permission: "content.technical_review",
    requiresCompliance: false,
    label: "Solicitar ajustes",
  },
  {
    from: "IN_EDITORIAL_REVIEW",
    to: "READY_TO_PUBLISH",
    permission: "content.editorial_review",
    requiresCompliance: true,
    label: "Aprovar editorialmente",
  },
  {
    from: "IN_EDITORIAL_REVIEW",
    to: "CHANGES_REQUESTED",
    permission: "content.editorial_review",
    requiresCompliance: false,
    label: "Solicitar ajustes",
  },
  {
    from: "READY_TO_PUBLISH",
    to: "PUBLISHED",
    permission: "content.publish",
    requiresCompliance: true,
    label: "Publicar",
  },
  {
    from: "READY_TO_PUBLISH",
    to: "CHANGES_REQUESTED",
    permission: "content.editorial_review",
    requiresCompliance: false,
    label: "Devolver para ajustes",
  },
  {
    from: "PUBLISHED",
    to: "UNPUBLISHED",
    permission: "content.publish",
    requiresCompliance: false,
    label: "Despublicar",
  },
  {
    from: "UNPUBLISHED",
    to: "READY_TO_PUBLISH",
    permission: "content.publish",
    requiresCompliance: true,
    label: "Preparar republicação",
  },
  {
    from: "UNPUBLISHED",
    to: "ARCHIVED",
    permission: "content.archive",
    requiresCompliance: false,
    label: "Arquivar",
  },
  {
    from: "CHANGES_REQUESTED",
    to: "ARCHIVED",
    permission: "content.archive",
    requiresCompliance: false,
    label: "Arquivar",
  },
  {
    from: "DRAFT",
    to: "ARCHIVED",
    permission: "content.archive",
    requiresCompliance: false,
    label: "Arquivar",
  },
];

/** Estados em que o artigo pode ser editado livremente. */
export const EDITABLE_STATUSES: readonly ContentStatus[] = [
  "DRAFT",
  "CHANGES_REQUESTED",
  "IN_TECHNICAL_REVIEW",
  "IN_EDITORIAL_REVIEW",
];

export function isEditable(status: ContentStatus): boolean {
  return EDITABLE_STATUSES.includes(status);
}

export function findTransition(from: ContentStatus, to: ContentStatus): Transition | null {
  return TRANSITIONS.find((t) => t.from === from && t.to === to) ?? null;
}

export function canTransition(from: ContentStatus, to: ContentStatus): boolean {
  return findTransition(from, to) !== null;
}

export function transitionsFrom(status: ContentStatus): Transition[] {
  return TRANSITIONS.filter((t) => t.from === status);
}

export function isContentStatus(value: string): value is ContentStatus {
  return (CONTENT_STATUSES as readonly string[]).includes(value);
}

/** Estado público: apenas PUBLISHED aparece na Central. */
export function isPublic(status: ContentStatus): boolean {
  return status === "PUBLISHED";
}
