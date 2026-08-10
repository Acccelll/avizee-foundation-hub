# 544 — Reconciliação de decisões antigas antes da Etapa 15

Data: 2026-08-10

## Objetivo

Eliminar estados documentais obsoletos sem transformar recomendações antigas em decisões por inferência. Quando uma proposta antiga foi posteriormente substituída por decisão explícita, implementação já aprovada ou contenção formal, este documento registra essa relação. Itens que ainda exigem manifestação do usuário permanecem abertos.

## Etapa 2 — DEC-01 a DEC-18

- `DEC-01 — sitemap`: encerrada pela arquitetura pública implementada e pelos controles atuais de sitemap/indexação.
- `DEC-02 — menu principal`: encerrada pelo shell público aprovado e implementado: Produtos, Soluções, Conteúdos, Sobre e Contato, com busca e Lista de Cotação; o logo leva à Home.
- `DEC-03 — mega menu`: proposta superada pelo shell público aprovado, que usa navegação simples. Nenhum mega menu será introduzido neste fechamento.
- `DEC-04 — URLs de catálogo`: encerrada pela implementação canônica `/produtos/{categoria}/{familia}`.
- `DEC-05 — Linhas complementares`: encerrada como rejeitada; a sexta categoria permanece válida.
- `DEC-06 — páginas individuais de SKU`: encerrada no escopo v1 pela página canônica de família; SKU permanece variação/atributo e não recebe rota pública própria.
- `DEC-07 — páginas de solução`: permanece aberta. É a única decisão estrutural de conteúdo necessária antes da Etapa 15.
- `DEC-08 — marcas de terceiro na busca`: encerrada pelos controles públicos de marca e pela proibição R-05/D-011 a D-013.
- `DEC-09 — páginas de segmento`: encerrada no escopo v1; segmentos permanecem atributo/filtro, sem nova superfície pública própria.
- `DEC-10 — busca global`: permanece como divergência funcional. O wireframe aprovado descreve resultados agrupados de Produtos, Soluções e Conteúdos, enquanto a implementação atual pesquisa somente o catálogo. Deve ser fechada por implementação ou decisão explícita de conter a busca à v1 atual.
- `DEC-11 — WhatsApp`: encerrada por D-044; Lista de Cotação é principal e WhatsApp é secundário/contextual.
- `DEC-12 — campos da cotação`: encerrada pela implementação do fluxo atual e pela minimização LGPD aprovada.
- `DEC-13 — persistência da lista`: encerrada pela implementação vigente da Lista de Cotação, sem criação de conta pública.
- `DEC-14 — páginas legais`: parcialmente encerrada. Privacidade e Termos existem; política de cookies dedicada não é necessária enquanto não existirem cookies opcionais, conforme D-087. Conteúdo jurídico final segue para fechamento legal.
- `DEC-15 — dados estruturados`: encerrada pela estratégia SEO sem `Offer`/preço e sem semântica de e-commerce.
- `DEC-16 — autores/tags/materiais/glossário/FAQ`: autores entraram no CMS; os demais continuam fora da v1 ou condicionais, sem necessidade de nova superfície pública neste fechamento.
- `DEC-17 — painel`: encerrada pela arquitetura administrativa e RBAC implementados.
- `DEC-18 — categorias editoriais`: encerrada como rejeitada; permanecem as 7 categorias editoriais aprovadas.

## Etapa 2.1 — DECT-01 a DECT-14

- `DECT-01`: encerrada parcialmente por D-052; somente 31 famílias / 97 SKUs são coorte pública aprovada.
- `DECT-02`, `DECT-03`, `DECT-04`, `DECT-06`, `DECT-07` e `DECT-09`: para registros incluídos na coorte D-052, a classificação aprovada dessa coorte prevalece. Essas propostas antigas não reabrem a taxonomia já aprovada.
- `DECT-05`: famílias de conexão fora da coorte aprovada permanecem contidas; nenhuma classificação provisória será publicada.
- `DECT-08`: encerrada por contenção formal D-054. Os 34 SKUs sem identidade permanecem na fila de normalização e fora da publicação.
- `DECT-10`: encerrada por D-053.
- `DECT-11`: encerrada por contenção formal D-054. Os 16 SKUs sem nome público confiável permanecem fora da publicação até dados confiáveis.
- `DECT-12`: permanece aberta em conjunto com `DEC-07`.
- `DECT-13`: a categoria Linhas complementares permanece categoria aprovada; filtros não criam URLs públicas canônicas alternativas. Nenhuma mudança taxonômica é feita neste fechamento.
- `DECT-14`: encerrada por D-054; FAM-032/PE sem identidade permanece fora do catálogo público.

## Casos individuais de taxonomia

Os conflitos individuais não resolvidos permanecem `CLOSED_CONTAINED` para fins de fechamento da v1: não são apagados, não são publicados e não bloqueiam a coorte 31/97. Só entram no catálogo quando a AviZee fornecer dado confiável e a normalização for revisada.

## Decisões que ainda exigem manifestação

Após esta reconciliação, as decisões antigas que realmente continuam abertas são:

1. `DEC-07 / DECT-12` — páginas consultivas de solução por aplicação.
2. `DEC-10` — completar a busca global prevista no wireframe ou formalizar a busca somente de catálogo na v1.
3. Ativação do formulário geral de contato dentro do layout já aprovado.
4. Ativação do mapa sob interação dentro do layout já aprovado.

Os itens acima não serão resolvidos por inferência.

## Regra de precedência

Este documento não substitui `01-approved-decisions.md`. Em conflito, prevalecem as decisões explícitas do usuário e a ordem de precedência definida pelo projeto.
