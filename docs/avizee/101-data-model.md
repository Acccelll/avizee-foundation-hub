# 101 — Modelo de Dados (lógico e relacional)

Todas as tabelas em `public`, com `id uuid primary key default gen_random_uuid()`,
`created_at`, `updated_at`, `created_by`, `updated_by` e `deleted_at` (soft delete) quando
aplicável. **SKU nunca é chave primária.**

## 1. Identidade e governança

| Tabela | Campos-chave |
|---|---|
| `users` | (auth) id, email, nome, ativo, mfa_enabled, last_login_at |
| `roles` | code, nome, descrição |
| `permissions` | code, recurso, ação |
| `role_permissions` | role_id, permission_id |
| `user_roles` | user_id, role_id — **tabela separada, nunca papel no perfil** |
| `audit_logs` | user_id, ação, entidade, entity_id, diff (redigido), ip, contexto, criado_em |
| `settings` | chave, valor (jsonb), escopo, público (bool) |

## 2. Taxonomia

`segments` · `applications` · `solutions` · `product_categories` (6 aprovadas) ·
`product_subcategories` (funcional, interna/pública conforme campo) ·
`product_families` (nome público, slug, categoria_id, aplicação principal, status, resumo).

Relações: `family_applications` (família, aplicação, principal bool) ·
`family_segments` (família, segmento) · `family_solutions`.

## 3. Catálogo

`products` (SKU/variação): `id uuid`, `family_id`, `public_sku`, `public_name`,
`variation_label`, `slug`, `status`, `validation_status`, `is_on_request`, `sort_order`.
Complementares: `product_codes` (código, tipo: PUBLIC_SKU/ORIGINAL/LEGACY/ALIAS/INTERNAL,
fonte, válido, conflito_id) · `product_code_conflicts` · `product_applications` ·
`product_segments` · `related_products` · `product_documents` · `product_images`.

## 4. Especificações

`specification_definitions` (code, label, tipo, unidade, enum_values, filtrável, público,
ordem) · `specification_scopes` (definição × categoria/família) ·
`product_specifications` (product_id, definition_id, value_text, value_num, value_bool,
unit) · `family_specifications` (valores comuns herdados).

## 5. Mídia e documentos

`media_assets` (bucket, path privado, path público, mime, bytes, largura, altura, hash,
`review_status`, `rights_status`, fonte, marca_detectada [ADMIN_ONLY], alt_text) ·
`media_variants` (asset_id, tipo: THUMB/WEBP/ORIGINAL, path, largura) ·
`image_review_events` · `documents` (título público, arquivo, versão, data, indexável,
direito de publicação, status) · `product_documents`.

## 6. Conteúdo editorial

`articles` (slug, título, resumo, corpo jsonb, status, published_at, scheduled_for,
author_id, reviewer_id, seo_id) · `editorial_categories` (7 aprovadas) ·
`article_categories` · `article_products` · `article_families` · `article_solutions` ·
`authors` · `article_sources` · `article_revisions` (versão, snapshot jsonb, autor, motivo) ·
`article_social` (legenda IG, roteiro, texto LinkedIn, CTA, hashtags, url_utm, status).

## 7. Cotação e contato

`quotations` (protocolo, status, empresa, contato, e-mail, telefone, cidade, uf, origem,
campanha, página_origem, consentimentos, ip_hash, criado_em) ·
`quotation_items` (quotation_id, product_id, family_id, snapshot_nome, snapshot_sku,
variação, quantidade, observação) — **snapshot preserva a cotação histórica mesmo após
despublicação** · `quotation_events` (status, ator, nota interna, criado_em) ·
`quotation_sources` · `contacts` (mensagens do formulário de contato).

Nenhuma coluna de preço, desconto, frete, total ou estoque existe no modelo.

## 8. Conteúdo institucional e SEO

`page_content` (page_key, block_key, tipo, valor jsonb, versão) — edição **dentro de blocos
previstos**, nunca construtor livre · `seo_metadata` (entidade, entity_id, title, description,
canonical, og_image_id, noindex) · `redirects` · `publication_history`.

## 9. Operações

`import_jobs` (arquivo, hash, operador, modo dry_run, status, resumo) · `import_errors` ·
`outbox_messages` (tipo, payload, tentativas, próxima_tentativa, status) ·
`consent_records` (titular, finalidade, base legal, texto, versão, aceito_em, revogado_em) ·
`privacy_requests` (tipo, titular, status, prazo).

## 10. Integridade

- FKs com `ON DELETE RESTRICT` para catálogo publicado; `SET NULL` apenas em referências
  opcionais; **nunca** cascade que apague item de cotação.
- Unicidade: `products.slug`, `product_families.slug`, `articles.slug`, `quotations.protocolo`,
  `product_codes(code, type)` com detecção de conflito.
- Índices: FKs, `status`, `published_at`, `slug`, GIN em `tsvector` e `pg_trgm`.
