# 121 — Logs, Monitoramento e Alertas

## 1. Camadas de log

| Camada | Conteúdo | Retenção |
|---|---|---|
| Auditoria (`audit_logs`) | Ações administrativas relevantes | 12–24 meses |
| Aplicação | Erros, latência, código de erro, rota, correlação | 30 dias |
| Jobs (`outbox_messages`, `import_jobs`) | Tentativas, resultado, motivo | 12 meses |
| Acesso | Requisições agregadas | Conforme provedor |

Nenhum log contém segredo completo, senha, token, corpo de e-mail, observação de cotação ou
dado pessoal além do estritamente necessário. IP é armazenado com hash quando usado para
antiabuso. Diffs de auditoria redigem campos SENSITIVE e SECRET.

## 2. Eventos auditados

Login, falha de login, criação, edição, publicação, despublicação, exclusão, importação,
alteração de SKU ou de código, alteração de status, alteração de cotação, troca de imagem,
aprovação/reprovação de imagem, alteração de metadados de SEO, alteração de configuração,
alteração de usuário ou papel, acesso a dados pessoais de cotação.
Campos: usuário, ação, entidade, ID, data, diff seguro, IP quando apropriado, contexto.

## 3. Monitoramento

Disponibilidade (health check externo a cada 1–5 min em `/` e `/api/public/health`),
taxa de erro 5xx, latência p75/p95, sucesso de envio de cotação, fila do outbox, falhas de
login, uploads com erro, importações, jobs do `pg_cron`, validade do sitemap, volume de 404,
uso de storage e conexões do banco.

## 4. Alertas mínimos

| Alerta | Gatilho |
|---|---|
| Site indisponível | 2 falhas consecutivas de health check |
| Cotação falhando | ≥ 3 erros de `submitQuotation` em 15 min |
| E-mail falhando | ≥ 5 mensagens em `FAILED` ou qualquer `DEAD_LETTER` |
| Erro elevado | 5xx > 1% das requisições em 10 min |
| Storage próximo do limite | ≥ 80% |
| Falhas repetidas de login | ≥ 10 falhas para o mesmo usuário em 15 min |
| Dependência externa indisponível | Provedor de e-mail ou banco inacessível |
| Job de agendamento sem execução | Sem execução bem-sucedida em 30 min |

Alertas não contêm dados pessoais completos — apenas identificadores técnicos e protocolo.

## 5. Processamento assíncrono

Fila única baseada em tabela (`outbox_messages`) com tipos: `EMAIL`, `IMAGE_DERIVATIVE`,
`ARTICLE_PUBLISH`, `SITEMAP_REFRESH`, `IMPORT_APPLY`. Worker acionado por `pg_cron`,
idempotente, com bloqueio por `FOR UPDATE SKIP LOCKED`, backoff e dead letter.
Nenhum broker externo na v1 — complexidade desproporcional ao volume.
