# 21 — Etapa 1: Plano e Método da Auditoria

`USER_DECISION` — Escopo definido no prompt da Etapa 1. Nenhum código funcional, nenhuma
alteração visual e nenhuma migração foram executados nesta etapa.

## Objetivo

Levantar, sem interpretar nem corrigir, o estado real de tudo que existe hoje: site publicado,
código-fonte, catálogos, imagens, marca, tipografia, SEO, funcionalidades, segurança,
acessibilidade e performance — produzindo inventários rastreáveis que sustentem as etapas
seguintes.

## Fontes obrigatórias examinadas

Ver `data/sources.csv` (9 fontes, todas com status `ANALISADO`).

## Método

1. Extração integral dos pacotes recebidos em ambiente isolado (`/tmp`), sem cópia de binários
   para o repositório.
2. Varredura de arquivos com hash MD5, dimensões de imagem e tamanho, gerando `data/files.csv`
   e `data/images.csv`.
3. Extração de texto dos dois catálogos em PDF e leitura do `produtos.csv` do site atual;
   consolidação por código em `data/products-provisional.csv`.
4. Cruzamento produto × imagem por código exato e por família, em `data/product-image-relations.csv`.
5. Leitura linha a linha do código PHP para inventário de páginas, SEO, funcionalidades,
   segurança, acessibilidade e performance.
6. Registro de tudo que diverge em `data/divergences.csv` e `data/duplicates.csv`, sem
   reconciliação silenciosa.

## Regras aplicadas durante a auditoria

- Nenhum dado inventado. Ausência é registrada como ausência.
- Nenhuma marca de terceiro reproduzida em campo público; a marca observada fica em campo
  interno (`campo_interno_marca`) conforme D-035.
- Nenhum preço registrado, em nenhuma coluna (R-04).
- Toda inferência é etiquetada `TECHNICAL_INFERENCE` com o raciocínio explícito.
- Toda recomendação nasce `PENDENTE_DE_APROVAÇÃO`.

## Numeração

Os documentos da Etapa 1 ocupam a faixa **21 a 39**. Os documentos 00 a 20 são da Etapa 0 e
permanecem inalterados, exceto pelas atualizações registradas em `16-change-log.md`.

## Entregáveis

| Documento | Conteúdo |
|---|---|
| `22-current-site-inventory.md` | Site publicado |
| `23-codebase-inventory.md` | Código-fonte |
| `24-page-and-content-inventory.md` | Páginas, seções e textos |
| `25-product-source-inventory.md` | Fontes de produto e cobertura |
| `26-provisional-product-matrix.md` | Matriz provisória de 174 SKUs |
| `27-image-inventory.md` | 188 imagens |
| `28-product-image-matrix.md` | Relação produto × imagem |
| `29-brand-asset-inventory.md` | Logotipo e assets de marca |
| `30-font-inventory.md` | Tipografia |
| `31-seo-inventory.md` | SEO atual |
| `32-functional-inventory.md` | Funcionalidades |
| `33-security-findings.md` | Segurança |
| `34-accessibility-findings.md` | Acessibilidade |
| `35-performance-findings.md` | Performance |
| `36-duplicates-and-divergences.md` | Duplicidades e divergências |
| `37-migration-readiness.md` | Prontidão para migração |
| `38-stage-01-open-questions.md` | Perguntas abertas |
| `39-stage-01-executive-report.md` | Relatório executivo |
