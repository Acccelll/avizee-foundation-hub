/**
 * Preparação de conteúdo para Instagram e LinkedIn (Etapa 10).
 *
 * REGRA DE ESCOPO: nenhuma postagem automática, nenhuma integração com API de
 * rede social, nenhuma credencial de terceiro. Esta camada apenas PREPARA o
 * texto e registra que ele foi exportado manualmente pela equipe.
 */
import { sanitizeText, type ContentBlock, blocksToPlainText } from "@/content/blocks";

export const SOCIAL_CHANNELS = ["INSTAGRAM", "LINKEDIN"] as const;
export type SocialChannel = (typeof SOCIAL_CHANNELS)[number];

export const SOCIAL_VARIANT_STATUSES = ["DRAFT", "READY", "EXPORTED"] as const;
export type SocialVariantStatus = (typeof SOCIAL_VARIANT_STATUSES)[number];

export const SOCIAL_VARIANT_STATUS_LABEL: Record<SocialVariantStatus, string> = {
  DRAFT: "Rascunho",
  READY: "Pronto para exportar",
  EXPORTED: "Exportado manualmente",
};

/** Limites operacionais por canal. Conservadores e verificáveis. */
export const CHANNEL_LIMITS: Record<
  SocialChannel,
  { caption: number; hashtags: number; headline: number }
> = {
  INSTAGRAM: { caption: 2200, hashtags: 15, headline: 80 },
  LINKEDIN: { caption: 2800, hashtags: 5, headline: 120 },
};

export const CHANNEL_LABEL: Record<SocialChannel, string> = {
  INSTAGRAM: "Instagram",
  LINKEDIN: "LinkedIn",
};

export function isSocialChannel(value: string): value is SocialChannel {
  return (SOCIAL_CHANNELS as readonly string[]).includes(value);
}

/** Normaliza uma hashtag: sem espaço, sem acento, sem símbolo. */
export function normalizeHashtag(value: string): string | null {
  const clean = sanitizeText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]/g, "");
  return clean.length >= 2 ? `#${clean}` : null;
}

export function normalizeHashtags(values: string[], channel: SocialChannel): string[] {
  const limit = CHANNEL_LIMITS[channel].hashtags;
  const out: string[] = [];
  for (const value of values) {
    const tag = normalizeHashtag(value);
    if (tag && !out.includes(tag)) out.push(tag);
    if (out.length >= limit) break;
  }
  return out;
}

export interface SocialDraft {
  channel: SocialChannel;
  headline: string;
  caption: string;
  hashtags: string[];
  callToAction: string;
}

/**
 * Sugestão inicial derivada do artigo aprovado. É apenas ponto de partida:
 * o texto final é sempre revisado por pessoa antes de ficar `READY`.
 */
export function suggestSocialDraft(input: {
  channel: SocialChannel;
  title: string;
  excerpt: string | null;
  blocks: ContentBlock[];
  categoryName: string | null;
}): SocialDraft {
  const limits = CHANNEL_LIMITS[input.channel];
  const body = input.excerpt?.trim() || blocksToPlainText(input.blocks);
  const caption = sanitizeText(body).slice(0, limits.caption - 120);
  const hashtags = normalizeHashtags(
    ["avicultura", "AviZee", input.categoryName ?? "conteudo tecnico"],
    input.channel,
  );

  return {
    channel: input.channel,
    headline: sanitizeText(input.title).slice(0, limits.headline),
    caption,
    hashtags,
    callToAction:
      input.channel === "INSTAGRAM"
        ? "Conteúdo completo no site da AviZee."
        : "Leia o conteúdo completo no site da AviZee.",
  };
}

export interface SocialIssue {
  field: "headline" | "caption" | "hashtags";
  detail: string;
}

/** Validação de limite por canal. Um item só fica `READY` sem problemas. */
export function validateSocialDraft(draft: SocialDraft): SocialIssue[] {
  const limits = CHANNEL_LIMITS[draft.channel];
  const issues: SocialIssue[] = [];
  if (draft.headline.trim().length === 0) {
    issues.push({ field: "headline", detail: "título obrigatório" });
  }
  if (draft.headline.length > limits.headline) {
    issues.push({ field: "headline", detail: `máximo de ${limits.headline} caracteres` });
  }
  if (draft.caption.trim().length < 40) {
    issues.push({ field: "caption", detail: "legenda muito curta (mínimo 40 caracteres)" });
  }
  if (draft.caption.length > limits.caption) {
    issues.push({ field: "caption", detail: `máximo de ${limits.caption} caracteres` });
  }
  if (draft.hashtags.length > limits.hashtags) {
    issues.push({ field: "hashtags", detail: `máximo de ${limits.hashtags} marcadores` });
  }
  if (draft.hashtags.some((tag) => !/^#[A-Za-z0-9]{2,}$/.test(tag))) {
    issues.push({ field: "hashtags", detail: "marcador em formato inválido" });
  }
  return issues;
}

/** Texto final para cópia manual. Nunca é enviado a nenhum serviço externo. */
export function renderSocialExport(draft: SocialDraft, articleUrl: string | null): string {
  return [
    draft.headline,
    "",
    draft.caption,
    "",
    draft.callToAction,
    articleUrl ? `\n${articleUrl}` : "",
    "",
    draft.hashtags.join(" "),
  ]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
