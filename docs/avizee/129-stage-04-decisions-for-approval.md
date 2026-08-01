# 129 — Decisões Técnicas para Aprovação (Etapa 4)

Todas com status **PENDENTE_DE_APROVAÇÃO**. Nenhuma foi aplicada.
Versão tabular em `architecture/technical-decisions.csv`.

| ID | Tema | Recomendação | Alternativas | Justificativa | Impacto | Riscos | Custo recorrente | Reversibilidade |
|---|---|---|---|---|---|---|---|---|
| DT-01 | Stack | Alternativa A: TanStack Start + Lovable Cloud | B (CMS headless), C (backend separado) | Compatibilidade nativa, controle de R-05, custo proporcional | Estrutural | Dependência do ambiente | Baixo | Alta (Postgres padrão) |
| DT-02 | Banco | PostgreSQL gerenciado com RLS | — | Integridade, full-text, RLS, JSONB | Estrutural | Configuração de RLS | Incluído | Alta |
| DT-03 | Backend | `createServerFn` + `api/public/*` para webhook/cron | API separada | Menos superfície, tipagem | Médio | — | — | Alta |
| DT-04 | Renderização | SSG para estáveis + SSR cacheado para catálogo/artigos | SSG total, CSR | SEO e frescor | Alto (SEO) | Cache mal ajustado | — | Alta |
| DT-05 | Especificações | Modelo híbrido: dicionário + valores tipados + JSON de exibição | EAV, JSON livre, tabela larga | Tipagem e filtro sem perder flexibilidade | Alto | Complexidade de UI | — | Média |
| DT-06 | Busca | Postgres `tsvector` + `pg_trgm` + `unaccent` | Motor dedicado | Volume não justifica externo; evoluível | Médio | Ranking limitado | Nenhum | Alta |
| DT-07 | Cotação | Banco como fonte; e-mail/WhatsApp como canais; outbox | E-mail direto | Nenhum lead perdido | Alto | — | — | Alta |
| DT-08 | WhatsApp | Link `wa.me` contextual, **após** o registro (e opcional antes, para dúvida pontual); API oficial fora da v1 | Só antes; API oficial | Preserva a Lista de Cotação como fluxo principal | Médio | Mensagem manual | Nenhum | Alta |
| DT-09 | CMS | Painel próprio na mesma aplicação | CMS headless | Governança de marca e permissões | Alto | Esforço de construção | Nenhum | Média |
| DT-10 | Editor | JSON estruturado em blocos, sem HTML arbitrário, sanitizado | Rich text HTML, Markdown | Segurança e consistência visual | Médio | Curva de uso | Possível licença | Média |
| DT-11 | E-mail | E-mail gerenciado com domínio próprio; provedor dedicado se necessário | SMTP próprio | Entregabilidade com menor operação | Médio | Bounce limitado | Baixo/Médio | Alta (outbox) |
| DT-12 | Storage | `private-media` padrão + `public-media` só para aprovados | Bucket único | Garantia física de privacidade | Alto | — | Baixo | Alta |
| DT-13 | Processamento de imagem | Derivados WebP/thumb gerados no upload (WASM no cliente admin) | Transformação sob demanda | Runtime não suporta binários nativos | Médio | Compatibilidade | Nenhum | Média |
| DT-14 | Autenticação | Auth nativa, MFA para ADMIN, sem cadastro público | Provedor externo | Simplicidade e segurança | Médio | — | Incluído | Alta |
| DT-15 | Papéis | 7 papéis de `111` com menor privilégio | Modelo simplificado | Segregação de funções | Médio | Gestão | — | Alta |
| DT-16 | Retenção | Política de `113` | Retenção indefinida | LGPD e minimização | Médio | Aprovação jurídica pendente | — | Alta |
| DT-17 | Serviços externos | Somente e-mail + Google Maps sob interação; EmbedSocial fora | Mais integrações | Privacidade e performance | Médio | — | Baixo | Alta |
| DT-18 | Ambientes | Dev, preview, homologação, produção conforme `118` | Sem homologação | Aceite seguro | Médio | Custo de ambiente extra | Baixo | Alta |
| DT-19 | Backup | Snapshot diário + export semanal + teste trimestral | Só snapshot gerenciado | Backup não testado não conta | Médio | Operação | Baixo | Alta |
| DT-20 | Analytics | Eventos de `115`, ativados só com consentimento | Ativar já | LGPD | Baixo | — | Baixo | Alta |
| DT-21 | Deploy | Preview automático + produção com aprovação manual e gates | Deploy contínuo | Controle de qualidade | Médio | Cadência | — | Alta |

**Nenhuma recomendação acima pode ser tratada como aprovada.** A implementação depende de
aprovação expressa item a item; aprovação parcial mantém as demais pendentes e impede iniciar
áreas dependentes.


## Resultado da deliberação — 2026-08-01

As decisões deixam de estar pendentes. Estados finais registrados também em
`architecture/technical-decisions.csv`:

| ID | Status final | Condição / ajuste |
|---|---|---|
| DT-01 | APROVADA_CONDICIONALMENTE | Verificação da stack executada e registrada em `architecture/stack-verification.md`: TanStack Start confirmado; proibida migração artesanal ou troca de stack |
| DT-02 | APROVADA | RLS deny-by-default, migrations versionadas, constraints, FKs, índices, auditoria, service role só no backend, testes de política; SKU não é PK |
| DT-03 | APROVADA_COM_AJUSTE | `createServerFn` interno; server routes para endpoints externos; `api/public` e `api/admin` como contratos explícitos |
| DT-04 | APROVADA_COM_AJUSTE | Matriz por tipo de página + invalidação explícita (`100`) |
| DT-05 | APROVADA | Impacto obrigatório ao alterar definição em uso |
| DT-06 | APROVADA | Prioridade de ranking e exclusão de campos internos do índice |
| DT-07 | APROVADA | Transação única + outbox; falha de e-mail não invalida cotação |
| DT-08 | APROVADA | `wa.me` secundário, após o registro, só com dado público |
| DT-09 | APROVADA | Painel próprio, sem page builder livre |
| DT-10 | APROVADA_COM_CONTROLES | Schema versionado, allowlist, sanitização, sem HTML arbitrário |
| DT-11 | APROVADA_EM_PRINCÍPIO | `EmailProvider` desacoplado; fornecedor pendente (DEP-T1); provider nulo até lá |
| DT-12 | APROVADA | Privado por padrão; público só para derivados aprovados |
| DT-13 | APROVADA_CONDICIONADA_A_PROVA_TÉCNICA | WASM é primeira alternativa a validar, não obrigação |
| DT-14 | APROVADA | MFA TOTP e AAL2 em operações privilegiadas antes de produção |
| DT-15 | APROVADA | Permissões granulares como fonte de autorização |
| DT-16 | APROVADA_CONDICIONALMENTE | Princípio aprovado; prazos pendentes (DEP-T5); exclusão automática bloqueada |
| DT-17 | APROVADA | Somente e-mail e Google Maps sob interação; EmbedSocial fora da v1 |
| DT-18 | APROVADA_COM_ALTERAÇÃO_ESTRUTURAL | Homologação em instância separada; proibido usar produção como preview |
| DT-19 | APROVADA_COM_COMPLEMENTO | Backup do storage separado do backup do banco |
| DT-20 | APROVADA | Sem ativação imediata; consentimento; `AnalyticsProvider` |
| DT-21 | APROVADA | 10 gates e aprovação manual; sem produção contínua |
