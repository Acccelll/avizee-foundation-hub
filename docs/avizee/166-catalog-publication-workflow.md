# 166 — Fluxo de Publicação

- Estados de revisão: `DRAFT`, `UNDER_REVIEW`, `BLOCKED_BY_CODE`, `BLOCKED_BY_IDENTITY`,
  `BLOCKED_BY_BRAND`, `BLOCKED_BY_RIGHTS`, `READY_TO_PUBLISH`.
- Estados de publicação: `NOT_PUBLISHED`, `PUBLISHED`, `UNPUBLISHED`, `ARCHIVED`.
- A importação nunca publica: todo o lote canônico entrou como `UNDER_REVIEW` /
  `NOT_PUBLISHED` (97/97 verificados).
- Toda transição exige permissão `catalog.publish` e gera registro em `publication_history`.
- Bloqueio é por registro: um SKU bloqueado não impede a publicação dos demais.
