---
name: Etapa 14 — Fechamento Funcional do CMS
description: Plano de implementação para integração Home-Catálogo-Conteúdo e maturidade editorial.
type: feature
---

# 516 — ETAPA 14: PLANO DE FECHAMENTO FUNCIONAL

## 1. OBJETIVOS
- Consolidar capacidades editoriais e integração catalogo-conteúdo.
- Substituir edição JSON por editor estruturado.
- Implementar publicação agendada funcional.
- Estabelecer gestão administrativa de autores.

## 2. ESCOPO DE IMPLEMENTAÇÃO
- **Home:** Renderização dinâmica de 3 artigos recentes.
- **Catálogo:** Relação bidirecional Artigo <-> Família.
- **Editor:** UI para 10 tipos de blocos (heading, paragraph, list, quote, image, callout, table, faq, product_relation, divider).
- **Workflow:** Novo estado `SCHEDULED` e processador de agendamento.
- **Administração:** CRUD de autores e permissões específicas.

## 3. RISCOS E LIMITAÇÕES
- Hardening MCP e saneamento histórico de segredos (.env) permanecem bloqueados e fora do escopo funcional desta etapa.
- Não haverá automação de redes sociais.
- Não haverá migração de dados canônicos do catálogo.

## 4. CRITÉRIOS DE ACEITE
- Home reflete publicações sem alteração de código.
- Relações produto-artigo são declaradas editorialmente e refletidas em ambas as páginas.
- Editor impede HTML arbitrário e valida conformidade.
- Agendamento respeita claim atômico e idempotência.
