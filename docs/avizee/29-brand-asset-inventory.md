# 29 — Inventário de Assets de Marca

Origem: `BRANDING` (S-04, S-07).

## Arquivos recebidos

| Arquivo | Formato | Dimensões | Bytes |
|---|---|---|---|
| `COLORIDO/SVG/Asset 2.svg` | SVG vetorial | viewBox 893,96 × 270,87 | 5.792 |
| `COLORIDO/PDF/Asset 2.pdf` | PDF vetorial | — | 43.768 |
| `COLORIDO/PNG/Asset 2.png` | PNG RGBA | 3726 × 1129 | 63.862 |
| `COLORIDO/JPG/Logo AviZee.jpg` | JPG RGB | 3725 × 1129 | 360.796 |

Cópia de trabalho no repositório: `src/assets/brand/avizee-logo-colorido.svg`.

## Anatomia

Lockup **horizontal**: símbolo (cabeça de galo em traço contínuo fundida a meia engrenagem) em
Vinho `#690500` + wordmark "AVIZEE" em caixa-alta pesada com entalhes, em Terracota `#b2592c`.

## Paleta oficial confirmada no vetor

| Cor | Hex |
|---|---|
| Preto | `#151514` |
| Vinho | `#690500` |
| Terracota | `#b2592c` |
| Creme | `#fffaed` |

## Lacunas (bloqueiam a construção do design system)

| # | Ausente | Consequência |
|---|---|---|
| 1 | Versão monocromática | sem aplicação em fundo neutro/impressão 1 cor |
| 2 | Versão negativa (sobre preto e sobre vinho) | rodapé e seções escuras sem logotipo válido |
| 3 | Símbolo isolado | sem avatar de rede social nem marca compacta em mobile |
| 4 | Favicon / ícone de app | o site atual usa `favicon.ico` genérico |
| 5 | Imagem social (og:image) | `logo-social.jpg` referenciado **não existe** (F-06) |
| 6 | Área de respiro, tamanho mínimo, grade de construção | uso inconsistente |
| 7 | Versão vertical/empilhada | sem alternativa para espaços estreitos |

Registrado como **O-26**, ainda aberto.

## Grafismo

Conforme D-032 (L-09), nenhum grafismo novo será criado. Usa-se apenas o padrão secundário
oficial, aplicado separadamente do símbolo. O "grafismo em V" citado no prompt original não
existe no manual (DIV-06, resolvida).

## Ícones de sistema

Nenhum conjunto de ícones oficial foi fornecido. O site atual usa SVGs avulsos (Instagram,
LinkedIn, WhatsApp) embutidos no HTML.
