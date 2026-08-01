# 70 — Prontidão para a Etapa 3 por Família

Dados: **`data/stage-03-readiness.csv`** — 43 linhas.

## 1. Critérios (§14)

Uma família está pronta quando tem nome funcional provisório, SKUs associados, categoria,
aplicação principal, segmento, atributos principais, política de imagem, status de publicação,
nível de confiança e ausência de conflito estrutural não documentado.

**Não bloqueiam**: ausência de fotografia; ausência de descrição extensa; conflito isolado em
um SKU.

## 2. READY_FOR_STAGE_3 — 25 famílias · 70 SKUs

FAM-001 Agulhas descartáveis · FAM-004 Agulhas para aplicador · FAM-005 Seringas automáticas de
fluxo contínuo · FAM-006 Seringas automáticas duplas · FAM-007 Vacinadoras com porta-frasco ·
FAM-008 Kits de reparo · FAM-009 Seringas descartáveis · FAM-015 Tubulações e mangueiras ·
FAM-022 Balanças suspensas e dinamômetros · FAM-023 Balanças eletrônicas para aves ·
FAM-024 Balanças para ovos · FAM-025 Balanças de precisão de bolso · FAM-026 Termômetros ·
FAM-027 Qualidade da água · FAM-028 Qualidade do ambiente · FAM-033 Bebedouros ·
FAM-034 Comedouros · FAM-035 Niples · FAM-036 Armadilhas · FAM-037 Adesivos e colas ·
FAM-038 Contadores manuais · FAM-039 Consumíveis de assepsia · FAM-040 Tuberculina ·
FAM-042 Seringas para insulina · FAM-043 Imãs intra-ruminais.

Observação: FAM-001 contém `AG005`, bloqueado por DIV-0101. A família segue pronta com os outros
9 SKUs (D-036).

## 3. READY_WITH_PENDING_CONTENT — 6 famílias · 27 SKUs

| Família | Pendência |
|---|---|
| FAM-002 Agulhas inox reutilizáveis | 3 SKUs com divergência de medida (AG016, AG019, AG022) |
| FAM-013 Equipos para aplicação e infusão | Categoria pode ser CAT-05 — DECT-04 |
| FAM-014 Bicos pulverizadores | 5 SKUs com divergência + `BI999` como CTA; nomes de variação a confirmar |
| FAM-029 Equipamentos para ovoscopia | 1 SKU; conteúdo mínimo publicável a redigir |
| FAM-030 Câmeras termográficas | 1 SKU; conteúdo mínimo publicável a redigir |
| FAM-031 Lâminas para debicagem | Nomes "BC", "KH", "corte V" precisam de tradução funcional |

Estas famílias podem entrar no design system: a estrutura é conhecida, falta texto.

## 4. BLOCKED_BY_CODE — 1 família · 3 SKUs

**FAM-003 Agulhas quadradas.** `AG025` e `AG026` compartilham a medida `10 X 08` e `AG026` não
tem nome. Sobra `AG020` limpo. Liberar exige confirmar se são um ou dois produtos.

## 5. BLOCKED_BY_IDENTITY — 4 famílias · 19 SKUs

FAM-010, FAM-011, FAM-012 (15 SKUs `SR`) e FAM-041 (`BV005`).

Todas dependem da **renomeação funcional item a item** exigida por R-05/D-035. O nome de família
já é neutro; o que falta é o nome público de cada SKU. `BV006` e `BV007` não têm marca no nome e
podem ser destravados isoladamente se o usuário preferir.

## 6. BLOCKED_BY_MISSING_DATA — 7 famílias · 55 SKUs

| Família | SKUs | O que falta |
|---|---|---|
| FAM-016 Conexões em L | 9 | Nome de produto; confirmar categoria (CAT-02 ou CAT-04) |
| FAM-017 Conexões retas e passa-muros | 9 | Idem |
| FAM-018 Conexões em T | 1 | Idem |
| FAM-019 Conexões não identificadas | 3 | Nome e função |
| FAM-020 Sistemas de pulverização | 2 | Nome e função ("SPRAY CARRINHO"/"SPRAY GALPÃO" são rótulos, não nomes) |
| FAM-021 Bombas | 3 | Nome e função — só existe o prefixo `BO` |
| FAM-032 Peças e componentes | 28 | Nome e função dos 28 códigos `PE` |

## 7. Conclusão sobre a liberação da Etapa 3

**31 famílias (72%) e 97 SKUs (56%)** têm taxonomia suficiente. Elas cobrem as seis categorias
aprovadas e todos os tipos de página previstos em `47-page-type-definitions.md`: há família com
1 SKU e família com 12, família com variação de medida e família com variação de capacidade,
família com imagem e família sem imagem, família de avicultura e família complementar.

`TECHNICAL_INFERENCE` — Raciocínio: o design system precisa de **casos representativos**, não do
catálogo completo. As 31 famílias prontas exercitam todos os padrões de layout e filtro. As 12
famílias bloqueadas não introduzem nenhum padrão novo — introduzem os mesmos padrões com dados
faltantes, o que a política de completude progressiva (D-041) já cobre.

Portanto, a recomendação é: **DEP-01 pode ser encerrado com a aprovação das 31 famílias prontas**,
mantendo as 12 restantes em fila. Isso não é decisão automática — depende da aprovação expressa
prevista em §23 e registrada como **DECT-10**.

## Atualização 2026-08-01 — status de aprovação

As famílias classificadas aqui como prontas foram **aprovadas** por D-052 (DECT-01 parcial):
**31 famílias / 97 SKUs**. As 12 restantes permanecem `PENDENTE_DE_APROVAÇÃO` e em fila de
normalização (D-054). `data/stage-03-readiness.csv` ganhou a coluna `status_aprovacao`.
Lista nominal em `73-stage-03-start-blocker.md` §7.1.
