# 86 — Protótipos da Interface Administrativa

Status: `PENDENTE_DE_APROVAÇÃO`. Baseado em `43-admin-information-architecture.md`. Wireframes
ASCII de baixa fidelidade, sem modelagem técnica ou de banco. Regra absoluta desta etapa:
**marca de terceiro, campos internos e dado de lead jamais vazam para o frontend público** —
todo componente abaixo assume DTO público explícito e separado do modelo administrativo (`43`).

## 1. Login

```text
┌────────────────────────────────────┐
│            [logo AviZee]            │
│         Painel Administrativo       │
│                                      │
│  E-mail     [                    ]  │
│  Senha      [                    ]  │
│  [ Entrar ]                          │
│  ( Esqueci minha senha )             │
└────────────────────────────────────┘
```
Regras: autenticação restrita a usuários cadastrados internamente; sem cadastro público; bloqueio
por tentativas (fora de escopo técnico desta etapa, apenas requisito conceitual).

## 2. Dashboard (Visão geral)

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ [logo] Painel     Catálogo  Mídia  Conteúdo  Cotações  Operação   [user]│
├──────────────────────────────────────────────────────────────────────────┤
│ VISÃO GERAL                                                               │
│ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐                    │
│ │ SKUs em        │ │ Imagens sem   │ │ Cotações sem   │                   │
│ │ rascunho: 12   │ │ direito de    │ │ resposta: 5    │                   │
│ │                │ │ uso: 7        │ │                │                   │
│ └───────────────┘ └───────────────┘ └───────────────┘                    │
│ ATALHOS: [ Ver fila de normalização ] [ Ver quarentena de imagens ]      │
└──────────────────────────────────────────────────────────────────────────┘
```
Regra: dashboard só exibe contagens agregadas de pendência, nunca dado de lead individual sem
navegar até a área de Cotações com permissão adequada.

## 3. Cotações — lista

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ COTAÇÕES                                    Filtro: [ Status ▾ ] 🔍 Buscar│
├──────────┬───────────────┬──────────┬────────────┬────────────┬─────────┤
│ Protocolo │ Empresa       │ Itens    │ Data       │ Status     │ Ação    │
├──────────┼───────────────┼──────────┼────────────┼────────────┼─────────┤
│ #00123    │ Granja X       │ 4         │ 12/03/2026 │ Sem resp. │ [Abrir] │
│ #00122    │ Avícola Y      │ 2         │ 11/03/2026 │ Respondida│ [Abrir] │
└──────────┴───────────────┴──────────┴────────────┴────────────┴─────────┘
```
Acesso restrito por papel (ver §8). Nenhuma coluna exibe custo, margem ou fornecedor.

## 4. Cotações — detalhe

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ ‹ Cotações      Protocolo #00123                       Status: [▾]      │
├──────────────────────────────────────────────────────────────────────────┤
│ SOLICITANTE                                                               │
│ Nome · Empresa · E-mail · Telefone · Cidade/UF · CNPJ · Cargo · Mensagem │
│ Origem: página X · termo de busca "AG011" · canal: site   (uso interno)  │
├──────────────────────────────────────────────────────────────────────────┤
│ ITENS                                                                     │
│ Agulhas descartáveis — 12x12 (AG011) · Qtd 12 · Obs: "..."               │
│ Balanças eletrônicas para aves — 5kg (BA003) · Qtd 2                     │
│ Item removido do catálogo aparece marcado: "não disponível para cotação" │
├──────────────────────────────────────────────────────────────────────────┤
│ HISTÓRICO DE ATENDIMENTO (notas internas)                                 │
│ [ Adicionar nota ]                                                        │
├──────────────────────────────────────────────────────────────────────────┤
│ [ Marcar como respondida ]   [ Exportar ]                                 │
└──────────────────────────────────────────────────────────────────────────┘
```
Regra: campo "Origem" e "Notas internas" são exclusivamente administrativos — nunca aparecem em
nenhuma superfície pública, mesmo indiretamente (email de confirmação ao cliente não reproduz
essas notas).

## 5. Catálogo — Famílias

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ FAMÍLIAS                          [ + Nova família ]     🔍 Buscar        │
├───────────────┬───────────┬────────────┬────────────┬────────────┬──────┤
│ Nome           │ Categoria │ Variações  │ Status      │ Imagem     │ Ação │
├───────────────┼───────────┼────────────┼────────────┼────────────┼──────┤
│ Agulhas        │ Categ. A  │ 3           │ Publicada   │ Aprovada   │[Editar]│
│ descartáveis   │           │             │             │            │      │
│ Seringas       │ Categ. A  │ 2           │ Publicada   │ Sem imagem │[Editar]│
│ automáticas    │           │             │             │            │      │
└───────────────┴───────────┴────────────┴────────────┴────────────┴──────┘
```

### Detalhe da família → aninha Variações

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ ‹ Famílias   Agulhas descartáveis                     Status: [Publicada▾]│
├──────────────────────────────────────────────────────────────────────────┤
│ Nome funcional público* [ Agulhas descartáveis          ]                │
│ campo_interno_marca      [ (visível apenas aqui, nunca renderizado       │
│                             publicamente) ]                               │
│ Descrição pública        [ textarea ]                                    │
│ Categoria*  [ Categ. A ▾ ]     Aplicações [ Vacinação ]                  │
├──────────────────────────────────────────────────────────────────────────┤
│ VARIAÇÕES (aninhadas)                          [ + Nova variação ]       │
│ ┌──────────┬────────┬─────────┬───────────┬──────────────┬─────────┐    │
│ │ SKU       │ Medida │ Unidade │ Status     │ Divergência   │ Ação    │    │
│ ├──────────┼────────┼─────────┼───────────┼──────────────┼─────────┤    │
│ │ AG010     │ 10x10  │ cx 100  │ Publicada  │ —             │[Editar] │    │
│ │ AG011     │ 12x12  │ cx 100  │ Publicada  │ —             │[Editar] │    │
│ │ AG005     │ 8x8    │ cx 100  │ Bloqueada  │ Conflito de   │[Revisar]│    │
│ │           │        │         │            │ código (D-036)│         │    │
│ └──────────┴────────┴─────────┴───────────┴──────────────┴─────────┘    │
└──────────────────────────────────────────────────────────────────────────┘
```
Regra: variação com status "Bloqueada" nunca é exposta no frontend público, mesmo que a família
esteja publicada (`48` §5, D-036). Coluna "Divergência" e campo `campo_interno_marca` existem
apenas nesta tela.

## 6. Fila de normalização (SKUs bloqueados/sem identidade)

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ FILA DE NORMALIZAÇÃO                        Filtro: [ Motivo ▾ ]         │
├──────────┬───────────────┬────────────────────┬────────────┬───────────┤
│ SKU       │ Nome bruto     │ Motivo do bloqueio  │ Origem     │ Ação      │
├──────────┼───────────────┼────────────────────┼────────────┼───────────┤
│ AG005     │ "agulha 8x8"   │ Conflito de código  │ importação │[Resolver] │
│ CN014     │ "peça s/ ident"│ Sem identificação    │ importação │[Resolver] │
│ BO009     │ "bomba x"      │ Fora do escopo aprov.│ importação │[Arquivar] │
└──────────┴───────────────┴────────────────────┴────────────┴───────────┘
```

### Tela de resolução

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ Resolver AG005                                                            │
│ Nome bruto original: "agulha 8x8"                                         │
│ Sugestão de família: Agulhas descartáveis                                 │
│ [ Vincular à família existente ▾ ]  ( Criar nova família )  ( Arquivar ) │
│ Observação interna [ textarea ]                                          │
│ [ Confirmar resolução ]                                                   │
└──────────────────────────────────────────────────────────────────────────┘
```
Regra: enquanto não resolvido, o item não existe para o público — nunca aparece como
"indisponível" (sugeriria estoque). Itens fora do escopo aprovado (as 12 famílias pendentes:
conexões, bombas, peças não identificadas, linha importada de seringas, monitores portáteis)
permanecem exclusivamente nesta fila, jamais publicados.

## 7. Biblioteca de imagens com quarentena

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ IMAGENS                Filtro: [ Status ▾: Aprovada/Quarentena/Rejeitada]│
├──────────────────────────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                          │
│ │[thumb]  │ │[thumb]  │ │[thumb]  │ │[thumb]  │                          │
│ │Aprovada │ │Quarent. │ │Quarent. │ │Rejeitada│                          │
│ │AG011     │ │BA003     │ │marca vis.│ │direito  │                          │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘                          │
├──────────────────────────────────────────────────────────────────────────┤
│ PENDÊNCIAS DE IMAGEM                                                      │
│ ▸ Marca visível na foto        ▸ Direito de uso não confirmado           │
│ ▸ Sem identificação de produto  ▸ Baixa qualidade                        │
└──────────────────────────────────────────────────────────────────────────┘
```

### Detalhe de imagem em quarentena

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ ‹ Imagens   IMG-00042                     Status: Quarentena             │
│ Motivo: Marca de terceiro visível no rótulo                              │
│ Direito de uso: NÃO CONFIRMADO                                           │
│ Vinculada a: Agulhas descartáveis (variação 12x12)                      │
│ [ Aprovar para publicação ] [ Rejeitar definitivamente ] [ Solicitar novo│
│ envio ]                                                                   │
└──────────────────────────────────────────────────────────────────────────┘
```
Regra crítica: imagem em quarentena nunca é servida ao frontend público, mesmo em cache ou CDN
intermediário; a família exibe placeholder oficial até aprovação (I-4, D-050, D-048).

## 8. Editor de conteúdo

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ ARTIGOS                                       [ + Novo artigo ]          │
├───────────────────┬─────────────┬───────────┬────────────┬──────────────┤
│ Título             │ Categoria    │ Revisor   │ Status      │ Ação         │
├───────────────────┼─────────────┼───────────┼────────────┼──────────────┤
│ Manutenção de bicos│ Equip. e    │ Fulano     │ Publicado   │ [Editar]     │
│ pulverizadores      │ manutenção  │            │             │              │
│ Ovoscopia — o que  │ Incubação   │ (pendente) │ Rascunho    │ [Editar]     │
│ observar            │             │            │             │              │
└───────────────────┴─────────────┴───────────┴────────────┴──────────────┘
```

### Editor de artigo

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ Título*        [                                    ]                    │
│ Resumo         [                                    ]                    │
│ Categoria*     [ Equipamentos e manutenção ▾ ]                           │
│ Autor*         [ ▾ ]        Revisor técnico* [ ▾ ]                       │
│ Corpo          [ editor rich text ]                                      │
│ Produtos citados [ + adicionar família ] → Bicos pulverizadores          │
│ Artigos relacionados [ + adicionar ]                                     │
│ SEO: título · descrição · slug                                           │
│ [ Salvar rascunho ]   [ Enviar para revisão ]   [ Publicar ]             │
└──────────────────────────────────────────────────────────────────────────┘
```
Regra: botão "Publicar" fica desabilitado sem revisor técnico atribuído e sem aprovação
registrada (RK-09).

## 9. Usuários e papéis

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ USUÁRIOS                                     [ + Novo usuário ]          │
├───────────────────┬──────────────────┬────────────┬──────────────────────┤
│ Nome               │ Papel             │ Status     │ Ação                 │
├───────────────────┼──────────────────┼────────────┼──────────────────────┤
│ Fulano             │ Editor de catálogo│ Ativo      │ [Editar]             │
│ Ciclana            │ Comercial          │ Ativo      │ [Editar]             │
│ Beltrano           │ Administrador      │ Ativo      │ [Editar]             │
└───────────────────┴──────────────────┴────────────┴──────────────────────┘
```

| Papel (proposto) | Acesso |
|---|---|
| Administrador | Todas as áreas, incluindo Usuários e Configurações |
| Editor de catálogo | Catálogo, Mídia — sem acesso a Cotações |
| Editorial | Conteúdo — sem acesso a Catálogo comercial nem Cotações |
| Comercial | Cotações — leitura de Catálogo, sem edição |

Papéis definitivos e granularidade técnica são `PENDENTE_DE_APROVAÇÃO`; esta é proposta
conceitual, sem modelagem de permissões em banco.

## 10. Regra transversal — isolamento público × administrativo

Reafirmação de `43` §"Campos internos proibidos no frontend": `campo_interno_marca`,
`marca_publicamente_exposta`, `nivel_confianca`, `divergencia`, `duplicidade_suspeita`,
`observacoes`, `source_id`/`source_location`, `imagem.direito_de_uso`, custo, fornecedor e
qualquer dado de lead **não têm caminho de renderização no frontend público em nenhuma tela
acima**. Todo protótipo administrativo deve ser lido em conjunto com um DTO público explícito por
tipo de página (`47`), de forma que a implementação futura tenha teste automatizado de payload
como guarda (RK-08). Este documento não define esse teste — é responsabilidade de etapa técnica
posterior.
