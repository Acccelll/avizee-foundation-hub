# 64 — Matriz Família → Aplicação

Dados: **`data/family-applications.csv`** — 108 relações (43 principais + 65 secundárias).

## 1. Regra

Cada família tem **exatamente uma** aplicação principal e zero ou mais secundárias, todas
extraídas do vocabulário controlado de 23 termos de `61-approved-category-baseline.md`.
**Nenhum termo novo foi criado.**

Aplicação ≠ categoria ≠ solução:

- **Categoria** é o agrupamento estável do catálogo (6, aprovadas).
- **Aplicação** é o processo em que o item é usado (vocabulário controlado, vira filtro).
- **Solução** é uma página editorial que reúne famílias e conteúdos em torno de uma necessidade.

## 2. Aplicações principais em uso

| Aplicação | Famílias | SKUs | Indexável como página? |
|---|---|---|---|
| vacinação | 9 | 36 | SIM (SOL-01) |
| circulação de fluidos | 4 | 24 | NÃO — filtro |
| pesagem | 4 | 12 | SIM (SOL-03) |
| aplicação | 4 | 12 | NÃO — filtro |
| pulverização | 2 | 10 | SIM (SOL-02) |
| hidratação | 2 | 5 | NÃO — filtro |
| controle de pragas | 2 | 4 | NÃO — filtro |
| monitoramento | 2 | 4 | NÃO — filtro |
| manejo | 2 | 2 | NÃO — filtro |
| manutenção | 1 | 2 | NÃO — filtro |
| reposição | 1 | 9 | NÃO — filtro |
| controle de temperatura | 1 | 4 | NÃO — filtro |
| alimentação | 1 | 4 | NÃO — filtro |
| biossegurança | 1 | 3 | NÃO — filtro |
| qualidade da água | 1 | 3 | NÃO — filtro |
| debicagem | 1 | 3 | NÃO — filtro |
| qualidade do ambiente | 1 | 1 | NÃO — filtro |
| ovoscopia | 1 | 1 | NÃO — filtro |
| — (não classificada) | 3 | 34 | — |

Três famílias (`FAM-019`, `FAM-021`, `FAM-032`) **não recebem aplicação**: nenhuma fonte declara
função. Deixá-las sem aplicação é o registro honesto; atribuir "manutenção" por conveniência seria
inferência frágil.

## 3. Aplicações do vocabulário sem família associada

`incubação` · `inspeção` · `automação` · `ar comprimido` · `medição`

Aparecem apenas como **aplicações secundárias**. Nenhuma família tem essas como aplicação
principal. Consequência prática: não devem gerar filtro de primeiro nível nem página na v1, o que
é coerente com a recomendação de 3 páginas de solução. Se `PE` e `CN` forem destravados,
`automação` e `ar comprimido` provavelmente ganham famílias.

## 4. Sinônimos de busca registrados

Registrados como sinônimos **internos** de busca, nunca como aplicações públicas nem como
termos indexáveis:

| Termo digitado | Resolve para |
|---|---|
| cânula, agulha hipodérmica | vacinação / FAM-001, FAM-002 |
| nozzle, bico spray | pulverização / FAM-014 |
| engate, luva, cotovelo | circulação de fluidos / FAM-016–FAM-018 |
| pesar frango, peso de ave | pesagem / FAM-022, FAM-023 |
| ovoscópio | ovoscopia / FAM-029 |
| debicador, lâmina de bico | debicagem / FAM-031 |

Marcas de terceiros **não** entram como sinônimo (DEC-08, R-05, RK-01).

## 5. Solução relacionada por família

| Solução | Famílias | Status |
|---|---|---|
| SOL-01 Soluções para vacinação | 13 | Página indexável proposta |
| SOL-02 Soluções para pulverização | 8 | Página indexável proposta |
| SOL-03 Soluções para pesagem, medição e controle | 9 | Página indexável proposta |
| SOL-04 Reposição e manutenção | 2 | Sem página na v1 — conteúdo insuficiente |
| SOL-05 Manejo e biossegurança | 7 | Sem página na v1 — avaliar na Etapa 3 |
| SOL-06 Linhas complementares | 4 | Sem página; acesso por categoria e filtro |

Status de todas as linhas: **PROPOSTA_PENDENTE_DE_APROVAÇÃO**.
