# 343 — Health checks and alerting

> Etapa 11 — Consolidação técnica e preparação pré-produção.
> Release candidate: **RC-AVIZEE-01** · Data: 2026-08-03 · Ambiente: homologação/preview.
> **Produção não alterada. DNS não alterado. Site atual intacto.**

## Endpoints
| Endpoint | Função | Conteúdo |
|---|---|---|
| `/api/public/liveness` | Processo vivo | status + ambiente |
| `/api/public/readiness` | Prontidão por componente | status por componente, sem detalhe interno |
| `/api/public/health` | Compatibilidade (Etapa 5) | status agregado |

## Classificação
Componentes críticos: aplicação, configuração, banco, migrations. Falha crítica ⇒ `unavailable` (503). Falha de dependência não crítica (e-mail, storage) ⇒ `degraded` com HTTP 200, pois o fluxo principal continua.

## Alertas
Definidos em `stage-11-alerts.csv` com severidade, limite, janela, canal, responsável, ação e escalonamento. Limites foram escolhidos para evitar ruído (janelas mínimas de 5 a 15 minutos e limiares relativos).
