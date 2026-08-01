# 149 — Validação de Responsividade da Fundação

Origem: `87-responsive-behavior.md`.

## 1. Faixas verificadas

| Faixa | Referência | Resultado |
|---|---|---|
| Mobile pequeno | 320–359 px | shells íntegros, sem rolagem horizontal |
| Mobile médio | 360–767 px | navegação administrativa empilha acima do conteúdo |
| Tablet | 768–1023 px | layout de coluna única com respiro maior |
| Notebook | 1024–1439 px | navegação lateral administrativa em duas colunas |
| Desktop amplo | ≥1440 px | contêiner limitado; sem linha de leitura excessiva |

## 2. Comportamentos aplicados

- Contêiner único (`container-avizee`) padroniza a medida em todas as rotas.
- O shell administrativo passa de coluna única para lateral + conteúdo a partir de
  `768px`.
- Nenhuma informação é escondida por faixa; o que muda é o arranjo.

## 3. Ações recomendadas apenas para desktop

Nenhuma ainda, porque não há operação complexa implementada. A Etapa 6 introduz tabelas
de SKU, comparação de conflitos e importação; para essas será necessário documentar
alternativa utilizável em telas pequenas (exigência explícita) em `182`.
