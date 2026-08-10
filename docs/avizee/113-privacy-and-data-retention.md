# 113 — Privacidade (LGPD) e Retenção

Todas as propostas: `PENDENTE_DE_APROVAÇÃO_JURÍDICA_E_OPERACIONAL`, salvo atualizações explícitas
registradas ao final deste documento.

## 1. Dados, finalidade e base legal

<!-- prettier-ignore -->
| Dado | Finalidade | Base legal (proposta) |
|---|---|---|
| Empresa, contato, e-mail, telefone, cidade, UF | Responder à solicitação de cotação | Procedimentos preliminares relacionados a contrato, a pedido do titular |
| Itens, quantidades, observações | Elaborar a resposta comercial | Idem |
| Consentimento de marketing | Comunicações promocionais | **Consentimento** — separado, opcional, desmarcado por padrão, revogável |
| IP (hash) e user-agent | Segurança antiabuso | Legítimo interesse |
| Logs de auditoria administrativa | Segurança e responsabilização | Legítimo interesse / obrigação de segurança |
| Cookies essenciais | Funcionamento do site | Necessidade |
| Analytics | Melhoria do serviço | Consentimento (não ativado na v1) |

## 2. Controles técnicos

Minimização (`103`), consentimento versionado em `consent_records` (texto e versão gravados),
revogação registrada, canal de solicitação do titular (`privacy_requests`) com prazo,
exportação sob demanda, exclusão/anonimização por função auditada, mascaramento de dado
pessoal para papéis não comerciais, ausência total de dado pessoal em analytics, em logs de
aplicação e em alertas.

## 3. Serviços externos e privacidade

Google Maps carrega **somente após clique** (D-051), com bloco estático e link externo como
alternativa. EmbedSocial fora da v1 (D-051). Provedor de e-mail recebe apenas o necessário
para entregar a mensagem.

## 4. Retenção proposta

<!-- prettier-ignore -->
| Dado | Retenção operacional | Observação |
|---|---|---|
| Cotações ativas | 24 meses após o último evento | Depois: anonimizar contato, preservar itens agregados |
| Cotações SPAM | 90 dias | Exclusão automática |
| Contatos (formulário) | 12 meses | Anonimização |
| Consentimentos | 5 anos após revogação | Prova de conformidade |
| Logs de auditoria | 12 meses | 24 meses para ações críticas |
| Logs de aplicação | 30 dias | Sem dado pessoal |
| Contas administrativas inativas | Desativação em 90 dias sem uso | Exclusão só com aprovação |
| Backups | 30 dias | Exclusão em backup ocorre por expiração do ciclo |
| Arquivos de importação | 12 meses | Auditoria de origem |
| Imagens reprovadas | 24 meses em área privada | Nunca públicas |
| Conteúdo arquivado | Permanente | Histórico editorial |

Diferenciação: operacional (uso corrente) · legal (obrigação) · segurança (auditoria) ·
histórica (integridade do catálogo e de cotações) · exclusão manual · anonimização.

## 5. Pendência

Textos jurídicos (Política de Privacidade, Termos, Cookies) não podem ser finalizados sem os
dados legais da empresa e revisão apropriada — DEP-T5.

## Atualização 2026-08-01 — DT-16 aprovada condicionalmente

Aprovado o **princípio** de política finita e configurável. **Prazos definitivos não aprovados**
(DEP-T5, pendente de validação operacional e jurídica). Grupos separados: cotações, contatos,
consentimentos, logs, auditoria, arquivos de importação, backups, imagens rejeitadas, documentos
de direito e contas administrativas. Cada grupo declara finalidade, base legal, prazo, evento
inicial, destino após o prazo, anonimização ou exclusão, exceções e responsável.
**A exclusão automática em produção fica bloqueada até a definição dos prazos.**

## Atualização 2026-08-10 — retenção de cotações/leads aprovada

O usuário aprovou explicitamente **24 meses após a última interação comercial** como prazo de
retenção para cotações/leads do site.

Após o prazo, os dados pessoais devem ser excluídos ou anonimizados quando não houver
relacionamento ativo ou outra obrigação aplicável. Se a cotação evoluir para contrato, operação
fiscal ou relacionamento comercial, o registro deixa de ser tratado apenas como lead do site e
passa a seguir a retenção aplicável ao processo correspondente.

Esta aprovação encerra `B11-02 / DEP-T5` **somente para cotações/leads**. Os demais prazos da tabela
acima continuam como proposta até decisão específica ou até demonstração de que não são necessários
no escopo operacional da v1. A exclusão automática ampla em produção continua bloqueada enquanto
esses grupos remanescentes não forem conciliados.
