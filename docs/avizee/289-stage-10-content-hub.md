# 289 — Etapa 10: Central de Conteúdos e CMS editorial

## Camada pública
- `/conteudos` — listagem com busca, filtro por categoria e paginação.
- `/conteudos/categoria/{slug}` — categoria editorial (7 categorias aprovadas, DEC-18 mantida).
- `/conteudos/{slug}` — artigo com blocos estruturados, referências, famílias relacionadas,
  artigos relacionados e JSON-LD `Article` (+ `FAQPage` quando há bloco FAQ).
- Slug antigo redireciona para o novo (301 via `resolveArticleRedirect`).
- `sitemap.xml` passa a incluir categorias e artigos publicados; rascunhos ficam fora.

## CMS administrativo
- `/admin/conteudos` — painel, filtros por situação e criação de rascunho.
- `/admin/conteudos/{id}` — metadados, blocos JSON validados (Zod), SEO, notas internas,
  referências, workflow, histórico de versões e variantes sociais.
- Versionamento imutável em `content_revisions`; toda transição registra `content_status_events`.

## Workflow
DRAFT → IN_TECHNICAL_REVIEW → IN_EDITORIAL_REVIEW → PUBLISHED → ARCHIVED.
Cada transição exige permissão fina; publicação é bloqueada quando há pendência de conformidade.

## Conformidade (R-03/R-05/R-11)
`checkContentCompliance` recusa marca de terceiro, vocabulário de preço/promoção e promessa
logística. Blocos são sanitizados no servidor; a renderização usa componentes React puros.

## Instagram e LinkedIn
Variantes preparadas e validadas por limites de canal. A exportação gera **texto para cópia
manual**. Não existe integração, agendamento ou postagem automática.

## Verificação
227 testes verdes (16 novos em `tests/unit/content-editorial.test.ts`). Typecheck limpo.
