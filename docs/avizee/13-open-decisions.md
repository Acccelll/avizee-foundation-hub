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
| L-08 | ~~Montserrat Alternates~~ | **RESOLVIDA 2026-08-01 → D-031** (proibida na v1) |
| L-09 | ~~Grafismo em "V" (DIV-06)~~ | **RESOLVIDA 2026-08-01 → D-032** (nenhum grafismo novo; padrão secundário oficial separado do símbolo) |
| L-10 | ~~Imagens com marca de terceiro visível~~ | **RESOLVIDA 2026-08-01 → D-033** (placeholder + pendência de nova foto) |
| L-11 | ~~Prioridade entre acervos de imagem~~ | **RESOLVIDA 2026-08-01 → D-034** (seleção por SKU/família) |
| L-12 | ~~Grupo "SOCOREX" e nomes com marca~~ | **RESOLVIDA 2026-08-01 → D-035** (renomear por função; marca só em campo interno) |
| L-13 | ~~Colisões de código DIV-10 a DIV-16~~ | **RESOLVIDA 2026-08-01 → D-036** (UUID como chave; conflito bloqueia só o registro) |
| L-14 | ~~55 SKUs complementares na v1~~ | **RESOLVIDA 2026-08-01 → D-037** (entram quando os dados forem confiáveis) |
| L-15 | ~~Destino do PDF do catálogo~~ | **RESOLVIDA 2026-08-01 → D-038** (aposentar; 301 para `/produtos`) |

## Recomendações ainda em aberto
L-01 a L-07 permanecem PENDENTE_DE_APROVAÇÃO. As decisões operacionais O-01 a O-20, além de
O-24 (WOFF2), O-26 (versões do logotipo) e O-27 (credencial SMTP), continuam ativas.


