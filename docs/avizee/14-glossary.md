# 14 — Glossário

| Termo | Definição |
|---|---|
| **Segmento** | Nível mais alto da taxonomia; setor produtivo atendido (Avicultura, Bovinocultura, Suinocultura). |
| **Solução / Aplicação** | Necessidade operacional que agrupa produtos por finalidade (vacinação, ovoscopia, pesagem, biossegurança...). |
| **Categoria** | Agrupamento de famílias por natureza do produto (ex.: "Vacinação e aplicação"). |
| **Família** | Conjunto de variações visual e funcionalmente semelhantes, apresentado em uma única página pública com seletor (ex.: "Agulha inox"). |
| **Variação / SKU** | Item individual comercializável, identificado por código e atributos diferenciadores (medida, capacidade, unidade). Ex.: `10 × 10 — AG011`. |
| **Lista de Cotação** | Agrupador de itens que o visitante monta no site antes de enviar a solicitação. **Nunca** chamado de carrinho. |
| **Cotação** | Solicitação enviada pelo visitante com itens, quantidades e dados da empresa. Não é pedido, reserva, aceite, preço, prazo ou frete garantidos. |
| **Produto público** | Conjunto de dados exibíveis: nome público neutro, código, especificações, aplicação, imagem aprovada. |
| **Produto interno** | Registro administrativo completo, incluindo campos privados. Nunca serializado para o cliente. |
| **Marca interna** | Marca de terceiro registrada apenas em campo administrativo privado (`marca_interna`, `fabricante_interno`, `referencia_original`, `fornecedor`, `descricao_original`). |
| **Nome público funcional** | Denominação neutra do produto, sem marca de terceiro. Ex.: "Seringa automática 0,5 ml". |
| **Normalização** | Processo rastreável de conversão do nome interno com marca para o nome público neutro. |
| **Imagem aprovada** | Imagem com status `APROVADA`, apta a publicação sem ressalvas. |
| **Imagem ilustrativa** | Imagem `APROVADA_PARA_FAMÍLIA`, publicada com aviso discreto de que representa a família e não a variação específica. |
| **Placeholder oficial** | Substituto visual da AviZee (fundo creme, símbolo, grafismo, Montserrat, "Imagem em atualização"). |
| **Conteúdo relacionado** | Vínculo entre artigo e produto/família/categoria/solução, em ambas as direções. |
| **Rascunho** | Registro não visível publicamente, por falta de imagem e de dados confiáveis, ou por decisão editorial. |
| **Publicado** | Registro visível publicamente, aderente a todas as regras não negociáveis. |
| **PENDENTE_DE_APROVAÇÃO** | Status obrigatório de toda recomendação do Lovable até aprovação explícita do usuário. |

## Termos incorporados na Etapa 2
`LOVABLE_RECOMMENDATION` — Status: **PENDENTE_DE_APROVAÇÃO**

| Termo | Definição |
|---|---|
| **Página canônica do produto** | A página de **família**. Variação de medida não tem URL própria (`45` §4). |
| **Porta de entrada** | Caminho pelo qual o visitante chega ao produto: código, nome, aplicação, categoria ou conteúdo. |
| **Filtro contextual** | Filtro que só existe dentro de uma família ou categoria (medida, capacidade, rosca). |
| **Estado da relação** | `CONFIRMADA` · `PROVISÓRIA` · `RECOMENDADA` · `NÃO_CONFIRMADA`. Só `CONFIRMADA` é renderizada. |
| **Consulta assistida** | Fluxo para quem não encontrou o item: descrição, foto ou WhatsApp, gerando oportunidade sem SKU. |
| **DADO_PENDENTE** | Marcação de campo cujo valor real ainda não foi confirmado pelo usuário. Nunca é preenchido por inferência. |
| **Conteúdo mínimo publicável** | Conjunto de campos sem o qual uma página não é indexada (`55`). |
| **Protocolo de cotação** | Identificador gerado no envio da solicitação, apresentado em `/cotacao/enviada`. |

## Termos incorporados na Etapa 2.1
`LOVABLE_RECOMMENDATION` — Status: **PENDENTE_DE_APROVAÇÃO**

| Termo | Definição |
|---|---|
| **Família estrutural** | Agrupamento de SKUs que compartilham função, forma de uso e conjunto de atributos. É a unidade de classificação e a página canônica do produto. |
| **Família órfã** | Família criada apenas para abrigar códigos sem nome em nenhuma fonte (FAM-019, FAM-021, FAM-032). Não é candidata a publicação. |
| **Aplicação principal** | A única aplicação que define a razão de existir da família. Toda família publicável tem exatamente uma. |
| **Aplicação secundária** | Uso adicional legítimo; alimenta filtro e busca, nunca a URL canônica. |
| **Classe de evidência** | `SOURCE_EXPLICIT` · `SOURCE_IMPLICIT` · `INFERENCE_HIGH` · `INFERENCE_MEDIUM` · `INFERENCE_LOW`. Determina se a classificação pode ser publicada. |
| **Herança taxonômica** | O SKU herda categoria, aplicação e segmento da família; só declara o que o diferencia. |
| **Bloqueio de registro** | Conflito trava o SKU afetado, nunca a família inteira (D-036). |
| **READY_FOR_STAGE_3** | Família com taxonomia suficiente para orientar o design system, mesmo sem fotografia ou descrição extensa. |


## Termos técnicos incorporados na Etapa 4

| Termo | Definição |
|---|---|
| View pública | Visão do banco contendo apenas campos PUBLIC/DERIVED_PUBLIC; única superfície lida por usuário anônimo |
| RLS | Row Level Security — controle de acesso por linha no Postgres |
| Outbox | Tabela de mensagens/jobs pendentes processada por worker, garantindo que falhas externas não afetem a transação principal |
| Idempotência | Reenvio da mesma solicitação produz o mesmo resultado (mesmo protocolo) |
| Snapshot de item | Cópia do nome, SKU e variação no momento da cotação, preservando o histórico |
| Dry run | Execução simulada da importação, com relatório e sem gravar |
| Dead letter | Mensagem que esgotou as tentativas e requer intervenção |
| Gate | Verificação bloqueante antes de avançar de etapa ou publicar |
| ADMIN_ONLY | Classificação de campo interno, nunca exposto publicamente |
| Placeholder oficial | Imagem padrão aprovada usada quando não há foto autorizada |
