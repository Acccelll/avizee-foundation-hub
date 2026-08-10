# AviZee — Projeto de Catálogo B2B e Site Institucional

Status corrente: **PRE_STAGE_15_CLOSURE_IN_PROGRESS**

> Este arquivo aponta para o estado vigente. Relatórios de RC e etapas anteriores permanecem como histórico e não devem ser usados isoladamente como status atual.

## Estado atual

- Etapa 14.1 foi integrada à `main` no PR #1.
- O fechamento integral das Etapas 0–14.1 ocorre no PR #2 antes de qualquer início da Etapa 15.
- A coorte pública continua restrita às 31 famílias / 97 SKUs aprovados; registros sem dados confiáveis permanecem contidos e não publicados.
- A credencial SMTP legada foi confirmada pelo usuário como revogada/trocada.
- Resend foi aprovado como provider transacional, mas criação de novos endereços, DNS e credenciais reais foi deliberadamente adiada até a conclusão de todas as etapas do projeto.
- A recertificação técnica automatizada do fechamento já obteve um HEAD integralmente verde; alterações posteriores de hardening são novamente recertificadas antes de qualquer fechamento do PR.
- Produção não é autorizada automaticamente por este fechamento; gates externos de lançamento continuam separados da conclusão funcional.

## Fonte corrente de governança

- [541-pre-stage-15-closure-matrix.md](541-pre-stage-15-closure-matrix.md) — matriz integral de fechamento.
- [542-current-status-pre-stage-15.md](542-current-status-pre-stage-15.md) — status corrente.
- [543-user-confirmations-2026-08-10.md](543-user-confirmations-2026-08-10.md) — decisões e dados confirmados pelo usuário.
- [544-decision-reconciliation-pre-stage-15.md](544-decision-reconciliation-pre-stage-15.md) — reconciliação das decisões antigas.
- [545-provider-operator-inventory.md](545-provider-operator-inventory.md) — inventário técnico de serviços externos.
- [546-pre-stage-15-ci-recertification.md](546-pre-stage-15-ci-recertification.md) — evidência da recertificação técnica automatizada.
- [547-mcp-request-hardening.md](547-mcp-request-hardening.md) — boundary, origem canônica e rate-limit fail-closed do MCP.

## Governança histórica

Os documentos das Etapas 11–14, incluindo release candidates e relatórios de remediação, continuam versionados para rastreabilidade. Quando houver divergência de status entre um documento histórico e os arquivos correntes acima, prevalece a fonte corrente sem apagar o registro histórico.

O `README.md` da raiz permanece um consolidado histórico extenso. Enquanto ele não puder ser atualizado de forma segura sem risco de truncamento, este índice e os documentos 541/542 são a referência corrente de status.

## Sobre o projeto

Plataforma B2B para avicultura, focada em catálogo técnico, conteúdo consultivo e geração de solicitações por Lista de Cotação, sem preços públicos, estoque, checkout ou pagamento.

## Change Log

Veja o histórico completo em [16-change-log.md](16-change-log.md).
