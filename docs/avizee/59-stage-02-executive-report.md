# 59 — Relatório Executivo da Etapa 2

Data: 2026-08-01 · Status global: **PENDENTE_DE_APROVAÇÃO**

## 1. Resumo executivo

A Etapa 2 converteu o inventário da Etapa 1 em uma arquitetura de informação completa: sitemap,
navegação, URLs, tipos de página, busca, filtros, cotação, Central de Conteúdos, jornadas,
indexação e painel conceitual. A proposta gira em torno de três escolhas estruturais:

1. **A família é a unidade canônica de página**, não o SKU. 174 SKUs viram cerca de 18 a 30
   páginas úteis, em vez de 174 páginas quase idênticas sem dado técnico.
2. **Categoria organiza por tipo de item; solução organiza por problema.** Não são dois catálogos:
   a solução lista famílias e nunca reproduz o conteúdo delas — é o que evita duplicação.
3. **Página só é indexável quando tem conteúdo próprio.** Categorias, soluções e categorias
   editoriais nascem com `noindex` até cumprirem o critério.

A maior ameaça à v1 não é estrutural, é de dado: sem atributo técnico por SKU (RK-18) e sem
classificação família → categoria → aplicação, os filtros contextuais não são publicáveis e as
páginas de família nascem curtas.

## 2. Fontes consultadas
Documentação permanente 00 a 20 · documentos da Etapa 1 (21 a 39) · respostas da Etapa 1 (40) ·
`data/products-provisional.csv` (174 SKUs, 20 prefixos de família) · `data/images.csv` ·
`data/divergences.csv` · `data/findings.csv` · `19-url-inventory.md`.

## 3 a 24. Entregáveis
Arquitetura pública (42) · administrativa (43) · sitemap (42 + `data/sitemap.csv`) ·
menu desktop e mobile e rodapé (44) · tipos de página (47) · catálogo e soluções (48) ·
Central de Conteúdos (51) · busca e filtros (49) · cotação e WhatsApp (50) · jornadas (53) ·
breadcrumbs (44 §4) · URLs (45) · redirecionamentos (46) · indexação (55) · priorização (57) ·
páginas opcionais e não recomendadas (42 e 57).

## 25. Dependências

| ID | Dependência | Bloqueia |
|---|---|---|
| DEP-01 | Classificação família → categoria → aplicação | Categorias, filtros, soluções, breadcrumbs |
| DEP-02 | Texto próprio de categoria, solução e editorial | Indexação dessas páginas |
| DEP-03 | Direito de uso das imagens (Q-02) | Foto real; placeholder cobre a v1 |
| DEP-04 | Dados de contato (Q-08) | Rodapé, Contato, Sobre |
| DEP-05 | Textos legais, razão social e CNPJ (Q-13) | Páginas legais e formulário |
| DEP-06 | Destinatário e provedor de e-mail (O-05, O-06) | Envio da cotação |
| DEP-07 | Rotação de credenciais (Q-01, O-27) | Lançamento seguro |
| DEP-08 | Aprovação de L-01 a L-07 | Cores funcionais, dicionário de marcas, URLs |

## 26. Riscos novos desta etapa

| ID | Risco | Mitigação prevista |
|---|---|---|
| RK-19 | **Páginas de família nascerem finas** por ausência de dado técnico | Critério de conteúdo mínimo por página; `noindex` até cumprir |
| RK-20 | **Solução virar cópia da categoria**, gerando duplicação | Solução lista, não reproduz; canônica única por família |
| RK-21 | **Comprador que só conhece a marca não encontrar o item** (efeito colateral de R-05) | Dicionário de sinônimos funcionais; estado de busca com sugestão; DEC-08 |
| RK-22 | **`/produtos` mudar de conteúdo mantendo a URL** | Monitoramento pós-lançamento no Search Console |

## 27. Lacunas
Classificação de famílias · atributos para filtros contextuais · textos de categoria e solução ·
dados de contato · textos legais · origem das imagens · AG005 e AG022 · L-01 a L-07.

## 28. Decisões pendentes
DEC-01 a DEC-18 em `58-stage-02-decisions-for-approval.md`. Destaques que **alteram material já
aprovado** e por isso exigem manifestação explícita: **DEC-05** (categoria "Linhas
complementares") e **DEC-18** (categorias editoriais).

## 29. Recomendações
Antes da Etapa 3, executar um passo curto de **classificação de famílias** (DEP-01): sem ele, o
design system será desenhado sobre uma taxonomia hipotética.

## 30. Documentos criados
41 a 59 (19 documentos) e `data/sitemap.csv`, `data/pages-proposed.csv`,
`data/url-migrations.csv`, `data/user-journeys.csv`, `data/page-relationships.csv`,
`data/product-content-relations.csv`, `data/stage-02-decisions.csv`.

> **Numeração**: os números 36 a 40 pedidos no prompt já pertencem à Etapa 1. A Etapa 2 ocupa
> 41 a 59. Mapa de equivalência no `README.md`.

## 31. Documentos atualizados
`01-approved-decisions.md` · `04-traceability-matrix.md` · `07-product-taxonomy.md` ·
`08-content-strategy.md` · `11-scope-and-out-of-scope.md` · `12-risk-register.md` ·
`13-open-decisions.md` · `14-glossary.md` · `16-change-log.md` · `README.md`.

## 32 a 34. Confirmações
- **Nenhuma implementação foi realizada**: nenhuma rota, componente, função de servidor, banco de
  dados, migração, importação de produto ou redirecionamento real.
- **Nenhum layout foi alterado**: nenhum arquivo em `src/` foi tocado; o preview segue idêntico.
- **Nenhuma proposta foi assumida como aprovada**: tudo nesta etapa é
  `PENDENTE_DE_APROVAÇÃO`, e nenhuma decisão anterior foi reaberta.
