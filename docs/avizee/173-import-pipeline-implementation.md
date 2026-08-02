# 173 — Pipeline de Importação

## Módulos
- `src/catalog/import/schema.ts` — contrato versionado, parser e sanitização.
- `src/catalog/import/plan.ts` — plano determinístico e assinatura.
- `src/catalog/import/runner.server.ts` — simulação, execução e rollback.
- `src/catalog/import.functions.ts` — funções de servidor autorizadas.
- `scripts/ops/canonical-import.ts` — operação controlada do lote canônico.

## Garantias
1. Execução exige simulação prévia com estado `DRY_RUN_COMPLETE`.
2. Execução compara assinatura do plano, hash do arquivo e replaneja contra o banco atual.
3. Qualquer divergência aborta com conflito explícito.
4. Cada linha é registrada em `import_job_rows` com valores anteriores e novos.
5. Rollback reverte apenas o lote informado, por soft delete ou restauração dos valores anteriores.
6. Toda operação é auditada.

## Lotes registrados

| Papel | Job | Assinatura | Resultado |
|---|---|---|---|
| Dry run inicial | `0c16d863-25b7-4cfc-bb10-553f1ea94dcb` | `v1-97-5769d7b7` | 97 criações, 0 erros, 0 bloqueios |
| Execução inicial | `3afdc4ce-3647-4922-a376-4a19d77d0e5a` | `v1-97-5769d7b7` | 97 SKUs criados |
| Dry run de idempotência | `8dba1537-e7e0-48f8-b61a-2ee3bd43dbf5` | `v1-97-8420882c` | 97 inalterados, 0 criações |
| Rollback | sobre `3afdc4ce-…` | — | 97 revertidos por soft delete |
| Dry run de restauração | `bc9640ab-a5cd-4148-8fcb-df6319774cef` | `v1-97-5769d7b7` | 97 criações |
| Execução de restauração | `fd5e66c3-3bad-48d0-9a38-a745b2480cb1` | `v1-97-5769d7b7` | 97 SKUs restaurados |
