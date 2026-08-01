# 10 — Diretrizes de Marca

> Esta etapa apenas **documenta** as regras. Nenhum layout, design system ou token foi
> implementado. Qualquer proposta visual depende de aprovação (R-10).
>
> Fonte verificada: `BRANDING` — "PROPOSTA DE BRANDING — AVIZEE V.01" (10 páginas), recebida em 2026-07-31.

## Definição da marca (manual oficial)
`BRANDING` — "Uma empresa moderna com foco em peças de avicultura, que oferecerá itens para:
vacinas, balanças e peças para reposição."

## Paleta oficial
`BRANDING` / `USER_DECISION` — confirmada na página 5 do manual.

| Nome (manual) | HEX | Uso previsto |
|---|---|---|
| Black | `#151514` | Texto principal, fundos escuros, contraste |
| Dark Red (Vinho) | `#690500` | Símbolo, cor de marca profunda, ênfase institucional |
| Brown (Terracota) | `#b2592c` | Wordmark, cor de ação e destaque |
| Off-White (Creme) | `#fffaed` | Fundo base, respiro, aplicação do logo sobre cor |

Nenhuma cor fora desta paleta pode ser introduzida sem aprovação. Cores funcionais
(erro, sucesso, aviso) ainda **não** foram definidas — ver L-01 em `13-open-decisions.md`.

## Logotipo — construção verificada
`BRANDING`

- **Símbolo**: cabeça de galo estilizada, desenhada em **traço contínuo de espessura uniforme**
  (outline, sem preenchimento), fundida à silhueta de **meia engrenagem** no lado direito.
  A crista é resolvida como um laço fechado à esquerda e o olho é um ponto cheio.
  Leitura conceitual: avicultura (galo) + equipamento/peça (engrenagem).
- **Wordmark**: "AVIZEE" em caixa-alta, sans-serif **muito pesada e condensada**, com entalhes
  verticais dentro dos traços das letras.
- **Lockup principal**: símbolo acima, wordmark abaixo, alinhados pela direita.
- **Aplicação sobre creme**: símbolo em Vinho `#690500` + wordmark em Terracota `#b2592c`.
- **Aplicação sobre cor** (terracota, preto ou vinho): logotipo inteiro em **Creme `#fffaed`**,
  monocromático — símbolo e wordmark na mesma cor.
- O **símbolo isolado** é uma versão oficial válida, aplicado em creme sobre terracota, preto ou vinho.

## Tipografia
`BRANDING` / `USER_DECISION` — Família única: **Montserrat**.

| Uso | Peso |
|---|---|
| Títulos principais | 700 ou 800 |
| Subtítulos | 600 ou 700 |
| Corpo de texto | 400 |
| Botões | 600 |
| Códigos e especificações | 500 ou 600 |

**Arquivos recebidos** (`Montserrat.zip`, 2026-07-31): OTF nos pesos Hairline, Thin, UltraLight,
ExtraLight, Light, Regular, Medium, SemiBold, Bold, ExtraBold, Black; TTF em Regular e Bold;
mais a variante decorativa **Montserrat Alternates** (11 pesos).

Observações `TECHNICAL_INFERENCE`:
- **Não há itálicos** no pacote. Raciocínio: nenhum arquivo `*Italic*` está presente; portanto o
  design system não deve prever estilo itálico real, sob risco de o navegador sintetizar a inclinação.
- **Não há WOFF/WOFF2**. Raciocínio: OTF/TTF são pesados para web; a conversão é necessária
  antes de qualquer uso em produção (decisão O-24).
- **Montserrat Alternates é proibida na v1** (D-031). Família distinta, não um peso; nenhum uso aprovado.
  Ver L-08 em `13-open-decisions.md`.

## Elementos oficiais
`BRANDING`
- Logotipo AviZee (lockup símbolo + wordmark)
- Símbolo gráfico: cabeça de galo em traço contínuo + meia engrenagem
- Fotografia de avicultura: aves adultas, pintinhos, manejo humano, ambiente de granja —
  usada em planos fechados e com o logotipo sobreposto (páginas 2 e 9 do manual)
- Combinações de terracota, vinho, preto e creme em blocos chapados de cor

## Direção visual aprovada
`USER_DECISION` — moderna · técnica · limpa · profissional · B2B · conectada à avicultura ·
coerente com o branding.

Reforço observado no manual `BRANDING`: composições de **blocos sólidos de cor**, ampla área de
respiro, ausência total de gradientes, sombras e efeitos. O contraste vem da cor chapada e do
peso tipográfico, não de decoração.

## Usos inadequados
`USER_DECISION` — estética de marketplace · aparência de loja virtual · excesso de efeitos ·
animações gratuitas · gradientes genéricos · elementos visuais incompatíveis com a marca ·
fontes fora de Montserrat · cores fora da paleta · logotipos de terceiros (R-05).

`BRANDING` — adicionalmente: não aplicar o símbolo preenchido (ele é sempre em outline),
não recolorir símbolo e wordmark com cores diferentes sobre fundo colorido, e não usar
Montserrat Alternates no lugar de Montserrat sem aprovação.

## Pendências de branding
- Assets vetoriais do logotipo (SVG/AI/EPS) **não foram recebidos** — apenas o PDF do manual.
  Ver O-22 em `13-open-decisions.md`.
- O manual **não define**: área de respiro, tamanho mínimo, versão horizontal, versão
  monocromática em preto sobre branco, nem grade de construção.
- **DIV-06 — RESOLVIDA (D-032)**: nenhum grafismo novo será criado. O vocabulário gráfico usa
  apenas o **padrão secundário oficial**, sempre aplicado **separado do símbolo** galo+engrenagem
  (ver `03-source-inventory.md`).
