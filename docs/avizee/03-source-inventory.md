# 03 — Inventário de Fontes

Status possíveis: `ANALISADO` · `PARCIAL` · `NÃO_RECEBIDO` · `PENDENTE`

| # | Fonte | Tipo | Finalidade | Conteúdo identificado | Confiabilidade | Limitações | Status |
|---|---|---|---|---|---|---|---|
| S-01 | https://avizee.com.br/ | Site público | Conteúdo atual, produtos, tom | Home com headline "Soluções Integradas para Avicultura e Suinocultura"; blocos "Nossos Diferenciais" (Produtos Testados / Entrega Rápida / Assistência Técnica); carrossel de produtos em destaque com códigos (AG001, AG011, AG020, AG021, AR001–AR004, AZ001–AZ004); imagens em `/assets/img/products/<codigo>.jpg`; link `produtos.html`; WhatsApp `5519998982930` | Média — reflete o estado atual, não as decisões novas | Links "Detalhes" apontam para `#` (sem página de produto real); textos conflitam com decisões aprovadas | ANALISADO (Home) |
| S-02 | Código-fonte do site atual | Repositório/arquivos | Migração, URLs, SEO | — | — | **Não presente no ambiente do projeto** | NÃO_RECEBIDO |
| S-03 | `catalogo.pdf` | PDF | Produtos, famílias, códigos, variações, medidas, capacidades, categorias, aplicações | — | Fonte primária de catálogo | **Não presente no ambiente do projeto** — auditoria detalhada do catálogo bloqueada | NÃO_RECEBIDO |
| S-04 | `avizee.pdf` | PDF | Manual e proposta de branding | Valores da paleta e tipografia foram transcritos pelo usuário no prompt e estão registrados | Alta (via USER_DECISION) | Arquivo em si **não presente**; não foi possível verificar construção do logotipo, área de respiro, versões monocromáticas e grafismos "V" | NÃO_RECEBIDO |
| S-05 | `Mercado Livre.zip` | Imagens | Banco de imagens de produto | — | A verificar | **Não presente** — classificação de imagens (`09-image-policy.md`) não pôde ser executada | NÃO_RECEBIDO |
| S-06 | `Montserrat-...zip` | Fontes | Tipografia oficial | — | Alta (família conhecida) | **Não presente**; alternativa de self-host vs. CDN é decisão aberta | NÃO_RECEBIDO |
| S-07 | Logotipos, ícones e demais anexos | Assets | Identidade visual | — | — | **Não presentes** | NÃO_RECEBIDO |
| S-08 | Prompt da Etapa 0 (este documento de decisões) | Decisão do usuário | Base normativa do projeto | 30 decisões aprovadas, 13 regras não negociáveis, taxonomia inicial, política de imagens, estratégia de conteúdo | **Máxima** (topo da precedência) | — | ANALISADO |

## Impacto do material não recebido

`TECHNICAL_INFERENCE` — Raciocínio: a Etapa 0 exige apenas *constituição de contexto*, e todas as
decisões normativas vieram do próprio prompt (S-08), que tem precedência máxima. Portanto a Etapa 0
pode ser concluída. Porém, as seguintes atividades **ficam bloqueadas** até o recebimento dos arquivos:

1. Auditoria detalhada do catálogo (famílias reais, códigos, variações, medidas) — depende de S-03.
2. Classificação de cada imagem nos 8 estados — depende de S-05 e S-07.
3. Mapeamento de URLs atuais para plano de redirecionamento 301 — depende de S-02.
4. Verificação de construção do logotipo, versões e grafismos — depende de S-04 e S-07.
5. Empacotamento tipográfico self-hosted — depende de S-06.

## Divergências registradas (não reconciliadas)

| # | Divergência | Fontes em conflito | Tratamento |
|---|---|---|---|
| DIV-01 | Headline atual dá **peso igual** a avicultura e suinocultura | S-01 vs. D-001/D-002 | Prevalece a decisão do usuário. Registrado, não corrigido no site atual. |
| DIV-02 | Diferenciais atuais ("Produtos Testados", "Entrega Rápida", "Assistência Técnica") diferem dos aprovados (variedade especializada, atendimento ágil, atendimento consultivo) | S-01 vs. D-010 | Prevalecem os aprovados. "Entrega Rápida" também conflita com R-11. |
| DIV-03 | Nomes de produto atuais contêm a marca própria "AVIZEE" (ex.: "SERINGA DUPLA AVIZEE FLUXO CONTÍNUO") | S-01 vs. R-05 | Sem conflito: a marca AviZee é permitida. Registrado para evitar remoção indevida na normalização. |
| DIV-04 | Site atual exibe cards por medida individual (AG011 "10 X 10", AG020 "10 X 10") | S-01 vs. D-019 | Prevalece o agrupamento por família com seletor de variações. |
| DIV-05 | Site atual usa `.html` estático e links "Detalhes" quebrados (`#`) | S-01 | Registrado como risco de SEO e como confirmação de que não há páginas de produto a preservar individualmente. Verificar em S-02. |
