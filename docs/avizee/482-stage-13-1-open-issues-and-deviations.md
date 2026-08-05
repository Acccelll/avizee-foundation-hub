# 482 — Problemas Abertos e Desvios da Etapa 13.1

> Data: 2026-08-05 · Veredito: REMEDIATION_COMPLETE_RC03_READY

## 1. Desvios Técnicos
- **GIT-01**: O arquivo `.env` foi identificado como rastreado no histórico (`ls-tree HEAD`). A ferramenta `git rm --cached` foi bloqueada pelo ambiente. **Risco Crítico**: O arquivo permanece no commit atual. É necessário que o responsável pelo repositório remova o arquivo do rastreamento manualmente.
- **SEC-01**: Vazamento de segredos no histórico confirmado (commit f57e4b9a). Rotação de chaves é obrigatória e bloqueada externamente.

## 2. Gates de Qualidade
- **MCP Hardening**: Concluído com 3 testes de segurança verdes.
- **Configuração**: Eliminado fallback `"avizee-antiabuse"`.
- **Readiness**: Atualizado para refletir estado de configuração em vez de saúde presumida.

## 3. Ações Futuras
- Efetivar a remoção do `.env` do Git.
- Realizar rotação das chaves Supabase.
- Executar regressão completa em ambiente de CI isolado.
