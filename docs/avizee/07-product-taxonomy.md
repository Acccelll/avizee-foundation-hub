# 07 — Taxonomia de Produtos

## Estrutura conceitual aprovada
`USER_DECISION`

```text
SEGMENTO
  └── SOLUÇÃO / APLICAÇÃO
        └── CATEGORIA
              └── FAMÍLIA DE PRODUTO
                    └── VARIAÇÃO / SKU
```

Exemplo aprovado:

```text
Avicultura
  └── Vacinação
        └── Agulhas
              └── Agulha inox
                    └── 10 × 10 — AG011
```

## Segmentos
`USER_DECISION`

| Segmento | Papel | Destaque |
|---|---|---|
| Avicultura | Principal | Máximo — Home, navegação, institucional |
| Bovinocultura | Complementar | Reduzido |
| Suinocultura | Complementar, inicialmente **sob consulta** | Reduzido |

## Soluções / Aplicações
`USER_DECISION` — vacinação · pulverização · pesagem · medição · incubação · ovoscopia ·
controle de temperatura · qualidade da água · qualidade do ambiente · manutenção · reposição ·
automação · ar comprimido · alimentação · hidratação · biossegurança · manejo.

## Categorias principais
`USER_DECISION`
1. Vacinação e aplicação
2. Pulverização e sistemas de fluido
3. Pesagem, medição e controle
4. Peças, reposição e automação
5. Manejo, alimentação e biossegurança
6. Linhas complementares

## Famílias identificadas (ponto de partida)
`USER_DECISION` — **não substitui a auditoria detalhada do catálogo** (bloqueada, ver T-15).

Vacinação e aplicação: agulhas descartáveis · agulhas inox · agulhas quadradas · agulhas para
aplicadores · seringas automáticas · seringas duplas · vacinadoras · cilindros graduados ·
kits e componentes.

Pulverização e sistemas de fluido: bicos pulverizadores · bombas · tubulações · conexões em L ·
conexões retas · conexões em T · conexões em Y · reguladores · filtros.

Pesagem, medição e controle: balanças para aves · balanças para ovos · termômetros ·
controladores · câmeras termográficas · lanternas para ovoscopia · medidores · sensores · contadores.

Peças, reposição e automação: fotocélulas · cabos · motores · motorredutores · lâminas · engates.

Manejo, alimentação e biossegurança: bebedouros · comedouros · armadilhas · consumíveis auxiliares.

## Regras de agrupamento
`USER_DECISION`
- **R-AG-1**: variações visual e funcionalmente semelhantes pertencem à mesma família e são
  apresentadas em uma única página com seletor de variações.
- **R-AG-2**: proibido criar um card público separado por medida quando a família resolver.
- **R-AG-3**: a variação carrega o código público (ex.: `AG011`) e os atributos diferenciadores
  (medida, capacidade, unidade de fornecimento).
- **R-AG-4**: nomes públicos de famílias e variações são funcionais e neutros (R-05).

## Evidências do catálogo atual
`CURRENT_SITE` — códigos observados na Home do site atual, úteis como amostra de padrão de
codificação (prefixo alfabético + sequencial):

| Código | Nome atual | Família provável | Variação |
|---|---|---|---|
| AG001 | Agulha descartável — 100 un | Agulhas descartáveis | 13 × 45 |
| AG011 | Agulha inox | Agulhas inox | 10 × 10 |
| AG020 | Agulha quadrada | Agulhas quadradas | 10 × 10 |
| AG021 | Agulha aplicador para vacina | Agulhas para aplicadores | Peça |
| AR001 | Armadilha para roedores | Armadilhas | Peça |
| AR002 | Adesivo para roedores | Armadilhas / consumíveis | Peça |
| AR003 | Armadilha túnel | Armadilhas | Peça |
| AR004 | Adesivo cola 450×155 mm | Consumíveis auxiliares | 450×155 mm |
| AZ001 | Seringa dupla AviZee fluxo contínuo | Seringas duplas | Peça |
| AZ002 | Seringa AviZee fluxo contínuo | Seringas automáticas | Peça |
| AZ003 | Seringa AviZee bouba aviária | Seringas automáticas | Peça |
| AZ004 | Vacinadora AviZee com porta frasco | Vacinadoras | Peça |

`TECHNICAL_INFERENCE` — Raciocínio: o prefixo `AG` agrupa agulhas, `AR` armadilhas/adesivos e `AZ`
itens de marca própria AviZee. Isso sugere que o código atual mistura **família** e **marca**, o que
precisa ser validado contra `catalogo.pdf` antes de virar chave de dados. **Não** tratar o prefixo
como categoria oficial sem essa validação.

## Rotas públicas (esboço conceitual — não implementado)
`LOVABLE_RECOMMENDATION` — Status: **PENDENTE_DE_APROVAÇÃO**

```text
/produtos
/produtos/[categoria]
/produtos/[categoria]/[familia]
/solucoes/[solucao]
/conteudos/[slug]
/cotacao
```
Slugs sempre neutros e sem marcas de terceiros (R-05).

## Etapa 2 — proposta de aplicação da taxonomia
`LOVABLE_RECOMMENDATION` — Status: **PENDENTE_DE_APROVAÇÃO**. Detalhe em
`48-product-discovery-architecture.md` e `45-url-architecture.md`.

- Segmento **não** vira menu nem hub: é filtro, selo e campo do produto (DEC-09).
- Das 17 aplicações, **3 a 4** ganham página indexável; as demais permanecem como filtro,
  sinônimo de busca ou tópico editorial (DEC-07).
- A **família** é a unidade canônica de página; variação de medida não gera URL (DEC-06).
- ~~DEC-05 (converter "Linhas complementares" em filtro)~~ — **REJEITADA pelo usuário em
  2026-08-01**. A categoria permanece na lista de 6. Os itens `BV` continuam sob ela.

## Etapa 2.1 — as 6 categorias permanecem, agora com famílias

`USER_DECISION` (lista de categorias) + `LOVABLE_RECOMMENDATION` (famílias, **PENDENTE_DE_APROVAÇÃO**).

A lista de 6 categorias **não foi alterada**. A Etapa 2.1 apenas a preencheu com 43 famílias
estruturais, resolvendo o bloqueio DEP-01 como proposta. Detalhe em
`62-family-taxonomy-proposal.md`.

| Categoria | Famílias | SKUs |
|---|---|---|
| CAT-01 Vacinação e aplicação | 13 | 44 |
| CAT-02 Pulverização e sistemas de fluido | 8 | 46 |
| CAT-03 Pesagem, medição e controle | 9 | 26 |
| CAT-04 Peças, reposição e automação | 2 | 31 |
| CAT-05 Manejo, alimentação e biossegurança | 7 | 18 |
| CAT-06 Linhas complementares | 4 | 9 |

A classificação família → categoria → aplicação → segmento existe agora como **proposta** e
cobre 100% dos SKUs em associação e 80,5% em classificação completa. DEP-01 só é encerrado
com a aprovação de DECT-01 e DECT-10 (`71-taxonomy-decisions-for-approval.md`).

