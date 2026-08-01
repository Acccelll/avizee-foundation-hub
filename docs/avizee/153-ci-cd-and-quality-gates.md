# 153 — CI/CD e Portas de Qualidade

Origem: `124-ci-cd-and-release-strategy.md`.

## 1. Portas já executáveis

| Porta | Comando | Estado |
|---|---|---|
| Type checking | `tsgo --noEmit` | passa |
| Lint e formatação | `bun run lint` | passa |
| Build | `bun run build` | executado pela plataforma a cada alteração |
| Formatação | `bun run format` | disponível |

## 2. Portas ainda ausentes

| Porta | Bloqueio |
|---|---|
| Testes automatizados | suíte não existe (DV-05-09) |
| Teste de não vazamento | depende do catálogo (Etapa 6) |
| Auditoria de acessibilidade automatizada | não instrumentada |
| Orçamento de performance | sem medição (DV-05-08) |

## 3. Regra de release aprovada

Nenhuma publicação em produção sem: testes verdes, teste de não vazamento verde,
acessibilidade WCAG 2.2 AA verificada, orçamento de performance respeitado e migrations
aplicadas com rollback planejado.

Como três dessas portas ainda não existem, **produção permanece bloqueada** — coerente
com DEP-T1, DEP-T3, DEP-T5 e RK-42, que já bloqueiam produção por outros motivos.

## 4. Ambientes de deploy

Preview automático a cada alteração. Homologação e produção exigem instâncias separadas
de banco (DT-18) e ainda não estão provisionadas.
