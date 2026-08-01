# 108 — Arquitetura da Central de Conteúdos

## 1. Ciclo editorial

`IDEA → PLANNED → DRAFT → TECHNICAL_REVIEW → COMMERCIAL_REVIEW → SEO_REVIEW → SCHEDULED →
PUBLISHED → UPDATED → UNPUBLISHED → ARCHIVED`.

Transições permitidas por papel (`111`). Toda transição grava `article_revisions` +
`publication_history` + `audit_logs`. Retrocesso é permitido e registrado; publicação
parcial é proibida.

## 2. Entidades

`articles`, `article_revisions`, `editorial_categories` (as 7 aprovadas, imutáveis sem
decisão), `article_categories`, `article_products`, `article_families`, `article_solutions`,
`authors`, `reviewers` (papel em `user_roles`), `article_sources`, `article_social`,
`seo_metadata`.

## 3. Relações com o catálogo

Artigo → produtos/famílias/soluções relacionados, com `relation_type`
(MENTIONS, RECOMMENDS, EXPLAINS). Bloco de produtos relacionados renderiza apenas registros
`PUBLISHED`; registros despublicados desaparecem do bloco sem quebrar o artigo.

## 4. Agendamento

`scheduled_for timestamptz` + job `pg_cron` a cada 5 minutos chamando
`/api/public/cron/publish-scheduled` autenticado por assinatura HMAC.
Em falha: artigo **permanece SCHEDULED**, tentativa registrada, alerta ao editor, sem
publicação parcial. Fallback: botão "publicar agora" manual.

## 5. Conteúdo social (armazenado, não publicado)

`article_social`: legenda Instagram, roteiro de carrossel, texto LinkedIn, CTA, hashtags,
URL com UTM, `social_status` (NOT_STARTED/READY/POSTED). **Nenhuma publicação automática em
Instagram ou LinkedIn na v1.**

## 6. SEO editorial

Cada artigo tem `seo_metadata` próprio: title, description, canonical, OG image (somente
imagem aprovada), `noindex` opcional. Alteração de slug cria redirect 301 automaticamente.

## 7. Regras de conteúdo

Nenhuma marca de terceiro no corpo público; nenhum preço; fontes obrigatórias em conteúdo
técnico; revisão técnica obrigatória para as categorias "Vacinação e aplicação",
"Equipamentos e manutenção" e "Incubação e manejo".


## Atualização 2026-08-01 — DT-09 e DT-10 aprovadas

O painel **não é page builder livre**: a estrutura visual aprovada permanece protegida e a edição
se limita aos conteúdos e blocos previstos.

Editor com controles obrigatórios: schema versionado, allowlist de tipos de bloco, validação no
servidor, sanitização, **nenhum HTML arbitrário**, migração entre versões do schema, prévia
segura, histórico de revisões, renderizador público separado do editor, fallback para bloco
desconhecido e bloqueio de scripts, iframes e atributos não autorizados.

Blocos iniciais: heading, parágrafo, lista, tabela, imagem, legenda, chamada, citação curta,
fonte, CTA, produto relacionado, artigo relacionado. Biblioteca comercial exige licença e custo
aprovados antes da instalação.
