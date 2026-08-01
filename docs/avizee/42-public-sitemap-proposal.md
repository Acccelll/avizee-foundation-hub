# 42 — Sitemap Público Proposto

Status: `PENDENTE_DE_APROVAÇÃO` · Dados: `data/sitemap.csv`

Classificação usada: `OBRIGATÓRIA_V1` · `RECOMENDADA_V1` · `EVOLUÇÃO` · `NÃO_RECOMENDADA` ·
`DECISÃO_NECESSÁRIA`.

## Árvore proposta

```text
/
├── produtos                                   OBRIGATÓRIA_V1
│   └── {slug-categoria}                       OBRIGATÓRIA_V1   (6 categorias)
│       └── {slug-familia}                     OBRIGATÓRIA_V1   (página canônica do produto)
│           └── {slug-sku}                     DECISÃO_NECESSÁRIA (só por exceção — ver 45 §4)
├── solucoes                                   RECOMENDADA_V1
│   └── {slug-solucao}                         RECOMENDADA_V1   (máx. 4 na v1)
├── conteudos                                  OBRIGATÓRIA_V1
│   ├── {slug-categoria-editorial}             OBRIGATÓRIA_V1
│   ├── {slug-artigo}                          OBRIGATÓRIA_V1
│   ├── autores/{slug-autor}                   EVOLUÇÃO
│   └── busca                                  NÃO_RECOMENDADA (usar busca global)
├── busca                                      RECOMENDADA_V1   (não indexável)
├── cotacao                                    OBRIGATÓRIA_V1   (não indexável)
├── cotacao/enviada                            OBRIGATÓRIA_V1   (não indexável)
├── sobre                                      OBRIGATÓRIA_V1
├── contato                                    OBRIGATÓRIA_V1
├── politica-de-privacidade                    OBRIGATÓRIA_V1
├── politica-de-cookies                        RECOMENDADA_V1
├── termos-de-uso                              RECOMENDADA_V1
└── 404                                        OBRIGATÓRIA_V1   (não indexável)
```

## Avaliação das páginas adicionais sugeridas

| Página | Classificação | Justificativa |
|---|---|---|
| `/segmentos` (hub) | **NÃO_RECOMENDADA** | Cria um segundo catálogo paralelo. Segmento é filtro e selo (D-003, P-3) |
| `/avicultura` | **NÃO_RECOMENDADA na v1** | A Home **é** a página de avicultura. Uma página separada canibaliza a Home e duplica conteúdo |
| `/bovinocultura` | **EVOLUÇÃO** | Só 9 SKUs (`BV`). Entra quando houver texto próprio e ≥ 3 famílias classificadas |
| `/suinocultura` | **NÃO_RECOMENDADA** | "Sob consulta" (D-003). Seção pública vazia é proibida pelo P-7. Tratar como linha no `/contato` e selo em produtos compatíveis |
| Central de materiais | **EVOLUÇÃO** | Não há ficha técnica, manual ou catálogo publicável (PDF aposentado por D-038; RK-18) |
| FAQ global | **DECISÃO_NECESSÁRIA** | Útil para "como funciona a cotação", mas exige texto aprovado. Alternativa: bloco de FAQ dentro de `/cotacao` e `/contato`, sem página própria |
| Busca global `/busca` | **RECOMENDADA_V1** | Serve às jornadas J-1, J-4 e J-8. `noindex` |
| Resultados de busca indexáveis | **NÃO_RECOMENDADA** | Conteúdo fino e duplicado |
| "Produto não encontrado" | **OBRIGATÓRIA_V1**, como **estado** de `/busca` e `/produtos`, não como URL | Evita URL vazia |
| Confirmação de cotação | **OBRIGATÓRIA_V1** (`/cotacao/enviada`, `noindex`) | Precisa de URL própria para o protocolo e para medição |
| Status de solicitação sem autenticação | **NÃO_RECOMENDADA** | Expõe dado de lead por URL adivinhável (RK-11) |
| Autores | **EVOLUÇÃO** | D-043 prevê poucos artigos na largada; página de autor nasceria fina |
| Tags públicas | **NÃO_RECOMENDADA na v1** | Sobreposição com categorias editoriais e risco de páginas vazias |
| Glossário | **EVOLUÇÃO** | Alto potencial de SEO de cauda longa, mas depende de dado técnico (RK-18) |

## Volumetria estimada da v1

| Tipo | Qtd. estimada | Base |
|---|---|---|
| Institucional + legal + utilitária | 9 | esta proposta |
| Categorias de produto | 6 | `07-product-taxonomy.md` |
| Famílias | 18 a 30 | 20 prefixos em `data/products-provisional.csv`, com PE, VR e CN a subdividir (D-042) |
| Páginas de SKU | 0 a 5 | somente exceções do critério de `45` §4 |
| Soluções | 3 a 4 | vacinação, pulverização, pesagem e medição, incubação e ovoscopia |
| Categorias editoriais | 3 a 5 | ver `51` |
| Artigos | 2 a 6 | D-043 |
| **Total indexável estimado** | **~45 a 60** | — |

Nenhuma dessas páginas é criada nesta etapa.
