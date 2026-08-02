# 157 — Etapa 6: Plano do Núcleo Administrativo do Catálogo

## 1. Objetivo
Implementar a administração canônica do catálogo (taxonomia, famílias, SKUs, códigos, mídia,
fila de normalização, conflitos), a importação controlada e a serialização pública segura,
sem antecipar o catálogo público (Etapa 7).

## 2. Escopo aprovado
31 famílias e 97 SKUs (D-052/D-053). Todo o restante permanece fora do catálogo canônico,
em fila de normalização, nunca excluído.

## 3. Ordem de execução aplicada
Fundação de dados → RBAC e auditoria → núcleo administrativo → serialização pública →
importação controlada → suíte automatizada → lote canônico → documentação.

## 4. Regras que governaram a implementação
- R-04: nenhum campo de preço existe no modelo.
- R-05: campos internos jamais entram na serialização pública.
- D-037: UUID é a chave técnica; o código alfanumérico é rótulo público.
- D-033: ausência de imagem nunca bloqueia o produto (placeholder).
- Nenhum registro é apagado fisicamente: soft delete e fila de normalização.

## 5. Não escopo
Catálogo público, busca pública, filtros públicos, Lista de Cotação completa, publicação,
sitemap de produtos, envio de e-mail real, WhatsApp real, produção.
