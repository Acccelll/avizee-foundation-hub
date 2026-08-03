# 342 — Logging metrics and correlation

> Etapa 11 — Consolidação técnica e preparação pré-produção.
> Release candidate: **RC-AVIZEE-01** · Data: 2026-08-03 · Ambiente: homologação/preview.
> **Produção não alterada. DNS não alterado. Site atual intacto.**

## Formato de log
`timestamp`, `env`, `level`, `event`, `correlation_id`, `request_id`, `actor_id` interno quando autorizado, `result`, `duration_ms` e erro sanitizado.

## Redação obrigatória
Nunca são registrados: senha, token, cookie, cabeçalho de autorização, chave, segredo, conteúdo integral da mensagem, observação pessoal, lista integral de itens ou documento de direito. E-mail é mascarado (`z***@dominio`), telefone e documento são truncados.

## Correlação
`correlation_id` é UUID sem PII e acompanha: requisição → função de servidor → banco → auditoria → outbox → tentativa de notificação → resposta.

Aplicado a cotação, formulário de contato, importação, publicação, upload, migração e restore.

## Métricas
Lista fechada em `stage-11-metrics.csv`, com rótulos restritos a `env`, `route`, `method`, `status`, `outcome`, `reason` e `entity`.
