# 185 — Rastreabilidade e Evidências da Etapa 6

| Requisito | Origem | Implementação | Evidência |
|---|---|---|---|
| R-04 sem preço | `02` | Modelo sem coluna de preço | Testes de serialização |
| R-05 sem marca pública | `02`, D-035 | `brand-terms.ts`, serializador | `leak-check`: 0 ocorrências |
| D-033 placeholder | `09` | `PLACEHOLDER_IMAGE` | Documento 168 |
| D-037 UUID | `01` | Chave primária UUID | Documento 160 |
| D-052/D-053 escopo | `01` | Lote de 31/97 | Documento 176 |
| DT-02 Postgres com RLS | `129` | Migrações com RLS e GRANT | Documento 181 |
| DV-05-01 auth real | `155` | Supabase Auth | Documento 158 |
| DV-05-06 auditoria | `155` | `audit_logs` imutável | Documento 180 |
| DV-05-09 testes | `155` | 174 testes | Documento 184 |
| Importação com dry run | `122` | `runner.server.ts` | Documentos 175 a 177 |

Arquivos estruturados: `implementation/stage-06-*.csv`.
Scripts de operação: `scripts/ops/canonical-import.ts`, `scripts/ops/leak-check.ts`.
