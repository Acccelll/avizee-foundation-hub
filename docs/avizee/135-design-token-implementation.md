# 135 — Implementação dos Design Tokens

Origem normativa: `76-design-tokens.md`, `78-color-and-contrast-system.md`,
`design/tokens.json`. Nenhum valor novo foi criado nesta etapa.

## 1. Fonte única

`src/styles.css` é a única fonte dos valores visuais. Componentes consomem tokens
semânticos; literais de cor em componente são proibidos.

## 2. Cores de marca

| Token | Valor aprovado |
|---|---|
| `--color-brand-black` | `#151514` |
| `--color-brand-wine` | `#690500` |
| `--color-brand-terracotta` | `#b2592c` |
| `--color-brand-cream` | `#fffaed` |

## 3. Cores funcionais (D-056)

| Estado | Cor | Restrição |
|---|---|---|
| Sucesso | verde `#1f6b3c` | só feedback/estado |
| Informação | azul `#12557e` | só feedback/estado |
| Erro | Vinho da marca | — |
| Aviso | Terracota da marca | — |

Verde e azul **não** podem aparecer em branding, decoração, ícone institucional ou
gráfico. São cores externas à paleta, admitidas apenas por necessidade de acessibilidade.

## 4. Camadas semânticas

`background` · `surface` · `surface-alt` · `inverse` · `text-primary` ·
`text-secondary` · `text-muted` · `text-inverse` · `border` · `border-subtle` ·
`action-primary` · `emphasis` · `focus-ring` · feedback.

## 5. Regras de uso verificadas

- Estado nunca depende apenas de cor: sempre acompanha rótulo textual ou ícone
  (requisito WCAG 2.2 AA, `88`).
- Anel de foco visível em todo elemento interativo.
- Contraste conferido contra `design/color-contrast-matrix.csv`.
