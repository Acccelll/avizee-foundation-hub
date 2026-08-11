# 542 — Status corrente pré-Etapa 15

## Fonte corrente

Este documento, `541-pre-stage-15-closure-matrix.md` e `551-post-lovable-recertification.md` representam o estado vigente do fechamento das Etapas 0–14.1. Documentos anteriores de release candidate permanecem como histórico.

## Estado funcional

- Etapa 14.1 está integrada à `main` pelo PR #1.
- O PR #2, que fechou funcionalmente as Etapas 0–14.1, foi aprovado e mergeado em `main` no commit `41579eac0d853201bdd10868d9df81402d8ffeab`.
- A coorte pública continua limitada às 31 famílias / 97 SKUs aprovados.
- Dados de contato, razão social, CNPJ, canal de privacidade, retenção e regra de prazo comercial foram confirmados.
- Retenção de cotações/leads por 24 meses foi implementada.
- Provider transacional Resend foi decidido; ativação real permanece para o gate de lançamento.
- Hardening interno do MCP está implementado com origem canônica e rate-limit fail-closed.
- Páginas consultivas próprias por aplicação e busca global em Produtos + Soluções + Conteúdos publicados foram implementadas.
- Formulário geral de Contato e mapa permanecem fora da v1 por decisão explícita.

## Recertificação funcional anterior

O fechamento funcional do PR #2 foi recertificado pelo GitHub Actions conforme `550-pre-stage-15-functional-closure-recertification.md`.

Status funcional consolidado do PR #2:

`PRE_STAGE_15_FUNCTIONAL_CLOSURE_CERTIFIED`

## Alterações pós-merge do Lovable

Depois do merge, o Lovable aplicou sete commits técnicos diretamente na `main`, levando o repositório até `44e165aa006e16ba3f758759a85e5478a3df14c6`.

A revisão desses commits está registrada no doc. 551. Eles abrangem tooling, correções de tipagem da busca, hardening de privilégios no Supabase e correção da leitura das facetas do catálogo. Não houve alteração de layout público, branding, taxonomia ou modelo comercial.

A recertificação integral desse novo baseline está em andamento na branch `pre-stage-15-post-lovable-recertification`.

Status corrente:

`PRE_STAGE_15_POST_LOVABLE_RECERTIFICATION_IN_PROGRESS`

## Gates de lançamento segregados

Ações que dependem do ambiente real não são tratadas como desenvolvimento funcional pendente, mas continuam obrigatórias antes da operação quando aplicáveis: configuração real de e-mail/DNS, criação das novas caixas de e-mail, provisionamento do administrador, binding MCP distribuído, backup/storage real, RPO/RTO, UAT, revisão jurídica e verificação do ambiente conectado.

Portanto permanecem válidos:

- `DATABASE_NOT_DIRECTLY_VERIFIED` para o ambiente conectado;
- `PRODUCTION_BLOCKED`;
- `OPERATION_BLOCKED`.

## Próximo passo

Concluir a recertificação integral do HEAD pós-Lovable, integrar o checkpoint de governança e só então considerar o baseline pré-Etapa 15 totalmente consolidado.
