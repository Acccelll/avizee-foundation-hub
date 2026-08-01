# 140 — SEO Estrutural e Controle de Indexação

Arquivos: `src/seo/meta.ts`, `src/routes/robots[.]txt.ts`.

## 1. Regra central

**Somente `production` é indexável.** Não existe chave de configuração que permita
indexar preview ou homologação — a decisão deriva do ambiente, não de um parâmetro.

Consequências implementadas:

- Fora de produção toda rota recebe `noindex, nofollow`.
- `canonical` só é emitido quando o ambiente é indexável, evitando canonical apontando
  para preview.
- `/robots.txt` é gerado dinamicamente e nega tudo fora de produção. O `public/robots.txt`
  estático foi removido para não haver duas verdades.

## 2. Metadados por rota

Toda rota de conteúdo define `head()` própria com título e descrição específicos.
Padrões: título abaixo de 60 caracteres, descrição abaixo de 160, `og:title`,
`og:description`, `og:type`, `og:locale` e `twitter:card`.

Não há título genérico do tipo "Lovable App".

## 3. Marcação de conteúdo provisório

Páginas cujo conteúdo ainda é provisório emitem `x-avizee-content-status:
provisional-stage-05`. Isso torna auditável, mais adiante, o que ainda precisa de texto
definitivo.

## 4. Não implementado por decisão

Sitemap de produtos, JSON-LD de produto, breadcrumb estruturado publicado e redirecionamentos
301 do site antigo. Todos dependem do catálogo público (Etapa 7) e do cutover.
