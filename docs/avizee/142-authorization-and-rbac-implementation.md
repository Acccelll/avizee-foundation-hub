# 142 — Autorização e RBAC

Arquivo: `src/permissions/model.ts`. Origem: `111-role-permission-matrix.md` e
`architecture/permissions.csv`.

## 1. Papéis aprovados

`ADMINISTRADOR` · `GESTOR_DE_CATALOGO` · `EDITOR` · `AUTOR` · `REVISOR_TECNICO` ·
`COMERCIAL` · `AUDITOR`. Nenhum papel novo foi inventado.

## 2. Permissões

`admin.access` · `catalog.read` · `catalog.write` · `content.read` · `content.write` ·
`content.publish` · `quotation.read` · `media.review` · `settings.write` ·
`users.manage` · `audit.read`.

## 3. Matriz aplicada

| Papel | Permissões |
|---|---|
| ADMINISTRADOR | todas |
| GESTOR_DE_CATALOGO | admin.access, catalog.read, catalog.write, media.review |
| EDITOR | admin.access, content.read, content.write, content.publish, media.review |
| AUTOR | admin.access, content.read, content.write |
| REVISOR_TECNICO | admin.access, catalog.read, content.read |
| COMERCIAL | admin.access, quotation.read, catalog.read |
| AUDITOR | admin.access, audit.read, catalog.read, content.read |

Princípio do menor privilégio: quem edita não necessariamente publica.

## 4. Onde a decisão acontece

A verificação real é **no servidor**. O gate de rota (`_protected`) consulta
`/api/auth/session`, que resolve papéis a partir do cookie verificado no backend. A
interface esconder um item nunca é considerado controle de acesso.

## 5. Papel nunca no perfil

Papel é relação separada do usuário, jamais coluna de perfil — regra permanente contra
escalonamento de privilégio. Quando as tabelas forem criadas na Etapa 6, isso será
`user_roles` + função `security definer`, conforme `101`.

## 6. Pendência

A matriz por **ação de catálogo** (criar família, publicar SKU, executar importação,
reverter importação, resolver conflito, acessar campos internos) é escopo da Etapa 6 e
será detalhada em `180`.
