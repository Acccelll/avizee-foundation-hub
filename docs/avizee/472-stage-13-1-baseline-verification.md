# 472 — Verificação de Linha de Base (Baseline)

> Data: 2026-08-05 · Commit Inicial: f12b4f0783e3a023d967058666eac7ddbc403595

## 1. Estado Inicial do Repositório
- **.env rastreado**: SIM (Identificado vazamento inicial no commit f57e4b9a).
- **Fallbacks fixos**: Encontrado `"avizee-antiabuse"` em `src/quotation/quotation.server.ts`.
- **MCP exposto**: 5 ferramentas sem limites de tamanho de string.
- **Testes MCP**: 0 existentes.

## 2. Inventário MCP (Pré-remediação)
- `search_catalog`
- `list_categories`
- `list_facets`
- `get_family`
- `suggest_terms`

## 3. Veredito de Segurança Inicial
**CRÍTICO**: O arquivo `.env` estava versionado no repositório. Requer rotação de chaves.
