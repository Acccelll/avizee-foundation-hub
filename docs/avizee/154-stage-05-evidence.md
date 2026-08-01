# 154 — Evidências da Etapa 5

Todas as evidências abaixo foram produzidas por execução real, não por declaração.

## 1. Type checking

```text
$ bunx tsgo --noEmit
(sem saída, código de saída 0)
```

## 2. Lint e formatação

```text
$ bunx eslint .
✖ 6 problems (0 errors, 6 warnings)
```

Os 6 avisos são `react-refresh/only-export-components` em primitivos de UI de terceiros
(`badge`, `button`, `form`, `navigation-menu`, `sidebar`, `toggle`). Não afetam
comportamento e não são regressão do projeto.

## 3. Disponibilidade das rotas

```text
/                          200
/produtos                  200
/solucoes                  200
/conteudos                 200
/sobre                     200
/contato                   200
/cotacao                   200
/politica-de-privacidade   200
/termos-de-uso             200
/admin/login               200
/robots.txt                200
/api/public/health         200
```

## 4. Controle de indexação

```text
$ curl /robots.txt
User-agent: *
Disallow: /
```

Ambiente não produtivo nega indexação integralmente.

## 5. Sessão e autenticação

```text
$ curl /api/auth/session
200 {"authenticated":false}

$ curl -X POST /api/auth/login -d '{"email":"x@y.com","password":"errada"}'
401
```

A resposta `401` é idêntica para e-mail inexistente, senha errada e corpo malformado —
não enumeração confirmada.

## 6. Autorização

O gate `_protected` redireciona para `/admin/login` sem sessão e para
`/admin/acesso-negado` quando a sessão existe mas não possui `admin.access`. A decisão
vem de `/api/auth/session`, resolvida no servidor a partir do cookie assinado.

## 7. Segurança de segredo

`AUTH_SESSION_SECRET` ausente em `staging`/`production` faz a aplicação **falhar ao
iniciar**, com mensagem que cita apenas o nome da variável.

## 8. Banco

Instância Postgres gerenciada ativada; clientes gerados; **nenhuma tabela criada**,
nenhum dado inserido, nenhum bucket criado.

## 9. Evidências que NÃO existem

Testes automatizados, auditoria de acessibilidade instrumentada, medição de performance
e persistência de auditoria. Ver `155`.
