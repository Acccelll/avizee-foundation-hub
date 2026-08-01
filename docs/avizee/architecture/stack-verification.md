# Evidência de Verificação da Stack (DT-01)

**Data**: 2026-08-01 · **Responsável**: engenharia · **Resultado**: **TANSTACK START CONFIRMADO**

Verificação objetiva exigida por DT-01 antes de qualquer implementação estrutural da Etapa 5.

| Item verificado | Evidência observada | Conclusão |
|---|---|---|
| `package.json` | `name: tanstack_start_ts`, `type: module`, scripts `vite dev` / `vite build` / `vite build --mode development` | Projeto Vite + TanStack Start |
| Presença de `@tanstack/react-start` | `@tanstack/react-start ^1.168.32` em `dependencies` | **Presente** |
| Router | `@tanstack/react-router ^1.170.18` + `@tanstack/router-plugin ^1.168.23` | Roteamento TanStack |
| Ausência de router legado | **Nenhum** `react-router-dom` nas dependências | Sem stack legada |
| Estrutura de rotas | `src/routes/` com `__root.tsx`, rotas públicas (`index`, `produtos`, `solucoes`, `conteudos`, `sobre`, `contato`, `cotacao`, legais), `src/routes/admin/`, `src/routes/api/auth/`, `src/routes/api/public/`, `robots[.]txt.ts`; árvore gerada em `src/routeTree.gen.ts` | File-based routing nativo |
| Configuração de build | `vite.config.ts` com `@lovable.dev/vite-tanstack-config`, Vite 8, Tailwind 4 via `@tailwindcss/vite` | Build oficial do template |
| Mecanismo de renderização | SSR nativo: `src/server.ts` delega a `@tanstack/react-start/server-entry`; `src/start.ts` e `src/router.tsx` presentes; runtime Worker (Nitro) | **SSR nativo TanStack Start** |
| Backend gerenciado | Lovable Cloud ainda **não ativado** neste projeto | Ativação pendente (Incremento 1) |

## Consequências

1. O cenário "React + Vite legado" **não se aplica**. Nenhuma migração artesanal, nenhuma
   recriação de projeto e nenhuma substituição de stack são necessárias ou autorizadas.
2. A implementação segue com SSR nativo do TanStack Start, `createServerFn` para chamadas
   internas e server routes em `src/routes/api/` para contratos externos (DT-03).
3. Lovable Cloud permanece como backend gerenciado aprovado (DT-01/DT-02), a ser ativado no
   início do Incremento 1 — não nesta rodada.
4. A dependência do ambiente Lovable permanece como **risco controlado** (RK-33).

**Condição 1 da §23 da decisão do cliente: ATENDIDA.**
