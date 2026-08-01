# 24 — Inventário de Páginas, Seções e Conteúdo

Dados tabulares em `data/pages.csv`.

## `/` — Home (`index.php`)

| Seção | Conteúdo atual | Conformidade |
|---|---|---|
| Hero | H1 "Soluções Integradas para Avicultura e Suinocultura" + "Equipamentos de alta qualidade para maximizar sua produção" + CTA "Conheça nossos produtos" | **Conflita com D-001/D-002** (peso igual à suinocultura) — DIV-01 |
| Diferenciais | "Produtos Testados", "Entrega Rápida", "Assistência Técnica" | **Conflita com D-010**; "Entrega Rápida" **viola R-11** (F-23) |
| Produtos em destaque | Carrossel de grupos vindos do CSV, com imagem, código e variações | Base útil; agrupamento por nome já existente (favorece D-019) |
| Modal de produto | Imagem + variações + botão "Orçar via WhatsApp" | **Conflita com D-007** (Lista de Cotação) — F-24 |
| Depoimentos / social | Bloco `testimonials` + widget EmbedSocial "Siga-nos nas Redes Sociais" | Conteúdo de terceiros; revisar |
| CTA final | WhatsApp direto (`5519998982930`) | Substituir pela Lista de Cotação |

## `/produtos` (`produtos.php`)

Listagem única de todo o CSV com filtros no cliente e o mesmo modal da home. Links "Detalhes"
apontam para `#`. Não há paginação, taxonomia, página de família nem página de SKU.

## `/sobre` (`sobre.php`)

Blocos: "Quem somos" ("A AviZee Equipamentos LTDA é especializada na comercialização de
equipamentos para avicultura…"), "Diferenciais" (Curadoria técnica, Atendimento consultivo,
**Logística ágil**, Condições B2B), "Nossa história" (3 marcos sem datas verificáveis),
"Missão, Visão e Valores" e CTA final.

- "Logística ágil — Agilidade e transparência em prazos e entregas" **viola R-11** (F-23).
- "Ser referência nacional em equipamentos para avicultura e suinocultura" conflita com D-002.
- "Curadoria técnica — Seleção de marcas…" precisa de revisão sob R-05.

## `/contato` (`contato.php`)

Dados de contato, iframe do Google Maps e formulário (nome, e-mail, telefone, mensagem) com
honeypot `website` e reCAPTCHA. Sem aviso de privacidade nem consentimento (F-26).

## `/blog` (`blog.php`)

H1 "Blog AviZee" e três cards **sem artigo real** (todos com `href="#"`):
"Como garantir a eficiência da vacinação em aves", "Importância da pesagem correta das aves",
"Como construir valor desde o primeiro contato com o cliente".

`TECHNICAL_INFERENCE` — Raciocínio: não existe nenhum arquivo de post no pacote; o blog é uma
maquete visual. Portanto **não há conteúdo editorial a migrar** para a Central de Conteúdos
(D-024) — apenas três títulos como pauta potencial.

## Textos aproveitáveis na v1

| Trecho | Uso |
|---|---|
| Razão social e descrição de "Quem somos" | base institucional, após revisão |
| Estrutura Missão/Visão/Valores | manter estrutura, reescrever texto sob D-002 e R-11 |
| Dados de contato e redes | manter, após confirmação |
| Títulos dos 3 cards de blog | pauta editorial inicial |

Nenhum texto atual é aproveitável sem revisão, porque todos misturam avicultura e suinocultura
em peso igual (D-001/D-002) ou contêm promessa logística (R-11).
