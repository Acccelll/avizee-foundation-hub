/**
 * Conteúdo institucional APROVADO (Etapa 9 + fechamento pré-Etapa 15).
 *
 * Fonte única de verdade: `docs/avizee/05-business-positioning.md` (USER_DECISION),
 * `docs/avizee/84-public-page-wireframes.md` (PT-01, PT-04, PT-14, PT-15),
 * `docs/avizee/89-microcopy-and-content-ui-guidelines.md` e confirmações do usuário em 2026-08-10.
 *
 * Regras aplicadas:
 * - nenhum texto inventado: tudo aqui deriva de material aprovado;
 * - nenhum dado não confirmado é publicado — vira `PENDING`;
 * - nenhum preço, prazo, estoque, promessa logística ou marca de terceiro (R-03/R-04/R-05/R-11).
 */

/** Marcador de dado ainda não confirmado. Nunca substituído por inferência. */
export const PENDING = "DADO_PENDENTE" as const;

export interface PendingField {
  label: string;
  status: typeof PENDING;
  decision: string;
}

export interface ConfirmedField {
  label: string;
  value: string;
}

/** Posicionamento aprovado (doc 05, USER_DECISION — essência imutável). */
export const POSITIONING = {
  eyebrow: "Especialista em equipamentos para avicultura",
  headline: "Equipamentos, componentes, peças e soluções para avicultura",
  statement:
    "A AviZee é uma empresa especializada em equipamentos, componentes, peças de reposição e soluções para avicultura, com variedade especializada, atendimento ágil e atendimento consultivo para empresas de todo o Brasil.",
} as const;

/** Diferenciais aprovados (doc 05). Interpretação aprovada, sem ampliação. */
export const DIFFERENTIATORS = [
  {
    id: "variedade",
    title: "Variedade especializada",
    description:
      "Oferta de equipamentos, componentes, peças e soluções voltadas principalmente às diferentes necessidades da avicultura.",
  },
  {
    id: "agilidade",
    title: "Atendimento ágil",
    description:
      "Rapidez no retorno, identificação inicial da necessidade e preparação da cotação.",
  },
  {
    id: "consultivo",
    title: "Atendimento consultivo",
    description:
      "Apoio na identificação do produto, medida, variação ou componente adequado à aplicação apresentada.",
  },
] as const;

/** Públicos atendidos (doc 06 / posicionamento B2B). */
export const AUDIENCES = [
  "Granjas de postura e de corte",
  "Incubatórios",
  "Produtores integrados",
  "Empresas da cadeia avícola",
] as const;

/** Abrangência: nacional, sem promessa logística (R-11). */
export const NATIONAL_COVERAGE = {
  title: "Atendimento em todo o Brasil",
  description:
    "Atendemos empresas de todo o Brasil. Condições de fornecimento, quantidades e demais detalhes são confirmados durante a cotação.",
} as const;

/** Segmentos complementares — pontuais, nunca equiparados à avicultura. */
export const COMPLEMENTARY_SEGMENTS = {
  title: "Segmentos complementares",
  description:
    "Bovinocultura e suinocultura são atendidas de forma complementar e pontual, sob consulta. O foco principal da AviZee é a avicultura.",
} as const;

/** Como funciona a cotação (doc 84, PT-01 bloco 7). O-10: sem SLA público. */
export const QUOTATION_STEPS = [
  {
    step: 1,
    title: "Encontre os produtos",
    description: "Use a busca por nome ou código, ou navegue pelas categorias do catálogo.",
  },
  {
    step: 2,
    title: "Monte sua lista de cotação",
    description: "Adicione as famílias e variações desejadas e informe as quantidades.",
  },
  {
    step: 3,
    title: "Envie a solicitação",
    description:
      "Você recebe um protocolo e a equipe confirma especificações e condições no retorno.",
  },
] as const;

/** Microcopy de CTA aprovada. Termos de e-commerce são proibidos (doc 05). */
export const CTA = {
  catalog: "Conhecer produtos",
  quote: "Solicitar cotação",
  talk: "Falar com a equipe",
} as const;

/** Dados de contato confirmados explicitamente pelo usuário em 2026-08-10 (Q-08). */
export const CONTACT_DETAILS: ConfirmedField[] = [
  { label: "Telefone", value: "(19) 99898-2930" },
  { label: "WhatsApp", value: "(19) 99898-2930" },
  { label: "E-mail", value: "comercial@avizee.com.br" },
  {
    label: "Endereço",
    value: "Rua Diogo António Feijó, 111 — João Aranha, Paulínia/SP — CEP 13145-706",
  },
  { label: "Horário de atendimento", value: "Seg - Sáb, 08h - 18h" },
];

/** Dados legais e de privacidade já confirmados/aprovados. */
export const LEGAL_DETAILS: ConfirmedField[] = [
  { label: "Razão social", value: "AviZee Equipamentos LTDA" },
  { label: "CNPJ", value: "53.078.538/0001-85" },
  { label: "Canal de privacidade", value: "privacidade@avizee.com.br" },
  {
    label: "Retenção de cotações/leads",
    value: "24 meses após a última interação comercial, salvo obrigação aplicável",
  },
];

/** Q-13 remanescente: inventário final de operadores precisa refletir apenas serviços ativados. */
export const LEGAL_FIELDS: PendingField[] = [
  { label: "Provedores e operadores", status: PENDING, decision: "Q-13" },
];

/** Estrutura das páginas legais permanece em rascunho até o fechamento jurídico do conteúdo. */
export const LEGAL_DOCUMENTS = {
  privacy: {
    title: "Política de privacidade",
    version: "0.1",
    status: "RASCUNHO" as const,
    effectiveDate: null as string | null,
    sections: [
      "Quem é o controlador dos dados",
      "Dados pessoais coletados na lista de cotação",
      "Finalidade e base legal do tratamento",
      "Compartilhamento com operadores",
      "Prazo de retenção",
      "Direitos do titular e canal de atendimento",
      "Cookies e medidas de segurança",
    ],
  },
  terms: {
    title: "Termos de uso",
    version: "0.1",
    status: "RASCUNHO" as const,
    effectiveDate: null as string | null,
    sections: [
      "Objeto e aceitação",
      "Natureza informativa do catálogo (sem preço e sem venda on-line)",
      "Lista de cotação e ausência de pedido confirmado",
      "Propriedade intelectual",
      "Limitação de responsabilidade",
      "Legislação aplicável e foro",
    ],
  },
} as const;

/** Missão, visão e valores: NÃO aprovados — o bloco não é publicado. */
export const MISSION_VISION_VALUES_APPROVED = false;

/** Páginas consultivas por aplicação aprovadas no fechamento pré-Etapa 15. */
export const SOLUTION_DETAIL_PAGES_APPROVED = true;

/** Decisão final pré-Etapa 15: não ativar formulário geral de contato na v1. */
export const CONTACT_FORM_APPROVED = false;

/** Decisão final pré-Etapa 15: não carregar mapa externo na v1. */
export const MAP_APPROVED = false;

/** Central de Conteúdos é dinâmica; constante histórica mantida apenas por compatibilidade. */
export const PUBLISHED_ARTICLES = 0;

/** Mínimo de famílias para exibir o bloco de destaques (doc 84, PT-01 bloco 6). */
export const FEATURED_MIN = 4;
export const FEATURED_LIMIT = 4;
