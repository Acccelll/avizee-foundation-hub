# 357 — Operational runbooks

> Etapa 11 — Consolidação técnica e preparação pré-produção.
> Release candidate: **RC-AVIZEE-01** · Data: 2026-08-03 · Ambiente: homologação/preview.
> **Produção não alterada. DNS não alterado. Site atual intacto.**

Runbooks em `stage-11-runbooks.csv`, cada um com objetivo, pré-condições, passos, validação, tratamento de falha, reversão, responsável e evidência.

Cobertura: deploy, migration, rollback, restore, cotação, outbox, e-mail, usuário, MFA, catálogo, conteúdo, publicação, storage, incidente, segredo e monitoramento.

## Exemplo — reprocessar a outbox
1. Pré-condição: provider de e-mail configurado e readiness sem falha crítica.
2. Verificar `outbox_pending` e as mensagens em `FAILED`.
3. Reprocessar respeitando `dedupe_key` (nenhuma duplicata é enviada).
4. Validar que a cotação permanece íntegra e o evento foi registrado.
5. Falha persistente: mover para `DEAD_LETTER` e abrir incidente.
6. Reversão: não há reenvio destrutivo; o registro em banco é a fonte da verdade.
