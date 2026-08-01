# 114 — Arquitetura de E-mail e Notificações

## 1. Padrão outbox

Nenhum envio síncrono no caminho crítico. `submitQuotation` grava a mensagem em
`outbox_messages` dentro da mesma transação; um worker acionado por `pg_cron` (a cada minuto)
processa pendentes com backoff exponencial (1, 5, 15, 60, 240 min; 5 tentativas) e registra
`SENT`, `FAILED` ou `DEAD_LETTER`. Falha de e-mail **nunca** invalida a cotação.

## 2. Mensagens previstas

| Tipo | Destinatário | Conteúdo |
|---|---|---|
| Nova cotação | Caixa comercial interna | Protocolo, empresa, contato, itens, link para o painel |
| Confirmação de cotação | Solicitante | Protocolo, resumo dos itens, prazo de retorno, canal de continuidade |
| Recuperação de senha | Administrador | Link de uso único |
| Aviso administrativo | Administrador | Falha de job, importação, agendamento |
| Alerta operacional | Administrador | Falhas repetidas, dependência indisponível |

Sem marca de terceiro, sem preço, sem dado além do necessário no corpo.

## 3. Configuração

- Remetente em domínio próprio, com SPF, DKIM e DMARC configurados.
- `reply-to` para a caixa comercial.
- Templates versionados no repositório, com variáveis, sem HTML de terceiros.
- Credenciais **somente** no gerenciador de segredos; nunca no banco, no código ou no bundle.
- Nenhuma credencial do site antigo reutilizada.

## 4. Alternativas (DT-11, `PENDENTE_DE_APROVAÇÃO`)

| Opção | Prós | Contras |
|---|---|---|
| E-mail gerenciado do Lovable com domínio próprio | Integrado, menos configuração | Recursos de bounce dependem do provedor subjacente |
| Provedor transacional dedicado (API) | Entregabilidade, webhooks de bounce, métricas | Custo recorrente, conta externa |
| SMTP seguro próprio | Controle | Operação e entregabilidade por conta da equipe |

Recomendação: e-mail gerenciado com domínio próprio na v1; provedor dedicado se o volume ou a
necessidade de bounce/analytics justificar. Em qualquer caso, o outbox mantém a portabilidade.

## 5. Ambientes

Em desenvolvimento e homologação, envio real desabilitado: mensagens gravadas no outbox com
destino redirecionado para caixa de teste ou marcadas `SIMULATED`.
