# 48 — Arquitetura de Descoberta de Produto

Status: `PENDENTE_DE_APROVAÇÃO`

## 1. Cinco portas de entrada

| Porta | Quem usa | Superfície |
|---|---|---|
| Código | comprador recorrente | busca com correspondência exata |
| Nome/medida | quem já conhece o item | busca + filtro contextual |
| Aplicação/problema | técnico e gestor | `/solucoes` + filtro de aplicação |
| Categoria | quem explora | menu Produtos e `/produtos` |
| Conteúdo | tráfego orgânico | artigo → família |

## 2. Segmento

Recomendação: **filtro + selo na página de família + campo de produto**. Sem menu e sem hub.
- Avicultura: padrão implícito; não vira selo (seria redundante em quase todo o catálogo).
- Bovinocultura: selo "também para bovinocultura" e valor de filtro (9 SKUs `BV`).
- Suinocultura: **sob consulta** (D-003). Sem seção, sem filtro na v1 — tratada por CTA de
  consulta. Criar filtro sem itens publicáveis produziria estado vazio permanente.

## 3. Soluções e aplicações

Classificação das 17 aplicações de `07-product-taxonomy.md`:

| Aplicação | Tratamento proposto |
|---|---|
| Vacinação | **Página de solução** — maior densidade de catálogo (AG, SR, SE) e de conteúdo |
| Pulverização | **Página de solução** — BI, BO, TB, CN |
| Pesagem e medição | **Página de solução** — BA, TE |
| Incubação e ovoscopia | **Página de solução condicional** — publica se houver texto próprio e ≥ 2 famílias |
| Controle de temperatura · qualidade da água · qualidade do ambiente | Filtro + tópico editorial |
| Manutenção · reposição · automação · ar comprimido | Filtro (famílias PE, CN, BO, BT) |
| Alimentação · hidratação | Filtro (CO, BB) |
| Biossegurança · manejo | Filtro + tópico editorial |
| Ovoscopia (isolada) | Sinônimo de busca, dentro de Incubação |

**Critério para página indexável de solução**: explicação própria + ≥ 2 famílias publicadas +
≥ 1 conteúdo + relevância comercial declarada. Sem isso, a aplicação existe **apenas como filtro**.

## 4. Categorias

As 6 categorias aprovadas são adequadas para navegação, SEO e escalabilidade. Duas observações
como `PENDENTE_DE_APROVAÇÃO`:
- "Linhas complementares" é rótulo fraco para o cliente e opaco para busca. Sugestão:
  usar como **filtro de segmento**, não como categoria, e distribuir os itens `BV` nas categorias
  funcionais. Decisão DEC-05 em `58`.
- "Peças, reposição e automação" concentraria hoje ~55 SKUs (PE, CN, BT, BO) sem dado técnico.
  Precisa de subdivisão em famílias antes de virar navegação útil (D-042).

## 5. Famílias — critérios

| Situação | Tratamento |
|---|---|
| ≥ 2 variações que diferem só em medida, capacidade ou embalagem | **Uma família**, seletor de variação |
| Variação com imagem própria aprovada | Fica na família; a imagem troca com o seletor |
| Imagem única para várias variações | Permitido, com aviso de imagem ilustrativa (I-4, DUP-0001 a 0004) |
| Item único sem parentes | Família de uma variação, mesma estrutura |
| Item tecnicamente distinto | Avaliar SKU próprio (`45` §4) |
| Item sob consulta (BI999) | **Não é SKU** (D-040): vira CTA de consulta na família de bicos |
| Peça muito específica | Permanece na família, encontrada por código e por filtro |
| Variação bloqueada por divergência | Existe internamente, invisível no público (D-036) |

## 6. Especificações
Comuns ficam no corpo da família; variáveis vivem na tabela de variações. Campo sem dado é
omitido (D-041). A tabela é a fonte de verdade das diferenças — nunca duplicar em texto corrido.
