# 352 — Performance and load validation

> Etapa 11 — Consolidação técnica e preparação pré-produção.
> Release candidate: **RC-AVIZEE-01** · Data: 2026-08-03 · Ambiente: homologação/preview.
> **Produção não alterada. DNS não alterado. Site atual intacto.**

## Baseline
Medições em homologação, registradas em `stage-11-performance.csv` (TTFB, LCP, INP, CLS, peso de HTML/JS/CSS/imagens/fontes, cache frio e quente, mobile e rede limitada).

Destaques: HTML servido pelo servidor com conteúdo essencial; fontes Montserrat self-hosted em WOFF2 com preload dos pesos críticos; imagens com dimensões declaradas, evitando deslocamento de layout.

Nenhuma alteração de layout foi feita para melhorar métrica.

## Carga
Teste proporcional e não destrutivo, apenas em homologação, com cotações sintéticas e sem qualquer envio de e-mail externo. Parâmetros e resultados em `stage-11-load-tests.csv`.

Escopo: listagem pública, busca, filtros, página de família, artigo, submissão sintética de cotação, processamento da outbox e painel. Nenhum teste foi executado contra produção.
