# 557 — Etapa 15: evidência de orçamento de performance

## Veredito

`PERFORMANCE_BUILD_BUDGET_VALIDATED`

## Gate automatizado

Os budgets do doc. 116 agora são verificados no CI após o build. O gate falha quando o bundle gerado excede os limites definidos.

## Resultado do CI #249

HEAD: `fd9de79250ebf4db6e11411072b69ca56c1c5c11`

- maior JS, candidato ao bundle inicial: `main-CxyngKRI.js` — **150,24 KB gzip / 170 KB**;
- maior chunk adicional: `Select-D_gukUMu.js` — **18,54 KB gzip / 60 KB**;
- CSS total: **12,64 KB gzip / 60 KB**;
- HTML inicial das rotas públicas testadas: **≤ 100 KB**.

O step `Performance budget` passou no CI #249 (`31499412669`).

## Limites

- estes números são budgets de artefato/build, não métricas reais de usuário;
- LCP, INP, CLS e TTFB p75 reais somente podem ser certificados após ambiente produtivo e tráfego representativo;
- a Etapa 15 não altera CDN, DNS ou infraestrutura produtiva.
