# 347 — Restore test evidence

> Etapa 11 — Consolidação técnica e preparação pré-produção.
> Release candidate: **RC-AVIZEE-01** · Data: 2026-08-03 · Ambiente: homologação/preview.
> **Produção não alterada. DNS não alterado. Site atual intacto.**

## Situação
O teste real de restauração **não foi executado**. Não há, nesta etapa, instância isolada disponível para restaurar banco e storage sem tocar o ambiente de homologação em uso — e restaurar em produção é proibido.

## Procedimento preparado (executar antes do go-live)
1. Provisionar instância isolada.
2. Restaurar o último snapshot do banco.
3. Restaurar o storage e conferir hashes.
4. Aplicar migrations pendentes.
5. Validar autenticação e papéis.
6. Validar catálogo (31 famílias / 97 SKUs) e imagens.
7. Validar cotações sintéticas e a outbox.
8. Validar artigos e redirects.
9. Executar a suíte crítica.
10. Registrar RPO e RTO observados, falhas, correções, evidência e responsável.

## Consequência
Bloqueio **B11-07 (P1)**. Sem esta evidência não há `GO_LIVE_READY`.
