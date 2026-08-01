# 131 — Etapa 5: Plano da Fundação Técnica

Status: `IMPLEMENTADO` · Aguarda aprovação formal.
Origem: prompt da Etapa 5 (50 seções) + decisões D-063 a D-065 (Etapa 4).

## 1. Objetivo

Implementar **somente** a fundação técnica: estrutura de projeto, ambientes, design tokens,
tipografia, shells público e administrativo, roteamento, SEO estrutural, autenticação,
autorização, contratos de serviço, logging, auditoria, segurança e portas de qualidade.

Nenhum módulo de negócio (catálogo, cotação, conteúdos) foi implementado.

## 2. Restrições respeitadas

| Restrição | Evidência |
|---|---|
| Não alterar o layout aprovado na Etapa 3 | Tokens e shells derivam de `76`–`89`; nenhum valor visual novo |
| Não ativar serviços reais | `src/services/adapters.server.ts` — todos os provedores são simulados e recusam produção |
| Não indexar fora de produção | `src/seo/meta.ts` e `src/routes/robots[.]txt.ts` |
| Não expor segredo ao cliente | `src/lib/env.server.ts` lido apenas no servidor |
| Não publicar conteúdo real de catálogo | Rotas públicas usam `ModulePlaceholder` |
| Não alterar o site atual | Nenhum artefato do site PHP legado foi tocado |

## 3. Sequência executada

1. Verificação da stack (`architecture/stack-verification.md`) — TanStack Start confirmado.
2. Design tokens e tipografia em `src/styles.css`.
3. Shells e componentes de estrutura.
4. Roteamento público e administrativo baseado em arquivos.
5. SEO estrutural e controle de indexação por ambiente.
6. Autenticação, sessão assinada, RBAC e auditoria.
7. Contratos de serviço com adaptadores simulados identificados.
8. Ativação do banco (Lovable Cloud) — ver `151`.

## 4. Fora do escopo desta etapa

Catálogo, cotação, CMS, busca, filtros, e-mail real, WhatsApp, analytics, domínio de
produção, migração do site atual.

## 5. Mapa dos documentos da Etapa 5

`131` plano · `132` prontidão · `133`–`139` implementação estrutural · `140` SEO ·
`141`–`143` identidade e sessão · `144` contratos · `145`–`146` observabilidade ·
`147` segurança · `148`–`150` qualidade · `151` banco · `152`–`153` testes e CI ·
`154` evidências · `155` desvios · `156` relatório executivo.
