# 20 — Recomendações Resolvidas (L-08 a L-15)

Origem: `USER_DECISION` — 2026-08-01. Textos normativos aprovados pelo usuário.
Correspondência em `01-approved-decisions.md`: **D-031 a D-038**.
Estas decisões encerram a Etapa 0: **não há mais bloqueio para iniciar a Etapa 1.**

---

## L-08 → D-031 — Tipografia

A fonte pública oficial da primeira versão será **exclusivamente Montserrat**.

**Montserrat Alternates não está aprovada** para uso no site, no painel administrativo, em peças
sociais geradas pelo sistema ou em materiais públicos derivados.

- Permanece armazenada apenas como ativo de referência interno.
- Não deve ser carregada, importada ou incluída no design system.
- Não deve ser usada em títulos, banners, artigos, botões ou peças geradas pelo painel.
- Qualquer uso futuro depende de proposta visual específica e **aprovação expressa**.

Justificativa: o branding define Montserrat como fonte, mas não atribui função à variante
Alternates; permitir seu uso sem regra criaria inconsistência visual.

---

## L-09 → D-032 — Vocabulário gráfico

O "grafismo em V" **não representa um novo elemento a ser criado**. O termo identifica
exclusivamente o **padrão gráfico secundário** já presente no branding oficial da AviZee,
composto pela repetição de formas associadas à identidade.

| Elemento | Definição |
|---|---|
| Símbolo principal | Galo integrado ao elemento mecânico/engrenagem |
| Grafismo secundário | Padrão repetitivo usado como textura ou apoio visual, **separado do símbolo** |

**Usos permitidos** (sempre discretos e subordinados ao logotipo): fundos, faixas institucionais,
banners, placeholders, capas de artigos, áreas de CTA, materiais sociais.

**Proibido**: competir com o logotipo; reduzir a legibilidade; preencher todas as seções; ser usado
como novo ícone; substituir o símbolo do galo; ser redesenhado, reinterpretado ou recriado.

Encerra a divergência **DIV-06**.

---

## L-10 → D-033 — Imagens com marca de terceiro

Produtos com **dados confiáveis** podem ser publicados na v1 mesmo quando a única imagem
disponível estiver reprovada por exibir marca de terceiro. Nesses casos:

- a imagem original **não** será entregue ao frontend;
- será utilizado o **placeholder oficial** "Imagem em atualização";
- a imagem é classificada como `PENDENTE_MARCA_VISÍVEL` e fica como referência interna;
- é registrada uma **pendência de nova fotografia**;
- o SKU permanece disponível para busca e cotação.

O produto só permanece como **rascunho** quando, além da imagem inadequada, os dados técnicos ou
a identidade também não forem confiáveis.

**Ordem de prioridade para nova fotografia**: 1) produtos em destaque · 2) vacinação ·
3) itens mais consultados · 4) peças recorrentes · 5) medição e pesagem · 6) demais itens.

---

## L-11 → D-034 — Precedência de imagens

Os três conjuntos — **PNG na raiz**, **JPG em `A/`** e **72 JPG do site atual** — são fontes
concorrentes de referência. **Não existe precedência global por pasta.**

A imagem principal é escolhida individualmente **por SKU ou família**, nesta ordem de critério:

1. ausência de marca de terceiro;
2. correspondência correta com o produto;
3. qualidade;
4. resolução útil;
5. nitidez;
6. enquadramento e fundo;
7. ausência de textos, preços e selos;
8. clareza do direito de uso.

**Duplicatas idênticas (só o formato difere)**: manter o arquivo de maior qualidade como fonte
interna — preferencialmente PNG quando preservar melhor o conteúdo ou houver transparência útil;
publicar **WebP otimizado**; JPG/PNG como fallback apenas quando necessário; nunca publicar todas
as cópias simultaneamente.

**Códigos divergentes**: o nome do arquivo **não comprova** a associação com o SKU. A associação é
validada na matriz produto × imagem; não há renomeação automática; até a validação a imagem fica
`NÃO_CONFIRMADA`.

**Site atual**: as 72 imagens são fonte adicional de migração e comparação — estar publicada não
significa estar correta, autorizada ou com melhor qualidade.

---

## L-12 → D-035 — Neutralização de marcas

Os produtos associados a marcas de terceiros **permanecem candidatos à v1**, desde que possam ser
identificados por função e especificação.

O grupo público **"SOCOREX" é substituído por "Seringas automáticas e componentes"**.

Nomes públicos descrevem exclusivamente: **função, capacidade, medida, aplicação, tipo e código
AviZee**. Marcas, fabricantes, linhas comerciais e referências originais existem somente em campos
internos protegidos (D-012). **A busca pública não indexa nem usa a marca de terceiro, nem como
sinônimo oculto.**

### Normalização de nomes

| Nome original | Nome público |
|---|---|
| Kit da seringa Socorex 0,5 ml | Kit de reparo para seringa automática 0,5 ml |
| Seringa Socorex 0,5 ml | Seringa automática 0,5 ml |
| Seringa Socorex dupla | Seringa automática dupla |
| Soquete seringa Socorex 0,5–1 ml | Soquete para seringa automática 0,5–1 ml |
| União de pontas Socorex dupla | União de pontas para seringa automática dupla |
| Cilindro graduado Socorex | Cilindro graduado para seringa automática |
| `LM001` Lâmina reta BC | Lâmina reta para debicagem |
| `LM002` Lâmina de repasse KH | Lâmina de repasse para debicagem |
| `LM003` | Lâmina em corte V para debicagem |

**Bicos**: descritos por cor, padrão de pulverização, ângulo, vazão (quando confirmada), aplicação
e código AviZee. Nunca por fabricante ou linha comercial.

**`BV005` e casos análogos**: identificar a função, registrar a especificação confirmada, criar
nome público neutro, manter a designação original apenas internamente e usar placeholder quando a
imagem expuser a marca.

---

## L-13 → D-036 — Governança de códigos

O **SKU não é a chave primária técnica**. Cada produto ou variação recebe um identificador interno
imutável (UUID).

### Campos obrigatórios do registro

`id` (UUID imutável) · `sku_publico` · `codigo_original` · `fonte_codigo` · `aliases_internos` ·
`status_validacao` · histórico de alterações.

### Política de resolução de conflitos

| Situação | Tratamento |
|---|---|
| Mesmo código, mesmo produto | Consolidar em um único SKU; preservar todas as fontes; nomes antigos viram aliases internos |
| Mesmo código, produtos diferentes | Registros internos provisórios separados; nenhum publicado com o código conflitante; status `BLOQUEADO_POR_DIVERGÊNCIA`; pedir confirmação comercial; **não inventar novo código** |
| Códigos diferentes, mesmo produto | Manter ambos; relacionar como suspeita de duplicidade; não apagar nem substituir silenciosamente; consolidar só com evidência |

**Casos concretos**
- `AG025` × `AG026`: não escolher por sequência numérica. Preservar os dois registros de origem,
  marcar a divergência, impedir publicação duplicada e solicitar o código canônico.
- `AG016` duplicado e `AG022` conflitante: IDs internos separados, código público bloqueado,
  fonte e descrição preservadas; resolver antes de publicar aquela variação.
- `PE`/`VR` duplicados: verificar se são códigos distintos para o mesmo item, código antigo,
  família vs. SKU, ou erro de transcrição. Até a confirmação, permanecem como aliases ou registros
  provisórios, sem consolidação automática.
- **Balanças**: divergência apenas de nome **não bloqueia** o SKU quando capacidade e precisão
  identificam a variação. Modelar como família ("Balança suspensa digital") + capacidade +
  resolução/precisão + tipo de uso + SKU; nomes comerciais divergentes viram aliases internos.

Conflitos **não** são corrigidos por inferência, sequência numérica ou conveniência. Nenhum SKU é
renumerado publicamente sem decisão expressa. **DIV-10 a DIV-16 não bloqueiam a modelagem do
banco — bloqueiam apenas a publicação dos registros afetados.**

---

## L-14 → D-037 — Catálogo complementar

Os ~55 SKUs exclusivos do catálogo complementar (conexões `CN`, peças `PE`, bombas `BO`,
baterias `BT`, tubulações, automação, reposição) **fazem parte do escopo da v1** quando seus dados
mínimos forem confiáveis. Reforçam diretamente o diferencial aprovado **variedade especializada**.

**Condições**: podem ser publicados com placeholder; não precisam aparecer na Home; não exigem
página editorial extensa; devem ser encontráveis por busca e por código; devem ser agrupados por
família; recebem descrições apenas com dados confirmados; permanecem em rascunho quando o código
ou a identidade estiverem conflitantes.

**Visibilidade na v1**: famílias principais na navegação; complementares no catálogo e na busca;
itens sem imagem não entram em "Produtos em destaque"; peças muito específicas podem ter páginas
mais objetivas; itens "diversos — consultar" geram **contato**, nunca um SKU fictício.

---

## L-15 → D-038 — PDF atual do catálogo

O PDF em `/assets/docs/catalogo.pdf` é **aposentado como documento público** na implantação do
novo site: está desatualizado, contém marcas de terceiros e nomenclaturas a neutralizar, não
acompanha o catálogo navegável, gera conflito com o site e é indexável.

**Tratamento**
- preservar cópia privada como referência histórica (**não apagar sem backup**);
- remover da navegação pública e impedir indexação;
- **301 permanente da URL antiga para `/produtos`**;
- atualizar links internos e externos controlados.

**Novo PDF futuro** (opcional): gerado da mesma base do site, sem marcas de terceiros, com
branding oficial, data/versão visível, sem preços, apontando para o site e informando que
disponibilidade e condições dependem de cotação.

---

## Efeito sobre a Etapa 0

Nenhum bloqueio remanescente. As divergências de SKU seguem como **pendências de dados**, já com
tratamento técnico e editorial definido. Continuam abertas: L-01 a L-07, O-01 a O-20, O-24
(WOFF2), O-26 (versões do logotipo) e O-27 (credencial SMTP exposta).
