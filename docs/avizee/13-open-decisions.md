# 13 — Decisões em Aberto

Somente decisões **não resolvidas**. Decisões aprovadas não são reabertas aqui.

## Operacionais (registradas, sem bloquear a Etapa 0)
`USER_DECISION` — §18 do prompt da Etapa 0.

| ID | Pendência | Necessária a partir de |
|---|---|---|
| O-01 | Arquitetura tecnológica | Etapa de implementação |
| O-02 | Banco de dados | Modelagem do catálogo |
| O-03 | Hospedagem | Publicação |
| O-04 | Estratégia de deploy | Publicação |
| O-05 | Endereço que receberá as cotações | Fluxo de cotação |
| O-06 | Provedor de e-mail | Fluxo de cotação |
| O-07 | Formato exato da integração com WhatsApp | Contato/cotação |
| O-08 | Usuários administrativos | Painel |
| O-09 | Papéis e permissões | Painel |
| O-10 | Prazo comercial divulgado (ex.: "retorno em até X") | Copy |
| O-11 | Política de retenção das cotações | LGPD / painel |
| O-12 | Textos jurídicos | Publicação |
| O-13 | Política de privacidade | Publicação |
| O-14 | Política de cookies | Publicação |
| O-15 | IDs de Analytics | Publicação |
| O-16 | Search Console | Publicação |
| O-17 | Meta Pixel | Publicação |
| O-18 | LinkedIn Insight Tag | Publicação |
| O-19 | Integração futura com CRM | Evolução |
| O-20 | Fluxo final de aprovação editorial | Central de Conteúdos |

## Bloqueios de material
| ID | Pendência | Impacto |
|---|---|---|
| O-21 | ~~Reenvio de `catalogo.pdf`~~ | **RESOLVIDO 2026-08-01** — dois catálogos recebidos (10 e 11 páginas); auditoria em `18-catalog-audit.md` |
| O-22 | ~~Assets vetoriais do logotipo~~ | **RESOLVIDO 2026-08-01** — SVG/PDF/PNG/JPG da versão colorida recebidos e guardados em `src/assets/brand/` |
| O-23 | ~~Reenvio de `Mercado Livre.zip`~~ | **RESOLVIDO 2026-07-31** — 110 imagens inventariadas em `17-image-inventory.md` |
| O-24 | Arquivos Montserrat recebidos (OTF/TTF, sem itálico, sem WOFF2). Definir: converter para WOFF2 e self-hospedar, ou usar CDN | Pendente — afeta performance e consistência tipográfica |
| O-25 | ~~Reenvio do código-fonte do site atual~~ | **RESOLVIDO 2026-08-01** — inventário de URLs e plano de 301 em `19-url-inventory.md` |
| O-26 | Versões complementares do logotipo: monocromática, negativa (sobre preto/vinho), símbolo isolado e favicon | **ATIVO** — só a versão colorida foi recebida; sem elas o cabeçalho escuro, o favicon e o placeholder oficial ficam sem asset correto |
| O-27 | Revogar a credencial SMTP exposta em `send_email.php` e definir o provedor de e-mail da v1 | **ATIVO** — ver RK-15; ação de segurança imediata do lado do usuário |


## Recomendações do Lovable — Status: PENDENTE_DE_APROVAÇÃO
Nenhuma destas é decisão. Nenhuma será executada sem aprovação explícita.

| ID | Recomendação | Justificativa |
|---|---|---|
| L-01 | Definir cores funcionais (erro/sucesso/aviso/informação) derivadas da paleta oficial | A paleta aprovada tem 4 cores e não cobre estados de formulário; sem isso a UI improvisará cores fora da marca |
| L-02 | Adotar um dicionário versionado de marcas proibidas + verificação automatizada antes de publicar | R-05 é a regra de maior risco (RK-01) e depende hoje de revisão humana |
| L-03 | Persistir a cotação no banco **antes** de disparar o e-mail | Evita perda silenciosa de lead (RK-07) |
| L-04 | Padronizar o esquema de URLs proposto em `07-product-taxonomy.md` | Necessário antes de qualquer trabalho de SEO |
| L-05 | Definir campo de "confiabilidade do dado técnico" por SKU | Operacionaliza a regra I-2 (rascunho vs. publicado) |
| L-06 | Definir o tratamento público do segmento Suinocultura ("sob consulta"): página informativa sem catálogo, ou ausência total na v1 | D-003 define o status, mas não a superfície pública |
| L-07 | Definir se os códigos atuais (AG/AR/AZ) serão mantidos como códigos públicos | Impacta SEO, busca por código e reconhecimento pelo comprador |
| L-08 | Definir se **Montserrat Alternates** (recebida no pacote) tem algum uso aprovado, ou se fica proibida | O pacote traz 11 pesos da variante decorativa; sem regra, ela acaba sendo usada por engano |
| L-09 | Resolver DIV-06: o "grafismo em V" é um elemento novo a criar, ou a menção se referia ao símbolo galo+engrenagem do manual? | Impacta diretamente o design system e todo o vocabulário gráfico do site |
| L-10 | Definir a política para os ~11 códigos com marca de terceiro visível: nova fotografia, placeholder oficial, ou remoção do item da v1 | Hoje esses SKUs não podem ser publicados com imagem (R-05) e não há caminho definido |
| L-11 | Confirmar se os dois conjuntos de imagens (PNG raiz vs. JPG `A/`) são versões do mesmo acervo e qual prevalece | 30+ códigos existem nos dois; sem regra, o risco é publicar a versão pior. Agora há um **terceiro** conjunto: as 72 JPG do site atual |
| L-12 | **Definir o tratamento público do grupo "SOCOREX" (15 SKUs) e dos nomes com marca de terceiro (`BV005`, `LM001`, `LM002`, códigos de bico)** | Maior violação estrutural de R-05. Opções: renomear por função ("seringa automática 0,5 ml"), manter a marca apenas em campo interno de busca, ou remover os itens da v1 |
| L-13 | Resolver as divergências de código DIV-10 a DIV-16 (AG016 duplicado, AG022 conflitante, PE/VR duplicados, AG025 vs. AG026, nomes de balança) | Bloqueia a modelagem do catálogo: código é chave única (RK-04) |
| L-14 | Decidir se os 55 SKUs exclusivos do catálogo complementar (conexões, peças, bombas, bateria) entram na v1 | Aumenta o catálogo de 117 para ~172 SKUs e cria 4 famílias novas sem nenhuma imagem no site |
| L-15 | Definir o destino do PDF do catálogo (`/assets/docs/catalogo.pdf`), hoje indexável e desatualizado | Manter, substituir por versão nova ou aposentar em favor do catálogo navegável |

