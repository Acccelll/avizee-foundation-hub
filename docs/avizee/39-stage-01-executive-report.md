# 39 — Relatório Executivo da Etapa 1

Data: 2026-08-01 · Escopo: auditoria e inventário. **Nenhum código funcional, nenhuma alteração
visual e nenhuma migração foram executados.**

## Números

| Indicador | Valor |
|---|---|
| Fontes auditadas | 9 (todas analisadas) |
| Arquivos do site atual inventariados | 174 |
| Páginas públicas | 5 |
| SKUs consolidados | **174** (117 no CSV · 116 no catálogo publicado · 106 no complementar) |
| SKUs exclusivos do catálogo complementar | 50 |
| SKUs com imagem | 94 (54%) |
| SKUs sem imagem | 80 (46%) |
| Imagens inventariadas | 188 |
| Imagens aprovadas para publicação | **0** |
| SKUs com marca de terceiro no nome | 16 |
| Divergências de alta severidade | 10 |
| Duplicidades | 5 |
| Achados (segurança, SEO, A11y, performance, conformidade) | 27 |

## Os cinco fatos que mais importam

1. **Duas credenciais estão expostas em texto claro** no código recebido (senha de aplicativo do
   Gmail e chave secreta do reCAPTCHA). É o único item que exige ação **hoje**, fora do projeto.
2. **O catálogo é maior do que o site**: 174 SKUs contra 117 publicados. Cinquenta produtos
   (conexões, bombas, bateria, peças) nunca estiveram online e não têm nenhuma imagem.
3. **Nenhuma imagem pode ser publicada ainda.** Não é falta de arquivo — é falta de confirmação
   de direito de uso, sobre 188 arquivos.
4. **Não existe dado técnico por SKU em nenhuma fonte.** Código, nome e medida existem;
   descrição, aplicação, material e segmento não existem em lugar nenhum.
5. **O modelo de conversão aprovado não existe no site atual.** Hoje tudo termina em WhatsApp
   direto; a Lista de Cotação (D-007) é construção nova.

## Riscos confirmados nesta etapa

| Risco | Situação após a auditoria |
|---|---|
| RK-15 (credencial exposta) | **Confirmado e ampliado** — inclui também a chave do reCAPTCHA |
| RK-01 (marca de terceiro) | **Quantificado** — 16 SKUs e 33 imagens |
| RK-02 (imagem sem autorização) | **Quantificado** — 188 arquivos, nenhum aprovado |
| RK-03 (catálogo inconsistente) | **Quantificado** — 10 divergências, 1 código duplicado |
| RK-05 (dado técnico incompleto) | **Confirmado como total** — nenhuma fonte traz o dado |
| RK-06 (perda de SEO) | **Reduzido** — nenhuma URL de SKU indexada a preservar |
| RK-07 (lead perdido) | **Confirmado** — o site atual não persiste nada |
| RK-11 (LGPD) | **Confirmado** — sem política e sem consentimento |

## Boas notícias

- Migração de dados transacionais é **zero**: não há banco, não há histórico de leads.
- O plano de 301 é curto e de baixo risco.
- O markup atual já demonstra cuidado real com ARIA — há base a preservar conceitualmente.
- O logotipo vetorial e a paleta estão confirmados e prontos para o design system.
- O agrupamento por família já é praticado pelo site atual, o que valida D-019.

## Conclusão

A Etapa 1 está concluída e **nada foi reconciliado em silêncio**. O projeto está pronto para
começar arquitetura e design system, mas **não está pronto para publicar catálogo**: faltam
direito de uso das imagens, dados técnicos por SKU e a resolução de 10 divergências.

As quinze perguntas que destravam a Etapa 2 estão em `38-stage-01-open-questions.md`.

## Critérios de aceite da Etapa 1

| # | Critério | Situação |
|---|---|---|
| 1 | Todas as fontes obrigatórias auditadas | Atendido — `data/sources.csv` |
| 2 | Inventário de arquivos do site atual | Atendido — `data/files.csv` (174) |
| 3 | Inventário de páginas e conteúdo | Atendido — `24` + `data/pages.csv` |
| 4 | Matriz provisória de produtos | Atendido — `data/products-provisional.csv` (174) |
| 5 | Inventário de imagens | Atendido — `data/images.csv` (188) |
| 6 | Matriz produto × imagem | Atendido — `data/product-image-relations.csv` (261) |
| 7 | Inventário de marca e tipografia | Atendido — `29` e `30` |
| 8 | Achados de SEO, funcional, segurança, A11y e performance | Atendido — `31` a `35` + `data/findings.csv` |
| 9 | Duplicidades e divergências registradas sem reconciliação | Atendido — `36` |
| 10 | Prontidão para migração declarada | Atendido — `37` |
| 11 | Perguntas abertas listadas | Atendido — `38` |
| 12 | Nenhum preço em qualquer artefato | Atendido |
| 13 | Nenhuma marca de terceiro em campo público | Atendido — só em `campo_interno_marca` |
| 14 | Nenhum código funcional implementado | Atendido |
| 15 | Nenhuma alteração visual aplicada | Atendido |
