# 561 — Integração ERP AviZee → Central de Conteúdos

> Decisão: D-090 (2026-11-06)
> Escopo: publicação de matérias. Cotações e catálogo ficam para etapas futuras.

## 1. Objetivo

Permitir que matérias criadas e aprovadas no ERP AviZee, inclusive pelo Claude conectado ao ERP, sejam publicadas no site sem redigitação e sem contornar as regras editoriais do site.

## 2. Fluxo

```
Claude (skill avizee-materias) ─┐
Tela de matérias do ERP ────────┼─▶ ERP (site_materias) ──HTTPS + segredo──▶ /api/internal/erp/materias
                                │                                           │
                                │                                           ├─ valida (blocos, marcas, termos, campos)
                                │                                           ├─ resolve categoria, autor e revisor
                                │                                           └─ DRAFT → … → PUBLISHED (eventos auditados)
```

- O site continua dono do conteúdo público. O ERP nunca grava no banco do site.
- A revisão técnica acontece antes do envio: no ERP ou na conversa com o Claude. Quem aprovou chega em `approvedBy` e vira o `technical_reviewer_id`; cada transição registra "Aprovado por … via ERP AviZee".
- Toda a validação de publicação roda **antes** de qualquer mudança de estado. Uma atualização inválida não tira do ar a versão publicada.

## 3. Endpoints

Todos exigem `Authorization: Bearer <ERP_CONTENT_SECRET>` e respondem com `Cache-Control: no-store`.

| Método | Caminho                              | Uso                                                                           |
| ------ | ------------------------------------ | ----------------------------------------------------------------------------- |
| `GET`  | `/api/internal/erp/referencias`      | Categorias editoriais ativas e famílias públicas do catálogo (slugs válidos). |
| `GET`  | `/api/internal/erp/materias?q=termo` | Busca matérias existentes (duplicidade de pauta).                             |
| `POST` | `/api/internal/erp/materias`         | Cria ou atualiza e, por padrão, publica.                                      |

### Corpo do `POST`

| Campo                                            | Obrigatório | Regra                                                                                                                              |
| ------------------------------------------------ | ----------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `externalId`                                     | sim         | Id da matéria no ERP (vai para as notas internas).                                                                                 |
| `articleId`                                      | não         | Id do artigo no site, devolvido pela publicação anterior. Sem ele, o site procura pelo slug entre artigos criados pela integração. |
| `title`                                          | sim         | 5–200 caracteres.                                                                                                                  |
| `subtitle`, `slug`, `seoTitle`, `seoDescription` | não         | Limites do editor. Sem `slug`, ele é gerado do título.                                                                             |
| `excerpt`                                        | sim         | 40–600 caracteres.                                                                                                                 |
| `categorySlug`                                   | sim         | Categoria editorial ativa.                                                                                                         |
| `blocks`                                         | sim         | Blocos do editor (`src/content/blocks.ts`).                                                                                        |
| `sources`                                        | sim         | 1–20 **nomes** de fonte. URLs não são aceitas no conteúdo público.                                                                 |
| `author.name`                                    | sim         | Encontra o autor pelo nome ou cria.                                                                                                |
| `approvedBy.name`                                | sim         | Revisor técnico. Encontra pelo nome ou cria.                                                                                       |
| `verificationNotes`                              | não         | Notas internas (links de verificação). Nunca publicadas.                                                                           |
| `publish`                                        | não         | Padrão `true`. Com `false`, salva como rascunho. Não pode ser usado para atualizar matéria publicada.                              |

### Resposta

`200 { ok, articleId, slug, version, status, url, unknownFamilies }`.

Erros: `400 VALIDATION_ERROR`, `404 NOT_FOUND` e `409 CONFLICT` trazem `cause` com a regra violada (por exemplo `categoria-invalida:x`, `slug-em-uso:y`, `conformidade:BRAND(...)`). Erros internos não expõem causa.

## 4. Regras de segurança

- O segredo é dedicado, com mínimo de 32 caracteres, e comparado em tempo constante. Sem ele configurado, a API responde `503`.
- A API age como um **usuário técnico real** (`ERP_INTEGRATION_USER_ID`). As permissões vêm de `user_roles`; nada é concedido em código. Papéis necessários: `EDITOR` e `REVISOR_TECNICO`. Não usar `ADMINISTRADOR`.
- Matéria criada pelo painel nunca é sobrescrita pela integração: slug em uso por outro autor resulta em `409`.
- Matérias agendadas ou arquivadas não são alteradas pela integração.
- Corpo limitado a 512 KB.

## 5. Provisionamento (Etapa 16)

1. Criar o usuário `integracao-erp` em Authentication, sem login interativo.
2. Atribuir os papéis:
   ```sql
   insert into public.user_roles (user_id, role) values
     ('<uuid>', 'EDITOR'), ('<uuid>', 'REVISOR_TECNICO');
   ```
3. Configurar `ERP_CONTENT_SECRET` (valor aleatório de 48 ou mais caracteres) e `ERP_INTEGRATION_USER_ID` nos segredos do site.
4. Configurar o mesmo segredo e a URL do site nos segredos das Edge Functions do ERP.
5. Fazer um teste em homologação com `publish: false` e depois um com publicação.
