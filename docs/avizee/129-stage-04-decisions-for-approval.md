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
