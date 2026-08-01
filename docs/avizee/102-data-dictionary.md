# 102 — Dicionário de Dados

Extrato normativo; a listagem campo a campo com classificação está em
`architecture/entities.csv` e `architecture/fields-classification.csv`.

## Convenções

| Convenção | Regra |
|---|---|
| Chave primária | `uuid`, imutável, gerada pelo banco |
| Nomes | `snake_case`, singular para coluna, plural para tabela |
| Datas | `timestamptz`, UTC |
| Enum | tipo Postgres nomeado, nunca texto livre |
| Soft delete | `deleted_at timestamptz null`; views públicas filtram |
| Auditoria | `created_by`/`updated_by` referenciam `users` |
| Texto público | limite explícito e validação por Zod no servidor |

## Enums definidos

- `product_status`: DRAFT, UNDER_REVIEW, BLOCKED_BY_CODE, BLOCKED_BY_IDENTITY,
  BLOCKED_BY_RIGHTS, READY_TO_PUBLISH, PUBLISHED, UNPUBLISHED, ARCHIVED.
- `article_status`: IDEA, PLANNED, DRAFT, TECHNICAL_REVIEW, COMMERCIAL_REVIEW, SEO_REVIEW,
  SCHEDULED, PUBLISHED, UPDATED, UNPUBLISHED, ARCHIVED.
- `quotation_status`: RECEIVED, IN_REVIEW, WAITING_INFORMATION, IN_SERVICE, RESPONDED,
  CONVERTED, CLOSED, SPAM, CANCELLED.
  Rótulos públicos: Recebida · Em análise · Aguardando informação · Em atendimento ·
  Respondida · Convertida · Encerrada · (SPAM e Cancelada não têm rótulo público).
- `media_review_status`: PENDING, APPROVED, REJECTED, REPLACED.
- `rights_status`: OWN, CONTRACTED, AUTHORIZED, UNKNOWN, DENIED.
- `code_type`: PUBLIC_SKU, ORIGINAL, LEGACY, ALIAS_INTERNAL, SUPPLIER_REF.
- `spec_value_type`: TEXT, NUMBER, BOOLEAN, ENUM, RANGE.
- `data_class`: PUBLIC, DERIVED_PUBLIC, ADMIN_ONLY, SENSITIVE, SECRET, INTERNAL_OPERATIONAL.

## Campos sensíveis por natureza

`quotations.email`, `.telefone`, `.contato`, `.empresa`, `.cnpj` (se coletado),
`contacts.*`, `consent_records.*`, `audit_logs.ip` → **SENSITIVE**, nunca em API pública,
nunca em analytics, nunca em log de aplicação, nunca em alerta.

`products.internal_brand`, `.supplier`, `.original_code`, `.internal_notes`,
`media_assets.marca_detectada`, `product_codes` de tipo `SUPPLIER_REF`/`ALIAS_INTERNAL`
→ **ADMIN_ONLY**, fisicamente ausentes das views públicas.
