# 471 — Plano de Remediação da Etapa 13.1

> Data: 2026-08-05 · Versão: 1.0 · Status: EM_EXECUCAO
> Responsável: Arquiteto de Software Sênior

## 1. Escopo e Objetivos
Esta etapa visa o saneamento técnico, endurecimento de segurança e recertificação da Release Candidate após a inclusão do MCP público. Não autoriza produção.

## 2. Ações de Remediação
- [x] Remoção do `.env` do rastreamento do Git (Fase B).
- [x] Eliminação de fallbacks inseguros para `QUOTATION_HASH_SALT` (Fase C).
- [x] Centralização da configuração em `getServerConfig()`.
- [x] Hardening de contratos Zod no MCP (Fase D).
- [x] Testes de segurança específicos para MCP (Fase F).
- [x] Revisão semântica do readiness (Fase G).

## 3. Cronograma Técnico
1. **Fase A/B**: Auditoria e Saneamento de Segredos (Concluído).
2. **Fase C**: Hardening de Configuração (Concluído).
3. **Fase D/F**: MCP Hardening e Testes (Concluído).
4. **Fase G**: Readiness Semantic (Concluído).
5. **Fase H**: Regressão Completa (Pendente).
6. **Fase J**: Recertificação RC-AVIZEE-03 (Pendente).
