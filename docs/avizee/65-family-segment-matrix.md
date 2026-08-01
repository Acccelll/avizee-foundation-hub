# 65 — Matriz Família → Segmento

Dados: **`data/family-segments.csv`** — 43 linhas.

## 1. Distribuição

| Segmento | Famílias | SKUs | Categoria de acesso | Destaque na Home |
|---|---|---|---|---|
| Avicultura | 39 | 165 | CAT-01 a CAT-05 | Sim |
| Bovinocultura | 4 | 9 | **CAT-06 Linhas complementares** | Não |
| Suinocultura | 0 | 0 | — | Não |

## 2. Base da atribuição

`SOURCE_DERIVED` — **Bovinocultura**: os 9 SKUs `BV` trazem `categoria_original = BOVINOCULTURA`
nas fontes, e quatro deles nomeiam explicitamente "TUBERCULINA" e "INTRA RUMINAL". Evidência
direta.

`SOURCE_DERIVED` — **Avicultura**: aplicada por herança conforme **D-042**, que autoriza tratar
como avícola tudo o que não é declarado complementar. Isso é uma regra de projeto aprovada, não
uma inferência nova. Ainda assim, cada linha permanece
`PROPOSTA_PENDENTE_DE_APROVAÇÃO` porque a herança nunca foi validada família a família.

`UNCLASSIFIED` — **Suinocultura**: nenhuma fonte associa qualquer SKU a suínos. O segmento
continua existindo institucionalmente e "sob consulta" (D-003), sem produto no catálogo.

## 3. Ressalva sobre as famílias sem nome

`FAM-019`, `FAM-021` e `FAM-032` (34 SKUs) receberam segmento **Avicultura** apenas por herança
D-042. Como sequer a função é conhecida, esse segmento é o campo de menor confiança de toda a
matriz. Se o destravamento revelar itens bovinos entre eles, a reclassificação é esperada e não
constitui erro desta etapa.

## 4. Coexistência entre categoria e filtro de segmento

Regra proposta (DEC-05 **não** aplicada):

1. A **categoria** "Linhas complementares" é o caminho de navegação: `/produtos/linhas-complementares`.
2. O **segmento** é atributo do produto e filtro transversal, disponível em toda listagem.
3. Um produto bovino é alcançável por **dois caminhos** — categoria e filtro — mas tem **uma única
   URL canônica**, sob a categoria. O filtro gera parâmetro não indexável (`?segmento=`),
   eliminando duplicidade de navegação e canibalização.
4. Na **busca**, produtos complementares aparecem normalmente, com selo visual de segmento, mas
   **ranqueiam abaixo** dos itens de avicultura quando a consulta é ambígua.
5. Na **Home**, nenhuma família complementar é promovida.
6. Nas páginas de **solução** (SOL-01 a SOL-03), famílias complementares não aparecem no corpo
   principal; podem aparecer em bloco secundário "linhas complementares relacionadas".

## 5. Aplicações compartilhadas entre segmentos

`aplicação`, `monitoramento` e `manejo` são usadas tanto por famílias avícolas quanto bovinas.
Isso é **desejado**: o filtro de aplicação é transversal e o de segmento é que separa. Não criar
aplicações duplicadas do tipo "aplicação bovina".

## 6. Selo de segmento

Toda família com segmento diferente de Avicultura exibe selo textual "Linha complementar —
bovinocultura" no card e na página. O selo é informativo e não substitui a categoria.
