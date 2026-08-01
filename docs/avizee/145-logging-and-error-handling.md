# 145 — Logging e Tratamento de Erros

Arquivos: `src/lib/logger.ts`, `src/lib/errors.ts`, `src/lib/error-page.ts`.

## 1. Log estruturado

Saída JSON de linha única com `level`, `ts`, `event`, `env` e contexto. Não existe
`console.log` informal na aplicação.

## 2. Redação obrigatória

Chaves redigidas integralmente: `password`, `senha`, `token`, `access_token`,
`refresh_token`, `authorization`, `cookie`, `set-cookie`, `secret`, `apikey`, `api_key`,
`session`, `hash`.

Mascaramento parcial: `email` (`p***@dominio`), `phone`, `telefone`, `cnpj`, `document`.

A redação é recursiva e limitada em profundidade, então um segredo aninhado em objeto
também é removido.

## 3. Erros

`AppError` com códigos estáveis (`UNAUTHENTICATED`, `FORBIDDEN`, `RATE_LIMITED`,
`NOT_FOUND`, `VALIDATION`, `INTERNAL`), cada um com status HTTP e mensagem em português
segura para exibição.

Regra: erro interno **nunca** vaza stack, caminho de arquivo, nome de tabela, marca ou
consulta ao usuário final. O detalhe vai para o log correlacionado por identificador.

## 4. Página de erro

`renderErrorPage()` produz HTML mínimo e neutro para falha não tratada de requisição,
sem depender do bundle da aplicação.

## 5. Correlação

`correlationId()` gera UUID por ocorrência, permitindo ligar a mensagem vista pelo
usuário à linha de log — sem expor o conteúdo do erro.
