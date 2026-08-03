# 327 — Release candidate definition

> Etapa 11 — Consolidação técnica e preparação pré-produção.
> Release candidate: **RC-AVIZEE-01** · Data: 2026-08-03 · Ambiente: homologação/preview.
> **Produção não alterada. DNS não alterado. Site atual intacto.**

## Identificação

| Campo | Valor |
|---|---|
| Release candidate | RC-AVIZEE-01 |
| Data | 2026-08-03 |
| Branch | main (workspace Lovable) |
| Ambiente | preview/homologação |
| Versão da aplicação | 0.11.0-rc1 |
| Versão do banco | migrations das Etapas 5 a 10 aplicadas |
| Escopo | Etapas 5 a 10 consolidadas + observabilidade da Etapa 11 |
| Testes | 234 verdes |
| Aprovação | pendente (UAT e jurídico) |

## Conteúdo da RC
- Catálogo canônico: 31 famílias, 97 SKUs, 6 categorias públicas.
- Cotação transacional com protocolo `AVZ-AAAA-XXXXXXXX`, outbox e painel comercial.
- Camada institucional com campos pendentes exibidos como "informação em confirmação".
- Central de Conteúdos e CMS editorial com workflow completo.
- Observabilidade: logs estruturados com redação, métricas sem PII, liveness e readiness.

## Regra de imutabilidade
RC-AVIZEE-01 está congelada. Correções posteriores geram `RC-AVIZEE-02`, `RC-AVIZEE-03` e assim por diante, com registro em `stage-11-release-candidates.csv`.
