# 66 — Relações Família ↔ Categorias Editoriais

Dados: **`data/family-editorial-relations.csv`** — 122 relações.

> As **7 categorias editoriais aprovadas permanecem intactas** (DEC-18 NÃO_APLICADA). Este
> documento apenas **relaciona** famílias e aplicações a elas. Nenhum artigo foi criado.

## 1. Regra

Uma relação editorial **não altera** a categoria de produto. Ela existe para:

- sugerir conteúdo relevante na página de família;
- sugerir produtos relacionados na página de artigo;
- orientar a pauta futura da Central de Conteúdos.

Todas as relações são `RECOMENDADA` — nenhuma fonte declara vínculo editorial, portanto nenhuma
é `CONFIRMADA`. Confiança MÉDIA, status `PROPOSTA_PENDENTE_DE_APROVAÇÃO`.

## 2. Mapa por categoria de produto

| Categoria de produto | Categorias editoriais relacionadas |
|---|---|
| CAT-01 Vacinação e aplicação | Vacinação e aplicação · Guias e boas práticas · Produtos e aplicações |
| CAT-02 Pulverização e sistemas de fluido | Equipamentos e manutenção · Guias e boas práticas · Produtos e aplicações |
| CAT-03 Pesagem, medição e controle | Incubação e manejo · Guias e boas práticas · Produtos e aplicações |
| CAT-04 Peças, reposição e automação | Equipamentos e manutenção · Produtos e aplicações |
| CAT-05 Manejo, alimentação e biossegurança | Incubação e manejo · Guias e boas práticas · Produtos e aplicações |
| CAT-06 Linhas complementares | Notícias e mercado · Produtos e aplicações |

## 3. Categorias editoriais sem relação de produto

**Curiosidades da avicultura** não recebeu vínculo com nenhuma família. Isso é correto e
intencional: é uma categoria de topo de funil, editorial pura, sem âncora de catálogo. Ela
**permanece aprovada e ativa** — a ausência de relação com produto não é motivo para removê-la
nem para rebaixá-la a tag.

## 4. Exemplo de leitura

```text
Família: FAM-001 Agulhas descartáveis
Aplicação: vacinação
Categorias editoriais relacionadas:
  - Vacinação e aplicação   (RECOMENDADA)
  - Guias e boas práticas   (RECOMENDADA)
  - Produtos e aplicações   (RECOMENDADA)
Categoria de produto: CAT-01 — inalterada
```

## 5. O que não foi feito

- Nenhum artigo redigido.
- Nenhuma pauta aprovada.
- Nenhuma categoria editorial criada, renomeada, fundida ou removida.
- Nenhuma tag transversal criada em substituição a categoria.
