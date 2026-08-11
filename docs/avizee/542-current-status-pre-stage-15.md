# 542 — Status corrente pré-Etapa 15

## Fonte corrente

Este documento e `541-pre-stage-15-closure-matrix.md` representam o estado vigente do fechamento das Etapas 0–14.1. Documentos anteriores de release candidate permanecem como histórico.

## Estado funcional

- Etapa 14.1 está integrada à `main` pelo PR #1.
- O PR #2, que fechou funcionalmente as Etapas 0–14.1, foi aprovado e mergeado em `main` no commit `41579eac0d853201bdd10868d9df81402d8ffeab`.
- O checkpoint pós-Lovable do PR #3 foi aprovado e squash-mergeado em `main` no commit `cb7324918aa212edd64e5cd184457c3f703730bd`.
- A coorte pública continua limitada às 31 famílias / 97 SKUs aprovados.
- Dados de contato, razão social, CNPJ, canal de privacidade, retenção e regra de prazo comercial foram confirmados.
- Retenção de cotações/leads por 24 meses foi implementada.
- Provider transacional Resend foi decidido; ativação real permanece para o gate de lançamento.
- Hardening interno do MCP está implementado com origem canônica e rate-limit fail-closed.
- Páginas consultivas próprias por aplicação e busca global em Produtos + Soluções + Conteúdos publicados foram implementadas.
- Formulário geral de Contato e mapa permanecem fora da v1 por decisão explícita.

## Recertificações anteriores

O fechamento funcional do PR #2 foi recertificado conforme `550-pre-stage-15-functional-closure-recertification.md`.

O primeiro bloco pós-Lovable foi revisado no doc. 551. O commit técnico `1f852351f7655ecaca6a37e1ff1fcb7eb9d92ddc` passou no CI #223 (`31446779287`) e o HEAD documental `839ab5e53201c3bab036c23630def39c19eea461` passou no CI #228 (`31447135301`).

## Sincronização final pós-PR #3

Após o merge do PR #3, o Lovable aplicou três commits adicionais, encerrando em `523877545fd67a13d4d2f0cfe61a26ae454277ca`.

O efeito líquido está restrito a dois arquivos:

- `src/lib/supabase-auth.middleware.ts` — novo middleware cliente que tenta anexar o token de sessão e, quando a configuração cliente do Supabase está indisponível, segue sem o cabeçalho em vez de derrubar a rota pública;
- `src/start.ts` — troca do middleware gerado pelo novo middleware seguro.

Não houve alteração de layout público, branding, taxonomia ou modelo comercial. Como esse ajuste entrou após a última certificação, ele está sendo recertificado integralmente antes de o baseline voltar ao estado final consolidado.

Status corrente:

`PRE_STAGE_15_FINAL_SYNC_RECERTIFICATION_IN_PROGRESS`

## Gates de lançamento segregados

Ações que dependem do ambiente real não são tratadas como desenvolvimento funcional pendente, mas continuam obrigatórias antes da operação quando aplicáveis: configuração real de e-mail/DNS, criação das novas caixas de e-mail, provisionamento do administrador, binding MCP distribuído, backup/storage real, RPO/RTO, UAT, revisão jurídica e verificação do ambiente conectado.

Portanto permanecem válidos:

- `DATABASE_NOT_DIRECTLY_VERIFIED` para o ambiente conectado;
- `PRODUCTION_BLOCKED`;
- `OPERATION_BLOCKED`.

## Próximo passo

Concluir a recertificação integral do HEAD que incorpora `52387754...`, atualizar este checkpoint para `PRE_STAGE_15_BASELINE_CONSOLIDATED` e integrar o housekeeping final. Somente então iniciar formalmente a Etapa 15 em branch própria.
