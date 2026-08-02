# 258 — Etapa 9: Validação de Acessibilidade e SEO das Páginas Institucionais

Status: `PENDENTE_DE_APROVAÇÃO`. Meta obrigatória: **WCAG 2.2 AA**.

## 1. Acessibilidade

| Critério | Verificação | Resultado |
|---|---|---|
| 1.3.1 Informação e relações | Seções com `aria-labelledby`, listas semânticas, `dl` para pares rótulo/valor | OK |
| 1.4.3 Contraste mínimo | Paleta oficial validada em `design/color-contrast-matrix.csv` | OK |
| 1.4.11 Contraste de não texto | Bordas de card e foco em `--border` / `--emphasis` | OK |
| 2.4.1 Blocos repetidos | Skip link do `PublicShell` presente em todas as rotas | OK |
| 2.4.6 Títulos e rótulos | Um `h1` por página; `h2` por bloco do wireframe | OK |
| 2.4.7 Foco visível | Estilo global de foco no `styles.css` | OK |
| 2.5.8 Tamanho do alvo (2.2) | CTAs com altura 48 px; ícones de cabeçalho 44 px | OK |
| 3.2.6 Ajuda consistente (2.2) | Acesso a Contato e Lista de cotação em header e rodapé de todas as páginas | OK |
| 3.3.2 Instruções e rótulos | Estado pendente descrito em texto, não só por cor | OK |
| 1.1.1 Conteúdo não textual | Ícones decorativos com `aria-hidden`; logo com `alt` textual | OK |

## 2. SEO

| Rota | Title | Description | Indexável |
|---|---|---|---|
| `/` | Soluções para avicultura \| AviZee | Posicionamento B2B + lista de cotação | Sim (após publicação) |
| `/sobre` | Sobre a AviZee | Especialização em avicultura e atendimento consultivo | Sim |
| `/solucoes` | Soluções por necessidade | Aplicações reais mapeadas ao catálogo | Sim |
| `/contato` | Contato | Canais e caminho de cotação | Sim |
| `/politica-de-privacidade` | Política de privacidade | Estrutura do documento | **Não** (rascunho) |
| `/termos-de-uso` | Termos de uso | Estrutura do documento | **Não** (rascunho) |

- Todos os títulos abaixo de 60 caracteres e descrições abaixo de 160.
- JSON-LD: `Organization` na Home (sem campos não confirmados), `BreadcrumbList` nas páginas
  internas. Nenhum `Offer`, `Product` com preço, `AggregateRating` ou `Review` (R-03/R-04).
- Enquanto o ambiente não for publicado, `robots.txt` mantém `Disallow: /` (R-10).

## 3. Desempenho

- Nenhuma imagem pesada foi introduzida na camada institucional; a Home reutiliza dados já
  carregados pelo loader do catálogo.
- Nenhum script de terceiro (mapa, chat, pixel) foi adicionado — dependem de decisão aberta.
