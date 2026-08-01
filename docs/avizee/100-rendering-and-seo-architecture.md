# 100 — Arquitetura de Renderização e SEO

## 1. Estratégia por tipo de página

| Página | Renderização | Justificativa | Revalidação |
|---|---|---|---|
| Home | SSG + revalidação | Conteúdo estável | Ao publicar bloco |
| Soluções / aplicação | SSG | Baixa mudança | Ao publicar |
| Lista de categorias | SSG | 6 categorias | Ao publicar família |
| Categoria | SSR com cache | Lista dinâmica | 5 min |
| Família | SSR com cache | Depende de SKUs e imagens | 5 min |
| SKU (produto) | SSR com cache | ~97 páginas na v1 | 5 min |
| Busca e filtros | SSR, `noindex,follow` | Combinações infinitas | — |
| Central de Conteúdos | SSR com cache | Novos artigos | 5 min |
| Categoria editorial | SSR com cache | — | 5 min |
| Artigo | SSG + revalidação na publicação | Estável após publicar | Ao publicar/atualizar |
| Sobre / Contato / legais | SSG | Estático | Ao editar |
| Cotação / confirmação | Cliente + servidor, `noindex` | Fluxo transacional | — |
| Painel | CSR sob `_authenticated`, `noindex` | Não indexável | — |

Nenhuma página pública depende exclusivamente de JavaScript no cliente para o conteúdo
principal. Loader de rota pública **nunca** chama função protegida (evita 401 em prerender).

## 2. Metadados

- **Title**: `{Nome público} | {Categoria} | AviZee` — máx. 60 caracteres, único por rota.
- **Description**: 140–160 caracteres, sem marca de terceiro, sem preço, sem promessa comercial.
- **Canonical**: absoluto, sem parâmetros de filtro, sem UTM. Paginação usa canonical da própria página.
- **Open Graph / Twitter**: `og:type`, `og:title`, `og:description`, `og:url`, `twitter:card`;
  `og:image` apenas com imagem **aprovada** e URL absoluta; caso contrário, omitido.
- **Hreflang**: não aplicável na v1 (pt-BR único).

## 3. Dados estruturados (JSON-LD)

| Página | Tipos | Restrições |
|---|---|---|
| Home | `Organization`, `WebSite` | Sem `aggregateRating`, sem `Offer` |
| Categoria/Família | `BreadcrumbList`, `ItemList` | Somente itens `PUBLISHED` |
| SKU | `Product` **sem `offers`** e sem `brand` de terceiro | `brand` = AviZee somente se juridicamente correto; caso contrário omitido |
| Artigo | `Article`, `BreadcrumbList` | `author`, `datePublished`, `dateModified` |
| Contato | `LocalBusiness` | Sem dados pessoais de funcionário |

Nunca emitir `price`, `priceCurrency`, `availability` ou marca interna em JSON-LD.

## 4. Sitemap e robots

- `src/routes/sitemap[.]xml.ts` gerado por rota de servidor, lendo apenas registros `PUBLISHED`
  com direitos válidos. `lastmod` **apenas** quando existir timestamp real e específico da página
  (`published_at`/`updated_at`); jamais data de build.
- Excluídos: busca, filtros, cotação, confirmação, painel, rascunhos, agendados, despublicados.
- `robots.txt`: `Allow: /` em produção; `Disallow: /` em preview e homologação.
  Diretiva `Sitemap:` somente quando houver URL definitiva aprovada.

## 5. Indexação, filtros e paginação

- Filtros aplicados por querystring: `noindex,follow`, canonical apontando para a base.
- Paginação: `?pagina=N` indexável com canonical próprio; sem `rel=prev/next` obrigatório.
- Produto despublicado: `410 Gone` quando descontinuado; `301` quando substituído por outro
  registro; nunca 404 silencioso em URL previamente indexada.
- Artigo agendado ou rascunho: `404` público até a publicação; preview autenticado por token.

## 6. Redirecionamentos

Tabela `redirects` (origem, destino, tipo, ativo, motivo, criado_em) lida por middleware.
Mapa mínimo herdado da Etapa 2 em `46-url-migration-map.md`; nada aplicado nesta etapa.


## Atualização 2026-08-01 — DT-04 aprovada com ajuste: matriz por tipo de página

Não vale regra global única de SSG nem de cache.

| Modo | Tipos de página |
|---|---|
| SSG / estático | Páginas legais estáveis; institucionais que raramente mudam; páginas técnicas sem dependência de dado administrativo; arquivos estruturais estáveis |
| SSR com cache e invalidação | Home; categorias; soluções; famílias; produtos; Central de Conteúdos; categorias editoriais; artigos publicados |
| SSR sem cache compartilhado (ou cache privado) | Prévias administrativas; páginas autenticadas; painel; conteúdo dependente de usuário; fila de normalização; importações; cotações |
| CSR (apenas interação) | Filtros; seleção de SKU; Lista de Cotação; estados locais; componentes administrativos interativos |

**Catálogo e artigos não podem depender de novo deploy** para refletir uma publicação feita no
painel. Invalidação explícita obrigatória após: publicação, despublicação, alteração de slug,
alteração de metadados, alteração de família, alteração de produto e atualização de artigo.
Proibido cachear resposta administrativa ou dado pessoal em cache público.
