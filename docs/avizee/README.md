# AviZee — Projeto de Catálogo B2B e Site Institucional

Status corrente: **PRE_STAGE_15_BASELINE_CONSOLIDATED**

> Este arquivo aponta para o estado vigente. Relatórios de RC e etapas anteriores permanecem como histórico e não devem ser usados isoladamente como status atual.

## Estado atual

- Etapa 14.1 foi integrada à `main` no PR #1.
- O fechamento integral das Etapas 0–14.1 foi aprovado e mergeado pelo PR #2 no commit `41579eac0d853201bdd10868d9df81402d8ffeab`.
- O checkpoint pós-Lovable foi aprovado e squash-mergeado pelo PR #3 no commit `cb7324918aa212edd64e5cd184457c3f703730bd`.
- O housekeeping final pré-Etapa 15 foi squash-mergeado pelo PR #4 no commit `96b9a5b5c5311ddc6b44ce402abd7b4e4f38be4d`.
- A coorte pública continua restrita às 31 famílias / 97 SKUs aprovados; registros sem dados confiáveis permanecem contidos e não publicados.
- O hardening interno, a retenção, o fixture canônico e o ensaio de restore lógico estão implementados e recertificados.
- Páginas consultivas de Soluções e busca global foram aprovadas, implementadas e recertificadas.
- Formulário geral de Contato e mapa permanecem fora da v1 por decisão explícita.
- Resend foi aprovado como provider transacional, mas criação de novos endereços, DNS e credenciais reais foi deliberadamente adiada para o fechamento do projeto.
- Produção não é autorizada automaticamente por este fechamento; gates externos de lançamento continuam separados da conclusão funcional.
- O roadmap restante da v1 foi aprovado como Etapas 15–19; a Etapa 15 ainda não foi iniciada formalmente.

## Fonte corrente de governança

- [541-pre-stage-15-closure-matrix.md](541-pre-stage-15-closure-matrix.md) — matriz integral de fechamento.
- [542-current-status-pre-stage-15.md](542-current-status-pre-stage-15.md) — status corrente.
- [543-user-confirmations-2026-08-10.md](543-user-confirmations-2026-08-10.md) — decisões e dados confirmados pelo usuário.
- [544-decision-reconciliation-pre-stage-15.md](544-decision-reconciliation-pre-stage-15.md) — reconciliação das decisões antigas.
- [545-provider-operator-inventory.md](545-provider-operator-inventory.md) — inventário técnico de serviços externos.
- [547-mcp-request-hardening.md](547-mcp-request-hardening.md) — boundary, origem canônica e rate-limit fail-closed do MCP.
- [549-approved-functional-decisions-pre-stage-15.md](549-approved-functional-decisions-pre-stage-15.md) — decisões funcionais finais aprovadas.
- [550-pre-stage-15-functional-closure-recertification.md](550-pre-stage-15-functional-closure-recertification.md) — recertificação funcional do marco do PR #2.
- [551-post-lovable-recertification.md](551-post-lovable-recertification.md) — revisão e recertificação do primeiro bloco pós-merge feito pelo Lovable.
- [552-approved-roadmap-stages-15-19.md](552-approved-roadmap-stages-15-19.md) — roadmap aprovado para concluir qualidade, readiness, homologação, go-live e encerramento da v1.

## Governança histórica

Os documentos das Etapas 11–14, incluindo release candidates e relatórios de remediação, continuam versionados para rastreabilidade. Quando houver divergência de status entre um documento histórico e os arquivos correntes acima, prevalece a fonte corrente sem apagar o registro histórico.

O `README.md` da raiz permanece um consolidado histórico extenso. O arquivo `STATUS.md` na raiz e os documentos 541/542/552 são a ponte explícita para a situação corrente e a progressão futura aprovada.

## Próximo bloco

A sequência aprovada para concluir a v1 é:

`15 — Qualidade Final → 16 — Readiness de Produção e Gates Externos → 17 — Release Candidate Final, Migração e UAT → 18 — Cutover e Go-Live → 19 — Hypercare, Aceite e Encerramento v1`.

A Etapa 15 pode ser iniciada formalmente em branch própria depois da integração deste checkpoint de roadmap. Os gates externos de lançamento continuam separados e não são dispensados pelo início da próxima etapa.

## Sobre o projeto

Plataforma B2B para avicultura, focada em catálogo técnico, conteúdo consultivo e geração de solicitações por Lista de Cotação, sem preços públicos, estoque, checkout ou pagamento.

## Change Log

Veja o histórico completo em [16-change-log.md](16-change-log.md).
