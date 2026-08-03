# 344 — Sli slo and operational targets

> Etapa 11 — Consolidação técnica e preparação pré-produção.
> Release candidate: **RC-AVIZEE-01** · Data: 2026-08-03 · Ambiente: homologação/preview.
> **Produção não alterada. DNS não alterado. Site atual intacto.**

## SLIs e metas iniciais
Registrados em `stage-11-sli-slo.csv`. São metas técnicas internas, **não** SLA comercial e **não** devem ser divulgadas publicamente.

| SLI | Meta inicial |
|---|---|
| Disponibilidade pública | 99,5% mensal |
| Latência p75 das páginas públicas | ≤ 1,2 s |
| Sucesso de submissão de cotação | ≥ 99,9% |
| Persistência da cotação submetida | 100% (perda zero) |
| Entrega de notificação (após DEP-T1) | ≥ 99% em 15 min |
| Latência p95 da busca | ≤ 600 ms |
| Sucesso de publicação editorial | ≥ 99% |
| Sucesso de backup diário | 100% |
| RTO de restauração | ≤ 4 h |
| RPO | ≤ 24 h |

RTO e RPO permanecem estimados até a execução do teste real de restauração (B11-07).
