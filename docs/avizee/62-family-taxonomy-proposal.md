# 62 — Proposta de Taxonomia de Famílias

Dados: **`data/families-taxonomy.csv`** — 43 famílias, 29 colunas, cobrindo os 174 SKUs.

> Nenhuma linha deste documento é decisão aprovada. Todas as classificações são propostas
> sujeitas a `66-taxonomy-decisions-for-approval.md`.

## Como ler

- **Evidência**: `SOURCE_EXPLICIT` = a função está escrita no nome do produto em pelo menos uma
  fonte. `INFERENCE_MEDIUM` = só há medida/código; a leitura é plausível mas contestável.
  `UNCLASSIFIED` = nenhuma fonte permite classificar.
- **Status**: `CONFIRMADA_POR_FONTE` · `PROPOSTA_PENDENTE_DE_APROVAÇÃO` · `BLOQUEADA` ·
  `NÃO_CLASSIFICADA`.
- Todas as famílias dependem de **DEP-01** e exigem aprovação, mesmo as `CONFIRMADA_POR_FONTE`
  — a fonte confirma a **função**, não a **atribuição de categoria**, que é decisão de arquitetura.

---

## Bloco A — CAT-01 Vacinação e aplicação (13 famílias · 55 SKUs)

| ID | Família proposta | SKUs | Qtd | Aplicação principal | Evidência | Conf. | Status |
|---|---|---|---|---|---|---|---|
| FAM-001 | Agulhas descartáveis | AG001–AG010 | 10 | vacinação | SOURCE_EXPLICIT | ALTA | CONFIRMADA |
| FAM-002 | Agulhas inox reutilizáveis | AG011–AG019, AG022–AG024 | 12 | vacinação | SOURCE_EXPLICIT | ALTA | CONFIRMADA |
| FAM-003 | Agulhas quadradas | AG020, AG025, AG026 | 3 | vacinação | SOURCE_EXPLICIT | MÉDIA | PROPOSTA |
| FAM-004 | Agulhas para aplicador de vacina | AG021 | 1 | vacinação | SOURCE_EXPLICIT | ALTA | CONFIRMADA |
| FAM-005 | Seringas automáticas de fluxo contínuo | AZ002, AZ003 | 2 | vacinação | SOURCE_EXPLICIT | ALTA | CONFIRMADA |
| FAM-006 | Seringas automáticas duplas | AZ001 | 1 | vacinação | SOURCE_EXPLICIT | ALTA | CONFIRMADA |
| FAM-007 | Vacinadoras com porta-frasco | AZ004 | 1 | vacinação | SOURCE_EXPLICIT | ALTA | CONFIRMADA |
| FAM-008 | Kits de reparo para seringas automáticas | AZ005, AZ006 | 2 | manutenção | SOURCE_EXPLICIT | ALTA | CONFIRMADA |
| FAM-009 | Seringas descartáveis | SE001–SE005 | 5 | aplicação | SOURCE_EXPLICIT | ALTA | CONFIRMADA |
| FAM-010 | Seringas automáticas de precisão (linha importada) | SR003, SR005, SR006, SR012 | 4 | vacinação | SOURCE_EXPLICIT | ALTA | **BLOQUEADA** |
| FAM-011 | Cilindros graduados para seringas automáticas | SR001, SR008, SR009 | 3 | vacinação | SOURCE_EXPLICIT | ALTA | **BLOQUEADA** |
| FAM-012 | Componentes e reposição para seringas automáticas | SR002, SR004, SR007, SR010, SR011, SR025–SR027, SR029 | 9 | reposição | SOURCE_EXPLICIT | MÉDIA | **BLOQUEADA** |
| FAM-013 | Equipos para aplicação e infusão | VR002, VR008 | 2 | aplicação | SOURCE_EXPLICIT | MÉDIA | PROPOSTA |

**Notas do bloco A**
- FAM-003: `AG026` chega sem nome e com medida `10X08`, idêntica à de `AG025`. A família é
  plausível, o SKU é conflito (`TXC`). Bloqueio no registro, não na família.
- FAM-010/011/012: 15 dos 16 SKUs `SR` trazem marca de terceiro no nome original. A família é
  legítima; o que bloqueia é a **renomeação funcional** exigida por R-05/D-035, cuja tabela
  normativa está em `20-resolved-recommendations.md` e precisa ser confirmada item a item.
- FAM-013 pode alternativamente pertencer a CAT-05 (manejo). Decisão **DECT-04**.

---

## Bloco B — CAT-02 Pulverização e sistemas de fluido (8 famílias · 40 SKUs)

| ID | Família proposta | SKUs | Qtd | Aplicação principal | Evidência | Conf. | Status |
|---|---|---|---|---|---|---|---|
| FAM-014 | Bicos pulverizadores | BI001–BI007 (+BI999) | 8 | pulverização | SOURCE_EXPLICIT | MÉDIA | PROPOSTA |
| FAM-015 | Tubulações e mangueiras | TB001, TB003–TB005, TB007 | 5 | circulação de fluidos | SOURCE_EXPLICIT | ALTA | CONFIRMADA |
| FAM-016 | Conexões em L | CN001–CN008, CN019 | 9 | circulação de fluidos | INFERENCE_MEDIUM | BAIXA | PROPOSTA |
| FAM-017 | Conexões retas e passa-muros | CN009–CN011, CN013, CN016–CN018, CN020, CN021 | 9 | circulação de fluidos | INFERENCE_MEDIUM | BAIXA | PROPOSTA |
| FAM-018 | Conexões em T | CN015 | 1 | circulação de fluidos | INFERENCE_MEDIUM | BAIXA | PROPOSTA |
| FAM-019 | Conexões não identificadas | CN012, CN014, CN026 | 3 | — | UNCLASSIFIED | BAIXA | **NÃO CLASSIFICADA** |
| FAM-020 | Sistemas de pulverização (carrinho e galpão) | BT001, BT002 | 2 | pulverização | INFERENCE_MEDIUM | BAIXA | PROPOSTA |
| FAM-021 | Bombas | BO001–BO003 | 3 | — | UNCLASSIFIED | BAIXA | **NÃO CLASSIFICADA** |

**Notas do bloco B**
- `BI999` = "DIVERSOS — CONSULTAR". Conforme D-040 **não é SKU**: vira CTA de cotação dentro da
  família. Registrado como conflito `ITEM_NAO_E_SKU`, não publicável.
- FAM-016/017/018: a única evidência é a descrição de rosca/tubo na coluna `medida`
  (`L 1/2 TB 10MM`, `T 1/2`, `1/8 X TB 6MM FEMEA`). A geometria é legível; a **aplicação avícola**
  não é declarada em nenhuma fonte. Podem também pertencer a CAT-04. Decisão **DECT-05**.
- FAM-021 "Bombas" existe apenas como suposição do prefixo `BO`. Sem nome em nenhuma fonte,
  **não recebe categoria nem aplicação** — o prefixo não é evidência (§24 do prompt).

---

## Bloco C — CAT-03 Pesagem, medição e controle (9 famílias · 22 SKUs)

| ID | Família proposta | SKUs | Qtd | Aplicação principal | Evidência | Conf. | Status |
|---|---|---|---|---|---|---|---|
| FAM-022 | Balanças suspensas e dinamômetros para aves | BA003, BA004, BA008 | 3 | pesagem | SOURCE_EXPLICIT | ALTA | CONFIRMADA |
| FAM-023 | Balanças eletrônicas para aves | BA005, BA006, BA009, BA010, BA013 | 5 | pesagem | SOURCE_EXPLICIT | ALTA | CONFIRMADA |
| FAM-024 | Balanças para ovos | BA007, BA011, BA014 | 3 | pesagem | SOURCE_EXPLICIT | ALTA | CONFIRMADA |
| FAM-025 | Balanças de precisão de bolso | BA012 | 1 | pesagem | SOURCE_EXPLICIT | ALTA | CONFIRMADA |
| FAM-026 | Termômetros | TE001–TE004 | 4 | controle de temperatura | SOURCE_EXPLICIT | ALTA | CONFIRMADA |
| FAM-027 | Medidores e testes de qualidade da água | VR003, VR004, VR011 | 3 | qualidade da água | SOURCE_EXPLICIT | ALTA | CONFIRMADA |
| FAM-028 | Testes de qualidade do ambiente | VR001 | 1 | qualidade do ambiente | SOURCE_EXPLICIT | ALTA | CONFIRMADA |
| FAM-029 | Equipamentos para ovoscopia | VR012 | 1 | ovoscopia | SOURCE_EXPLICIT | MÉDIA | PROPOSTA |
| FAM-030 | Câmeras termográficas | VR013 | 1 | monitoramento | SOURCE_EXPLICIT | MÉDIA | PROPOSTA |

**Notas do bloco C**
- FAM-025 (`BA012`, mini balança de bolso 100 g) não menciona aves nem ovos. Manter separada
  evita poluir uma família avícola com um item genérico. Decisão **DECT-06**: manter separada,
  fundir em FAM-024 ou excluir da v1.
- FAM-026 mistura termômetro para vacina, ambiente e espeto para aves. Todos medem temperatura
  e compartilham filtros — não desmembrar por medida (R-AG-1). Se o usuário quiser páginas
  distintas por uso, isso é **DECT-07**.

---

## Bloco D — CAT-04 Peças, reposição e automação (2 famílias · 31 SKUs)

| ID | Família proposta | SKUs | Qtd | Aplicação principal | Evidência | Conf. | Status |
|---|---|---|---|---|---|---|---|
| FAM-031 | Lâminas para debicagem | LM001–LM003 | 3 | debicagem | SOURCE_EXPLICIT | ALTA | CONFIRMADA |
| FAM-032 | Peças e componentes — não identificados | 28 códigos `PE` | 28 | — | UNCLASSIFIED | BAIXA | **NÃO CLASSIFICADA** |

**Notas do bloco D — a maior lacuna do catálogo**

Os 28 SKUs `PE` (PE004, PE006–PE010, PE013, PE016, PE028–PE031, PE037, PE039, PE041, PE045,
PE047, PE048, PE062–PE066, PE075–PE079) chegam **sem nome de produto em nenhuma das três fontes**.
Cinco deles (PE075–PE079) têm imagem localizada, mas §16 proíbe inferir especificação por
aparência.

Isso torna impossível cumprir a subdivisão pedida em §5 do prompt (controladores, filtros,
fotocélulas, cabos, motores, termômetros, bombas, componentes, ferramentas) sem inventar dado.
FAM-032 é uma **família-contêiner de trabalho**, não uma família publicável. Ela sai do catálogo
da v1 e só é destravada com a lista código × nome fornecida pela AviZee — decisão **DECT-08**.

CAT-04 fica, portanto, com **uma única família publicável na v1**. Isso é uma constatação a
registrar, não um motivo para alterar a categoria aprovada.

---

## Bloco E — CAT-05 Manejo, alimentação e biossegurança (7 famílias · 17 SKUs)

| ID | Família proposta | SKUs | Qtd | Aplicação principal | Evidência | Conf. | Status |
|---|---|---|---|---|---|---|---|
| FAM-033 | Bebedouros pendulares para aves | BB001–BB004 | 4 | hidratação | SOURCE_EXPLICIT | ALTA | CONFIRMADA |
| FAM-034 | Comedouros para aves | CO001–CO004 | 4 | alimentação | SOURCE_EXPLICIT | ALTA | CONFIRMADA |
| FAM-035 | Niples para bebedouro | VR007 | 1 | hidratação | SOURCE_EXPLICIT | ALTA | CONFIRMADA |
| FAM-036 | Armadilhas para roedores | AR001, AR003 | 2 | controle de pragas | SOURCE_EXPLICIT | ALTA | CONFIRMADA |
| FAM-037 | Adesivos e colas para captura | AR002, AR004 | 2 | controle de pragas | SOURCE_EXPLICIT | ALTA | CONFIRMADA |
| FAM-038 | Contadores manuais para aves | VR010 | 1 | manejo | SOURCE_EXPLICIT | ALTA | CONFIRMADA |
| FAM-039 | Consumíveis de assepsia e apoio | VR005, VR006, VR009 | 3 | biossegurança | SOURCE_EXPLICIT | ALTA | CONFIRMADA |

**Notas do bloco E**
- FAM-035 (niple) poderia ser peça de reposição (CAT-04). Foi mantido junto de bebedouros porque
  a jornada de compra é a mesma. Decisão **DECT-09**.
- FAM-036 e FAM-037 são separadas porque uma é equipamento reutilizável e outra é consumível —
  filtros e frequência de recompra diferentes.

---

## Bloco F — CAT-06 Linhas complementares (4 famílias · 9 SKUs)

| ID | Família proposta | SKUs | Qtd | Aplicação principal | Segmento | Evidência | Conf. | Status |
|---|---|---|---|---|---|---|---|---|
| FAM-040 | Conjunto para aplicação de tuberculina | BV001–BV004 | 4 | aplicação | Bovinocultura | SOURCE_EXPLICIT | ALTA | CONFIRMADA |
| FAM-041 | Monitores e analisadores portáteis | BV005, BV006, BV007 | 3 | monitoramento | Bovinocultura | SOURCE_EXPLICIT | ALTA | **BLOQUEADA** |
| FAM-042 | Seringas para insulina | BV008 | 1 | aplicação | Bovinocultura | SOURCE_EXPLICIT | ALTA | CONFIRMADA |
| FAM-043 | Imãs intra-ruminais | BV009 | 1 | manejo | Bovinocultura | SOURCE_EXPLICIT | ALTA | CONFIRMADA |

**Notas do bloco F**
- A categoria "Linhas complementares" **está preservada** e recebeu conteúdo real: 4 famílias,
  9 SKUs. Ela não foi convertida em filtro.
- FAM-041 está bloqueada por `BV005`, cujo nome original expõe marca de terceiro (R-05/D-035).
  `BV006` e `BV007` não têm esse problema e poderiam ser liberados isoladamente.
- Nenhum SKU de **suinocultura** foi encontrado em qualquer fonte. O segmento permanece "sob
  consulta", sem produto associado.
