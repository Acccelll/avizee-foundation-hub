# 51 — Arquitetura da Central de Conteúdos

Status: `PENDENTE_DE_APROVAÇÃO`

## 1. Categorias editoriais

As 7 categorias aprovadas em `08-content-strategy.md` excedem o volume editorial realista da v1
(D-043 prevê poucos artigos). Categoria vazia é página fina, proibida pelo P-7.

| Categoria aprovada | Tratamento proposto na v1 |
|---|---|
| Guias e boas práticas | **Categoria principal** |
| Vacinação e aplicação | **Categoria principal** — maior aderência ao catálogo |
| Equipamentos e manutenção | **Categoria principal** |
| Incubação e manejo | Categoria condicional — publica com ≥ 2 artigos |
| Curiosidades da avicultura | **Tag**, não categoria — sobrepõe-se a Guias |
| Notícias e mercado | **EVOLUÇÃO** — exige cadência que não há |
| Produtos e aplicações | **Não publicar como categoria** — sobrepõe-se ao catálogo; vira o bloco "Produtos citados" dentro do artigo |

Regra: categoria editorial só é listada e indexada com **≥ 2 artigos publicados**.
Nenhuma categoria aprovada é eliminada — as demais ficam no modelo, ocultas até terem conteúdo.

## 2. Tipos de página

| Tipo | Conteúdo |
|---|---|
| Central (`/conteudos`) | Introdução · destaque · categorias com contagem · últimos artigos · CTA de cotação |
| Categoria editorial | Nome · descrição própria · artigos · categorias de produto relacionadas |
| Artigo | Ver §3 |
| Autor | `EVOLUÇÃO` — nome, função, credencial, artigos |
| Tag | `NÃO_RECOMENDADA` na v1 (páginas finas, sobreposição) |
| Materiais | `EVOLUÇÃO` — sem material publicável hoje (D-038, RK-18) |

## 3. Modelo do artigo

Título · resumo · imagem de capa (ou placeholder) · categoria (uma, canônica) · tags (internas
na v1) · autor · **revisor técnico** (RK-09) · data de publicação · data de atualização · tempo de
leitura · sumário quando houver 4+ seções · corpo · fontes · produtos relacionados ·
artigos relacionados · CTA · metadados · versões sociais (Instagram, LinkedIn).

Regras: um `h1`; hierarquia sem salto; nenhuma marca de terceiro no corpo, na imagem ou no `alt`;
nenhuma promessa comercial (R-11); artigo sem revisão técnica não publica.

## 4. Relações editoriais

```text
Artigo ─┬─ categoria editorial   (1, canônica)
        ├─ produtos citados      (0..n famílias, declaradas)
        ├─ solução relacionada   (0..n)
        └─ artigos relacionados  (0..n, curadoria manual)
```

Recíproca: a família mostra o artigo que a cita; a solução mostra os artigos do seu tema.
Nenhuma relação é gerada automaticamente. Detalhe e estados em `52`.

## 5. Backlog editorial (D-043)

| Pauta | Origem | Estado |
|---|---|---|
| Como escolher agulha para vacinação | reescrita do blog atual | Backlog priorizado |
| Boas práticas de pesagem em aviário | reescrita do blog atual | Backlog |
| Manutenção de bicos pulverizadores | novo, apoia a família BI | Backlog |
| Ovoscopia: o que observar | novo | Backlog condicional |

Nenhuma pauta foi escrita, publicada ou aprovada nesta etapa.
