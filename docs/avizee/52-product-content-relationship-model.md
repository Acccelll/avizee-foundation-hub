# 52 — Modelo de Relacionamento Produto × Conteúdo × Solução

Status: `PENDENTE_DE_APROVAÇÃO` · Dados: `data/product-content-relations.csv`

## 1. Grafo

```text
Segmento ──< Família
Solução  >──< Categoria      (n:n, curadoria)
Categoria ──< Família ──< Variação
Família  >──< Aplicação      (n:n, herdada pela variação — D-042)
Artigo   >──< Família        (n:n, declarada)
Artigo    ──> Categoria editorial (1)
Artigo   >──< Solução        (n:n)
Família  >──< Família        (complemento funcional, simétrico)
```

## 2. Perguntas que o modelo responde

| Pergunta | Caminho |
|---|---|
| Qual artigo apoia qual produto? | Artigo × Família |
| Qual produto pertence a qual solução? | Família × Aplicação → Solução |
| Quais categorias tem uma solução? | Solução × Categoria |
| Quais aplicações tem uma família? | Família × Aplicação |
| Quais artigos levam a cotação? | Artigo com CTA + Artigo × Família |
| Quais produtos aparecem em artigos? | Artigo × Família (recíproca) |
| Quais conteúdos aparecem na página de produto? | Família ← Artigo |

## 3. Estados da relação

| Estado | Significado | Pode renderizar? |
|---|---|---|
| `CONFIRMADA` | Aprovada pelo usuário ou evidente na fonte | Sim |
| `PROVISÓRIA` | Inferida de fonte com lacuna; precisa de validação | Não |
| `RECOMENDADA` | Proposta do Lovable | Não, até aprovação |
| `NÃO_CONFIRMADA` | Suspeita sem evidência | Não |

Regra: **o frontend renderiza apenas `CONFIRMADA`.** Bloco sem relação confirmada não é exibido.
Nenhuma relação foi preenchida sem evidência; as relações do CSV que hoje derivam apenas do
prefixo do código estão marcadas `RECOMENDADA`, jamais `CONFIRMADA`.
