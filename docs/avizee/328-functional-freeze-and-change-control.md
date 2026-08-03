# 328 — Functional freeze and change control

> Etapa 11 — Consolidação técnica e preparação pré-produção.
> Release candidate: **RC-AVIZEE-01** · Data: 2026-08-03 · Ambiente: homologação/preview.
> **Produção não alterada. DNS não alterado. Site atual intacto.**

## Congelamento
A partir da abertura da homologação de RC-AVIZEE-01:
- nenhuma funcionalidade nova é aceita;
- layout, taxonomia e conteúdo editorial aprovado não podem ser alterados;
- somente correções de defeito P0/P1/P2 aprovadas entram.

## Fluxo de correção
1. Registro do defeito em `stage-11-defects.csv` com severidade.
2. Análise de impacto e identificação dos testes afetados.
3. Correção com teste automatizado correspondente.
4. Reexecução da suíte completa (regressão das Etapas 5 a 10).
5. Incremento da RC e novo registro em `stage-11-release-candidates.csv`.

## Proibições durante o congelamento
Evolução de escopo misturada à estabilização; alteração silenciosa da mesma RC; desativação de teste para obter resultado verde; redução de regra de lint/typecheck.
