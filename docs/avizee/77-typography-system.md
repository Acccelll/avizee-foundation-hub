# 77 — Sistema Tipográfico

Status: `PENDENTE_DE_APROVAÇÃO`. Fonte: `10-brand-guidelines.md`, D-031, D-046 (self-host WOFF2).

## 1. Família e pesos permitidos

Única família: **Montserrat** convencional. Montserrat Alternates é proibida (D-031) — não é
carregada, não é referenciada em nenhum CSS ou componente.

| Peso | Valor | Uso permitido |
|---|---|---|
| Regular | 400 | Corpo de texto, parágrafo, legenda |
| Medium | 500 | Código de SKU, rótulo de especificação |
| SemiBold | 600 | Subtítulo, botão, código de SKU em destaque |
| Bold | 700 | Título de seção, título principal em telas densas |
| ExtraBold | 800 | Título hero da Home, títulos institucionais |

Pesos Hairline, Thin, UltraLight, ExtraLight e Light do pacote recebido não têm uso aprovado:
contraste insuficiente em textos pequenos e incompatibilidade com a leitura técnica exigida por
P-01. Ficam registrados como disponíveis, não como aprovados.

Não há itálico real (confirmado em `10-brand-guidelines.md`): nenhum componente aplica
`font-style: italic`, para não depender de sintetização do navegador.

## 2. Escala tipográfica modular

Razão 1.25 (terça maior), base 16px, arredondada a valores práticos.

| Token | Tamanho desktop | Tamanho mobile (clamp) | Peso padrão | Uso |
|---|---|---|---|---|
| `--text-display` | 48px | `clamp(32px, 6vw, 48px)` | 800 | Hero da Home |
| `--text-h1` | 36px | `clamp(26px, 5vw, 36px)` | 700/800 | Título único da página |
| `--text-h2` | 28px | `clamp(22px, 4vw, 28px)` | 700 | Título de seção |
| `--text-h3` | 22px | `clamp(19px, 3vw, 22px)` | 600/700 | Subtítulo, título de card |
| `--text-h4` | 18px | `clamp(16px, 2.5vw, 18px)` | 600 | Título de bloco menor, rótulo de grupo |
| `--text-body-lg` | 18px | 16px | 400 | Introdução de página, lide editorial |
| `--text-body` | 16px | 16px | 400 | Corpo padrão |
| `--text-body-sm` | 14px | 14px | 400 | Texto de apoio, legenda de tabela |
| `--text-caption` | 12px | 12px | 500 | Metadado, rótulo de badge, aviso de imagem ilustrativa |
| `--text-code` | 14px | 14px | 500/600 | Código de SKU |

## 3. Line-height e letter-spacing

| Categoria | Line-height | Letter-spacing | Motivo |
|---|---|---|---|
| Display / H1 | 1.1 | `-0.01em` | Blocos de poucas palavras, leitura rápida |
| H2 / H3 / H4 | 1.25 | `-0.005em` | Compacidade sem perda de clareza |
| Corpo (body, body-sm) | 1.6 | `0em` | Leitura confortável de texto corrido e especificação |
| Caption | 1.4 | `0.01em` | Textos pequenos legíveis mesmo minúsculos |
| Código de SKU | 1.4 | `0.02em` | Espaçamento levemente aberto reduz confusão entre caracteres |

## 4. Medida de linha (measure)

- Corpo de texto editorial (artigo, descrição institucional): 60 a 75 caracteres por linha,
  controlado por `max-width` em `ch` no bloco de texto, nunca na página inteira.
- Texto técnico em tabela ou ficha de especificação: sem limite de measure — a tabela governa a
  largura da coluna.
- Título (H1 a H4): sem limite de measure aplicado; a quebra é natural pelo container.

## 5. Tratamento do código de SKU

O código AviZee é o dado mais consultado por comprador recorrente (P-02). Regras:

- Fonte: Montserrat Medium ou SemiBold, nunca Regular abaixo de 14px.
- **Tabular numbers obrigatório**: `font-variant-numeric: tabular-nums;` em todo elemento que
  exiba código de SKU, garantindo alinhamento vertical em tabela de variações.
- Nunca sofre `text-transform: lowercase`; sempre exibido como registrado (maiúsculas e números).
- Nunca quebra entre letra e número: `white-space: nowrap` no token do código.
- Contraste mínimo do código contra o fundo: 4.5:1 (mesmo padrão de texto de corpo, não de UI
  decorativa), calculado em `78-color-and-contrast-system.md`.
- Em resultado de busca, o trecho correspondente à consulta digitada é destacado com peso 700,
  nunca só com cor.

## 6. Self-host e carregamento (D-046)

- Arquivos servidos como **WOFF2**, convertidos localmente a partir do pacote OTF/TTF recebido
  (`30-font-inventory.md`); nenhuma requisição a CDN de terceiro (Google Fonts ou similar).
- `<link rel="preload" as="font" type="font/woff2" crossorigin>` para os pesos críticos de
  primeira dobra: Regular 400 e SemiBold 600. Os demais pesos carregam sob demanda via
  `@font-face`, sem preload, para não penalizar o tempo de carregamento inicial.
- `font-display: swap` em todo `@font-face`, para que o texto renderize com a fonte de fallback
  imediatamente e substitua assim que Montserrat carregar, sem bloquear a leitura.
- Subconjunto de caracteres (subsetting) recomendado: Latin + Latin Extended (acentuação
  portuguesa), reduzindo o peso do arquivo.

## 7. Fallback stack

```css
--font-family-base: "Montserrat", "Helvetica Neue", Arial, sans-serif;
```

Critério de escolha: Helvetica Neue e Arial têm proporção de caractere e altura de x-height
próximas de Montserrat, minimizando o salto visual (layout shift) durante o `swap`.

## 8. Comportamento responsivo

- Todos os tamanhos de título usam `clamp(min, preferred, max)`, evitando saltos abruptos entre
  breakpoints e garantindo leitura confortável tanto em tela de 360px quanto em desktop largo.
- O corpo de texto **não** usa `clamp`: permanece fixo em 16px em qualquer largura, por ser o
  tamanho mínimo confortável de leitura prolongada (reforça P-08 — leitura em campo).
- Código de SKU **não** reduz abaixo de 14px em nenhuma largura de tela, mesmo dentro de tabela
  densa em mobile (ver versão em cartões da tabela de variações, `47-page-type-definitions.md`).

## 9. O que este documento não define

Não define fonte funcional para modo escuro (não há modo escuro na v1, ver `78`, seção 7). Não
aprova o uso de Montserrat Alternates em nenhuma hipótese sem decisão expressa e documento
próprio de proposta visual, conforme D-031.
