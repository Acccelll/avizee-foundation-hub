# 43 — Arquitetura de Informação Administrativa (conceitual)

Status: `PENDENTE_DE_APROVAÇÃO`. Sem modelagem técnica, sem papéis definitivos, sem banco.

## Princípio

O painel existe para **destravar publicação**, não para replicar um ERP (fora de escopo,
`11-scope-and-out-of-scope.md`). Sua organização espelha os gargalos reais da Etapa 1:
dado técnico ausente (RK-18), direito de uso de imagem (Q-02) e divergências (RK-03).

## Agrupamento proposto

| Grupo | Áreas | Função |
|---|---|---|
| **Painel** | Visão geral | Pendências abertas: SKUs em rascunho, imagens sem direito de uso, cotações sem resposta |
| **Catálogo** | Famílias · SKUs/Variações · Categorias · Soluções e aplicações | Curadoria da taxonomia e do dado técnico |
| **Mídia** | Imagens · Pendências de imagem | Estados de `09-image-policy.md` e quarentena D-048 |
| **Conteúdo** | Artigos · Categorias editoriais · Autores e revisores · Páginas institucionais | Fluxo editorial com revisão técnica (RK-09) |
| **Comercial** | Cotações | Lead, itens, protocolo, status de atendimento |
| **Operação** | SEO · Usuários · Configurações · Logs · Importações | Suporte |

Notas de nomenclatura: "Produtos" não é um item de menu — se desdobra em **Famílias** e
**Variações**, porque a família é a unidade de publicação (P-4). "Importações" é área de
**apoio à normalização**, não de sincronização automática.

## Hierarquia de navegação

```text
Visão geral
Catálogo
  ├── Famílias        → Variações (aninhadas na família, não em menu de topo)
  ├── Categorias
  └── Soluções e aplicações
Mídia
  ├── Imagens
  └── Pendências (marca visível · direito de uso · sem identificação · baixa qualidade)
Conteúdo
  ├── Artigos
  ├── Categorias editoriais
  ├── Autores e revisores
  └── Páginas institucionais
Cotações
Operação
  ├── SEO
  ├── Usuários
  ├── Configurações
  ├── Importações
  └── Logs
```

## Diferenças público × administrativo

| Dimensão | Público | Administrativo |
|---|---|---|
| Unidade de navegação | Família | Registro (família, variação, imagem) |
| Marca de terceiro | Proibida em qualquer superfície (R-05) | Visível apenas no campo interno de busca |
| Código do SKU | Exibido como referência | Chave de conciliação, com histórico de conflito (D-036) |
| Item com divergência | Invisível | Listado e destacado |
| Imagem pendente | Substituída por placeholder | Visível com o status e o motivo |
| Lead | Nunca exposto | Restrito por permissão |

## Campos internos proibidos no frontend

`campo_interno_marca` · `marca_publicamente_exposta` · `nivel_confianca` · `divergencia` ·
`duplicidade_suspeita` · `observacoes` · `source_id` / `source_location` · `imagem.direito_de_uso` ·
custo, fornecedor e qualquer dado de lead.

Controle previsto: DTO público explícito por tipo de página (`47`) + teste automatizado de payload
(RK-08). Ambos são implementação — não desta etapa.
