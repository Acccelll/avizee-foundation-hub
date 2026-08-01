# 18 — Auditoria do Catálogo

Origem: `CATALOG` — materiais recebidos em 2026-08-01.
Fontes desta auditoria:

| Ref. | Arquivo | Natureza |
|---|---|---|
| C-A | `catalogo.pdf` (10 páginas, dentro do código-fonte do site, `assets/docs/`) | Catálogo **publicado** hoje no site |
| C-B | Catálogo em PDF de 11 páginas (Adobe InDesign, 21/11/2024) | Catálogo **complementar** — famílias que não estão no site |
| C-C | `assets/data/produtos.csv` | Base de dados que alimenta `produtos.php` (fonte estruturada) |

> Nenhum dado foi reconciliado silenciosamente. Divergências estão listadas e permanecem abertas.

## Números

| Métrica | Valor |
|---|---|
| SKUs em C-C (CSV) | **117** |
| Códigos em C-A (PDF do site) | 116 |
| Códigos em C-B (PDF complementar) | 106 |
| Códigos presentes **só** em C-B | **55** |
| Universo consolidado (C-C ∪ C-B) | **~172 SKUs** |
| Grupos em C-C | 14 |
| Imagens de produto no site atual | 72 JPG (`assets/img/products/<codigo>.jpg`, minúsculas) |

## Grupos existentes no CSV (C-C)

| Grupo | SKUs | Prefixo |
|---|---|---|
| AGULHA | 25 | AG |
| SOCOREX | 15 | SR |
| OUTROS | 13 | VR |
| BALANÇA | 12 | BA |
| BOVINOCULTURA | 9 | BV |
| BICO | 8 | BI |
| AVIZEE | 6 | AZ |
| TUBOS | 5 | TB |
| SERINGA | 5 | SE |
| TERMÔMETROS | 4 | TE |
| COMEDOURO | 4 | CO |
| BEBEDOURO | 4 | BB |
| ARMADILHAS | 4 | AR |
| LÂMINA | 3 | LM |

## Famílias que existem apenas no catálogo complementar (C-B)

`CATALOG` — **55 SKUs ausentes do site e do CSV**. São, em maioria, peças de reposição e
componentes pneumáticos:

| Prefixo | Qtd | Famílias |
|---|---|---|
| CN | 27 | Conexões L, retas, T, Y, reguladora de fluxo (nylon/latão, 1/8"–1/2", tubos 6/10/12 mm) |
| PE | 23 | Peças: engates rápidos, passa-muro, regulador de pressão, contador manual, controlador eletrônico de temperatura, capa/corpo do bico vacinadora, filtros, fotocélula e cabos, câmera termográfica, chave canhão, aquecedor de vacina, lâmpada piloto, lanterna de ovoscopia, manômetro, motorredutores, pHmetro, termômetros, supressor |
| BO | 3 | Bombas: diafragma 12 V, aerador esteira, submersa para banho-maria |
| BT | 2 | Bateria vacinadora: spray carrinho, spray galpão |

Além disso, C-B traz uma família **AGULHA QUADRADA** (AG022 10X08, AG016 10X10) e a linha
**AGULHA APLICADOR PARA VACINA** (AG021), e marca explicitamente
"AGULHAS DIVERSAS — CONSULTAR" e "CONEXÕES DIVERSAS — SOB CONSULTA".

`TECHNICAL_INFERENCE` — Raciocínio: PE075–PE079 e VR010–VR013 descrevem os **mesmos itens**
(contador manual, pHmetro, lanterna de ovoscopia, câmera termográfica) com códigos diferentes.
Isso indica duas numerações convivendo — ver DIV-13.

## Divergências do catálogo (não reconciliadas)

| # | Divergência | Fontes | Observação |
|---|---|---|---|
| DIV-10 | `AG016` aparece duas vezes em C-B: "06 X 10" e "10 X 10" (agulha quadrada). No CSV, `AG016` = INOX 06 X 10 e a quadrada 10 X 10 é `AG020` | C-B vs. C-C | Código duplicado — exige decisão do usuário |
| DIV-11 | `AG022`: C-B = "10 X 08" (quadrada); C-C = INOX "04 X 08" | C-B vs. C-C | Conflito direto de medida e família |
| DIV-12 | `AG005`: C-B mostra "8 X 25 / 8X8"; C-C = "25 X 8" | C-B vs. C-C | Provável erro de diagramação em C-B |
| DIV-13 | Itens duplicados sob dois códigos: PE006/VR010 (contador manual), PE075/VR011 (pHmetro), PE076/VR012 (lanterna ovoscopia), PE079/VR013 (câmera termográfica) | C-B vs. C-C | Duas numerações para o mesmo produto (RK-04) |
| DIV-14 | Balanças BA005/BA006/BA009/BA010: C-B as chama "BALANÇA S DINAMÔMETRO AVES"; C-A e C-C chamam "BALANÇA ELETRÔNICA PARA AVES" | C-B vs. C-C | Nomes públicos conflitantes na mesma família |
| DIV-15 | `AG025` (quadrada 10X08) existe no CSV; C-A grafa `AG026` para a mesma medida | C-A vs. C-C | Código público inconsistente |
| DIV-16 | C-C tem `BI007` e `BI999` ("DIVERSOS - CONSULTAR"); C-B não traz BI007 | C-B vs. C-C | `BI999` é um pseudo-SKU de consulta, não um produto |

## Impacto crítico da regra R-05 (marcas de terceiros)

`CATALOG` — Tratamento definido em **D-035** (renomear por função; marca só em campo interno).

| Onde | Ocorrência | Alcance |
|---|---|---|
| Nome de **grupo** inteiro | `SOCOREX` | **15 SKUs** (SR001–SR027) |
| Nome de produto | "SERINGA SOCOREX", "CILINDRO GRADUADO SOCOREX", "SOQUETE SERINGA SOCOREX", "KIT REPARO DA SERINGA SOCOREX", "MOLA DO EMBOLO SOCOREX", "BICO REPOSIÇÃO SOCOREX", "CONEXÃO MANGUEIRA SOCOREX", "UNIÃO DE PONTAS - SOCOREX DUPLA" | 15 |
| Nome de produto | `BV005` "MONITOR FREESTYLE OPTIUM NEO" | 1 |
| Nome de produto | `LM001` "LAMINA RETA BC", `LM002` "LAMINA DE REPASSE KH" | 2 |
| Descrições de bico | códigos de fabricante ("80015 BD", "8001 BD", "8002 BD", "TX-VK6°", "RC 80°") | 5 |
| Nomes de arquivo de imagem | `sr001.jpg` … `sr029.jpg` (o código em si não expõe marca — o **grupo** expõe) | 15 |

`TECHNICAL_INFERENCE` — Raciocínio: R-05 proíbe marca de terceiro em qualquer superfície pública
(nome, slug, alt, SEO, dados estruturados, WhatsApp, nome de arquivo). Um grupo inteiro chamado
"SOCOREX" é, hoje, a maior violação estrutural do catálogo. Não existe caminho automático:
renomear muda o reconhecimento do comprador (que busca pela marca), e manter viola a regra.
**Resolvido 2026-08-01 — D-035**: renomear por função (ex.: "seringa automática 0,5 ml"); a marca
original vive apenas em campo interno (D-012). O grupo "SOCOREX" deixa de existir como nome público.

Nota: "AVIZEE" é marca **própria** e permanece permitida (DIV-03).

## Cobertura de imagem

`IMAGE_ASSET`

| Métrica | Valor |
|---|---|
| SKUs no CSV (C-C) | 117 |
| Imagens no site atual | 72 |
| **Cobertura sobre C-C** | **~62%** |
| SKUs de C-B (55) com imagem | 0 no site; parcialmente cobertos pelo acervo "Mercado Livre" (prefixos PE, SE, CO, BB) |
| Cobertura sobre o universo consolidado (~172) | **~42%** (site) — sobe combinando com o acervo `Mercado Livre` |

Os dois acervos (site 72 JPG; `Mercado Livre` 110 arquivos) **se sobrepõem parcialmente**;
a regra de prioridade entre eles continua PENDENTE_DE_APROVAÇÃO (L-11).

## Estado

Auditoria **executada** (2026-08-01). Bloqueio O-21 encerrado. DIV-10 a DIV-16 e L-12 foram
resolvidas em 2026-08-01 (**D-035** e **D-036**): a modelagem usa UUID como chave, o código do
fabricante é atributo, e cada conflito bloqueia somente o registro afetado (rascunho). Os 55 SKUs
complementares entram na v1 quando os dados forem confiáveis (**D-037**).
