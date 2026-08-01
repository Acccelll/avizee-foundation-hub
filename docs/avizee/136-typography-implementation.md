# 136 — Implementação Tipográfica

Origem normativa: `77-typography-system.md`, D-031, D-046, D-057.

## 1. Fonte

**Montserrat convencional**, fonte única do projeto. Montserrat Alternates é
**proibida** na v1 (D-031).

Entrega via `@fontsource-variable/montserrat` (WOFF2 self-host, sem CDN de terceiro),
importado em `src/styles.css`. Isso satisfaz D-046 (self-host WOFF2) e evita requisição
externa que comprometeria privacidade e performance.

## 2. Pesos em uso

| Uso | Peso |
|---|---|
| Corpo | 400 |
| Ênfase e rótulos | 500 |
| Subtítulos e botões | 600 |
| Títulos | 700 / 800 |

A fonte variável cobre a faixa contínua; não há arquivo estático por peso.

## 3. SKU (D-057)

SKU é exibido em **Montserrat 500/600** com `font-variant-numeric: tabular-nums`.
É **proibido** introduzir uma segunda família monoespaçada.

## 4. Itálico

O acervo recebido não tinha itálicos. A fonte variável do pacote cobre apenas o eixo de
peso; itálico sintético é proibido. Consequência prática: o projeto não usa itálico —
ênfase se faz por peso. Registrado em `155` como DV-05-02.

## 5. Legibilidade

Corpo mínimo 16px, altura de linha 1.5 em texto corrido, medida de leitura limitada,
sem texto justificado.
