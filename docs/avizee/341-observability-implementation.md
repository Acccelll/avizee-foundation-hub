# 341 — Observability implementation

> Etapa 11 — Consolidação técnica e preparação pré-produção.
> Release candidate: **RC-AVIZEE-01** · Data: 2026-08-03 · Ambiente: homologação/preview.
> **Produção não alterada. DNS não alterado. Site atual intacto.**

## Implementado nesta etapa
- `src/observability/metrics.ts` — registro fechado de métricas, rótulos em allowlist, normalização de cardinalidade, proibição de PII em labels.
- `src/observability/health.ts` — classificação `healthy` / `degraded` / `unavailable`, com componentes críticos e não críticos separados.
- `src/routes/api/public/liveness.ts` — liveness sem dependências externas.
- `src/routes/api/public/readiness.ts` — readiness por componente, sem detalhe interno.
- `tests/unit/observability.test.ts` — 7 testes cobrindo classificação, PII em rótulos e agregação.

Já existente e mantido: `src/lib/logger.ts` (log estruturado com redação) e `src/lib/audit.server.ts` (auditoria imutável em banco).

## Cobertura
Aplicação, banco, autenticação, catálogo, busca, cotação, outbox, e-mail, CMS, storage, migrations e backups — conforme `stage-11-metrics.csv` e `stage-11-health-checks.csv`.

## Limite
Nenhuma PII integral é registrada. Métricas são voláteis por worker e não substituem a auditoria em banco.
