# 177 — Idempotência e Rollback

## 1. Idempotência
- Primeira execução: 97 criações (`3afdc4ce-…`).
- Segunda simulação do arquivo idêntico: **97 inalterados, 0 criações, 0 atualizações**
  (`8dba1537-…`, assinatura `v1-97-8420882c`).
- Nenhuma duplicidade, nenhum histórico falso, nenhuma atualização sem conteúdo novo.
- O índice único parcial de código público reforça a garantia no nível do banco.

## 2. Rollback
- Estado antes: 97 produtos ativos, 97 códigos.
- Rollback do lote `3afdc4ce-…`: 97 registros revertidos por soft delete; `import_jobs` marcado
  como `ROLLED_BACK` com data.
- Estado depois: 0 produtos ativos, 31 famílias preservadas, auditoria preservada.
- Segunda tentativa de rollback do mesmo lote é recusada (coberto por teste automatizado).
- Alterações posteriores a um lote são preservadas: o rollback usa os valores anteriores
  registrados linha a linha, não uma cópia global da tabela.

## 3. Reaplicação e restauração
Nova simulação (`bc9640ab-…`) e nova execução (`fd5e66c3-…`) restauraram os 97 SKUs. O ambiente
está no estado canônico aprovado.

## 4. Limitações conhecidas
- A reaplicação após rollback cria novos UUIDs; as 97 linhas revertidas permanecem no banco com
  `deleted_at` preenchido, como histórico. Não são visíveis para o público nem contam na
  reconciliação, mas inflam a contagem bruta de `products` (194 linhas, 97 ativas).
- O rollback é por lote; não existe rollback parcial por linha.


| Papel | Job | Assinatura | Resultado |
|---|---|---|---|
| Dry run inicial | `0c16d863-25b7-4cfc-bb10-553f1ea94dcb` | `v1-97-5769d7b7` | 97 criações, 0 erros, 0 bloqueios |
| Execução inicial | `3afdc4ce-3647-4922-a376-4a19d77d0e5a` | `v1-97-5769d7b7` | 97 SKUs criados |
| Dry run de idempotência | `8dba1537-e7e0-48f8-b61a-2ee3bd43dbf5` | `v1-97-8420882c` | 97 inalterados, 0 criações |
| Rollback | sobre `3afdc4ce-…` | — | 97 revertidos por soft delete |
| Dry run de restauração | `bc9640ab-a5cd-4148-8fcb-df6319774cef` | `v1-97-5769d7b7` | 97 criações |
| Execução de restauração | `fd5e66c3-3bad-48d0-9a38-a745b2480cb1` | `v1-97-5769d7b7` | 97 SKUs restaurados |
