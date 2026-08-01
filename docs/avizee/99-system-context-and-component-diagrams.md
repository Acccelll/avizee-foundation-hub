# 99 — Diagramas de Contexto e de Componentes

Sem segredos reais. Diagramas lógicos.

## 1. Contexto

```text
        Visitante B2B                     Equipe AviZee
        (público, anônimo)            (admin autenticado)
              |                                |
              v                                v
   +---------------------+         +--------------------------+
   |  Aplicação pública  |         | Aplicação administrativa |
   |  SSR / SSG          |         |  /_authenticated/*       |
   +----------+----------+         +-------------+------------+
              |  views públicas                  |  funções autenticadas
              v                                  v
   +--------------------------------------------------------+
   |          Funções de servidor  (createServerFn)          |
   +----+------------------+---------------+-----------------+
        |                  |               |
        v                  v               v
  +-----------+     +-------------+   +-----------+
  | Postgres  |     |  Storage    |   |  Outbox   |
  |  + RLS    |     | priv / pub  |   | + pg_cron |
  +-----------+     +-------------+   +-----+-----+
                                            |
                        +-------------------+------------------+
                        v                                      v
              Provedor de e-mail                    WhatsApp (link wa.me)
              (transacional)                        Google Maps (sob clique)
```

## 2. Fluxo de cotação

```text
Família/SKU --> [Adicionar à lista] --> Lista local (localStorage + estado)
      --> /cotacao (revisar, quantidade, observação)
      --> submitQuotation (servidor: validação, honeypot, rate limit, idempotência)
      --> quotations + quotation_items + quotation_events (RECEIVED)
      --> protocolo AVZ-AAAA-NNNNNN --> outbox: e-mail interno + confirmação
      --> tela de confirmação (protocolo + botão WhatsApp opcional)
```

## 3. Fluxo editorial

```text
IDEA -> PLANNED -> DRAFT -> TECHNICAL_REVIEW -> COMMERCIAL_REVIEW -> SEO_REVIEW
   -> SCHEDULED --(pg_cron)--> PUBLISHED -> UPDATED -> UNPUBLISHED -> ARCHIVED
       falha de agendamento: permanece SCHEDULED + alerta ao editor
```

## 4. Fluxo de imagem

```text
Upload (admin) -> validação MIME/tamanho/dimensão -> private-media
   -> media_assets(status=PENDING, rights=UNKNOWN)
   -> revisão: APPROVED (copia p/ public-media) | REJECTED (permanece privado)
   -> derivados WebP + thumb gerados no upload -> vínculo família/SKU
   -> frontend só lê media_assets aprovados; senão placeholder oficial
```

## 5. Fluxo de publicação e SEO

```text
Registro READY_TO_PUBLISH --(gate de publicação)--> PUBLISHED
   -> publication_history -> sitemap.xml (somente PUBLISHED)
   -> seo_metadata (title, description, canonical, OG) -> JSON-LD
   -> mudança de slug -> insere redirect 301 automático
```
