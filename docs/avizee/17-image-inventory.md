# 17 — Inventário de Imagens (acervo "Mercado Livre")

Origem: `IMAGE_ASSET` — arquivo `Mercado Livre.zip` recebido em 2026-07-31.
Total: **110 arquivos** · 60 PNG na raiz + 50 JPG na subpasta `A/`.

> Classificação feita por **inspeção visual em painel de contato**. Cada item precisa de
> confirmação individual em alta resolução antes da publicação. Nenhuma imagem foi copiada
> para o projeto nesta etapa.

## Estrutura do acervo

| Conjunto | Formato | Qtd | Observação |
|---|---|---|---|
| Raiz | PNG (fundo branco/transparente) | 60 | Recortes mais limpos; um arquivo em minúsculas (`ag020.png`) |
| `A/` | JPG (fundo branco) | 50 | Conjunto parcialmente sobreposto ao da raiz |

**Códigos por prefixo — raiz**: AG(8) AR(4) BA(6) BB(4) BV(8) CO(1) LM(1) PE(4) SE(1) SR(10) TB(3) TE(1) VR(9)
**Códigos por prefixo — `A/`**: AR(4) AZ(6) BA(6) BV(4) LM(1) SR(11) TB(4) TE(3) VR(11)

`AZ` (linha própria AviZee) aparece **somente** em `A/`. `AG`, `BB`, `CO`, `PE`, `SE` aparecem
**somente** na raiz.

## Duplicatas exatas (mesmo arquivo, códigos diferentes)
`IMAGE_ASSET`

| Arquivos idênticos | Leitura |
|---|---|
| `A/BA005` = `A/BA006` = `A/BA010` = `A/BA013` | Uma foto servindo 4 SKUs de balança — candidato natural a `APROVADA_PARA_FAMÍLIA` (regra I-4) |
| `A/TB004` = `A/TB005` | Mesma tubulação em duas medidas |
| `A/SR008` = `A/SR009` | Mesmo componente de reposição |
| `A/SR005` = `A/SR006` | Mesma vacinadora |

`TECHNICAL_INFERENCE` — Raciocínio: arquivos com hash MD5 idêntico significam que o acervo **já
trata** essas variações como visualmente indistinguíveis. Isso confirma empiricamente a regra de
agrupamento por família (D-019) e a política de imagem ilustrativa (D-023).

## Pendências por marca de terceiro visível
`IMAGE_ASSET` — status **`PENDENTE_MARCA_VISÍVEL`** (não publicáveis sem tratamento; ver R-05).

| Código(s) | Onde a marca aparece |
|---|---|
| `SR001`, `SR008`, `SR009` (A/) | Marca impressa na embalagem do componente |
| `BA004` (raiz), `BA011`, `BA014` (A/) | Marca no corpo/visor da balança |
| `BA005`, `BA006`, `BA010`, `BA013` (A/) e `BA006` (raiz) | Marca no visor do dinamômetro |
| `BA009` (raiz) | Marca no mostrador da balança de relógio |
| `BV005` (raiz e A/) | Marca no medidor digital |
| `VR001` (raiz e A/) | Marca no frasco de tiras de teste |
| `VR005` (raiz e A/) | Marca no rótulo da garrafa |
| `VR009` (raiz e A/) | Marca no sachê |
| `TB001` (A/) | Marca na lata de spray |
| `LM002` (A/), `LM003` (raiz) | Gravação na lâmina |
| `TE001` (raiz e A/) | Texto de marca no visor |

**Importante** (D-021): não remover a marca digitalmente quando isso alterar a aparência real do
produto. O caminho correto para estes itens é **nova fotografia** ou publicação com placeholder
oficial enquanto a foto não existe (I-1).

## Pendências de qualidade / padronização
`IMAGE_ASSET` — status **`PENDENTE_BAIXA_QUALIDADE`**

| Código(s) | Problema |
|---|---|
| `BA009`, `CO001`, `LM003` (raiz) | Fundo preto, fora do padrão do restante do acervo |
| `LM003` (raiz) | Recorte estreito, baixa definição |
| `ag020.png` | Nome fora do padrão (minúsculas) — corrigir na normalização |

## Candidatos a `APROVADA` (sem marca aparente, fundo limpo)
`IMAGE_ASSET` — sujeitos a conferência em alta resolução.

`AG004` `AG005` `AG006` `AG007` `AG010` `AG011` `AG012` · `AR001` `AR002` `AR003` `AR004` ·
`AZ001` `AZ002` `AZ003` `AZ005` `AZ006` `AZ007` · `BB001` `BB002` `BB003` `BB004` ·
`BV001` `BV002` `BV003` `BV004` `BV008` `BV009` · `PE075` `PE076` `PE078` `PE079` ·
`SE001` · `SR003` `SR004` `SR005` `SR007` `SR010` `SR011` `SR012` `SR025` `SR026` `SR027` `SR029` ·
`TB003` `TB004` `TB005` `TB007` · `TE003` `TE004` ·
`VR002` `VR003` `VR004` `VR006` `VR008` `VR010` `VR011` `VR012` `VR013` · `ag020`

## Regra de prioridade entre os dois conjuntos
`LOVABLE_RECOMMENDATION` — Status: **PENDENTE_DE_APROVAÇÃO**
Quando o mesmo código existir na raiz (PNG) e em `A/` (JPG), preferir o **PNG da raiz** por
recorte e fundo mais limpos, exceto quando a versão `A/` mostrar o produto correto e a raiz não.

## Cobertura
`IMAGE_ASSET` — não é possível calcular a cobertura do catálogo (quantos SKUs têm imagem) porque
`catalogo.pdf` ainda **não foi recebido**. Ver O-21 em `13-open-decisions.md`.

> **Atualizado 2026-08-01**: catálogo recebido — cobertura calculada em `18-catalog-audit.md` e na
> seção abaixo.

---

## Terceiro acervo: imagens do site atual (2026-08-01)

`IMAGE_ASSET` — o código-fonte recebido (S-02) traz **72 JPG** em `assets/img/products/`,
nomeadas em **minúsculas** (`ag001.jpg`, `sr029.jpg`…), uma por código.

**Prefixos**: AG(4) AR(4) AZ(6) BA(7) BB(2) BI(2) BV(9) CO(1) LM(3) SE(1) SR(12) TB(3) TE(4) VR(13)

| Comparação | Resultado |
|---|---|
| Cobertura sobre os 117 SKUs do CSV | **~62%** |
| Cobertura sobre o universo consolidado (~172 SKUs) | **~42%** |
| Famílias sem nenhuma imagem no site | `CN` (conexões), `PE` (peças), `BO` (bombas), `BT` (bateria) — as 55 do catálogo complementar |

`TECHNICAL_INFERENCE` — Raciocínio: o acervo "Mercado Livre" cobre parte das lacunas (tem `PE`,
`SE`, `BB`, `CO`), mas **nenhum dos três acervos cobre `CN`, `BO` e `BT`**. Se L-14 aprovar a
entrada dos 55 SKUs complementares, esses itens entram obrigatoriamente com placeholder (regra I-1).

Passam a existir **três** conjuntos concorrentes para o mesmo código (PNG raiz · JPG `A/` · JPG do
site). A regra de prioridade (L-11) precisa cobrir os três.
