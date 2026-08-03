import { describe, expect, it } from "vitest";

import {
  blocksSchema,
  checkContentCompliance,
  readingMinutes,
  relatedFamilySlugs,
  sanitizeText,
  sanitizeUrl,
  slugify,
  type ContentBlock,
} from "@/content/blocks";
import {
  CONTENT_STATUSES,
  canTransition,
  isEditable,
  isPublic,
  transitionsFrom,
} from "@/content/workflow";
import {
  CHANNEL_LIMITS,
  normalizeHashtags,
  renderSocialExport,
  suggestSocialDraft,
  validateSocialDraft,
} from "@/content/social";

const paragraph = (text: string): ContentBlock => ({ type: "paragraph", text });

describe("blocos estruturados", () => {
  it("remove HTML e scripts do texto", () => {
    expect(sanitizeText('<script>alert(1)</script>Manejo')).not.toContain("<script");
    expect(sanitizeText("<b>Ventilação</b>")).toBe("Ventilação");
  });

  it("aceita apenas endereços http(s)", () => {
    expect(sanitizeUrl("javascript:alert(1)")).toBeNull();
    expect(sanitizeUrl("https://avizee.com.br")).toBe("https://avizee.com.br");
  });

  it("rejeita blocos de tipo desconhecido", () => {
    expect(blocksSchema.safeParse([{ type: "html", value: "<div>" }]).success).toBe(false);
    expect(blocksSchema.safeParse([paragraph("Texto técnico de manejo.")]).success).toBe(true);
  });

  it("calcula tempo de leitura mínimo de 1 minuto", () => {
    expect(readingMinutes([paragraph("Texto curto.")])).toBeGreaterThanOrEqual(1);
  });

  it("extrai famílias relacionadas dos blocos", () => {
    const blocks = blocksSchema.parse([
      paragraph("Comparativo de bebedouros."),
      { type: "product_relation", familySlugs: ["bebedouro-nipple", "bebedouro-nipple"] },
    ]);
    expect(relatedFamilySlugs(blocks)).toEqual(["bebedouro-nipple"]);
  });

  it("gera slug sem acento e sem símbolo", () => {
    expect(slugify("Ventilação & Climatização")).toBe("ventilacao-climatizacao");
  });
});

describe("conformidade editorial", () => {
  it("bloqueia vocabulário de preço e promessa comercial", () => {
    const issues = checkContentCompliance({
      title: "Promoção de bebedouros com desconto",
      excerpt: null,
      blocks: [paragraph("Compre agora com preço especial e frete grátis.")],
    });
    expect(issues.length).toBeGreaterThan(0);
    expect(issues.some((issue) => issue.code === "FORBIDDEN_TERM")).toBe(true);
  });

  it("aprova conteúdo técnico sem marca nem preço", () => {
    const issues = checkContentCompliance({
      title: "Como avaliar a vazão do bebedouro nipple",
      excerpt: "Critérios técnicos de verificação em galpões de postura.",
      blocks: [
        paragraph(
          "A vazão adequada depende da idade das aves, da pressão da linha e da regulagem do regulador de pressão instalado no início da linha.",
        ),
      ],
    });
    expect(issues).toEqual([]);
  });
});

describe("fluxo editorial", () => {
  it("declara as situações aprovadas", () => {
    expect(CONTENT_STATUSES).toContain("DRAFT");
    expect(CONTENT_STATUSES).toContain("PUBLISHED");
  });

  it("não permite publicar direto do rascunho", () => {
    expect(canTransition("DRAFT", "PUBLISHED")).toBe(false);
    expect(canTransition("DRAFT", "IN_TECHNICAL_REVIEW")).toBe(true);
  });

  it("só o estado publicado é público", () => {
    expect(isPublic("PUBLISHED")).toBe(true);
    expect(isPublic("DRAFT")).toBe(false);
    expect(isPublic("ARCHIVED")).toBe(false);
  });

  it("conteúdo publicado não é editável diretamente", () => {
    expect(isEditable("PUBLISHED")).toBe(false);
    expect(isEditable("DRAFT")).toBe(true);
  });

  it("cada transição exige permissão declarada", () => {
    for (const status of CONTENT_STATUSES) {
      for (const transition of transitionsFrom(status)) {
        expect(transition.permission).toBeTruthy();
      }
    }
  });
});

describe("variantes sociais", () => {
  it("normaliza hashtags e respeita o limite do canal", () => {
    const tags = normalizeHashtags(["avicultura", "#Manejo", "inválida!"], "INSTAGRAM");
    expect(tags).toContain("#avicultura");
    expect(tags.length).toBeLessThanOrEqual(CHANNEL_LIMITS.INSTAGRAM.hashtags);
  });

  it("recusa legenda acima do limite do canal", () => {
    const issues = validateSocialDraft({
      channel: "LINKEDIN",
      headline: "Manejo de bebedouros",
      caption: "x".repeat(CHANNEL_LIMITS.LINKEDIN.caption + 1),
      hashtags: [],
      callToAction: "",
    });
    expect(issues.some((issue) => issue.field === "caption")).toBe(true);
  });

  it("sugere rascunho a partir do artigo e exporta texto para cópia manual", () => {
    const draft = suggestSocialDraft({
      channel: "INSTAGRAM",
      title: "Como avaliar a vazão do bebedouro nipple",
      excerpt: "Critérios técnicos de verificação em galpões de postura, sem preço e sem marca.",
      categoryName: "Manejo",
    });
    const text = renderSocialExport(draft, "https://avizee.com.br/conteudos/vazao-nipple");
    expect(text).toContain("Como avaliar");
    expect(text).not.toMatch(/R\$/);
  });
});
