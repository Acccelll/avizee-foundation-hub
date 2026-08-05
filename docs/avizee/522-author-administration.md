---
name: Etapa 14 — Gestão de Autores
description: Registro da infraestrutura administrativa de autores.
type: feature
---

# 522 — GESTÃO ADMINISTRATIVA DE AUTORES

## 1. INFRAESTRUTURA
- Tabela `public.content_authors` criada com RLS e auditoria.
- Criadas funções server-side `listAuthors`, `getAuthor` e `saveAuthor`.
- Permissão `content.manage_authors` exigida para escritas.

## 2. REGRAS
- Autores não podem ser excluídos fisicamente se vinculados a artigos (uso de `is_active`).
- Bio e cargo são campos opcionais e higienizados.
