# 56 — Matriz Página × Objetivo

Status: `PENDENTE_DE_APROVAÇÃO` · Dados completos (19 colunas): `data/pages-proposed.csv`

Resumo. Colunas do CSV: `page_id, nome, url, tipo, publico, intencao_principal,
intencao_secundaria, origem_trafego, cta_principal, cta_secundario, conteudo_necessario,
dados_necessarios, relacoes, indexacao, prioridade, versao, status, dependencias, riscos,
decisao_necessaria`.

| page_id | Página | URL | Intenção principal | CTA principal | Indexação | Prioridade |
|---|---|---|---|---|---|---|
| PG-01 | Home | `/` | Entender oferta e foco | Ver produtos | INDEXAR | ESSENCIAL_V1 |
| PG-02 | Produtos | `/produtos` | Localizar item | Adicionar à lista | INDEXAR | ESSENCIAL_V1 |
| PG-03 | Categoria | `/produtos/{cat}` | Explorar por tipo | Ver família | CONDICIONAL | ESSENCIAL_V1 |
| PG-04 | Família | `/produtos/{cat}/{fam}` | Escolher variação | Adicionar à lista | INDEXAR | ESSENCIAL_V1 |
| PG-05 | SKU | `/produtos/{cat}/{fam}/{sku}` | Item distinto | Adicionar à lista | DECISÃO | PODE_ENTRAR_V1 |
| PG-06 | Soluções (hub) | `/solucoes` | Navegar por necessidade | Ver solução | CONDICIONAL | IMPORTANTE_V1 |
| PG-07 | Solução | `/solucoes/{slug}` | Resolver problema | Falar com especialista | CONDICIONAL | IMPORTANTE_V1 |
| PG-08 | Central de Conteúdos | `/conteudos` | Aprender | Ler artigo | INDEXAR | ESSENCIAL_V1 |
| PG-09 | Categoria editorial | `/conteudos/{cat}` | Aprofundar tema | Ler artigo | CONDICIONAL | IMPORTANTE_V1 |
| PG-10 | Artigo | `/conteudos/{slug}` | Resolver dúvida | Ver produtos citados | INDEXAR | ESSENCIAL_V1 |
| PG-11 | Autor | `/conteudos/autores/{slug}` | Credibilidade | Ler artigos | NÃO_INDEXAR | EVOLUÇÃO |
| PG-12 | Busca | `/busca` | Encontrar rápido | Abrir família | NÃO_INDEXAR | IMPORTANTE_V1 |
| PG-13 | Lista de cotação | `/cotacao` | Revisar e enviar | Solicitar cotação | NÃO_INDEXAR | ESSENCIAL_V1 |
| PG-14 | Cotação enviada | `/cotacao/enviada` | Confirmar | Voltar ao catálogo | NÃO_INDEXAR | ESSENCIAL_V1 |
| PG-15 | Sobre | `/sobre` | Confiar | Solicitar cotação | INDEXAR | ESSENCIAL_V1 |
| PG-16 | Contato | `/contato` | Falar com a empresa | Enviar mensagem | INDEXAR | ESSENCIAL_V1 |
| PG-17 | Privacidade | `/politica-de-privacidade` | Conformidade | — | INDEXAR | ESSENCIAL_V1 |
| PG-18 | Cookies | `/politica-de-cookies` | Conformidade | — | INDEXAR | IMPORTANTE_V1 |
| PG-19 | Termos | `/termos-de-uso` | Conformidade | — | INDEXAR | PODE_ENTRAR_V1 |
| PG-20 | 404 | — | Recuperar o visitante | Buscar | NÃO_INDEXAR | ESSENCIAL_V1 |
| PG-21 | Bovinocultura | `/bovinocultura` | Segmento complementar | Ver produtos | CONDICIONAL | EVOLUÇÃO |
| PG-22 | FAQ | `/perguntas-frequentes` | Tirar dúvida | Solicitar cotação | DECISÃO | DECISÃO_NECESSÁRIA |
| PG-23 | Materiais | `/materiais` | Baixar documento | Baixar | DECISÃO | EVOLUÇÃO |
| PG-24 | Glossário | `/glossario` | Entender termo | Ver produtos | DECISÃO | EVOLUÇÃO |
