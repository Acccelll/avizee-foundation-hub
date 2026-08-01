# 96 — Avaliação das Capacidades Reais do Lovable

**Status**: verificação técnica do ambiente do projeto · Nada ativado.

## 1. Ambiente observado

| Item | Situação verificada |
|---|---|
| Framework | TanStack Start v1 (React 19, Vite 7), roteamento por arquivo em `src/routes` |
| Renderização | SSR nativo + prerender/SSG na build; rotas de servidor em `src/routes/api` |
| Runtime de servidor | Worker serverless (edge, `nodejs_compat` parcial) |
| Backend de dados | **Lovable Cloud (Postgres gerenciado) — não habilitado neste projeto** |
| Autenticação | Nativa do Lovable Cloud: e-mail/senha, telefone, Google, Apple, SAML |
| Storage | Buckets nativos com políticas RLS em `storage.objects` |
| Funções de backend | `createServerFn` (RPC tipado) e rotas HTTP em `src/routes/api/public/*` |
| Segredos | Gerenciador de secrets do projeto; variáveis apenas no servidor |
| E-mail | Serviço de e-mail com domínio próprio disponível sobre o Cloud; alternativa SMTP/API transacional |
| Agendamento | `pg_cron` no Postgres gerenciado chamando endpoint `/api/public/*` autenticado por assinatura |
| Sitemap | Rota de servidor `src/routes/sitemap[.]xml.ts` gerada dinamicamente |
| Analytics | Leitura de métricas do projeto; instrumentação própria por evento é desenvolvimento customizado |
| Backups | Backup gerenciado do Postgres; exportação de dados pelo painel Cloud |
| Publicação/domínio | Publicação gerenciada e domínio customizado pelo painel |

## 2. Limitações relevantes confirmadas

| Área | Limitação | Adaptação proposta |
|---|---|---|
| Runtime | Sem `child_process`, `sharp`, `canvas`, binários nativos | Processamento de imagem **fora do runtime**: pré-processamento no upload via biblioteca WASM/Canvas no navegador do administrador, ou transformação nativa do storage |
| Runtime | Sem filesystem real persistente | Todo binário em storage; nada gravado em disco do servidor |
| Filas | Sem broker de filas nativo | Tabela de outbox no Postgres + worker acionado por `pg_cron` (`121`, `114`) |
| Busca | Sem motor dedicado (Elastic/Typesense) nativo | `tsvector` + `pg_trgm` + `unaccent` no Postgres (`106`) |
| Agendamento | Sem scheduler de aplicação | `pg_cron` → endpoint público assinado (`108` §agendamento) |
| Antivírus | Sem verificação de malware nativa | Whitelist de MIME, validação de assinatura de arquivo, limite de tamanho, SVG proibido, upload restrito a papéis autenticados (`109`) |
| E-mail | Bounce/webhooks dependem do provedor escolhido | Decisão DT-11; outbox garante persistência independentemente do provedor |
| SEO | Prerender falha em rota protegida (401 em loader autenticado) | Rotas públicas nunca chamam função protegida em loader (`100`) |
| Ambientes | Preview e produção gerenciados; homologação separada não é nativa | Homologação = projeto/branch dedicado ou preview com `noindex` (`118`) |

## 3. Matriz necessidade → capacidade

| Necessidade | Capacidade necessária | Recurso disponível | Limitação | Alternativa | Risco | Recomendação |
|---|---|---|---|---|---|---|
| HTML indexável | SSR/SSG | Nativo (TanStack Start) | Rota protegida não prerenderiza | SSR sob demanda | Baixo | Usar nativo |
| Catálogo | Postgres relacional | Nativo (Cloud) | Requer habilitar Cloud | — | Baixo | Habilitar na implementação |
| Marca privada | RLS + serializer | Nativo + customizado | RLS não basta sem GRANT correto | Views públicas | **Alto** | Views públicas + testes (`112`) |
| Busca | Full-text PT-BR | `tsvector`/`pg_trgm` | Sem ranking semântico | Serviço externo futuro | Baixo | Nativo na v1 |
| Cotação | Persistência + notificação | Função de servidor + outbox | Sem fila nativa | `pg_cron` | Médio | Outbox |
| Imagens | Storage + derivados | Storage nativo | Sem `sharp` | WASM no cliente admin | Médio | Pré-processar no upload |
| E-mail | Transacional | Integração | Provedor a aprovar | SMTP seguro | Médio | DT-11 |
| Agendamento | Cron | `pg_cron` | Requer endpoint assinado | Publicação manual | Médio | `pg_cron` + fallback manual |
| Backup | Snapshot + restauração | Gerenciado | Restauração precisa ser testada | Export periódico | Médio | Teste trimestral (`120`) |
| Monitoramento | Alertas | Parcial | Sem alerta nativo por regra | Health check externo | Médio | `121` |

## 4. Classificação dos recursos

- **Nativo**: SSR/SSG, rotas, funções de servidor, Postgres, auth, storage, secrets, publicação, domínio, backup gerenciado.
- **Integração suportada**: e-mail com domínio próprio, provedores OAuth, Google Maps (carregamento sob interação), pagamento (fora de escopo).
- **Serviço externo**: provedor transacional de e-mail (se aprovado), monitoramento externo de disponibilidade.
- **Desenvolvimento customizado**: catálogo, busca, cotação, CMS, mídia, importação, analytics de eventos, auditoria.
- **Evolução futura**: motor de busca dedicado, CDN de imagem com transformação sob demanda, publicação social, portal do cliente.

## 5. Dependências não confirmadas (bloqueiam decisão, não a arquitetura)

DEP-T1 provedor de e-mail (O-05/O-06) · DEP-T2 disponibilidade de `pg_cron` no plano contratado ·
DEP-T3 política de buckets públicos do workspace · DEP-T4 evidência de revogação das credenciais
antigas (Q-01/O-27) · DEP-T5 dados legais da empresa para textos LGPD.


## Atualização 2026-08-01 — verificação objetiva exigida por DT-01

A avaliação de capacidades passa a ter como base a verificação factual do repositório registrada
em `architecture/stack-verification.md`: TanStack Start com SSR nativo, Vite, roteamento por
arquivos e runtime Worker. Lovable Cloud ainda não ativado. O processamento de imagens permanece
sujeito à prova técnica exigida por DT-13.
