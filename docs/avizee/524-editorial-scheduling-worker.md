---
name: Etapa 14 — Scheduler Worker
description: Registro da implementação do processador de agendamento.
type: feature
---

# 524 — EDITORIAL SCHEDULING WORKER

## 1. IMPLEMENTAÇÃO
- Criado `src/content/scheduler.server.ts`.
- Mecanismo de **Claim Atômico** via token UUID para evitar concorrência.
- Publicação idempotente: altera `status` para `PUBLISHED` e define `published_at`.
- Auditoria de sistema registrada para cada publicação automática.

## 2. RESILIÊNCIA
- Falhas mantêm o artigo em `SCHEDULED`.
- Registro de `last_schedule_error` para diagnóstico administrativo.
- Incremento de tentativas para monitoramento de saúde.

## 3. SEGURANÇA
- O worker exige `SUPABASE_SERVICE_ROLE_KEY`.
- Não expõe dados parciais em caso de falha.
