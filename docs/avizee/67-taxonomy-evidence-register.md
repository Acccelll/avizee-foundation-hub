# 67 — Registro de Evidências da Taxonomia

Dados: **`data/taxonomy-evidence.csv`** — 43 registros, um por família.

## 1. Classes de evidência utilizadas

| Classe | Famílias | SKUs | Significado |
|---|---|---|---|
| `SOURCE_EXPLICIT` | 36 | 132 | A função está escrita no nome do produto em pelo menos uma fonte |
| `SOURCE_DERIVED` | — | 174 | Herança de segmento/categoria do SKU a partir da família (aplicado no nível do SKU) |
| `INFERENCE_HIGH` | 0 | 0 | Não utilizada: quando havia nome, ele era explícito |
| `INFERENCE_MEDIUM` | 4 | 21 | Só há rosca/medida ou descrição parcial; leitura plausível mas contestável |
| `INFERENCE_LOW` | 0 | 0 | Não utilizada: casos frágeis foram rebaixados a `UNCLASSIFIED` |
| `UNCLASSIFIED` | 3 | 34 | Nenhuma fonte permite classificar |
| `BLOCKED_BY_DIVERGENCE` | — | 10 | Aplicado no nível do SKU (DIV-0101 a DIV-0110) |

`TECHNICAL_INFERENCE` — Raciocínio para não usar `INFERENCE_HIGH`: a distinção entre "evidência
forte no nome" e "nome explícito" é artificial neste catálogo. Quando existe nome, ele declara a
função ("BALANÇA ELETRÔNICA PARA OVOS", "ARMADILHA PARA ROEDORES"). Quando não existe nome, não
há evidência forte alguma. O meio-termo, por isso, ficou vazio — e isso é um sinal de qualidade
da fonte, não de método.

## 2. Exemplos de registro

**SOURCE_EXPLICIT**
```text
Alvo: FAM-024 Balanças para ovos
Afirmação: pertence a "Pesagem, medição e controle", aplicação "pesagem", segmento Avicultura
Citação: "BALANÇA ELETRÔNICA PARA OVOS" (BA007) | "MINI BALANÇA ELETRONICA PARA OVOS" (BA011)
Localização: catálogo publicado + catálogo complementar + produtos.csv
Raciocínio: o nome do produto declara objeto (ovos) e função (pesagem)
```

**INFERENCE_MEDIUM**
```text
Alvo: FAM-016 Conexões em L
Afirmação: pertence a "Pulverização e sistemas de fluido", aplicação "circulação de fluidos"
Citação: coluna medida — "L 1/2 TB 10MM", "L 1/4 TB 6 MM C/ ABA", "L 3/8 X TB 10MM"
Raciocínio: a notação descreve rosca e diâmetro de tubo, o que caracteriza conexão pneumática
           ou hidráulica em L. A fonte NÃO declara a aplicação avícola nem se o item pertence
           à linha de pulverização ou à de ar comprimido. Poderia pertencer a CAT-04.
Status: PROPOSTA_PENDENTE_DE_APROVAÇÃO
```

**UNCLASSIFIED**
```text
Alvo: FAM-032 Peças e componentes — não identificados (28 SKUs PE)
Afirmação: nenhuma
Citação: SEM NOME EM QUALQUER FONTE
Raciocínio: existe apenas o código. O prefixo PE não é evidência (§24). Classificar por
           prefixo produziria uma taxonomia inventada, exatamente o risco que a Etapa 2.1
           foi criada para evitar.
Status: NÃO_CLASSIFICADA
```

## 3. Rastreabilidade

Cada linha do CSV traz `fonte`, `localizacao` (página do catálogo ou origem CSV), `citacao`
literal e `raciocinio`. Nenhuma afirmação foi registrada sem esses quatro campos preenchidos —
quando não havia citação, o campo recebe explicitamente `SEM NOME EM QUALQUER FONTE`.

## 4. Uso das imagens como evidência

Conforme §16, as imagens foram consultadas apenas para **identidade e agrupamento**:

- confirmaram que `AG011`/`AG012` são a mesma família com medidas diferentes;
- confirmaram que `BB001`–`BB004` compartilham o mesmo desenho com capacidades diferentes;
- **não** foram usadas para atribuir categoria, aplicação ou especificação a `PE075`–`PE079`,
  que têm imagem mas nenhum nome;
- 11 imagens seguem com marca visível de terceiro e permanecem em quarentena (D-048).

Nenhuma imagem está aprovada. `possui_imagem_aprovada = NAO` em todas as 43 famílias.
