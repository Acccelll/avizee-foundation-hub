# 30 — Inventário Tipográfico

Origem: S-06 (`Montserrat.zip`).

## Montserrat (família aprovada)

| Peso | OTF | TTF |
|---|---|---|
| Hairline | ✓ | — |
| Thin | ✓ | — |
| UltraLight | ✓ | — |
| ExtraLight | ✓ | — |
| Light | ✓ | — |
| Regular | ✓ | ✓ |
| Medium | ✓ | — |
| SemiBold | ✓ | — |
| Bold | ✓ | ✓ |
| ExtraBold | ✓ | — |
| Black | ✓ | — |

11 pesos em OTF, 2 em TTF. **Nenhum itálico** em nenhum peso.

## Montserrat Alternates

9 pesos OTF recebidos (Thin → Black). **Proibida na v1** por D-031 (L-08). Os arquivos não devem
ser empacotados no build.

## Lacunas

| # | Item | Impacto |
|---|---|---|
| 1 | Sem WOFF2 / WOFF | self-host exige conversão (O-24, aberto) |
| 2 | Sem itálicos | ênfase precisa ser resolvida por peso ou caixa, nunca por itálico sintético |
| 3 | Sem arquivo de licença no pacote | uso e redistribuição não comprovados documentalmente |
| 4 | Sem variable font | mais requisições ou mais bytes no self-host |

`TECHNICAL_INFERENCE` — Raciocínio: Montserrat é distribuída sob SIL Open Font License, o que
normalmente permite self-host e conversão para WOFF2. Como **nenhum arquivo de licença veio no
pacote**, isso é registrado como inferência e não como fato comprovado; a confirmação documental
fica pendente.

## Uso no site atual

Google Fonts, apenas 3 pesos (400/600/700), via `preload` + `onload`, com `<noscript>` de
fallback. Terceiro no caminho crítico de renderização (F-18).

## Escala tipográfica

Nenhuma escala, entrelinha ou par de pesos foi definida em qualquer fonte recebida. A definição
pertence à etapa de design system.
