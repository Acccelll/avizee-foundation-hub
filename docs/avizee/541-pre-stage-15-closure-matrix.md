# 541 — Fechamento integral pré-Etapa 15

## Objetivo

Encerrar de forma rastreável todas as pendências herdadas das Etapas 0–14.1 antes do início da Etapa 15, sem alterar branding, taxonomia aprovada ou modelo comercial e sem redesenhar o layout público existente.

Esta etapa de fechamento não autoriza produção por si só. O status de produção só muda quando os gates operacionais de lançamento forem efetivamente concluídos e evidenciados.

## Critério de fechamento

Os estados usados são:

- `CLOSED_IMPLEMENTED` — resolvido no código/configuração e validado;
- `CLOSED_USER_DECISION` — encerrado por decisão explícita do usuário;
- `CLOSED_EVIDENCED` — encerrado por evidência verificável;
- `CLOSED_CONTAINED` — escopo deliberadamente contido e sem exposição pública indevida;
- `CLOSED_DEFERRED_LAUNCH_GATE` — não é trabalho funcional pendente; depende de ação externa no fechamento de lançamento e continua bloqueando produção quando aplicável.

## Matriz consolidada — estado corrente em 2026-08-11

<!-- prettier-ignore -->
| Origem | ID / Tema | Estado corrente | Evidência / remanescente |
|---|---|---|---|
| Etapas 2/2.1 | DECT-08 / DEP-09 — 34 SKUs sem identidade | `CLOSED_CONTAINED` | D-054 / doc. 544: permanecem fora da publicação |
| Etapas 2/2.1 | DECT-11 — 16 SKUs sem nome público | `CLOSED_CONTAINED` | D-054 / doc. 544: permanecem fora da publicação |
| Etapas 2/2.1 | demais decisões taxonômicas antigas | `CLOSED_USER_DECISION` / `CLOSED_CONTAINED` | reconciliação integral no doc. 544; coorte pública continua 31 famílias / 97 SKUs |
| Etapas 3/5 | DEC-07 / DECT-12 — páginas consultivas de solução | `CLOSED_IMPLEMENTED` | opção B aprovada no doc. 549; `/solucoes/{aplicacao}` implementado e recertificado |
| Etapa 2 | DEC-10 — busca global | `CLOSED_IMPLEMENTED` | opção B aprovada no doc. 549; Produtos + Soluções + Conteúdos publicados implementados e recertificados |
| Etapa 4 | DEP-T1 / O-05 / O-06 — provider e destino de e-mail | `CLOSED_DEFERRED_LAUNCH_GATE` | Resend, remetente planejado, destino e Reply-To decididos; criação de caixas/subdomínio, DNS e chave real ficam para o fechamento do projeto |
| Etapa 4 | O-08 / O-09 — usuários reais e papéis | `CLOSED_DEFERRED_LAUNCH_GATE` | regra de um administrador inicial aprovada; provisionamento da conta concreta ocorre no gate operacional |
| Etapa 5 | Q-08 — contato público | `CLOSED_USER_DECISION` | endereço, CEP, e-mail, telefone/WhatsApp e horário confirmados e refletidos na implementação |
| Etapa 5 | Q-13 — dados legais e canal de privacidade | `CLOSED_DEFERRED_LAUNCH_GATE` | razão social/CNPJ/canal aprovados; criação da caixa e revisão jurídica final permanecem no gate de lançamento |
| Etapa 5 | O-10 / B11-08 — prazo comercial público | `CLOSED_USER_DECISION` | decisão explícita: não publicar promessa temporal fixa |
| Etapa 5 | formulário geral de contato | `CLOSED_USER_DECISION` | opção A aprovada no doc. 549: não ativar na v1; Lista de Cotação continua fluxo comercial registrado |
| Etapa 5 | mapa | `CLOSED_USER_DECISION` | opção A aprovada no doc. 549: não ativar na v1; nenhum mapa externo é carregado |
| Etapa 6 / 14.1 | Central de Conteúdos | `CLOSED_IMPLEMENTED` | integrada e recertificada; relações catálogo↔conteúdo permanecem declarativas |
| Etapa 7 | qualidade técnica do fechamento funcional | `CLOSED_EVIDENCED` | recertificação funcional anterior documentada no doc. 550 |
| Etapas 11–13 | B11-05 / O-27 — credencial SMTP legada | `CLOSED_USER_DECISION` | usuário confirmou revogação/rotação; credencial antiga proibida |
| Etapas 11–13 | B11-01 — SPF/DKIM/DMARC e e-mail real | `CLOSED_DEFERRED_LAUNCH_GATE` | decisão técnica concluída; configuração real continua obrigatória antes de envio produtivo |
| Etapas 11–13 | B11-02 / DEP-T5 — retenção de cotações/leads | `CLOSED_IMPLEMENTED` | política de 24 meses, RPC, worker e testes implementados |
| Etapas 11–13 | B11-03 — revisão jurídica final | `CLOSED_DEFERRED_LAUNCH_GATE` | obrigatório antes da publicação definitiva dos textos legais |
| Etapas 11–13 | B11-04 — contato | `CLOSED_USER_DECISION` | dados atuais confirmados |
| Etapas 11–13 | B11-06 — UAT humano | `CLOSED_DEFERRED_LAUNCH_GATE` | homologação/aceite final; não é substituído por CI |
| Etapas 11–13 | B11-07 — backup real / RPO / RTO | `CLOSED_DEFERRED_LAUNCH_GATE` | restore lógico local já comprovado; DR real, RPO/RTO e backup do ambiente conectado permanecem gates de lançamento |
| Etapas 11–13 | DEP-T3 — storage/backup de objetos | `CLOSED_DEFERRED_LAUNCH_GATE` | requer infraestrutura/ambiente real; não é falsamente certificado pelo restore do banco |
| Etapas 11–13 | hardening MCP/segredos/rate-limit — código | `CLOSED_IMPLEMENTED` | boundary de origem, fail-closed, higiene de `.env` e testes recertificados; hardening pós-merge revisado no doc. 551 |
| Etapas 11–13 | MCP rate-limit distribuído — infraestrutura real | `CLOSED_DEFERRED_LAUNCH_GATE` | binding `MCP_RATE_LIMITER` continua obrigatório para habilitar MCP em produção; sem binding permanece fail-closed |
| Governança | documentos históricos divergentes | `CLOSED_CONTAINED` | `STATUS.md` e docs. 541/542 são as fontes correntes; histórico não é apagado |
| Ambiente conectado | verificação direta do banco Lovable/Supabase | `CLOSED_DEFERRED_LAUNCH_GATE` | nenhuma alegação de banco ao vivo verificado é feita sem evidência direta |
| Pós-merge PR #2 | sete commits aplicados pelo Lovable até `44e165aa...` | `CLOSED_EVIDENCED` | revisados no doc. 551; migration reconciliada; CI #223 e CI #228 verdes; checkpoint integrado pelo PR #3 no commit `cb732491...` |
| Pós-merge PR #3 | ajuste de autenticação cliente do Lovable até `52387754...` | `CLOSED_REVIEWED_PENDING_RECERTIFICATION` | efeito líquido restrito a `src/lib/supabase-auth.middleware.ts` e `src/start.ts`; sem alteração visual; recertificação integral do HEAD corrente em andamento |

## Decisões funcionais finais

O lote que dependia do usuário foi encerrado no doc. `549-approved-functional-decisions-pre-stage-15.md`:

1. páginas consultivas por aplicação — aprovadas, implementadas e recertificadas;
2. busca global Produtos + Soluções + Conteúdos — aprovada, implementada e recertificada;
3. formulário geral de Contato — mantido fora da v1;
4. mapa — mantido fora da v1.

Não resta `OPEN_USER_INPUT` funcional das Etapas 0–14.1.

## Gates externos segregados do desenvolvimento

E-mail real/DNS, criação das novas caixas, provisionamento do administrador, UAT, revisão jurídica, backup/storage real, RPO/RTO, binding distribuído MCP e verificações do ambiente conectado continuam **obrigatórios antes da operação/produção quando aplicáveis**, mas não são reapresentados como etapas funcionais incompletas.

Por isso continuam válidos:

- `PRODUCTION_BLOCKED`;
- `OPERATION_BLOCKED`;
- `DATABASE_NOT_DIRECTLY_VERIFIED` para o ambiente conectado.

## Estado do fechamento

O PR #3 foi aprovado e squash-mergeado em `main` no commit `cb7324918aa212edd64e5cd184457c3f703730bd`.

Depois desse merge, o Lovable aplicou um ajuste adicional de autenticação cliente, encerrando em `523877545fd67a13d4d2f0cfe61a26ae454277ca`. O ajuste foi revisado e não reabre nenhuma decisão funcional, mas o baseline formal só volta a `CONSOLIDATED` após recertificação integral deste novo HEAD.

## Status

`PRE_STAGE_15_FINAL_SYNC_RECERTIFICATION_IN_PROGRESS`
