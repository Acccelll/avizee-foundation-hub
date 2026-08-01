# 31 — Inventário de SEO

Achados detalhados em `data/findings.csv` (F-06 a F-13).

## Estado por tag

| Tag | Estado atual | Problema |
|---|---|---|
| `<title>` | único por página, mas `header.php` injeta um segundo `<title>AviZee` | duplicação (F-13) |
| `meta description` | igual em `/`, definida em `head-meta.php` e repetida na página | duplicada e conflita com D-001 (F-12) |
| `og:title` / `og:description` | fixos para todas as páginas | não variam por rota |
| `og:image` | `https://avizee.com.br/assets/img/logo-social.jpg` | **arquivo inexistente** (F-06) |
| `og:url` | fixo na home | incorreto nas demais rotas (F-08) |
| `canonical` | **ausente** | F-07 |
| `twitter:card` | **ausente** | F-07 |
| `robots.txt` | **ausente** no pacote | F-09 |
| `sitemap.xml` | **ausente** no pacote | F-09 |
| JSON-LD | **ausente** | F-11 |
| `lang="pt-BR"` | presente | conforme |
| `viewport` | presente | conforme |
| `hreflang` | não aplicável (site monolíngue) | — |

## Arquitetura de URL

5 URLs públicas, nenhuma página de família e nenhuma página de SKU (F-10). Todo o catálogo de
174 produtos vive em uma única URL — não há superfície indexável de cauda longa.

`TECHNICAL_INFERENCE` — Raciocínio: sem páginas de SKU indexadas, **não há autoridade de URL de
produto a preservar** na migração. O risco de perda de SEO (RK-06) permanece reduzido e o plano
de 301 continua sendo o de `19-url-inventory.md`.

## Estrutura de headings

Home tem um H1 único; `sobre.php` e `blog.php` também. `produtos.php` usa H1 "Produtos" e H2 por
card, o que é aceitável. Não foi detectado H1 múltiplo — o problema estrutural é o duplo `<head>`.

## Oportunidade na v1

| Ação | Ganho esperado |
|---|---|
| Páginas de família e de SKU | cauda longa hoje inexistente |
| `head()` por rota com title/description/canonical/OG únicos | correção de F-06 a F-12 |
| JSON-LD `Organization` + `ItemList` **sem preço** (R-04) | rich results conformes |
| `robots.txt` + `sitemap.xml` gerados | rastreamento previsível |
| 301 de `/blog` → `/conteudos` e do PDF → `/produtos` | preserva o pouco de histórico existente |
