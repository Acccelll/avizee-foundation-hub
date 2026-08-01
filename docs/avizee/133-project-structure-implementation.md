# 133 — Estrutura do Projeto Implementada

## 1. Árvore relevante

```text
src/
├── assets/brand/          logotipo vetorial oficial
├── auth/                  contrato, provedor e sessão administrativa
│   ├── contract.ts
│   ├── local-provider.server.ts
│   └── session.server.ts
├── components/
│   ├── admin/AdminShell.tsx
│   ├── public/PublicShell.tsx
│   ├── public/ModulePlaceholder.tsx
│   └── ui/                primitivos shadcn (não alterados visualmente)
├── integrations/supabase/ clientes gerados pelo Lovable Cloud
├── lib/                   env, env.server, logger, errors, audit.server
├── permissions/model.ts   RBAC (papéis, permissões, matriz)
├── routes/                roteamento baseado em arquivos
├── seo/meta.ts            metadados e controle de indexação
├── services/              contracts.ts + adapters.server.ts
├── styles.css             fonte única dos tokens visuais
└── start.ts               middlewares globais (erro, CSRF, bearer)
```

## 2. Convenções aplicadas

- **Fronteira de servidor pelo nome do arquivo**: `*.server.ts` nunca é importável pelo
  cliente. Segredos vivem exclusivamente nesses módulos.
- **Rotas HTTP externas** ficam em `src/routes/api/`; `api/public/*` é o único prefixo
  acessível sem autenticação do site.
- **Nenhum valor visual literal** em componente: tudo vem de token (`135`).
- **Português** em rótulos, mensagens e microcopy; inglês apenas em identificadores
  técnicos.

## 3. Módulos deliberadamente ausentes

Não existem diretórios de catálogo, cotação ou conteúdos. Sua criação é escopo da
Etapa 6 em diante, para não gerar componentes vazios ou `TODO`.
