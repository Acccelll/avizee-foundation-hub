# 541 — Fechamento integral pré-Etapa 15

## Objetivo

Encerrar de forma rastreável todas as pendências herdadas das Etapas 0–14.1 antes do início da Etapa 15, sem alterar layout público, branding, taxonomia aprovada ou modelo comercial.

Esta etapa de fechamento não autoriza produção por si só. O status de produção só muda quando os bloqueios operacionais aplicáveis forem efetivamente encerrados e evidenciados.

## Critério de fechamento

Nenhuma pendência será considerada encerrada por simples mudança documental. Cada item deve terminar em um dos estados:

- `CLOSED_IMPLEMENTED` — resolvido no código/configuração e validado;
- `CLOSED_USER_DECISION` — encerrado por decisão explícita do usuário;
- `CLOSED_EVIDENCED` — encerrado por evidência operacional verificável;
- `CLOSED_CONTAINED` — escopo deliberadamente contido, com registros fora da publicação e sem risco de exposição;
- `PARTIALLY_CLOSED` — parcela técnica encerrada, com remanescente operacional claramente separado;
- `OPEN_USER_INPUT` — depende de dado/decisão que somente a AviZee pode fornecer;
- `OPEN_EXTERNAL_ACTION` — depende de ação externa verificável;
- `OPEN_TECHNICAL` — correção técnica ainda necessária.

## Matriz consolidada — estado corrente em 2026-08-10

<!-- prettier-ignore -->
| Origem | ID / Tema | Estado corrente | Evidência / remanescente |
|---|---|---|---|
| Etapas 2/2.1 | DECT-08 / DEP-09 — 34 SKUs sem identidade | `CLOSED_CONTAINED` | D-054 / doc. 544: permanecem fora da publicação |
| Etapas 2/2.1 | DECT-11 — 16 SKUs sem nome público | `CLOSED_CONTAINED` | D-054 / doc. 544: permanecem fora da publicação |
| Etapas 2/2.1 | DECT-02 a DECT-09 e DECT-11 a DECT-14 remanescentes | `CLOSED_USER_DECISION` / `CLOSED_CONTAINED` | reconciliação integral no doc. 544; DECT-12 permanece vinculada a DEC-07 |
| Etapas 3/5 | DEC-07 / DECT-12 — páginas detalhadas de solução | `OPEN_USER_INPUT` | decisão ainda necessária antes da Etapa 15 |
| Etapa 2 | DEC-10 — busca global | `OPEN_USER_INPUT` | completar Produtos/Soluções/Conteúdos ou conter formalmente à busca de catálogo v1 |
| Etapa 4 | DEP-T1 / O-05 / O-06 — provedor e destino de e-mail | `PARTIALLY_CLOSED` | Resend/remetente/destino aprovados no doc. 543; DNS/API key/remetente real = `OPEN_EXTERNAL_ACTION` |
| Etapa 4 | O-08 / O-09 — usuários reais e atribuição de papéis | `PARTIALLY_CLOSED` | regra de um administrador inicial aprovada; login concreto/provisionamento = `OPEN_EXTERNAL_ACTION` |
| Etapa 5 | Q-08 — contato público | `CLOSED_USER_DECISION` | dados atuais confirmados no doc. 543 e já refletidos na implementação |
| Etapa 5 | Q-13 — dados legais | `PARTIALLY_CLOSED` | razão social/CNPJ/canal aprovados; criação de `privacidade@avizee.com.br` e revisão legal final ainda externas |
| Etapa 5 | O-10 / B11-08 — prazo comercial público | `CLOSED_USER_DECISION` | decisão explícita: não publicar promessa temporal fixa |
| Etapa 5 | formulário geral de contato | `OPEN_USER_INPUT` | ativar ou manter ausente dentro do layout aprovado; não inferir |
| Etapa 5 | mapa | `OPEN_USER_INPUT` | ativar sob interação ou manter ausente dentro do layout aprovado; não inferir |
| Etapa 6 / 14.1 | Central de Conteúdos | `CLOSED_IMPLEMENTED` | integrada; recertificação automatizada do HEAD concluída no doc. 546 |
| Etapa 7 | qualidade integral do HEAD | `CLOSED_EVIDENCED` | CI run #83: lint, Prettier, build, typecheck, migrations, SSR e suíte integral verdes — doc. 546 |
| Etapas 11–13 | B11-05 / O-27 — credencial SMTP legada | `CLOSED_USER_DECISION` | usuário confirmou revogação/rotação no doc. 543; credencial antiga proibida |
| Etapas 11–13 | B11-01 — SPF/DKIM/DMARC e e-mail real | `OPEN_EXTERNAL_ACTION` | provedor já decidido; configuração real ainda pendente |
| Etapas 11–13 | B11-02 / DEP-T5 — retenção | `CLOSED_IMPLEMENTED` | regra 24 meses aprovada e automação/worker/testes implementados; produção continua dependente de configuração operacional |
| Etapas 11–13 | B11-03 — dados legais | `PARTIALLY_CLOSED` | dados oficiais confirmados; revisão legal/canal real ainda externos |
| Etapas 11–13 | B11-04 — contato | `CLOSED_USER_DECISION` | dados atuais confirmados no doc. 543 |
| Etapas 11–13 | B11-06 — UAT | `OPEN_EXTERNAL_ACTION` | execução e aceite humano continuam necessários |
| Etapas 11–13 | B11-07 — restore / RPO / RTO | `PARTIALLY_CLOSED` | restore lógico local do schema da aplicação comprovado no CI #83; backup real, storage e RPO/RTO permanecem externos — docs. 447/448/546 |
| Etapas 11–13 | DEP-T3 — storage/backup | `OPEN_EXTERNAL_ACTION` | mecanismo de restore do DB não certifica objetos de storage; política/backup/restore real ainda necessários |
| Etapas 11–13 | hardening MCP/segredos/rate-limit | `OPEN_TECHNICAL` | cinco tools read-only e testes de contrato existem; rate-limit explícito ainda precisa revisão/fechamento |
| Governança | README raiz, README docs e relatórios divergentes | `OPEN_TECHNICAL` | `542` é a fonte corrente; falta sinalização mínima nos READMEs históricos |
| CI | preview HTTP/E2E e recertificação integral | `CLOSED_EVIDENCED` | GitHub Actions CI run #83, commit `63b763b...`, conclusão `success` — doc. 546 |

## Confirmações atuais

As decisões fornecidas diretamente pelo usuário neste fechamento estão consolidadas em `543-user-confirmations-2026-08-10.md`. A reconciliação das decisões antigas está em `544-decision-reconciliation-pre-stage-15.md`.

Referências divergentes do site legado não prevalecem sobre essas confirmações atuais.

## Pendências que continuam exigindo decisão do usuário

Após a reconciliação documental e o fechamento técnico já executado, permanecem quatro decisões funcionais sem resposta e que não serão resolvidas por inferência:

1. `DEC-07 / DECT-12` — páginas consultivas de solução por aplicação;
2. `DEC-10` — busca global completa ou busca somente de catálogo na v1;
3. ativação do formulário geral de contato dentro do layout aprovado;
4. ativação do mapa sob interação dentro do layout aprovado.

Elas serão solicitadas em um único lote após o fechamento das pendências técnicas internas restantes.

## Ordem restante de execução

1. fechar hardening técnico interno remanescente, principalmente MCP/rate-limit e governança documental;
2. registrar/segregar corretamente as ações externas de backup/storage/provedores/UAT;
3. obter em um único lote as quatro decisões funcionais ainda abertas;
4. recertificar novamente o HEAD caso haja alteração funcional;
5. somente então deliberar sobre o encerramento do PR e o início da Etapa 15.

## Status

`PRE_STAGE_15_CLOSURE_IN_PROGRESS`

A recertificação técnica automatizada está verde, mas `PRODUCTION_BLOCKED` e `OPERATION_BLOCKED` continuam válidos enquanto os gates externos/operacionais aplicáveis não forem concluídos.
