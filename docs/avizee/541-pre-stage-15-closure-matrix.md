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
- `OPEN_USER_INPUT` — depende de dado/decisão que somente a AviZee pode fornecer;
- `OPEN_EXTERNAL_ACTION` — depende de ação externa verificável;
- `OPEN_TECHNICAL` — correção técnica ainda necessária.

## Matriz consolidada

<!-- prettier-ignore -->
| Origem | ID / Tema | Estado inicial desta etapa | Fechamento requerido |
|---|---|---|---|
| Etapas 2/2.1 | DECT-08 / DEP-09 — 34 SKUs sem identidade | `OPEN_USER_INPUT` | identificar ou manter contenção formal sem publicação |
| Etapas 2/2.1 | DECT-11 — 16 SKUs sem nome público | `OPEN_USER_INPUT` | nomear ou manter contenção formal sem publicação |
| Etapas 2/2.1 | DECT-02 a DECT-09 e DECT-11 a DECT-14 remanescentes | `OPEN_USER_INPUT` / documental | reconciliar com decisões já aplicadas e encerrar estados obsoletos |
| Etapas 3/5 | DEC-07 / DECT-12 — páginas detalhadas de solução | `OPEN_USER_INPUT` | decisão necessária antes da Etapa 15 |
| Etapa 4 | DEP-T1 / O-05 / O-06 — provedor e destino de e-mail | `OPEN_USER_INPUT` | definir provedor, remetente e destinatários |
| Etapa 4 | O-08 / O-09 — usuários reais e atribuição de papéis | `OPEN_USER_INPUT` | definir contas administrativas reais e papéis |
| Etapa 5 | Q-08 — contato público | `OPEN_USER_INPUT` | confirmar telefone/WhatsApp/e-mail/endereço/horário |
| Etapa 5 | Q-13 — dados legais | `OPEN_USER_INPUT` | razão social, CNPJ, controlador/canal do titular, retenção e operadores |
| Etapa 5 | O-10 — prazo comercial público | `OPEN_USER_INPUT` | definir prazo ou decidir não publicar SLA |
| Etapa 5 | formulário geral de contato | `OPEN_USER_INPUT` / `OPEN_TECHNICAL` | depende de contato/e-mail confirmados; implementar se aprovado |
| Etapa 5 | mapa | `OPEN_USER_INPUT` / `OPEN_TECHNICAL` | depende de endereço confirmado; ativar apenas se aprovado |
| Etapa 6 / 14.1 | Central de Conteúdos | `CLOSED_IMPLEMENTED` com homologação integral pendente | manter código integrado e registrar dívida de homologação separadamente |
| Etapa 7 | qualidade integral do HEAD | `OPEN_TECHNICAL` | recertificar após fechamento funcional anterior |
| Etapas 11–13 | B11-05 / O-27 — credencial SMTP legada | `OPEN_EXTERNAL_ACTION` | evidência de revogação/rotação |
| Etapas 11–13 | B11-01 — SPF/DKIM/DMARC e e-mail real | `OPEN_USER_INPUT` / `OPEN_EXTERNAL_ACTION` | definir e validar configuração |
| Etapas 11–13 | B11-02 / DEP-T5 — retenção | `OPEN_USER_INPUT` | decisão operacional/jurídica |
| Etapas 11–13 | B11-03 — dados legais | `OPEN_USER_INPUT` | dados oficiais |
| Etapas 11–13 | B11-04 — contato | `OPEN_USER_INPUT` | dados atuais confirmados |
| Etapas 11–13 | B11-06 — UAT | `OPEN_EXTERNAL_ACTION` | execução e aceite humano |
| Etapas 11–13 | B11-07 — restore / RPO / RTO | `OPEN_TECHNICAL` / `OPEN_EXTERNAL_ACTION` | teste real e evidência |
| Etapas 11–13 | DEP-T3 — storage/backup | `OPEN_TECHNICAL` / `OPEN_USER_INPUT` | política e teste operacional |
| Etapas 11–13 | hardening MCP/segredos/rate-limit | `OPEN_TECHNICAL` | revisar e corrigir antes da recertificação final |
| Governança | README raiz, README docs e relatórios divergentes | `OPEN_TECHNICAL` | consolidar fonte atual de status sem apagar histórico |
| CI | preview HTTP/E2E | `OPEN_TECHNICAL` | corrigir na etapa de recertificação integral |

## Fontes legadas disponíveis para confirmação, não para inferência automática

Os arquivos do site legado fornecidos ao projeto contêm os seguintes dados que podem ser reutilizados somente após confirmação de atualidade:

- Endereço: Rua Ada Caroline Scarano, 259 — João Aranha, Paulínia/SP;
- CEP: 13145-794;
- E-mail: comercial@avizee.com.br;
- Telefone/WhatsApp: (19) 99898-2930;
- Nome exibido no institucional legado: AviZee Equipamentos LTDA;
- Destino do formulário legado: comercial@avizee.com.br;
- Implementação legada de e-mail: SMTP Gmail/PHPMailer.

Esses dados são referência histórica do código legado e não serão tratados como atuais sem ratificação explícita.

## Ordem de execução

1. reconciliar documentação e decisões obsoletas;
2. fechar pendências internas que não exigem decisão do usuário;
3. obter em um único lote as confirmações/dados da AviZee;
4. implementar as decisões confirmadas sem alterar layout;
5. fechar hardening técnico e operacional das etapas anteriores;
6. executar UAT/restore quando aplicável;
7. recertificar o HEAD consolidado;
8. somente então deliberar sobre o início da Etapa 15.

## Status inicial

`PRE_STAGE_15_CLOSURE_IN_PROGRESS`
