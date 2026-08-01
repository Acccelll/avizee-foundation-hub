# 105 — Modelo de Especificações Dinâmicas

## 1. Problema

Famílias com atributos heterogêneos (agulhas: diâmetro, comprimento, material, embalagem;
balanças: capacidade, resolução, tipo; conexões: formato, rosca, tubo, material; tubulações:
material, diâmetro, unidade; seringas: capacidade, simples/dupla, aplicação).

## 2. Opções avaliadas

| Opção | Vantagem | Problema |
|---|---|---|
| Tabela larga com centenas de colunas | Consulta simples | Ingovernável, migrations constantes |
| EAV puro | Flexível | Perde tipagem, filtro caro, valores livres |
| JSON livre | Rápido de escrever | Sem controle, sem filtro confiável, sem validação |
| **Híbrido: dicionário + valores tipados (+ JSON de exibição)** | Tipagem, filtro, governança | Um pouco mais de modelagem |

## 3. Escolha: híbrido (DT-05)

- `specification_definitions`: `code`, `label` público, `value_type` (TEXT/NUMBER/BOOLEAN/
  ENUM/RANGE), `unit`, `enum_values[]`, `is_filterable`, `is_public`, `display_order`,
  `help_text`. **Nenhum atributo existe sem definição** — não há campo livre.
- `specification_scopes`: quais definições se aplicam a cada categoria/família, com
  obrigatoriedade.
- `product_specifications` / `family_specifications`: valor tipado em colunas dedicadas
  (`value_text`, `value_num`, `value_bool`, `value_min`, `value_max`) + `unit_id`.
  Constraint garante que apenas a coluna compatível com o `value_type` seja preenchida.
- Coluna derivada `specs_display jsonb` **materializada** por trigger, usada apenas para
  renderização rápida da tabela de especificações; nunca é fonte de verdade nem de filtro.

## 4. Filtros

Somente definições com `is_filterable = true` e `is_public = true` viram filtro público.
Numéricos usam faixa; enums usam múltipla escolha; texto não é filtrável.
Índices: `(definition_id, value_num)` e `(definition_id, value_text)`.

## 5. Governança

Criar/alterar definição é ação auditada, restrita a ADMINISTRADOR e GESTOR_DE_CATÁLOGO.
Unidade nunca é texto livre — vem de tabela `units`. Alteração de `value_type` de uma
definição em uso exige migração explícita com relatório de impacto.


## Atualização 2026-08-01 — DT-05 aprovada

Modelo híbrido confirmado: dicionário, definições tipadas, valores por família, valores por SKU,
unidades controladas, herança, sobrescrita explícita, marcação de uso futuro em filtro e
validação. Proibidos JSON inteiramente livre, tabela larga, EAV sem tipagem e especificações
arbitrárias. **Alterar uma definição já utilizada exige apresentar o impacto antes da
confirmação.**
