# 119 — Banco de Dados e Migrations

## 1. Banco

PostgreSQL gerenciado (Lovable Cloud). Justificativa: relacional é adequado a taxonomia,
integridade referencial de cotações e governança de códigos; oferece full-text nativo,
RLS para o requisito R-05, JSONB para o corpo editorial e é portável (reversibilidade).

## 2. Migrations

- Versionadas, sequenciais, idempotentes onde possível, **sempre** com script de rollback.
- Toda migration que cria tabela em `public` inclui, na mesma migration e nesta ordem:
  `CREATE TABLE` → `GRANT` por papel → `ENABLE ROW LEVEL SECURITY` → `CREATE POLICY`.
- Nenhuma migration insere dado pessoal ou segredo.
- Seeds: taxonomia aprovada (6 categorias, 7 categorias editoriais, segmentos, aplicações,
  definições de especificação, papéis e permissões). Produtos **não** entram por seed —
  entram por importação auditada (`122`).

## 3. Constraints e índices

Unicidade de slug por escopo; `products.public_sku` único **entre registros válidos**, com
conflito registrado em vez de sobrescrita; FKs sem cascade destrutivo; `check` de coerência
entre `value_type` e coluna preenchida; índices em FKs, `status`, `published_at`, GIN em
`tsv` e `gin_trgm_ops` em títulos e códigos.

## 4. Regras de integridade herdadas

- SKU não é chave primária.
- Slug único com estratégia de sufixo e histórico em `redirects`.
- Exclusão nunca quebra cotação histórica — `quotation_items` guarda snapshot.
- Produto despublicado permanece visível na cotação histórica no painel.
- Artigo publicado mantém `article_revisions`.
- Redirecionamentos sobrevivem a mudanças de slug (criados automaticamente).

## 5. Versionamento

Cada release referencia a última migration aplicada; migrations rodam antes do deploy da
aplicação, com verificação de compatibilidade retroativa (expand/contract) para evitar
indisponibilidade.
