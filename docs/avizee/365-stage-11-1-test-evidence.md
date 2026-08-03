# 365 — Etapa 11.1: evidências de teste da RC-AVIZEE-02

> Ambiente: homologação/preview. **Produção, DNS e site atual não alterados.**
> Execução: `bunx vitest run` · Relatório JUnit: `reports/tests/junit.xml`.

## Resultado

| Métrica | Valor |
|---|---|
| Arquivos de teste | 19 |
| Testes | 279 |
| Falhas | 0 |
| Acréscimo da Etapa 11.1 | +45 |

## Novos arquivos e o que provam

| Arquivo | Seção | Evidência |
|---|---|---|
| `tests/unit/quotation-payload-hash.test.ts` | §8 | Hash canônico determinístico, independente da ordem dos itens, insensível a caixa/espaços/formatação de telefone, sensível a quantidade/observação/consentimento; campos voláteis fora da forma canônica. |
| `tests/unit/environment-and-seo.test.ts` | §11, §13, §14, §15, §16 | Fonte única de ambiente; falha dura sem `QUOTATION_HASH_SALT`/`APP_PUBLIC_URL` fora de desenvolvimento; coerência `APP_ENV`/`VITE_APP_ENV`; sitemap só com URL absoluta e sem rotas excluídas nem `lastmod` de build; robots bloqueia indexação fora de produção. |
| `tests/unit/outbox-states.test.ts` | §9, §10, §24 | Estados mínimos presentes, semântica declarada *at-least-once* com consumidor idempotente, backoff crescente, avaliação de migrations reprovando versão divergente ou item ausente. |
| `tests/integration/quotation-flow.test.ts` | §8, §17 | Gravação atômica (cotação, itens, consentimentos, evento, 2 mensagens de outbox); repetição idêntica devolve o mesmo protocolo sem duplicar outbox; payload diferente na mesma chave gera `IDEMPOTENCY_CONFLICT` sem alterar o registro existente; 4 requisições concorrentes produzem uma única cotação; lista vazia recusada; nenhum campo de preço/frete/prazo no esquema. |
| `tests/integration/outbox-claim.test.ts` | §9, §10 | `FOR UPDATE SKIP LOCKED` real: dois workers concorrentes nunca reivindicam o mesmo evento; conclusão exige `claim_token` correto; reagendamento com backoff preserva o evento; lease vencido retorna à fila; estado inválido é recusado. |

## Limites

Estas evidências cobrem apenas o saneamento técnico. Os bloqueios externos
B11-01 a B11-08 (documento 356) permanecem em aberto e o veredito de release
continua **GO_LIVE_BLOCKED**.
