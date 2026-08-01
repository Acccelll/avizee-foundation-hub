# 124 — CI/CD, Gates e Release

## 1. Pipeline

`lint` → `typecheck` → `testes unitários e de integração` → `build` →
`auditoria de dependências` → `scan de segredo no bundle` → `testes R-05` →
`E2E em preview` → `axe-core` → `Lighthouse CI` → `deploy de homologação` →
`aprovação manual` → `migrations` → `deploy de produção` → `smoke test`.

## 2. Gates bloqueantes

Nenhuma versão vai a produção quando: testes críticos falharem; build falhar; marca interna
vazar; segredo estiver no bundle; cotação estiver indisponível; sitemap for inválido;
redirecionamento crítico falhar; acessibilidade crítica estiver quebrada; conteúdo em rascunho
estiver acessível publicamente; ou orçamento de performance regredir mais de 10%.

## 3. Branches e versionamento

`main` (produção, protegida) · `develop` (integração) · `feature/*` · `fix/*` ·
`release/*` quando necessário. Pull request obrigatório com preview automático e revisão.
Tags `vMAJOR.MINOR.PATCH`; `CHANGELOG.md` por release. Banco versionado por migrations;
catálogo e conteúdo versionados por `import_jobs`, `article_revisions` e
`publication_history`.

## 4. Deploy

Preview automático por alteração; **produção exige aprovação explícita** — sem deploy
automático a cada commit. Rollback: reverter release + migration de reversão + verificação de
integridade. Segredos por ambiente, nunca no repositório. Logs de deploy retidos.

## 5. Definição de pronto

Código revisado, testes passando, acessibilidade verificada, SEO da rota conferido, tokens
aprovados respeitados, documentação atualizada em `/docs/avizee/` e gate aprovado.


## Atualização 2026-08-01 — DT-21 aprovada

Deploy de produção exige, nesta ordem: 1) lint; 2) type checking; 3) testes; 4) build;
5) migrations validadas; 6) teste de RLS; 7) teste de não vazamento (R-05); 8) acessibilidade
crítica; 9) segurança; 10) **aprovação manual**. Preview automático por alteração; homologação
antes de produção; rollback e changelog obrigatórios.
**Proibida produção contínua automática a cada alteração.**
