# 146 — Fundação de Auditoria

Arquivo: `src/lib/audit.server.ts`.

## 1. Forma do registro

```text
actorId · action · entity · entityId · result · origin · context · occurredAt
```

É exatamente a forma aprovada em `101` e `102` para a tabela `audit_logs`. A estrutura
foi fixada agora justamente para que a persistência posterior não exija reescrever
chamadas.

## 2. Ações cobertas nesta etapa

`auth.login.success` · `auth.login.failure` · `auth.logout` · `auth.rate_limited` ·
`user.create` · `user.role.change` · `permission.change` · `settings.change` ·
`content.publish`.

## 3. Onde grava hoje

Em **log estruturado**, não em banco. Quando a fundação foi construída não havia banco
aprovado. Isso é uma limitação real: log não oferece consulta por entidade, retenção
garantida nem imutabilidade.

Com o banco ativo (`151`), a persistência em `audit_logs` passa a ser obrigatória na
Etapa 6 — sem ela, o requisito de trilha de auditoria do catálogo não se cumpre.
Registrado como DV-05-06 em `155`.

## 4. Segurança do registro

O contexto passa pelo redator do `logger`: senha, token e cookie nunca são gravados e o
e-mail é mascarado. Não se registra arquivo completo, documento de direitos nem segredo.

## 5. Origem

`originFrom(request)` usa o primeiro endereço de `x-forwarded-for`. Em conformidade com
`113`, o endereço destina-se a virar hash antes de persistir.
