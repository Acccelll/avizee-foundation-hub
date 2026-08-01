# 61 — Linha de Base das Categorias Aprovadas

Este documento fixa o que **não pode ser alterado** na Etapa 2.1 e registra formalmente a não
aplicação de DEC-05 e DEC-18.

## 1. Categorias públicas de produto — vigentes e imutáveis

`USER_DECISION` — Fonte: `07-product-taxonomy.md`, reconfirmada em 2026-08-01.

| ID | Categoria | Status |
|---|---|---|
| CAT-01 | Vacinação e aplicação | APROVADA — vigente |
| CAT-02 | Pulverização e sistemas de fluido | APROVADA — vigente |
| CAT-03 | Pesagem, medição e controle | APROVADA — vigente |
| CAT-04 | Peças, reposição e automação | APROVADA — vigente |
| CAT-05 | Manejo, alimentação e biossegurança | APROVADA — vigente |
| CAT-06 | **Linhas complementares** | APROVADA — vigente |

Proibido renomear, fundir, remover, substituir ou reordenar como decisão definitiva sem
aprovação expressa. Problemas identificados viram recomendação pendente, nunca alteração.

## 2. Categorias editoriais — vigentes e imutáveis

`USER_DECISION` — 7 categorias, reconfirmadas em 2026-08-01.

1. Guias e boas práticas
2. Vacinação e aplicação
3. Equipamentos e manutenção
4. Incubação e manejo
5. Curiosidades da avicultura
6. Notícias e mercado
7. Produtos e aplicações

Proibido reduzir para três principais mais uma transversal.

## 3. Segmentos vigentes

| Segmento | Papel | Tratamento na v1 |
|---|---|---|
| Avicultura | Principal | Máximo destaque |
| Bovinocultura | Complementar | Catálogo e busca, via CAT-06; sem destaque na Home |
| Suinocultura | Complementar e pontual | Sob consulta; nenhum SKU identificado nas fontes |

## 4. Estrutura conceitual preservada

```text
SEGMENTO → SOLUÇÃO/APLICAÇÃO → CATEGORIA → FAMÍLIA → VARIAÇÃO/SKU
```

As matrizes desta etapa são apresentadas com a família como linha (ordem operacional), mas
preservam as cinco dimensões.

## 5. DEC-05 — NÃO_APLICADA

| Campo | Registro |
|---|---|
| Proposta original | Converter a categoria "Linhas complementares" em filtro de segmento e distribuir os itens `BV` nas categorias funcionais |
| Impacto se aplicada | Alteraria a lista de 6 categorias aprovada em `07-product-taxonomy.md`; obrigaria a reclassificar 9 SKUs `BV`; mudaria URLs previstas em `45-url-architecture.md` |
| Motivo da não aplicação | Alterava categoria aprovada sem autorização |
| Decisão vigente | "Linhas complementares" **permanece como categoria pública aprovada**. O campo `segmento` coexiste como atributo e filtro, sem substituir a categoria |
| Arquivos afetados | `07-product-taxonomy.md`, `48-product-discovery-architecture.md`, `58-stage-02-decisions-for-approval.md`, `13-open-decisions.md`, `16-change-log.md`, `data/stage-02-decisions.csv` |
| Data | 2026-08-01 |
| Estado | Encerrada como **NÃO_APLICADA** — não fica aguardando aplicação silenciosa |

## 6. DEC-18 — NÃO_APLICADA

| Campo | Registro |
|---|---|
| Proposta original | Reduzir as 7 categorias editoriais a 3 principais + 1 condicional, transformando "Curiosidades" em tag e não publicando "Notícias e mercado" e "Produtos e aplicações" como categoria |
| Impacto se aplicada | Alteraria a taxonomia editorial aprovada em `08-content-strategy.md`; removeria 4 categorias do sitemap editorial |
| Motivo da não aplicação | Alterava categorias editoriais aprovadas sem autorização |
| Decisão vigente | As **7 categorias editoriais permanecem íntegras** |
| Arquivos afetados | `08-content-strategy.md`, `51-content-hub-architecture.md`, `58-stage-02-decisions-for-approval.md`, `13-open-decisions.md`, `16-change-log.md`, `data/stage-02-decisions.csv` |
| Data | 2026-08-01 |
| Estado | Encerrada como **NÃO_APLICADA** |

## 7. Vocabulário controlado de aplicações

23 termos aprovados para análise: vacinação · aplicação · pulverização · pesagem · medição ·
incubação · ovoscopia · controle de temperatura · qualidade da água · qualidade do ambiente ·
manutenção · reposição · automação · ar comprimido · alimentação · hidratação · biossegurança ·
controle de pragas · manejo · debicagem · circulação de fluidos · inspeção · monitoramento.

**Nenhum termo novo foi criado nesta etapa.** Todas as 43 famílias foram classificadas dentro
desse vocabulário. Sinônimos registrados para busca interna (não indexáveis, não públicos como
aplicação): "agulha/cânula", "bico/nozzle", "conexão/engate", "balança/pesagem".
