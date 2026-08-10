# 542 — Status corrente pré-Etapa 15

## Fonte corrente

Este documento e `541-pre-stage-15-closure-matrix.md` representam o estado vigente do fechamento das Etapas 0–14.1. Documentos anteriores de release candidate permanecem como histórico.

## Estado funcional

- Etapa 14.1 já está integrada à `main` pelo PR #1.
- A coorte pública continua limitada às 31 famílias / 97 SKUs aprovados.
- Dados de contato, razão social, CNPJ, canal de privacidade, retenção e regra de prazo comercial foram confirmados.
- Retenção de cotações/leads por 24 meses foi implementada.
- Provider transacional Resend foi decidido; ativação real permanece para o gate de lançamento.
- Hardening interno do MCP está implementado com origem canônica e rate-limit fail-closed.

## Decisões finais aprovadas

O usuário aprovou o conjunto registrado em `549-approved-functional-decisions-pre-stage-15.md`:

1. páginas consultivas próprias por aplicação;
2. busca global em Produtos + Soluções + Conteúdos publicados;
3. formulário geral de Contato mantido fora da v1;
4. mapa mantido fora da v1.

As duas decisões positivas foram implementadas no PR #2 reutilizando os componentes, tokens e padrões públicos existentes. Não houve mudança de branding, taxonomia ou modelo comercial.

## Qualidade

O marco técnico anterior foi integralmente recertificado no CI #127. O novo HEAD, que inclui as decisões funcionais acima, está em recertificação integral.

No ciclo atual já foram observados com sucesso lint, Prettier, build e typecheck. A certificação final só será atualizada quando o mesmo HEAD concluir migrations, fixture canônico, restore lógico, servidor SSR e suíte integral.

Status atual:

`PRE_STAGE_15_FUNCTIONAL_CLOSURE_IMPLEMENTED_REVALIDATION_IN_PROGRESS`

## Gates de lançamento segregados

Ações que dependem do ambiente real não são tratadas como desenvolvimento funcional pendente, mas continuam obrigatórias antes da operação quando aplicáveis: configuração real de e-mail/DNS, provisionamento do administrador, binding MCP distribuído, backup/storage real, RPO/RTO, UAT, revisão jurídica e verificação do ambiente conectado.

Portanto permanecem válidos:

- `DATABASE_NOT_DIRECTLY_VERIFIED` para o ambiente conectado;
- `PRODUCTION_BLOCKED`;
- `OPERATION_BLOCKED`.

## Próximo passo

A Etapa 15 permanece suspensa até o CI integral verde do HEAD final, consolidação da evidência, revisão do PR #2 e aprovação explícita do merge.
