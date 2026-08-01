# 60 — Etapa 2.1: Plano de Consolidação Taxonômica (resolução do DEP-01)

> **Aviso de numeração**: esta etapa foi solicitada como documentos **55 a 67**. Esses números já
> pertencem à Etapa 2 (`55-indexation-and-canonical-strategy.md` … `59-stage-02-executive-report.md`).
> Para não sobrescrever documentação anterior (protocolo do `README.md`), a Etapa 2.1 ocupa
> **60 a 72**. Equivalência: 55→60 · 56→61 · 57→62 · 58→63 · 59→64 · 60→65 · 61→66 · 62→67 ·
> 63→68 · 64→69 · 65→70 · 66→71 · 67→72.
>
> **Aviso de referências**: a lista de pré-condições do prompt cita `21-product-source-inventory.md`,
> `22-provisional-product-matrix.md`, `23-image-inventory.md`, `24-product-image-matrix.md`,
> `32-duplicates-and-divergences.md`, `33-migration-readiness.md`, `37-public-sitemap-proposal.md`,
> `42-page-type-definitions.md`, `43-product-discovery-architecture.md`,
> `44-search-and-filter-architecture.md`, `47-product-content-relationship-model.md`,
> `52-v1-scope-prioritization.md`, `53-stage-02-decisions-for-approval.md` e
> `54-stage-02-executive-report.md`. Os números reais são, respectivamente, **25, 26, 27, 28, 36,
> 37, 42, 47, 48, 49, 52, 57, 58 e 59**. Todos foram lidos.

## 1. Objetivo

Resolver **exclusivamente** o bloqueio DEP-01:

> "A classificação família → categoria → aplicação não existe em nenhuma fonte."

Produzir uma matriz taxonômica rastreável e validável, **sem** alterar decisões aprovadas, sem
implementar nada e sem avançar para a Etapa 3.

## 2. Confirmação do bloqueio DEP-01

`SOURCE_EXPLICIT` — Confirmado. Em `data/products-provisional.csv`, os 174 registros trazem
`aplicacao_confirmada = NAO_CONFIRMADA` e `segmento_confirmado = NAO_CONFIRMADO`. Nenhuma das
8 fontes declara categoria pública, aplicação ou segmento por SKU. A única coluna agrupadora
presente em todas as fontes é o prefixo de duas letras do código, que o próprio
`25-product-source-inventory.md` classifica como **família provisória**, não como taxonomia.

**DEP-01 existe e está aberto.** Esta etapa produz a proposta de resolução; a resolução em si
depende de aprovação do usuário (§23 do prompt).

## 3. Pré-condições verificadas

| Item | Situação |
|---|---|
| Documentação das Etapas 0, 1 e 2 | Lida e consistente |
| `data/products-provisional.csv` (174 SKUs) | Lido integralmente |
| `data/divergences.csv` (10 divergências ALTAS) | Lido |
| `data/images.csv` / `product-image-relations.csv` | Lidos (evidência auxiliar apenas) |
| Catálogo publicado e complementar | Já destilados na matriz provisória da Etapa 1 |
| Conteúdo do site atual | Já destilado em `24-page-and-content-inventory.md` |

Nenhuma inconsistência bloqueante encontrada. Um desvio de numeração foi encontrado e está
documentado no topo deste arquivo, sem interromper a etapa.

## 4. Método

1. **Classificar a família primeiro**; SKU e variação herdam segmento, categoria e aplicação.
2. **Nunca usar o prefixo como evidência única.** O prefixo entra apenas como pista de
   agrupamento e é desmembrado quando reúne funções distintas.
3. **Classificar cada afirmação** em `SOURCE_EXPLICIT`, `SOURCE_DERIVED`, `INFERENCE_HIGH`,
   `INFERENCE_MEDIUM`, `INFERENCE_LOW`, `UNCLASSIFIED` ou `BLOCKED_BY_DIVERGENCE`.
4. **Toda inferência nasce `PROPOSTA_PENDENTE_DE_APROVAÇÃO`.** Nenhuma vira fato.
5. **Bloquear por registro, não por família** (D-036), exceto quando a família inteira carece
   de nome e função em todas as fontes.
6. **Imagem é evidência auxiliar de identidade**, nunca de especificação técnica (§16).
7. **Não criar categoria nova**, não renomear, não fundir e não remover categoria aprovada.

## 5. Regra de desmembramento aplicada

Uma família foi dividida quando reúne funções diferentes, exige filtros incompatíveis, pertence
a categorias distintas ou tem jornada de compra diferente. **Não** foi dividida por medida,
capacidade, cor ou pequena variação técnica.

Aplicações práticas:

- `AG` (26 SKUs) → 4 famílias: descartáveis, inox, quadradas, para aplicador.
- `BA` (12) → 4 famílias: suspensas/dinamômetro, eletrônicas para aves, para ovos, precisão de bolso.
- `SR` (16) → 3 famílias: seringas de precisão, cilindros graduados, componentes de reposição.
- `VR` (13) → 8 famílias distintas, distribuídas por **4 categorias** diferentes — o prefixo
  `OUTROS` não era uma família.
- `CN` (22) → 4 famílias por geometria de conexão, todas com confiança BAIXA.
- `PE` (28) → **não foi subdividido**: nenhuma fonte fornece nome ou função para esses códigos.
  Subdividi-los agora seria inventar dado. Ver §6.

## 6. Limite honesto declarado

§5 do prompt determina subdividir `PE` por família funcional (controladores, filtros, fotocélulas,
cabos, motores, termômetros, bombas, componentes, ferramentas). **Isso não foi executado** porque
os 28 registros `PE` chegam das fontes **sem nome de produto** — apenas código, e em dois casos
uma medida (`PE028` 06 MM, `PE029` 10 MM). O mesmo vale para `CN` parcial, `BO` (3) e `BT` (2).

A subdivisão de `PE` está registrada como **decisão DECT-08**, dependente de o usuário fornecer a
lista nome × código. Enquanto isso, `PE` permanece em uma família-contêiner
`NÃO_CLASSIFICADA`, fora do catálogo da v1.

## 7. Entregáveis desta etapa

Documentos `60` a `72` e oito CSVs em `data/`. Nenhum código, componente, layout, design system,
rota, banco ou importação de produto. `src/` permanece intocado.
