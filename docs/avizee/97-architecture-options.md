# 97 — Alternativas de Arquitetura

Três alternativas tecnicamente viáveis. Nenhuma aprovada — DT-01.

## Alternativa A — Aplicação única TanStack Start + Lovable Cloud (recomendada)

| Camada | Definição |
|---|---|
| Frontend | React 19 / TanStack Start, rotas por arquivo, tokens aprovados |
| Renderização pública | SSG para páginas estáveis + SSR sob demanda para catálogo e artigos |
| Backend | `createServerFn` + rotas `api/public/*` para webhooks e cron |
| Banco | Postgres gerenciado (Lovable Cloud) com RLS |
| Autenticação | Auth nativa, apenas usuários administrativos |
| Storage | Buckets nativos: `public-media` (aprovado) e `private-media` (quarentena) |
| E-mail | Provedor transacional via função de servidor + outbox |
| Busca | Postgres `tsvector` + `pg_trgm` + `unaccent` |
| CMS | Painel próprio dentro da mesma aplicação, sob `_authenticated` |
| Cotações | Tabelas `quotations`/`quotation_items`/`quotation_events` |
| SEO | `head()` por rota, sitemap por rota de servidor, JSON-LD, redirects |
| Deploy | Preview automático; produção com gate manual |
| Backups | Gerenciado + export periódico |
| Custo | Um único ambiente gerenciado; sem licenças adicionais |
| Limitações | Sem motor de busca dedicado; imagem processada no upload |
| Dependências | Habilitar Cloud; provedor de e-mail |
| Manutenção | **Alta** — um repositório, uma stack, equipe pequena |

## Alternativa B — Frontend estático + CMS headless externo

| Camada | Definição |
|---|---|
| Frontend | Mesmo TanStack Start, majoritariamente SSG |
| CMS | Serviço headless externo (conteúdo e catálogo) |
| Banco | Do CMS + Postgres apenas para cotações |
| Busca | Índice gerado na build ou serviço do CMS |
| Vantagens | Painel editorial pronto, menos código de CMS |
| Limitações | Modelo de catálogo com regras de bloqueio de SKU e marca privada dificilmente reproduzível; risco de vazamento de campo interno via API do CMS; rebuild necessário a cada publicação |
| Custos | Assinatura mensal por editor/registro |
| Risco | **Alto** para R-05 (marca privada) e para governança de SKU |
| Manutenção | Dois sistemas, dois modelos de permissão |

## Alternativa C — Backend dedicado separado (API própria + frontend)

| Camada | Definição |
|---|---|
| Frontend | TanStack Start consumindo API própria |
| Backend | Serviço separado (Node/edge) com ORM e Postgres próprio |
| Vantagens | Independência total, portabilidade |
| Limitações | Fora do que o ambiente Lovable opera nativamente; dois deploys, dois monitoramentos |
| Custos | Infraestrutura adicional e operação |
| Risco | Sobrecarga operacional desproporcional a ~170 SKUs |
| Manutenção | **Baixa** para equipe pequena |

## Comparação

| Critério | A | B | C |
|---|---|---|---|
| Compatibilidade com Lovable | Alta | Média | Baixa |
| SEO | Alta | Alta | Alta |
| Desempenho | Alta | Alta | Média |
| Segurança / R-05 | Alta (controle total do serializer) | **Baixa** | Alta |
| Manutenção por equipe pequena | Alta | Média | Baixa |
| Escalabilidade suficiente | Sim | Sim | Sim |
| Custo recorrente | Baixo | Médio/Alto | Alto |
| Reversibilidade | Alta (dados em Postgres padrão) | Média | Alta |

## Recomendação

**Alternativa A**, por compatibilidade nativa, controle integral sobre a exposição de campos
internos (requisito R-05), custo proporcional a ~170 SKUs, operação por equipe pequena e
reversibilidade preservada (dados em Postgres padrão, exportáveis).
Status: `PENDENTE_DE_APROVAÇÃO` (DT-01).


## Atualização 2026-08-01 — decisão do cliente

A Alternativa A (TanStack Start + Lovable Cloud) foi **aprovada condicionalmente** e a condição
foi satisfeita: o repositório já é TanStack Start (`architecture/stack-verification.md`).
As alternativas B (CMS headless) e C (backend separado) ficam **descartadas para a v1** e não
podem ser adotadas silenciosamente.
