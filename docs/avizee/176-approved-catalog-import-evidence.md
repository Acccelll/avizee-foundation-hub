# 176 — Evidência da Importação Canônica

## 1. Identificação
- Arquivo: `docs/avizee/data/canonical/import-products-v1.csv`.
- Hash: registrado em `import_jobs.file_hash` (SHA-256 do conteúdo).
- Contrato: 1.0.0. Operador: `operacao.catalogo@avizee.invalid`.
- Ambiente: instância não produtiva do Lovable Cloud. Nenhuma publicação foi ativada.

## 2. Execução
Job `fd5e66c3-3bad-48d0-9a38-a745b2480cb1` (estado corrente restaurado após o teste de rollback),
precedido pelo job `3afdc4ce-3647-4922-a376-4a19d77d0e5a`. Assinatura `v1-97-5769d7b7`.

## 3. Reconciliação
| Indicador | Esperado | Obtido |
|---|---|---|
| Famílias canônicas | 31 | 31 |
| SKUs canônicos ativos | 97 | 97 |
| SKUs sem família | 0 | 0 |
| SKUs em revisão | 97 | 97 |
| SKUs publicados | 0 | 0 |
| Códigos de origem gravados | 97 | 97 |
| Códigos públicos expostos | 0 | 0 |
| Marcas em campo público | 0 | 0 |
| Descrição pública preenchida | 0 | 0 (não inferida) |
| Registros pendentes no canônico | 0 | 0 |

Distribuição por categoria: Vacinação e aplicação 9 famílias / 36 SKUs; Pesagem, medição e
controle 9 / 22; Manejo, alimentação e biossegurança 7 / 17; Pulverização e sistemas de fluido
2 / 13; Linhas complementares 3 / 6; Peças, reposição e automação 1 / 3.

## 4. Amostragem
`implementation/stage-06-canonical-sample.csv` traz duas amostras por categoria pública, com
família, código, nome público, variação e estados. Todas passaram na prévia pública segura.

## 5. Não vazamento
`scripts/ops/leak-check.ts`: 97 produtos e 31 famílias verificados, 0 ocorrências de campo
interno e 0 ocorrências de termo de marca na serialização pública.

## 6. Auditoria
39+ registros `import.*` em `audit_logs`, com ator mascarado, entidade, resumo e assinatura.


| Papel | Job | Assinatura | Resultado |
|---|---|---|---|
| Dry run inicial | `0c16d863-25b7-4cfc-bb10-553f1ea94dcb` | `v1-97-5769d7b7` | 97 criações, 0 erros, 0 bloqueios |
| Execução inicial | `3afdc4ce-3647-4922-a376-4a19d77d0e5a` | `v1-97-5769d7b7` | 97 SKUs criados |
| Dry run de idempotência | `8dba1537-e7e0-48f8-b61a-2ee3bd43dbf5` | `v1-97-8420882c` | 97 inalterados, 0 criações |
| Rollback | sobre `3afdc4ce-…` | — | 97 revertidos por soft delete |
| Dry run de restauração | `bc9640ab-a5cd-4148-8fcb-df6319774cef` | `v1-97-5769d7b7` | 97 criações |
| Execução de restauração | `fd5e66c3-3bad-48d0-9a38-a745b2480cb1` | `v1-97-5769d7b7` | 97 SKUs restaurados |
