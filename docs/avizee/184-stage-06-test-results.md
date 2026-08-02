# 184 — Resultados dos Testes da Etapa 6

## Configuração
- Framework: Vitest (ambiente Node, `fileParallelism: false`), configuração em `vitest.config.ts`.
- Relatórios: `reports/tests/junit.xml` e cobertura em `reports/coverage`.
- Ambiente: instância **não produtiva** do Lovable Cloud, com guarda que aborta a suíte quando
  `APP_ENV=production`. Usuários e registros sintéticos com prefixo `zzt-`, removidos ao final.
- Migrations reais aplicadas; nenhuma tabela simulada.

## Resultado
**10 arquivos, 174 testes, 174 aprovados, 0 falhas, ~67 s.**

| Bloco | Arquivo | Testes |
|---|---|---|
| Unitário — contrato de importação | `tests/unit/import-schema.test.ts` | 25 |
| Unitário — serialização pública | `tests/unit/serializer.test.ts` | 25 |
| Unitário — plano de importação | `tests/unit/import-plan.test.ts` | 14 |
| Unitário — máquina de estados | `tests/unit/state-machine.test.ts` | 16 |
| Unitário — permissões e auditoria | `tests/unit/permissions-audit.test.ts` | 15 |
| Unitário — termos de marca | `tests/unit/brand-terms.test.ts` | 12 |
| Integração — administração do catálogo | `tests/integration/catalog-admin.test.ts` | 25 |
| Integração — pipeline de importação | `tests/integration/import-pipeline.test.ts` | 10 |
| Segurança — RLS, RBAC e não vazamento | `tests/security/rls-and-exposure.test.ts` | 17 |
| Superfícies HTTP | `tests/e2e/http-surfaces.test.ts` | 15 |

## Cobertura funcional relevante
RLS por papel, negação por permissão ausente, imutabilidade da auditoria, mascaramento de e-mail,
recusa de execução com assinatura divergente e com conteúdo divergente, recusa de reexecução da
mesma simulação, bloqueio de linha fora do escopo sem descarte, gravação de código de origem como
interno, rollback por soft delete, recusa de rollback duplicado, ausência de campo interno e de
preço na serialização, saúde do serviço sem revelar detalhes internos.

## Falhas encontradas e corrigidas durante a construção da suíte
1. Falta de `GRANT EXECUTE` nas funções de papel — corrigida por migração.
2. Enums de estado incorretos em `runner.server.ts` — corrigidos.
3. Health check sem prova real de disponibilidade — passou a consultar `/auth/v1/health`.

## Comandos
`bunx vitest run` · `bunx tsgo --noEmit` · `bunx eslint .` · `bun run build`

## Limitações
Sem teste de carga, sem axe-core automatizado e sem Lighthouse nesta etapa.

## DV-05-09
**ENCERRADO_COM_EVIDÊNCIA.**
