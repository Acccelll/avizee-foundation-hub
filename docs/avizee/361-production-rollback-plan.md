# 361 — Production rollback plan

> Etapa 11 — Consolidação técnica e preparação pré-produção.
> Release candidate: **RC-AVIZEE-01** · Data: 2026-08-03 · Ambiente: homologação/preview.
> **Produção não alterada. DNS não alterado. Site atual intacto.**

Checklist em `stage-11-rollback-checklist.csv`.

## Gatilhos
Perda ou corrupção de dados; vazamento de dado interno ou pessoal; cotação não registrada; indisponibilidade acima da janela acordada; migration com falha irrecuperável; indexação indevida do ambiente errado.

## Autoridade e prazo
A decisão cabe ao responsável técnico designado no plano de cutover, em conjunto com o responsável do cliente, dentro de 30 minutos após a detecção.

## Escopo do rollback
Frontend, backend, banco (restauração de snapshot pré-cutover), migrations (nova migration corretiva, nunca edição), storage, DNS (retorno ao apontamento anterior), redirects, robots, sitemap, e-mail (suspensão de envio) e analytics (desativação).

## Verificação pós-rollback
Site legado respondendo, cotações preservadas, ausência de indexação indevida, comunicação registrada. O rollback é procedimento escrito e testado — nunca ação improvisada.
