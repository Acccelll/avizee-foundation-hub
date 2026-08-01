# 36 — Duplicidades e Divergências

Dados: `data/duplicates.csv` (5 registros) e `data/divergences.csv` (10 registros).
**Nada foi reconciliado.** Cada item é apresentado com as fontes em conflito e a decisão pendente.

## Duplicidades

| ID | Tipo | Itens | Evidência | Tratamento |
|---|---|---|---|---|
| DUP-0001 | Imagem | `BA005` · `BA006` · `BA010` · `BA013` | MD5 idêntico | evidência de agrupamento por família (D-019) |
| DUP-0002 | Imagem | `SR005` · `SR006` | MD5 idêntico | idem |
| DUP-0003 | Imagem | `SR008` · `SR009` | MD5 idêntico | idem |
| DUP-0004 | Imagem | `TB004` · `TB005` | MD5 idêntico | idem |
| DUP-0005 | Código | `AG016` | duas ocorrências no catálogo complementar | **bloqueia o registro** (D-036) |

## Divergências entre fontes

Todas de severidade **ALTA**, todas com o mesmo tratamento: o registro fica em rascunho até
confirmação do usuário (D-036), sem afetar os demais SKUs.

| ID | SKU | Valores em conflito |
|---|---|---|
| DIV-0101 | AG005 | `25 X 8` vs. `8 X 25` |
| DIV-0102 | AG016 | `06 X 10` vs. `10 X 10` |
| DIV-0103 | AG019 | `12 X 10` vs. `12 X 10 AGULHA APLICADOR` |
| DIV-0104 | AG022 | `04 X 08` vs. `04 X 08 PARA VACINA` vs. `10 X 08` |
| DIV-0105 | BI002 | `BICO PULVERIZ VERDE LEQUE` vs. `VERDE LEQUE 80015 BD` |
| DIV-0106 | BI003 | `BICO PULVERIZADOR` vs. `VERMELHO TX-VK6°` |
| DIV-0107 | BI004 | `BICO PULVERIZADOR` vs. `LARANJA LEQUE 8001 BD` |
| DIV-0108 | BI005 | `AMARELO LEQUE 8002 BD` vs. `BICO PULVERIZADOR` |
| DIV-0109 | BI006 | `AZUL CONE CHEIO` vs. `BICO PULVERIZADOR AZUL` vs. `LARANJA RC 80°` |
| DIV-0110 | BI999 | `BICO PULVERIZADOR` vs. `DIVERSOS - CONSULTAR` |

### Leitura dos dois grupos

- **AG005 / AG016 / AG019 / AG022** — divergência de **medida**. Não é possível decidir por
  inspeção qual valor está correto; exige confirmação com o fornecedor.
- **Família BI (bicos)** — o CSV do site guarda o rótulo genérico "BICO PULVERIZADOR" enquanto o
  catálogo guarda a especificação real (cor, tipo de leque, código técnico). `BI006` é o caso
  mais grave: três descrições incompatíveis para um mesmo código.

`TECHNICAL_INFERENCE` — Raciocínio: na família BI o catálogo é claramente mais informativo que o
CSV, mas adotá-lo automaticamente violaria a regra de não reconciliar em silêncio. Fica como
recomendação, não como decisão.

## Divergências herdadas da Etapa 0

DIV-01 a DIV-17 permanecem válidas em `03-source-inventory.md`. DIV-06 e DIV-17 foram resolvidas
por D-032 e D-035.
