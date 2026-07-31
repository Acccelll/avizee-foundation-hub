# 03 — Inventário de Fontes

Status possíveis: `ANALISADO` · `PARCIAL` · `NÃO_RECEBIDO` · `PENDENTE`

| # | Fonte | Tipo | Finalidade | Conteúdo identificado | Confiabilidade | Limitações | Status |
|---|---|---|---|---|---|---|---|
| S-01 | https://avizee.com.br/ | Site público | Conteúdo atual, produtos, tom | Home com headline "Soluções Integradas para Avicultura e Suinocultura"; blocos "Nossos Diferenciais" (Produtos Testados / Entrega Rápida / Assistência Técnica); carrossel de produtos em destaque com códigos (AG001, AG011, AG020, AG021, AR001–AR004, AZ001–AZ004); imagens em `/assets/img/products/<codigo>.jpg`; link `produtos.html`; WhatsApp `5519998982930` | Média — reflete o estado atual, não as decisões novas | Links "Detalhes" apontam para `#` (sem página de produto real); textos conflitam com decisões aprovadas | ANALISADO (Home) |
| S-02 | Código-fonte do site atual | Repositório/arquivos | Migração, URLs, SEO | — | — | **Não presente no ambiente do projeto** | NÃO_RECEBIDO |
| S-03 | `catalogo.pdf` | PDF | Produtos, famílias, códigos, variações, medidas, capacidades, categorias, aplicações | — | Fonte primária de catálogo | **Não presente no ambiente do projeto** — auditoria detalhada do catálogo bloqueada | NÃO_RECEBIDO |
| S-04 | `avizee.pdf` — "PROPOSTA DE BRANDING — AVIZEE V.01" | PDF, 10 páginas | Manual e proposta de branding | Definição da marca ("peças de avicultura: vacinas, balanças e peças para reposição"); paleta confirmada (`#151514`, `#690500`, `#b2592c`, `#fffaed`); logotipo (símbolo cabeça de galo em traço contínuo + meia engrenagem, wordmark pesado em caixa-alta); versões sobre creme, terracota, preto e vinho; símbolo isolado; aplicação sobre fotografia de avicultura | Alta — documento oficial | Não define área de respiro, tamanho mínimo, versão horizontal nem grade de construção; **não traz assets vetoriais** | **ANALISADO** (2026-07-31) |
| S-05 | `Mercado Livre.zip` | Imagens | Banco de imagens de produto | 110 arquivos: 60 PNG na raiz + 50 JPG em `A/`; prefixos AG, AR, AZ, BA, BB, BV, CO, LM, PE, SE, SR, TB, TE, VR; 4 grupos de duplicatas exatas; ~11 códigos com marca de terceiro visível | Alta como acervo; média por item | Classificação feita por painel de contato — exige conferência individual em alta resolução; cobertura do catálogo não calculável sem S-03 | **ANALISADO** (2026-07-31) — ver `17-image-inventory.md` |
| S-06 | `Montserrat.zip` | Fontes | Tipografia oficial | Montserrat em OTF (Hairline → Black, 11 pesos) + TTF Regular/Bold; Montserrat Alternates (11 pesos) | Alta | **Sem itálicos**; **sem WOFF/WOFF2** (conversão necessária); Alternates é família distinta e seu uso não foi aprovado | **ANALISADO** (2026-07-31) |
| S-07 | Logotipos vetoriais, ícones e demais assets | Assets | Identidade visual | — | — | **Não recebidos** — só existe o PDF do manual (S-04); sem SVG/AI/EPS o logotipo não pode ser aplicado com qualidade | NÃO_RECEBIDO |
| S-08 | Prompt da Etapa 0 (este documento de decisões) | Decisão do usuário | Base normativa do projeto | 30 decisões aprovadas, 13 regras não negociáveis, taxonomia inicial, política de imagens, estratégia de conteúdo | **Máxima** (topo da precedência) | — | ANALISADO |

## Impacto do material não recebido

`TECHNICAL_INFERENCE` — Raciocínio: a Etapa 0 exige apenas *constituição de contexto*, e todas as
decisões normativas vieram do próprio prompt (S-08), que tem precedência máxima. Portanto a Etapa 0
está concluída. Com o recebimento de S-04, S-05 e S-06 em 2026-07-31, restam bloqueadas:

1. Auditoria detalhada do catálogo (famílias reais, códigos, variações, medidas) — depende de S-03. **Bloqueado**
2. Cálculo de cobertura de imagem por SKU — depende de S-03. **Bloqueado**
3. Mapeamento de URLs atuais para plano de redirecionamento 301 — depende de S-02. **Bloqueado**
4. Aplicação do logotipo em qualidade de produção — depende de S-07 (vetores). **Bloqueado**
5. Empacotamento tipográfico WOFF2 — S-06 recebido em OTF/TTF; conversão pendente de aprovação (O-24).

Concluídos com o material recebido: verificação da paleta, do logotipo e das versões de aplicação
(S-04, ver `10-brand-guidelines.md`); inventário e triagem do acervo de imagens
(S-05, ver `17-image-inventory.md`); levantamento dos pesos tipográficos disponíveis (S-06).


## Divergências registradas (não reconciliadas)

| # | Divergência | Fontes em conflito | Tratamento |
|---|---|---|---|
| DIV-01 | Headline atual dá **peso igual** a avicultura e suinocultura | S-01 vs. D-001/D-002 | Prevalece a decisão do usuário. Registrado, não corrigido no site atual. |
| DIV-02 | Diferenciais atuais ("Produtos Testados", "Entrega Rápida", "Assistência Técnica") diferem dos aprovados (variedade especializada, atendimento ágil, atendimento consultivo) | S-01 vs. D-010 | Prevalecem os aprovados. "Entrega Rápida" também conflita com R-11. |
| DIV-03 | Nomes de produto atuais contêm a marca própria "AVIZEE" (ex.: "SERINGA DUPLA AVIZEE FLUXO CONTÍNUO") | S-01 vs. R-05 | Sem conflito: a marca AviZee é permitida. Registrado para evitar remoção indevida na normalização. |
| DIV-04 | Site atual exibe cards por medida individual (AG011 "10 X 10", AG020 "10 X 10") | S-01 vs. D-019 | Prevalece o agrupamento por família com seletor de variações. |
| DIV-05 | Site atual usa `.html` estático e links "Detalhes" quebrados (`#`) | S-01 | Registrado como risco de SEO e como confirmação de que não há páginas de produto a preservar individualmente. Verificar em S-02. |
| DIV-06 | O prompt cita "grafismos inspirados na letra **V**"; o manual oficial não apresenta nenhum grafismo em "V" — o elemento gráfico é o símbolo cabeça de galo em traço contínuo fundido a meia engrenagem | S-08 vs. S-04 | **Não reconciliado.** Requer definição do usuário: o grafismo "V" é um elemento novo a criar, ou a menção se referia ao símbolo do manual? Registrado como L-09 em `13-open-decisions.md`. |
| DIV-07 | O manual define o foco como "vacinas, balanças e peças para reposição"; a taxonomia aprovada é bem mais ampla (17 aplicações, 6 categorias) | S-04 vs. S-08 | Prevalece a taxonomia aprovada (precedência 1 > 2). O manual é anterior à expansão do catálogo. Registrado. |
| DIV-08 | O acervo de imagens contém prefixos ausentes do site atual (`BB`, `CO`, `PE`, `SE`) e o site contém códigos ausentes do acervo (`AG001`, `AG021`, `AZ004`) | S-05 vs. S-01 | Nenhuma fonte é completa. Reconciliação só é possível contra `catalogo.pdf` (S-03). Não reconciliado. |
| DIV-09 | Quatro grupos de imagens são arquivos idênticos servindo códigos diferentes (ver `17-image-inventory.md`) | S-05 | Tratado como evidência a favor do agrupamento por família (D-019/D-023), não como erro. |
