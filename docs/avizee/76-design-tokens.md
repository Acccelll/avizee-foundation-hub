# 76 — Tokens de Design

Status: `PENDENTE_DE_APROVAÇÃO`. Fonte normativa: `10-brand-guidelines.md` (paleta e tipografia),
`02-non-negotiable-rules.md` (R-06, R-07), `13-open-decisions.md` (L-01, cores funcionais
pendentes). Nenhum valor aqui existe em `src/` hoje; esta é a proposta de tokenização a ser
avaliada antes de qualquer implementação.

## 1. Princípio de nomenclatura

Todo token é semântico (o que faz), não descritivo (o que parece). `color-action-primary`, não
`color-orange`. Escala de referência (primitivo) e camada semântica são documentadas separadas:
o primitivo nunca é referenciado diretamente por componente.

## 2. Cor — camada primitiva

Só a paleta oficial (4 cores) e neutros matematicamente derivados dela. Nenhuma cor fora desta
lista é um primitivo válido.

| Token primitivo | HEX | HSL |
|---|---|---|
| `--avizee-black` | `#151514` | `60 2.4% 8%` |
| `--avizee-wine` | `#690500` | `2.9 100% 20.6%` |
| `--avizee-terracotta` | `#b2592c` | `20.1 60.4% 43.5%` |
| `--avizee-cream` | `#fffaed` | `43.3 100% 96.5%` |

### 2.1 Neutros derivados (proposta)

Derivados por interpolação de luminosidade entre `--avizee-black` e `--avizee-cream`, mantendo o
matiz mais próximo do preto de marca (matiz 60°, quase acromático). Não são cores novas: são
gradações de preto/creme, permitidas por não introduzirem matiz estranho à paleta.

| Token | HSL | Uso previsto |
|---|---|---|
| `--neutral-950` | `60 2% 8%` | Igual a `--avizee-black`; texto de maior ênfase |
| `--neutral-800` | `60 2% 20%` | Texto secundário sobre creme |
| `--neutral-600` | `60 2% 38%` | Texto terciário, legendas |
| `--neutral-400` | `60 2% 58%` | Bordas, divisores |
| `--neutral-200` | `48 15% 88%` | Fundo de bloco alternado, tabela zebrada |
| `--neutral-100` | `45 40% 93%` | Fundo de card sobre creme |
| `--neutral-050` | `43.3 100% 96.5%` | Igual a `--avizee-cream`; fundo base |

## 3. Cor — camada semântica

| Token semântico | Mapeia para | Uso |
|---|---|---|
| `--color-bg-base` | `--avizee-cream` | Fundo padrão de página |
| `--color-bg-inverse` | `--avizee-black` | Fundo de seção institucional escura |
| `--color-bg-surface` | `--neutral-100` | Cards, blocos elevados sobre o fundo base |
| `--color-bg-surface-alt` | `--neutral-200` | Zebra de tabela, fundo alternado |
| `--color-text-primary` | `--avizee-black` | Texto principal sobre fundo claro |
| `--color-text-inverse` | `--avizee-cream` | Texto sobre fundo escuro/vinho/terracota |
| `--color-text-secondary` | `--neutral-800` | Texto de apoio, metadado |
| `--color-text-muted` | `--neutral-600` | Legenda, texto auxiliar de baixa ênfase |
| `--color-border-default` | `--neutral-400` | Bordas de input, divisor de seção |
| `--color-border-subtle` | `--neutral-200` | Divisor discreto entre linhas de tabela |
| `--color-brand-symbol` | `--avizee-wine` | Símbolo do logotipo sobre creme |
| `--color-brand-wordmark` | `--avizee-terracotta` | Wordmark sobre creme |
| `--color-action-primary` | `--avizee-terracotta` | Botão de ação primária ("Adicionar à lista de cotação") |
| `--color-action-primary-hover` | `--avizee-terracotta` escurecido 8% | Hover do botão primário |
| `--color-action-primary-text` | `--avizee-cream` | Texto sobre botão de ação primária |
| `--color-action-secondary` | transparente + borda `--avizee-wine` | Ação secundária (WhatsApp, "ver detalhes") |
| `--color-emphasis-institutional` | `--avizee-wine` | Ênfase institucional, símbolo, títulos de destaque |
| `--color-focus-ring` | `--avizee-wine` | Anel de foco visível em todo elemento interativo |

## 4. Cores funcionais — `PENDENTE_DE_APROVAÇÃO` (L-01)

Nenhuma cor de erro, sucesso, aviso ou informação foi aprovada. A proposta abaixo deriva
estritamente da paleta oficial, sem introduzir matiz novo, e existe apenas como ponto de partida
para aprovação — **não deve ser implementada em `src/` antes de decisão expressa**.

| Token proposto | Derivação | HSL proposto | Status |
|---|---|---|---|
| `--color-feedback-error` | `--avizee-wine`, mesma cor institucional reaproveitada | `2.9 100% 20.6%` | `PENDENTE_DE_APROVAÇÃO` |
| `--color-feedback-error-bg` | `--avizee-wine` a 8% de opacidade sobre creme | `2.9 60% 94%` | `PENDENTE_DE_APROVAÇÃO` |
| `--color-feedback-success` | `--avizee-black`, sem matiz de "verde" (fora da paleta) | `60 2.4% 8%` | `PENDENTE_DE_APROVAÇÃO` |
| `--color-feedback-warning` | `--avizee-terracotta` | `20.1 60.4% 43.5%` | `PENDENTE_DE_APROVAÇÃO` |
| `--color-feedback-info` | `--avizee-terracotta` a 60% de luminosidade | `20.1 45% 65%` | `PENDENTE_DE_APROVAÇÃO` |

Observação normativa: reaproveitar vinho para erro e terracota para aviso é a única forma de
comunicar estado sem sair da paleta de 4 cores; nenhum estado pode depender só da cor (P-06) —
todo estado funcional carrega texto e ícone, nunca cor isolada. Esta tabela não autoriza uso;
autoriza apenas a discussão de aprovação.

## 5. Tipografia — tokens

Ver detalhamento completo em `77-typography-system.md`. Tokens de referência:

| Token | Valor |
|---|---|
| `--font-family-base` | `"Montserrat", "Helvetica Neue", Arial, sans-serif` |
| `--font-weight-regular` | `400` |
| `--font-weight-medium` | `500` |
| `--font-weight-semibold` | `600` |
| `--font-weight-bold` | `700` |
| `--font-weight-extrabold` | `800` |

## 6. Espaçamento — base 4px

Escala geométrica sobre base 4px, nomeada por múltiplo, nunca por pixel bruto no componente.

| Token | Valor | Uso típico |
|---|---|---|
| `--space-1` | `4px` | Espaço mínimo, entre ícone e texto adjacente |
| `--space-2` | `8px` | Espaço entre elementos muito próximos |
| `--space-3` | `12px` | Padding interno de badge, chip |
| `--space-4` | `16px` | Padding interno padrão de card, gap de formulário |
| `--space-5` | `20px` | Espaço entre itens de lista |
| `--space-6` | `24px` | Padding interno de card grande, gap de grid |
| `--space-8` | `32px` | Espaço entre blocos relacionados |
| `--space-10` | `40px` | Espaço entre subseções |
| `--space-12` | `48px` | Espaço entre seções de página |
| `--space-16` | `64px` | Espaço entre seções principais da Home |
| `--space-20` | `80px` | Respiro editorial amplo, banner institucional |
| `--space-24` | `96px` | Respiro máximo, seções hero |

## 7. Raio

| Token | Valor | Uso |
|---|---|---|
| `--radius-none` | `0px` | Tabela, elementos que exigem alinhamento reto |
| `--radius-sm` | `4px` | Badge, chip, tag de categoria |
| `--radius-md` | `8px` | Botão, input, card pequeno |
| `--radius-lg` | `12px` | Card de produto, painel |
| `--radius-full` | `9999px` | Avatar, indicador circular, contador da lista de cotação |

## 8. Sombra

Reforço de `10-brand-guidelines.md`: "ausência total de gradientes, sombras e efeitos" na
composição de marca. Sombra é permitida apenas como recurso funcional discreto de elevação de
interface (não decorativo), sempre neutra, nunca colorida.

| Token | Valor | Uso |
|---|---|---|
| `--shadow-none` | nenhum | Padrão da maioria dos blocos |
| `--shadow-sm` | `0 1px 2px hsl(60 2% 8% / 0.06)` | Card sobre fundo, distinção mínima |
| `--shadow-md` | `0 4px 12px hsl(60 2% 8% / 0.10)` | Menu suspenso, popover |
| `--shadow-lg` | `0 12px 32px hsl(60 2% 8% / 0.14)` | Modal, painel sobreposto |

## 9. Borda

| Token | Valor |
|---|---|
| `--border-width-hairline` | `1px` |
| `--border-width-default` | `1px` |
| `--border-width-emphasis` | `2px` |
| `--border-width-focus` | `3px` |

## 10. Z-index

| Token | Valor | Uso |
|---|---|---|
| `--z-base` | `0` | Fluxo normal |
| `--z-sticky` | `10` | Cabeçalho fixo, CTA de cotação persistente |
| `--z-dropdown` | `20` | Menus suspensos, autocomplete de busca |
| `--z-overlay` | `30` | Fundo escurecido de modal |
| `--z-modal` | `40` | Modal, diálogo de confirmação |
| `--z-toast` | `50` | Notificação temporária (item adicionado à lista) |

## 11. Duração e easing

| Token | Valor | Uso |
|---|---|---|
| `--duration-instant` | `100ms` | Feedback de toque (hover, active) |
| `--duration-fast` | `150ms` | Transição de estado de componente |
| `--duration-base` | `220ms` | Abertura de menu, acordeão |
| `--duration-slow` | `320ms` | Modal, transição de página |
| `--easing-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Padrão geral |
| `--easing-enter` | `cubic-bezier(0, 0, 0.2, 1)` | Elementos entrando na tela |
| `--easing-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Elementos saindo da tela |

Nenhuma animação decorativa gratuita (`10-brand-guidelines.md`, usos inadequados). Movimento
existe só para comunicar mudança de estado, nunca como efeito.

## 12. Breakpoints e container

| Token | Valor | Referência |
|---|---|---|
| `--breakpoint-xs` | `360px` | Celular pequeno |
| `--breakpoint-sm` | `640px` | Celular grande / phablet |
| `--breakpoint-md` | `768px` | Tablet retrato |
| `--breakpoint-lg` | `1024px` | Tablet paisagem / notebook pequeno |
| `--breakpoint-xl` | `1280px` | Desktop |
| `--breakpoint-2xl` | `1536px` | Desktop grande |
| `--container-max-width` | `1280px` | Largura máxima de conteúdo |
| `--container-padding-mobile` | `16px` | Margem lateral em telas < 768px |
| `--container-padding-desktop` | `32px` | Margem lateral em telas ≥ 1024px |

Detalhamento de grid em `79-grid-spacing-and-layout.md`.

## 13. Bloco de referência CSS (proposta para `src/styles.css`)

Bloco preparado no formato HSL exigido pela convenção do arquivo atual (`--variável: H S% L%`,
consumida via `hsl(var(--variável))`). Este bloco é **proposta**; a adoção depende de aprovação e
de reconciliação com as variáveis já existentes no arquivo (`--background`, `--foreground` etc.),
que devem passar a apontar para os tokens semânticos abaixo em vez de valores neutros genéricos.

```css
:root {
  /* Primitivos de marca — não usar diretamente em componentes */
  --avizee-black: 60 2.4% 8%;
  --avizee-wine: 2.9 100% 20.6%;
  --avizee-terracotta: 20.1 60.4% 43.5%;
  --avizee-cream: 43.3 100% 96.5%;

  /* Neutros derivados */
  --neutral-950: 60 2% 8%;
  --neutral-800: 60 2% 20%;
  --neutral-600: 60 2% 38%;
  --neutral-400: 60 2% 58%;
  --neutral-200: 48 15% 88%;
  --neutral-100: 45 40% 93%;
  --neutral-050: 43.3 100% 96.5%;

  /* Semânticos — cor */
  --color-bg-base: var(--avizee-cream);
  --color-bg-inverse: var(--avizee-black);
  --color-bg-surface: var(--neutral-100);
  --color-bg-surface-alt: var(--neutral-200);
  --color-text-primary: var(--avizee-black);
  --color-text-inverse: var(--avizee-cream);
  --color-text-secondary: var(--neutral-800);
  --color-text-muted: var(--neutral-600);
  --color-border-default: var(--neutral-400);
  --color-border-subtle: var(--neutral-200);
  --color-brand-symbol: var(--avizee-wine);
  --color-brand-wordmark: var(--avizee-terracotta);
  --color-action-primary: var(--avizee-terracotta);
  --color-action-primary-text: var(--avizee-cream);
  --color-emphasis-institutional: var(--avizee-wine);
  --color-focus-ring: var(--avizee-wine);

  /* Cores funcionais — PENDENTE_DE_APROVACAO (L-01), não usar até decisão */
  --color-feedback-error: var(--avizee-wine);
  --color-feedback-warning: var(--avizee-terracotta);
  --color-feedback-success: var(--avizee-black);
  --color-feedback-info: 20.1 45% 65%;

  /* Tipografia */
  --font-family-base: "Montserrat", "Helvetica Neue", Arial, sans-serif;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Espaçamento base 4px */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;

  /* Raio */
  --radius-none: 0px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* Sombra (neutra, sem cor de marca) */
  --shadow-sm: 0 1px 2px hsl(var(--avizee-black) / 0.06);
  --shadow-md: 0 4px 12px hsl(var(--avizee-black) / 0.10);
  --shadow-lg: 0 12px 32px hsl(var(--avizee-black) / 0.14);

  /* Borda */
  --border-width-hairline: 1px;
  --border-width-default: 1px;
  --border-width-emphasis: 2px;
  --border-width-focus: 3px;

  /* Z-index */
  --z-base: 0;
  --z-sticky: 10;
  --z-dropdown: 20;
  --z-overlay: 30;
  --z-modal: 40;
  --z-toast: 50;

  /* Duração e easing */
  --duration-instant: 100ms;
  --duration-fast: 150ms;
  --duration-base: 220ms;
  --duration-slow: 320ms;
  --easing-standard: cubic-bezier(0.2, 0, 0, 1);
  --easing-enter: cubic-bezier(0, 0, 0.2, 1);
  --easing-exit: cubic-bezier(0.4, 0, 1, 1);

  /* Breakpoints (referência para uso em JS; media query usa valor literal) */
  --breakpoint-xs: 360px;
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
  --container-max-width: 1280px;
  --container-padding-mobile: 16px;
  --container-padding-desktop: 32px;
}
```

## 14. O que este documento não faz

Não altera `src/styles.css`. Não define modo escuro (ver `78-color-and-contrast-system.md`,
seção 7). Não aprova cores funcionais. A adoção efetiva depende de aprovação e de tarefa de
implementação específica, fora desta etapa documental.
