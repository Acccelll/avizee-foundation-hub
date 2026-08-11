# 558 — Etapa 15: validação final de segurança

## Veredito

`SECURITY_TECHNICAL_VALIDATED`

## Controles acrescentados

As respostas do servidor passam a aplicar centralmente:

- Content-Security-Policy com `default-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'`, `base-uri 'self'` e `form-action 'self'`;
- `X-Content-Type-Options: nosniff`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- `X-Frame-Options: DENY`;
- `Cross-Origin-Opener-Policy: same-origin`;
- `Permissions-Policy` bloqueando câmera, microfone, geolocalização, pagamento e USB;
- HSTS somente quando `APP_ENV=production`.

Os headers são aplicados também a respostas MCP bloqueadas e respostas de erro normalizadas, sem remover headers funcionais existentes.

## Evidência automatizada

O HEAD de código `fd9de79250ebf4db6e11411072b69ca56c1c5c11` passou no CI #249 (`31499412669`), incluindo regressão unitária dos headers, E2E HTTP, testes de segurança existentes e replay integral do banco local.

## Limites

- a CSP mantém `unsafe-inline` em `script-src`/`style-src` para compatibilidade com o runtime/hydration atual; portanto não é declarada como CSP estrita por nonce;
- HSTS real depende de HTTPS produtivo;
- hardening de infraestrutura, segredos reais, binding distribuído MCP e ambiente conectado permanecem gates da Etapa 16.
