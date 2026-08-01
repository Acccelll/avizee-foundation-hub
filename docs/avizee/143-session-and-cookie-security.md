# 143 — Sessão e Segurança de Cookie

Arquivo: `src/auth/session.server.ts`.

## 1. Formato

Cookie `avizee_admin_session` contendo `payload.assinatura`, onde o payload traz apenas
`sub` (UUID do usuário), `exp` e `jti`. Não há nome, e-mail, papel nem qualquer PII no
cookie.

## 2. Assinatura

HMAC-SHA256 com `AUTH_SESSION_SECRET`, comparado em tempo constante. Payload adulterado
ou expirado é rejeitado sem consultar o provedor.

## 3. Atributos

`HttpOnly` · `SameSite=Lax` · `Path=/` · `Secure` fora de desenvolvimento ·
`Max-Age` derivado de `AUTH_SESSION_TTL_MINUTES` (default 8 horas).

`HttpOnly` impede leitura por script, o que neutraliza roubo de sessão via XSS.

## 4. CSRF

`src/start.ts` registra `createCsrfMiddleware` para server functions. As rotas de
autenticação usam `SameSite=Lax` e só aceitam POST com corpo JSON.

## 5. Encerramento

`POST /api/auth/logout` emite cookie vazio com expiração no passado e registra
`auth.logout`. Não existe encerramento apenas no cliente.

## 6. Limitação conhecida

Não há revogação por `jti` (lista de sessões inválidas) porque isso exige persistência.
Com o banco ativo, passa a ser viável; registrado em `155` como DV-05-05.
