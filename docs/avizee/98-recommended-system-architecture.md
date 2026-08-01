# 98 — Arquitetura Recomendada do Sistema

`PENDENTE_DE_APROVAÇÃO` (DT-01 a DT-21).

## 1. Componentes

| # | Componente | Responsabilidade |
|---|---|---|
| C1 | Aplicação pública | Home, soluções, catálogo, família, SKU, Central de Conteúdos, institucional, legais |
| C2 | Aplicação administrativa | Painel sob `_authenticated`: catálogo, mídia, conteúdo, cotações, configurações, logs |
| C3 | Camada de dados | Postgres gerenciado, RLS, views públicas, migrations versionadas |
| C4 | Autenticação | Sessão administrativa, sem cadastro público na v1 |
| C5 | Storage | `private-media` (padrão) e `public-media` (somente aprovados) |
| C6 | Funções de servidor | Leitura pública, escrita administrativa, cotação, importação |
| C7 | Rotas públicas HTTP | `sitemap.xml`, `robots.txt`, cron assinado, webhooks de e-mail |
| C8 | Outbox + worker | E-mail, agendamento de artigo, derivados de imagem, revalidação |
| C9 | Busca | Índice `tsvector` materializado por família/SKU/artigo, apenas campos públicos |
| C10 | Cotação | Persistência, protocolo, eventos, notificação |
| C11 | SEO | `head()` por rota, JSON-LD, canonical, breadcrumbs, redirects tabelados |
| C12 | Auditoria e logs | `audit_logs`, logs operacionais sem dado pessoal completo |

## 2. Princípios arquiteturais

1. **Banco é a fonte de verdade.** E-mail e WhatsApp são canais, nunca o registro.
2. **Separação de serialização.** Toda leitura pública passa por view/serializer que
   fisicamente não contém campos `ADMIN_ONLY`. A ausência de campo é estrutural, não condicional.
3. **Menor privilégio.** RLS por papel; `anon` só enxerga views públicas de registros `PUBLISHED`.
4. **Imutabilidade de identidade.** UUID como chave; SKU é atributo com histórico e conflitos.
5. **Estados explícitos.** Publicação nunca é inferida — depende de status e de direitos.
6. **Degradação segura.** Falha de e-mail, mapa ou WhatsApp não invalida a cotação registrada.
7. **Reversibilidade.** Postgres padrão, migrations versionadas, export completo.

## 3. Fluxos principais

- **Descoberta**: rota pública → loader → view pública → HTML SSR/SSG com JSON-LD.
- **Cotação**: lista no cliente → função de servidor valida → grava cotação + itens + evento →
  gera protocolo → enfileira e-mails no outbox → confirma na tela.
- **Editorial**: rascunho → revisões → agendamento → `pg_cron` publica → histórico + sitemap.
- **Imagem**: upload → `private-media` + status `PENDING` → revisão → aprovado copia para
  `public-media` → reprovado permanece privado para sempre.
- **SEO**: `redirects` em tabela → middleware de rota → 301; sitemap lê apenas `PUBLISHED`.

## 4. Contratos de API (provisórios)

Ver `architecture/api-contracts-provisional.csv`. Regra transversal: nenhuma resposta pública
inclui `internal_brand`, `supplier`, `original_code`, `cost`, notas administrativas ou aliases
internos — nem como campo nulo.
