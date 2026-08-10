# 547 — Hardening da superfície MCP antes da Etapa 15

> Data: 2026-08-10  
> Branch: `pre-stage-15-close-previous-stages`  
> Escopo: segurança técnica da superfície MCP; nenhuma alteração de layout público.

## 1. Estado funcional preservado

O MCP continua limitado às cinco ferramentas públicas e somente leitura já aprovadas. Este fechamento não adiciona ferramentas, não amplia o catálogo publicado, não expõe campos internos e não cria operações de escrita.

As rotas geradas por `@lovable.dev/mcp-js` permanecem sob responsabilidade do plugin e não foram tomadas manualmente pelo projeto.

## 2. Boundary externo no servidor

A proteção foi aplicada no entrypoint estável `src/server.ts`, antes de qualquer entrega da requisição ao handler gerado do MCP.

As superfícies protegidas são:

- `/mcp`;
- `/.mcp/*`.

Rotas públicas normais e o restante do site não passam pelo limiter específico do MCP.

## 3. Origem canônica em produção

Antes do handler MCP, o servidor exige em `APP_ENV=production` que a origem da própria URL da requisição corresponda à origem HTTPS configurada em `APP_PUBLIC_URL`.

O guard não usa `X-Forwarded-Host` fornecido pelo cliente para tomar essa decisão.

Comportamento:

- origem canônica válida → continua;
- origem divergente → HTTP 421 com resposta genérica e `no-store`;
- `APP_PUBLIC_URL` ausente, inválida ou sem HTTPS → HTTP 503 e fail-closed.

Essa camada é externa à opção `trustForwardedHost` atualmente emitida pelo adaptador MCP e existe justamente para que a política do projeto não dependa de um header encaminhado pelo cliente.

## 4. Rate limit

### Produção

O código exige um binding distribuído com o nome:

`MCP_RATE_LIMITER`

O contrato esperado é um objeto com operação assíncrona `limit({ key })` retornando `{ success: boolean }`.

Se o binding não existir em produção, o MCP responde HTTP 503 (`rate_limit_not_configured`). Se o binding falhar, responde HTTP 503 (`rate_limit_unavailable`). Se o limite for excedido, responde HTTP 429 (`rate_limited`). Em todos esses casos a resposta é genérica e `Cache-Control: no-store`.

Não foi escolhido nem hardcoded neste repositório um limite operacional de produção, período ou namespace do provedor. Esses valores pertencem à configuração real de infraestrutura e devem ser definidos no ambiente de publicação antes que o MCP possa ser habilitado em produção.

### Desenvolvimento, preview e teste

Fora de produção existe apenas um bucket em memória, atualmente amplo, para proteção básica do processo local. Esse fallback:

- não é distribuído;
- não é apresentado como controle de produção;
- não substitui o binding exigido em produção.

## 5. Chave do limiter

Quando disponível, a chave usa `CF-Connecting-IP`, fornecido pela borda Cloudflare no ambiente esperado. O código deliberadamente não usa `X-Forwarded-For` como fonte de identidade do cliente.

A chave não é retornada ao cliente nem incluída nas mensagens de erro do limiter.

## 6. Segredos e arquivos de ambiente

No HEAD deste fechamento:

- `.env` foi removido do repositório;
- `.gitignore` bloqueia `.env` e `.env.*`, exceto `.env.example`;
- `.env.example` contém apenas inventário/placeholders, sem credencial real;
- segredos de workers internos permanecem separados por finalidade;
- o CI possui regressão específica para impedir que `.env` volte ao checkout versionado.

A remoção do arquivo do HEAD não equivale à rotação retroativa de qualquer segredo histórico. A credencial SMTP legada tem tratamento separado e sua revogação foi confirmada pelo usuário no doc. 543.

## 7. Testes adicionados

`tests/unit/mcp-rate-limit.test.ts` cobre:

- delimitação das superfícies MCP;
- ausência de impacto em rotas públicas normais;
- origem canônica válida;
- rejeição de host divergente mesmo quando existe `X-Forwarded-Host`;
- fail-closed de origem inválida;
- fail-closed em produção sem binding;
- binding permitindo requisição;
- HTTP 429 quando o limite é excedido;
- ausência de vazamento da chave nas respostas;
- fail-closed quando o binding fica indisponível;
- fallback local somente fora de produção.

`tests/security/regression.test.ts` também protege a higiene do checkout de CI quanto a arquivos `.env` versionados.

## 8. Classificação

A lacuna de **código permitir MCP de produção sem rate limiter** fica tecnicamente contida por fail-closed.

A criação/configuração real do binding distribuído permanece uma ação externa de infraestrutura:

- código/boundary: `CLOSED_IMPLEMENTED` após CI verde do novo HEAD;
- binding real de produção: `OPEN_EXTERNAL_ACTION`;
- produção: continua `PRODUCTION_BLOCKED`;
- operação: continua `OPERATION_BLOCKED`.
