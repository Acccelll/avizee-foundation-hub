# Blocos do editor do site

O corpo da matéria não é HTML: é uma lista de blocos tipados. Qualquer outro tipo, ou campo fora dos limites, é rejeitado. O título da matéria é o H1, então o corpo começa em H2.

| Tipo               | Campos                                                             | Limites                                                    |
| ------------------ | ------------------------------------------------------------------ | ---------------------------------------------------------- |
| `heading`          | `level` (2 ou 3), `text`                                           | texto até 160                                              |
| `paragraph`        | `text`                                                             | até 2.000                                                  |
| `list`             | `ordered` (true/false), `items[]`                                  | 1–30 itens, cada um até 500                                |
| `quote`            | `text`, `attribution` (opcional)                                   | 600 / 160                                                  |
| `callout`          | `tone` (`info` ou `warning`), `title` (opcional), `text`           | 120 / 800                                                  |
| `table`            | `caption` (opcional), `headers[]`, `rows[][]`                      | 1–6 colunas, 1–40 linhas, cabeçalho até 80, célula até 200 |
| `faq`              | `items[]` com `question` e `answer`                                | 1–15 itens; pergunta até 200, resposta até 1.200           |
| `product_relation` | `familySlug`, `note` (opcional)                                    | slug de família real do catálogo; nota até 300             |
| `image`            | `mediaId` ou `url` https, `alt` (obrigatório), `caption`, `credit` | alt até 300                                                |
| `divider`          | —                                                                  | —                                                          |

Texto puro em todos os campos: sem Markdown, sem HTML, sem emoji. Negrito e links não existem no corpo.

## Requisitos para publicar

Uma matéria só pode ser publicada com: categoria, autor, resumo com 40+ caracteres, pelo menos um bloco e data de publicação. A aprovação do usuário na conversa (revisão técnica) é obrigatória.

## Exemplo

```json
[
  { "type": "paragraph", "text": "A temperatura do pinteiro nos primeiros dias..." },
  { "type": "heading", "level": 2, "text": "Qual é a temperatura ideal na primeira semana?" },
  { "type": "paragraph", "text": "Segundo a Embrapa Suínos e Aves, ..." },
  {
    "type": "table",
    "caption": "Faixas de referência por idade",
    "headers": ["Idade", "Temperatura"],
    "rows": [["1º dia", "32 a 34 °C"]]
  },
  {
    "type": "callout",
    "tone": "warning",
    "title": "Atenção",
    "text": "Ajuste sempre pelo comportamento das aves e pela orientação técnica da integradora."
  },
  {
    "type": "faq",
    "items": [{ "question": "Como saber se os pintinhos estão com frio?", "answer": "..." }]
  },
  {
    "type": "product_relation",
    "familySlug": "slug-real-da-familia",
    "note": "Conheça as variações disponíveis para cotação."
  }
]
```

Os valores do exemplo são ilustrativos. Use sempre os dados das suas fontes.
