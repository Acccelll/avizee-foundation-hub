# 175 — Evidência de Simulação

## 1. Dry run sintético
Coberto pela suíte de integração (`tests/integration/import-pipeline.test.ts`): simula sem
alterar o catálogo, registra erros de linha inválida sem abortar o lote, bloqueia linha fora do
escopo aprovado sem descartar, recusa execução com assinatura divergente e com conteúdo diferente.

## 2. Dry run canônico
- Arquivo: `docs/avizee/data/canonical/import-products-v1.csv` (97 linhas + cabeçalho).
- Versão do contrato: 1.0.0.
- Operador: `operacao.catalogo@avizee.invalid` (usuário nomeado, ambiente não produtivo).
- Job: `0c16d863-25b7-4cfc-bb10-553f1ea94dcb`; assinatura `v1-97-5769d7b7`.
- Resultado: 97 criações, 0 atualizações, 0 inalterados, 0 bloqueios, 0 avisos, 0 erros.

## 3. Prova de ausência de escrita
Antes do dry run: `products = 0`. Depois do dry run: `products = 0`. A simulação gravou apenas
`import_jobs`, `import_job_rows` e o registro de auditoria.

## 4. Decisão
Liberação da execução aprovada, por ausência de erro bloqueante e por assinatura estável entre
duas simulações consecutivas do mesmo arquivo.


| Papel | Job | Assinatura | Resultado |
|---|---|---|---|
| Dry run inicial | `0c16d863-25b7-4cfc-bb10-553f1ea94dcb` | `v1-97-5769d7b7` | 97 criações, 0 erros, 0 bloqueios |
| Execução inicial | `3afdc4ce-3647-4922-a376-4a19d77d0e5a` | `v1-97-5769d7b7` | 97 SKUs criados |
| Dry run de idempotência | `8dba1537-e7e0-48f8-b61a-2ee3bd43dbf5` | `v1-97-8420882c` | 97 inalterados, 0 criações |
| Rollback | sobre `3afdc4ce-…` | — | 97 revertidos por soft delete |
| Dry run de restauração | `bc9640ab-a5cd-4148-8fcb-df6319774cef` | `v1-97-5769d7b7` | 97 criações |
| Execução de restauração | `fd5e66c3-3bad-48d0-9a38-a745b2480cb1` | `v1-97-5769d7b7` | 97 SKUs restaurados |
