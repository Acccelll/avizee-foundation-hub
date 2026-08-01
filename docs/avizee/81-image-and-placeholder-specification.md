# 81 — Especificação de Imagem e Placeholder

Status: `APROVADO` (Etapa 3 aprovada com ajustes em 2026-08-01; ver `93`). Aprovação conceitual — não autoriza implementação. Detalha em nível de implementação as regras de
`09-image-policy.md`, os tipos de página de `47-page-type-definitions.md` e as regras não
negociáveis R-05 e R-09 de `02-non-negotiable-rules.md`. Aplica-se apenas às 31 famílias e
97 SKUs aprovados; nenhuma imagem de família ou SKU fora do escopo aprovado é referenciada.

## 1. Mapeamento dos 8 estados de imagem

| Status (`09`) | Publicável | Tratamento na interface | Aviso exibido |
|---|---|---|---|
| `APROVADA` | Sim | Imagem real do SKU, galeria completa quando houver mais de um arquivo | Nenhum |
| `APROVADA_PARA_FAMÍLIA` | Sim | Imagem real de uma variação representando a família inteira | Aviso "Imagem ilustrativa" (I-4), obrigatório e visível |
| `PENDENTE_MARCA_VISÍVEL` | Não | Nunca chega ao frontend | — |
| `PENDENTE_BAIXA_QUALIDADE` | Não | Nunca chega ao frontend | — |
| `PENDENTE_IMAGEM_INCORRETA` | Não | Nunca chega ao frontend | — |
| `PENDENTE_DIREITO_DE_USO` | Não | Nunca chega ao frontend | — |
| `SEM_IMAGEM` | Placeholder | Placeholder oficial AviZee | Nenhum aviso adicional; o placeholder já comunica "em atualização" |
| `NÃO_PUBLICAR` | Não | Nunca chega ao frontend, nunca reaproveitada, nunca cacheada em CDN pública | — |

Regra de quarentena (deriva de R-09/I-3): qualquer imagem cujo status não seja `APROVADA` ou
`APROVADA_PARA_FAMÍLIA` fica em **quarentena** — não é servida por nenhuma rota pública, não
entra em sitemap de imagem, não é indexada, não aparece em Open Graph, JSON-LD, feed ou cache
de borda acessível publicamente. A ausência de imagem publicável nunca bloqueia a publicação da
família/SKU quando os dados técnicos são confiáveis (I-1); o placeholder assume o lugar da
imagem sem gerar erro visual ou de layout.

Regra de marca visível (D-033): nenhuma imagem publicada, em nenhum estado, exibe marca,
logotipo, selo ou identidade visual de terceiro, mesmo parcialmente visível em segundo plano,
em etiqueta, embalagem ou reflexo. Imagem com marca detectada é automaticamente tratada como
`PENDENTE_MARCA_VISÍVEL` e não é editada digitalmente para remover a marca quando isso alterar
a aparência real do produto (ver `09-image-policy.md`, "Edições proibidas"); aguarda nova foto.

## 2. Placeholder oficial AviZee

### 2.1 Composição

- Fundo: Creme `#fffaed`, chapado, sem gradiente.
- Símbolo AviZee (cabeça de galo + meia engrenagem, outline) centralizado, em Vinho `#690500`
  ou em Terracota `#b2592c` conforme a área de composição, nunca preenchido.
- Grafismo discreto do padrão secundário oficial ("linha V"), aplicado com baixo contraste,
  separado do símbolo, nunca sobreposto a ele (D-032).
- Texto "Imagem em atualização" em Montserrat, peso 500 ou 600, cor Preto `#151514` ou Vinho
  `#690500`, alinhado abaixo do símbolo.
- Nenhum outro elemento gráfico, ícone, textura ou efeito é adicionado à composição.

### 2.2 Variações por proporção

O placeholder é produzido como um único arquivo-mestre e recortado/centralizado para cada
proporção usada no site, mantendo símbolo e texto sempre centralizados e legíveis:

| Proporção | Uso |
|---|---|
| 1:1 (quadrado) | Card de família na grade do catálogo, thumbnails, resultado de busca |
| 4:3 | Galeria de página de família, bloco de destaque |
| 16:9 | Banners de categoria/solução quando não houver foto institucional adequada |
| 3:4 (retrato) | Card em layout mobile de largura reduzida, quando aplicável |

Em proporções muito estreitas (ex.: miniatura de item na lista de cotação), o texto "Imagem em
atualização" pode ser omitido visualmente, mas o símbolo permanece e o texto equivalente segue
disponível via `alt`.

### 2.3 Texto alternativo do placeholder

`alt` fixo e normativo: **"Imagem em atualização — [nome funcional da família ou SKU]"**. Nunca
contém marca de terceiro, nunca usa "sem foto" ou "indisponível" (associação a falta de estoque),
nunca fica vazio (`alt=""`) exceto quando o placeholder for puramente decorativo ao lado de um
título que já repete a mesma informação em texto.

## 3. Aviso "imagem ilustrativa" (I-4, status `APROVADA_PARA_FAMÍLIA`)

Aplicável quando uma imagem real representa a família inteira porque as variações são
visualmente semelhantes (PT-05, D-050).

- Posição: rótulo curto sobreposto ou imediatamente adjacente à imagem principal da família,
  nunca escondido em tooltip apenas.
- Texto normativo: **"Imagem ilustrativa da família"**, complementado quando necessário por
  "as variações podem apresentar pequenas diferenças".
- Estilo: badge discreto em Creme `#fffaed` sobre Preto `#151514` ou Vinho `#690500`, tipografia
  Montserrat 500/600, sem ícone de alerta genérico fora da paleta (se houver ícone, é neutro,
  ex. "informação", nunca cor funcional não aprovada).
- O aviso não aparece em imagens `APROVADA` (representação exata do SKU) nem no placeholder
  (que já comunica seu próprio estado).
- O aviso é obrigatório em toda superfície que reutilize essa imagem: card de família, página
  de família, resultado de busca, item da lista de cotação quando a variação selecionada não tem
  imagem própria.

## 4. Proporções e tamanhos responsivos

| Contexto | Proporção | Larguras servidas (px) |
|---|---|---|
| Card de família (grade `/produtos`) | 1:1 | 320, 480, 640 |
| Imagem principal da página de família | 4:3 | 480, 768, 1024, 1440 |
| Galeria (miniaturas) | 1:1 | 96, 160 |
| Item da lista de cotação | 1:1 | 64, 96 |
| Banner de categoria/solução | 16:9 | 768, 1280, 1920 |
| Card de artigo (Central de Conteúdos) | 16:9 ou 4:3 (definido em `51`) | 480, 768, 1024 |

Toda imagem usa `srcset`/`sizes` correspondente às larguras acima; nenhuma imagem é servida em
resolução original sem redimensionamento.

## 5. Formatos

Ordem de preferência por content negotiation: **AVIF** → **WebP** → **JPEG** como fallback
final. PNG é reservado a assets com transparência real (símbolo isolado, placeholder quando
exportado com fundo transparente para composição). SVG é reservado a logotipo, símbolo e ícones
de interface, nunca a fotografia de produto. Nenhum formato fora desta lista é usado em produção.

## 6. Lazy loading

- Imagens abaixo da dobra (grade de catálogo além dos primeiros itens, galeria de família,
  conteúdos relacionados) usam carregamento adiado (`loading="lazy"`), com dimensão reservada
  via `width`/`height` ou `aspect-ratio` para evitar deslocamento de layout (CLS).
- Imagem principal da página de família e primeira imagem da grade acima da dobra carregam de
  forma prioritária (eager/preload), pois compõem o maior conteúdo visível inicial.
- Placeholder oficial segue a mesma política de lazy loading do slot que ocupa; não recebe
  tratamento especial de prioridade só por ser placeholder.

## 7. Alt text normativo por tipo de página

| Tipo de página | Padrão de `alt` |
|---|---|
| PT-02 Catálogo — card de família | "[Nome funcional da família], [categoria]" |
| PT-03 Categoria — banner | "[Nome da categoria] — AviZee" (sem marca de terceiro) |
| PT-04 Solução | "[Nome da solução] — aplicação em avicultura" |
| PT-05 Família — imagem principal | "[Nome funcional da família]" + sufixo "(imagem ilustrativa)" quando `APROVADA_PARA_FAMÍLIA` |
| PT-05 Família — galeria/miniatura | "[Nome funcional], variação [rótulo da variação]" quando a imagem for específica da variação |
| PT-06 SKU | "[Nome público do SKU], referência [código]" |
| PT-12 Lista de cotação — item | "[Nome funcional da família], variação [rótulo]" |
| PT-09 Artigo | Descrição funcional do conteúdo da imagem editorial, sem marca |
| Placeholder (qualquer página) | "Imagem em atualização — [nome funcional]" |

Nenhum `alt` contém marca de terceiro, preço, prazo ou promessa logística (I-6, R-05, R-04, R-11).
Imagens puramente decorativas de composição institucional (ex.: textura de fundo do padrão
secundário) usam `alt=""` com `role="presentation"`.

## 8. Regra geral de consistência

Toda imagem publicada — real ou placeholder — respeita a paleta oficial no entorno visual
(moldura, fundo de card, badge de aviso), nunca introduz cor fora de `#151514`, `#690500`,
`#b2592c`, `#fffaed` nos elementos de interface que a envolvem, e nunca é apresentada com preço,
selo de disponibilidade de estoque ou prazo de entrega sobrepostos (R-03, R-04, R-11).

## 9. Status

Documento `PENDENTE_DE_APROVAÇÃO` (R-10). A classificação real do acervo de imagens não foi
executada (ver `09-image-policy.md`, "Estado da classificação"); esta especificação define a
regra de tratamento para quando a classificação existir.
