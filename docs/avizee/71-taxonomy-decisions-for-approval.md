# 71 — Decisões Taxonômicas para Aprovação

Dados: **`data/taxonomy-decisions.csv`**. Salvo indicação em contrário, todas com status
**PENDENTE_DE_APROVAÇÃO** e não executadas.

**Atualização 2026-08-01**: DECT-01 e DECT-10 foram respondidas pelo usuário. Ver
`73-stage-03-start-blocker.md` §7 e as decisões D-052 a D-055 em `01-approved-decisions.md`.

---

### DECT-01 — Aprovar o conjunto das 43 famílias propostas — **APROVADA PARCIALMENTE**
**Status**: `APROVADA_PARCIALMENTE_31_FAMILIAS_97_SKUS` (2026-08-01, `USER_DECISION`).
**Decisão**: aprovadas **31 famílias / 97 SKUs**, com nome funcional, associação de SKUs,
categoria pública, segmento, aplicação principal e aplicações secundárias confirmadas. As
**12 famílias restantes** (FAM-003, 010, 011, 012, 016 a 021, 032, 041) seguem pendentes.
**As 43 famílias não foram aprovadas em bloco.** Lista nominal em `73` §7.1.
**Contexto original**: `62-family-taxonomy-proposal.md`. 174 SKUs → 43 famílias em 6 categorias.
**Impacto**: libera o desmembramento base para a Etapa 3 dentro do escopo aprovado.


### DECT-02 — Desmembramento do prefixo `AG` em 4 famílias
**Contexto**: 26 SKUs `AG` → descartáveis, inox, quadradas, para aplicador.
**Alternativas**: (A) 4 famílias; (B) 2 famílias (descartáveis × reutilizáveis); (C) 1 família "Agulhas".
**Recomendação**: A. **Riscos**: C produz uma página com 26 variações e filtros incompatíveis
(descartável não tem medida de rosca).

### DECT-03 — Desmembramento do prefixo `VR` em 8 famílias e 4 categorias
**Contexto**: `VR` era rotulado "OUTROS" e reunia fita de amônia, equipos, soro, gaze, niple,
contador, pHmetro, lanterna de ovoscopia e câmera termográfica.
**Recomendação**: aprovar o desmembramento. **Riscos**: manter `VR` unido criaria uma família
sem sentido funcional e sem filtro possível.

### DECT-04 — Categoria de FAM-013 Equipos para aplicação e infusão
**Alternativas**: (A) CAT-01 Vacinação e aplicação; (B) CAT-05 Manejo, alimentação e biossegurança.
**Recomendação**: A. **Motivo**: o equipo é instrumento de aplicação, não de manejo.
**Decisão necessária**: sim — a fonte não resolve.

### DECT-05 — Categoria das famílias de conexão (FAM-016 a FAM-019)
**Alternativas**: (A) CAT-02 Pulverização e sistemas de fluido; (B) CAT-04 Peças, reposição e
automação; (C) dividir conforme o uso real, quando conhecido.
**Recomendação**: C, com A como posição provisória. **Riscos**: A pode colocar peça de ar
comprimido dentro da linha de pulverização. **Dependências**: DECT-08.

### DECT-06 — FAM-025 Balanças de precisão de bolso
**Contexto**: `BA012`, 100 g, sem menção a aves ou ovos.
**Alternativas**: (A) família própria; (B) fundir em FAM-024 Balanças para ovos; (C) excluir da v1.
**Recomendação**: A. **Riscos**: B cria uma família cujo nome mente sobre um dos seus itens.

### DECT-07 — Desmembramento de FAM-026 Termômetros
**Contexto**: reúne termômetro para vacina, de ambiente, para aves e tipo espeto.
**Alternativas**: (A) família única com filtro de uso; (B) três famílias por uso.
**Recomendação**: A, por R-AG-1 e por volume (4 SKUs). **Riscos**: B gera páginas finas (RK-19).

### DECT-08 — Destravamento dos 34 SKUs sem nome (`PE`, `CN` parcial, `BO`) — **crítica**
**Contexto**: `62` §Bloco D e `69` §9. Nenhuma das 8 fontes nomeia esses códigos.
**Alternativas**: (A) a AviZee fornece a lista código × nome × função; (B) excluí-los da v1;
(C) classificá-los por prefixo.
**Recomendação**: A, com B como plano de contingência. **C é rejeitada** — viola §24.
**Impacto**: é a única dependência real para 100% de cobertura taxonômica.

### DECT-09 — Categoria de FAM-035 Niples para bebedouro
**Alternativas**: (A) CAT-05 junto de bebedouros; (B) CAT-04 como peça de reposição.
**Recomendação**: A, pela jornada de compra compartilhada.

### DECT-10 — Liberação parcial da Etapa 3 com 31 famílias — **APROVADA COM ESCOPO CONTROLADO**
**Status**: `APROVADA_COM_ESCOPO_CONTROLADO` (2026-08-01, `USER_DECISION`).
**Decisão**: a Etapa 3 está liberada para criar o design system e todos os tipos de página,
usando como conteúdo real apenas as 31 famílias, os 97 SKUs, as 6 categorias públicas, as 7
categorias editoriais, as aplicações aprovadas e as imagens aprovadas ou o placeholder oficial.
Estados genéricos de conteúdo bloqueado são permitidos desde que não revelem produtos pendentes.
**Contexto**: `70` §7. **Detalhe integral**: `73-stage-03-start-blocker.md` §7.2.


### DECT-11 — Nomes públicos funcionais dos 16 SKUs com marca de terceiro
**Contexto**: FAM-010, FAM-011, FAM-012, FAM-041. Os nomes de **família** já são neutros; falta o
nome público de cada SKU.
**Alternativas**: (A) aplicar a tabela normativa de `20-resolved-recommendations.md` item a item;
(B) publicar só a família, sem nome por variação.
**Recomendação**: A. **Dependências**: confirmação do usuário sobre cada linha da tabela.

### DECT-12 — Página de solução por aplicação
**Contexto**: `64` §5. Três aplicações concentram famílias suficientes (vacinação 9,
pesagem 4, pulverização 2).
**Alternativas**: (A) 3 páginas (SOL-01, SOL-02, SOL-03); (B) 6, uma por solução;
(C) nenhuma, só filtros.
**Recomendação**: A. **Riscos**: B cria páginas com 2 famílias (RK-19).
**Observação**: coerente com DEC-07, que segue pendente.

### DECT-13 — Regra de coexistência entre CAT-06 e o filtro de segmento
**Contexto**: `65` §4, com DEC-05 **não aplicada**.
**Recomendação**: aprovar as 6 regras propostas — URL canônica sob a categoria, filtro de
segmento não indexável, sem promoção na Home, selo textual no card.
**Impacto**: define como "Linhas complementares" convive com o atributo de segmento sem
duplicar navegação.

### DECT-14 — FAM-032 fora do catálogo da v1
**Contexto**: 28 SKUs `PE` sem nome.
**Alternativas**: (A) manter fora do catálogo público até DECT-08; (B) publicar como
"peças sob consulta" com CTA de cotação, sem nome.
**Recomendação**: A. **Riscos**: B cria 28 registros sem conteúdo mínimo publicável e contraria
o princípio P-7.

---

## Casos que exigem decisão individual (§17)

Apenas estes fogem da aprovação por família:

| Caso | SKUs | Pergunta |
|---|---|---|
| Divergência de medida | AG005, AG016, AG022 | Qual medida é a correta? |
| Identidade duplicada | AG025 × AG026 | São o mesmo produto? |
| Família ambígua | AG019 | É agulha inox ou agulha para aplicador? |
| Variação de bico | BI002–BI006 | Confirmar cor/ângulo/modelo de cada código |
| Item não-SKU | BI999 | Confirmar tratamento como CTA (D-040) |
| Registro órfão | SR029 | Qual produto é? |
| Marca no nome | BV005 | Confirmar nome funcional substituto |

Todos os demais 160 SKUs podem ser validados **por família**.
