# 139 — Roteamento Implementado

Roteamento baseado em arquivos do TanStack Router. `src/routeTree.gen.ts` é gerado e não
é editado manualmente.

## 1. Rotas públicas

| Caminho | Arquivo | Conteúdo |
|---|---|---|
| `/` | `routes/index.tsx` | institucional provisório |
| `/produtos` | `routes/produtos.tsx` | placeholder de módulo |
| `/solucoes` | `routes/solucoes.tsx` | placeholder de módulo |
| `/conteudos` | `routes/conteudos.tsx` | placeholder de módulo |
| `/sobre` | `routes/sobre.tsx` | institucional |
| `/contato` | `routes/contato.tsx` | institucional, sem envio real |
| `/cotacao` | `routes/cotacao.tsx` | placeholder de módulo |
| `/politica-de-privacidade` | `routes/politica-de-privacidade.tsx` | legal |
| `/termos-de-uso` | `routes/termos-de-uso.tsx` | legal |

As URLs seguem `45-url-architecture.md`. Nenhuma rota de categoria, família ou SKU foi
criada — isso é Etapa 7.

## 2. Rotas administrativas

| Caminho | Arquivo | Proteção |
|---|---|---|
| `/admin/login` | `routes/admin/login.tsx` | pública |
| `/admin/acesso-negado` | `routes/admin/acesso-negado.tsx` | pública |
| `/admin` | `routes/admin/_protected.tsx` + `_protected/index.tsx` | sessão + `admin.access` |

O layout `_protected` usa `ssr: false` porque a sessão vive em cookie verificado no
servidor; a decisão real de acesso é sempre revalidada no backend a cada requisição.

## 3. Rotas HTTP

| Caminho | Método | Função |
|---|---|---|
| `/api/auth/login` | POST | autenticação, rate limited |
| `/api/auth/logout` | POST | expira o cookie |
| `/api/auth/session` | GET | estado da sessão para o gate |
| `/api/public/health` | GET | verificação de disponibilidade, sem dados internos |
| `/robots.txt` | GET | gerado por ambiente |

## 4. Matriz de renderização (DT-04 com ajuste)

| Tipo | Estratégia |
|---|---|
| Institucional e legal | estático |
| Catálogo e conteúdos (futuro) | servidor com cache, invalidado na publicação |
| Administrativo e privado | servidor sem cache |
| Interações | cliente |

Nesta etapa só existem os dois primeiros grupos e o administrativo.
