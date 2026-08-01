# 41 — Plano de Arquitetura de Informação (Etapa 2)

> **Numeração**: a Etapa 2 foi solicitada como documentos 36 a 54. Esses números já estavam
> ocupados pela Etapa 1 (36 a 40). Para não sobrescrever registro histórico, a Etapa 2 ocupa
> **41 a 59**. Mapa de equivalência no `README.md`.

> **Status global desta etapa**: `PENDENTE_DE_APROVAÇÃO`. Nada aqui é decisão.
> Nenhuma página, componente, rota, migração, banco de dados ou layout foi criado.

## 1. Pré-condição verificada

| Verificação | Resultado |
|---|---|
| Documentação permanente lida (00 a 20) | Sim |
| Documentos da Etapa 1 lidos (21 a 40) | Sim |
| Etapa 1 concluída | Sim — `39-stage-01-executive-report.md`, respostas em `40-stage-01-answers.md` |
| Decisões aprovadas reabertas | Nenhuma |
| Recomendações tratadas como decisão | Nenhuma |

### Lacunas conhecidas que **não** bloqueiam a arquitetura
São lacunas de **dado**, não de **estrutura**. A arquitetura é definida de forma que a chegada
do dado preencha slots já previstos:

| Lacuna | Origem | Efeito na Etapa 2 |
|---|---|---|
| Sem descrição técnica/aplicação por SKU | RK-18 | Filtros contextuais nascem `DEPENDE_DE_NORMALIZAÇÃO`; páginas de categoria e solução exigem texto próprio antes de indexar |
| Direito de uso das imagens não confirmado | Q-02 | Placeholder é caminho padrão, nunca exceção (D-050) |
| AG005 e AG022 em rascunho | Q-03 | 2 SKUs não publicáveis; não afeta estrutura |
| Contato não confirmado | Q-08 | Rodapé e `/contato` marcam `DADO_PENDENTE` |
| Razão social, CNPJ e canal de privacidade | Q-13 | Páginas legais ficam `INDEXAR_QUANDO_HOUVER_CONTEÚDO` |
| L-01 a L-07 sem aprovação | `13-open-decisions.md` | L-04 (esquema de URLs) é endereçado por `45-url-architecture.md`, ainda como proposta |

### Lacuna que **bloqueia parcialmente**
`ARCHITECTURE_BLOCKER` — a atribuição **SKU → categoria → aplicação** não existe em nenhuma fonte
(Q-06/Q-07 encerradas por decisão de método D-042: segmento e aplicação são definidos na família e
herdados). Isso significa que a Etapa 3 não pode montar o catálogo navegável antes de um passo de
**classificação de famílias**. A arquitetura desta etapa é válida; o preenchimento não é.
Registrado como dependência DEP-01 em `59-stage-02-executive-report.md`.

## 2. Princípios adotados

| # | Princípio | Como se materializa |
|---|---|---|
| P-1 | Clareza | Home responde "o que", "para quem" e "como cotar" acima da dobra |
| P-2 | Busca orientada à necessidade | 5 portas de entrada: código, nome, aplicação, categoria, conteúdo |
| P-3 | Especialização | Avicultura é o eixo da navegação; complementares vivem em filtro e selo, não em menu |
| P-4 | Redução de repetição | Família é a unidade canônica de página; variação é estado, não URL |
| P-5 | Relação entre áreas | Todo produto liga a solução e conteúdo; todo conteúdo liga a produto |
| P-6 | Escalabilidade | Taxonomia de 4 níveis com slugs estáveis e independentes de código |
| P-7 | SEO estrutural | Página só é indexável quando tem conteúdo próprio — nunca para preencher sitemap |

## 3. Modelo conceitual

```text
SEGMENTO (filtro + selo, sem menu próprio)
  └── SOLUÇÃO / APLICAÇÃO  →  /solucoes/{slug}      (curadoria, poucas páginas)
        └── CATEGORIA      →  /produtos/{slug}      (navegação primária do catálogo)
              └── FAMÍLIA  →  /produtos/{cat}/{fam} (página canônica do produto)
                    └── VARIAÇÃO/SKU                (estado interno; URL só por exceção)
```

Entidades públicas: Segmento · Solução · Categoria · Família · Variação · Artigo ·
Categoria editorial · Autor · Página institucional · Lista de cotação.

Entidades internas nunca renderizadas: marca de terceiro, fornecedor, custo, código de origem
conflitante, status editorial, notas internas, lead.

## 4. Fronteira público × interno

`RK-08` — nenhuma consulta pública pode usar `select *`. Todo tipo de página desta etapa declara
explicitamente, em `47-page-type-definitions.md`, os campos que consome. Campos internos
(`campo_interno_marca`, `nivel_confianca`, `observacoes`, `divergencia`, `duplicidade_suspeita`)
são proibidos em props hidratadas, JSON-LD, atributos `alt`, nomes de arquivo e mensagens de
WhatsApp.

## 5. Documentos desta etapa

41 plano · 42 sitemap público · 43 arquitetura administrativa · 44 modelo de navegação ·
45 URLs · 46 migração de URLs · 47 tipos de página · 48 descoberta de produto ·
49 busca e filtros · 50 jornada de cotação · 51 Central de Conteúdos ·
52 modelo produto × conteúdo · 53 jornadas · 54 mobile · 55 indexação ·
56 matriz página × objetivo · 57 priorização da v1 · 58 decisões para aprovação ·
59 relatório executivo.
