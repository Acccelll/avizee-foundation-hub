# 160 — Migrações do Catálogo

Migrações aplicadas na instância não produtiva do Lovable Cloud (ordem cronológica):

| Migração | Conteúdo |
|---|---|
| `20260802030555…` | Enums de domínio, taxonomia, famílias, produtos, códigos, especificações |
| `20260802030613…` | Mídia, direitos, documentos, relações e placeholders |
| `20260802030821…` | Importação, normalização, conflitos, auditoria e histórico de publicação |
| `20260802034232…` | Correções de GRANT e EXECUTE nas funções de papel |
| `20260802034949…` | Ajustes de políticas de leitura administrativa |
| `20260802040634…` | Semente canônica da taxonomia e das 31 famílias + índice único de SKU ativo |

Regras respeitadas: GRANT explícito por tabela, RLS habilitada, políticas por papel via
`has_role`/`has_any_role`, `audit_logs` protegida por gatilho de imutabilidade.

O índice `products_public_sku_active_uidx` impede dois produtos ativos com o mesmo código público.
