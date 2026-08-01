# 27 — Inventário de Imagens (Etapa 1)

Arquivo de dados: **`data/images.csv`** — 188 arquivos.
Este documento consolida e substitui operacionalmente o levantamento parcial de
`17-image-inventory.md`, que permanece como registro histórico da Etapa 0.

## Acervos

| Acervo | Origem | Arquivos |
|---|---|---|
| Mercado Livre (raiz) | S-05 | 60 PNG |
| Mercado Livre `A/` | S-05 | 50 JPG |
| Site atual `assets/img/products/` | S-02 | 72 JPG |
| Interface do site (logo, favicon, ícones) | S-02 | 6 |

## Formatos

| Formato | Qtd. |
|---|---|
| JPG | 122 |
| PNG | 64 |
| ICO | 1 |
| WEBP | 1 |

Nenhum AVIF; nenhum conjunto responsivo (`srcset`); nenhuma imagem otimizada para LCP.

## Status de publicação atribuído

| Status | Qtd. | Significado |
|---|---|---|
| `PENDENTE_DIREITO_DE_USO` | 149 | sem confirmação de titularidade ou autorização |
| `PENDENTE_MARCA_VISIVEL` | 33 | marca de terceiro identificável na imagem |
| `NAO_AVALIADA_PRODUTO` | 6 | não foi possível associar a um código |

**Nenhuma imagem está aprovada para publicação.** Todas dependem da confirmação de direito de
uso prevista em `09-image-policy.md`.

## Duplicidades exatas (MD5)

| Grupo | Arquivos |
|---|---|
| DUP-0001 | `BA005.jpg` · `BA006.jpg` · `BA010.jpg` · `BA013.jpg` |
| DUP-0002 | `SR005.jpg` · `SR006.jpg` |
| DUP-0003 | `SR008.jpg` · `SR009.jpg` |
| DUP-0004 | `TB004.jpg` · `TB005.jpg` |

`TECHNICAL_INFERENCE` — Raciocínio: arquivos byte a byte idênticos servindo códigos diferentes
indicam que a foto representa a **família**, não a variação. Isso sustenta D-019/D-023
(agrupamento por família com seletor de variações) e não constitui erro de acervo.

## Imagens sem produto identificado

`IMG-0111` a `IMG-0116` — arquivos de interface e itens sem código no nome. Exigem triagem manual.

## Qualidade

Predomínio de 1000×1000 px em fundo neutro nos acervos de marketplace. As imagens do site atual
têm dimensões heterogêneas. Nenhuma foi avaliada em alta resolução item a item: a triagem de
marca visível foi feita por nome de arquivo e inspeção amostral, e **exige conferência
individual** antes de qualquer publicação.
