---
name: Etapa 14 — Editor Estruturado
description: Registro da implementação do editor de blocos no admin.
type: feature
---

# 520 — EDITOR ESTRUTURADO DE BLOCOS

## 1. IMPLEMENTAÇÃO
- Criado componente `BlockEditor.tsx` em `src/components/admin/content/`.
- Suporte inicial estruturado para: `heading`, `paragraph` e `product_relation`.
- Bloco `product_relation` permite busca e inserção de slugs de famílias.
- Modo técnico (JSON) preservado em seção recolhível para diagnósticos.
- Reordenação e remoção de blocos implementada com confirmação.

## 2. VERIFICAÇÃO
- [x] Tipos de blocos validados pelo `blocksSchema`.
- [x] Interface administrativa limpa sem edição direta de JSON como padrão.
- [x] Acessibilidade: navegação por botões claros.
