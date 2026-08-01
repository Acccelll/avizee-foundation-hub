# 55 — Estratégia de Indexação e Canônicas

Status: `PENDENTE_DE_APROVAÇÃO`. Nenhum metadado foi implementado; sitemap não é publicado nesta etapa.

## 1. Classificação por tipo de página

| Tipo | Indexação | Nota |
|---|---|---|
| Home | **INDEXAR** | — |
| `/produtos` | **INDEXAR** | Precisa de introdução própria |
| Categoria | **INDEXAR_QUANDO_HOUVER_CONTEÚDO** | Exige descrição própria + ≥ 1 família publicada |
| Solução | **INDEXAR_QUANDO_HOUVER_CONTEÚDO** | Critério de `48` §3 |
| Família | **INDEXAR** | Página canônica do produto |
| SKU | **DECISÃO_NECESSÁRIA** | Só existe por exceção (DEC-06) |
| Resultados de busca | **NÃO_INDEXAR** | Conteúdo fino e infinito |
| URLs com filtro | **NÃO_INDEXAR** | Canônica na categoria |
| Paginação | **INDEXAR** | Canônica própria por página, nunca apontando para a página 1 |
| `/cotacao` e `/cotacao/enviada` | **NÃO_INDEXAR** | Transacional |
| `/contato` | **INDEXAR** | — |
| `/sobre` | **INDEXAR** | — |
| Artigo | **INDEXAR** | — |
| Categoria editorial | **INDEXAR_QUANDO_HOUVER_CONTEÚDO** | ≥ 2 artigos |
| Autor | **NÃO_INDEXAR na v1** | Página fina (EVOLUÇÃO) |
| Tag | **NÃO_INDEXAR** | Não pública na v1 |
| Legais | **INDEXAR** | Sinal de confiança |
| 404 | **NÃO_INDEXAR** | Status 404 real, sem redirecionar para a Home |
| Painel | **NÃO_INDEXAR** | Bloqueado também no `robots.txt` |

## 2. Canônicas

- Família: sempre `/produtos/{categoria}/{familia}`, sem parâmetros.
- Variação (`?sku=`): canônica da família.
- Filtro e ordenação: canônica da página base.
- Paginação: cada página é canônica de si mesma.
- `utm_*`: ignorado pela canônica.
- Uma família pertence a **uma** categoria canônica, mesmo servindo a várias soluções — é o que
  impede conteúdo duplicado entre `/produtos/...` e `/solucoes/...`.
- Solução **lista** famílias; nunca as reproduz com conteúdo próprio da família.

## 3. Prevenção de conteúdo fino

Página só entra no sitemap quando: tem texto próprio, tem finalidade distinta e não é resultado de
combinação de filtros. Página de categoria sem descrição, solução sem produtos e categoria
editorial com um artigo ficam fora do sitemap e com `noindex` até cumprirem o critério.

## 4. Dados estruturados (previstos, não implementados)
Organização (Home) · BreadcrumbList (todas as páginas com trilha) · Article (artigos) ·
ItemList (categorias). **Product/Offer não deve ser usado sem preço nem disponibilidade** — seria
sinal enganoso e reforçaria a percepção de e-commerce (RK-14). Decisão DEC-15 em `58`.

## 5. Riscos
- `/produtos` mantém a URL com conteúdo inteiramente novo: oscilação temporária esperada.
- 45 a 60 URLs novas de uma vez, sem histórico: indexação gradual, não instantânea.
- Sem dado técnico, as páginas de família nascem curtas — risco de conteúdo fino no próprio
  catálogo (RK-18). É a maior ameaça de SEO da v1.
