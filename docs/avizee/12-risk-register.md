# 12 — Registro de Riscos

Escala: Probabilidade / Impacto — Baixa · Média · Alta

| ID | Risco | Prob. | Impacto | Mitigação prevista | Status |
|---|---|---|---|---|---|
| RK-01 | **Exposição de marcas de terceiros** — quantificada na Etapa 1: 16 SKUs e 33 imagens em nomes, slugs, alt, SEO, dados estruturados, WhatsApp ou nomes de arquivo | Alta | Alto | Separação estrita público/interno (D-012); dicionário de marcas proibidas; verificação automatizada no build e antes de publicar (a definir) | Aberto |
| RK-02 | **Imagens sem autorização** ou com direito de uso não confirmado — 188 arquivos, 0 aprovados (Etapa 1) | Alta | Alto | Estados `PENDENTE_DIREITO_DE_USO` e `NÃO_PUBLICAR`; publicação só com status aprovado | Aberto |
| RK-03 | **Catálogo inconsistente** entre PDF, site atual e imagens | Alta | Alto | Auditoria com registro de divergências, sem reconciliação silenciosa; matriz de origem por SKU | **Auditoria executada** (2026-08-01) — 7 divergências abertas em `18-catalog-audit.md` |
| RK-04 | **Duplicidade de produtos** (mesma variação em famílias diferentes) | Média | Médio | Chave única por código; regra de agrupamento R-AG-1/R-AG-3 | Aberto |
| RK-05 | **Informações técnicas incompletas** | Alta | Médio | Regra I-2 (rascunho); campo de confiabilidade do dado | Aberto |
| RK-06 | **Perda de SEO na migração** | Média | Alto | Inventário de URLs atuais + plano de 301 (`19-url-inventory.md`) | **Reduzido** — só 5 URLs públicas e nenhuma página de SKU indexada |
| RK-07 | **Falha no envio da cotação** (lead perdido silenciosamente) | Média | Alto | Persistência da cotação no banco antes do envio do e-mail; fila/retry; alerta de falha; confirmação visível ao usuário | Aberto |
| RK-08 | **Vazamento de campos internos** via API, SSR, props hidratadas ou logs | Média | Alto | Seleção explícita de campos públicos (nunca `select *`); DTO público; teste automatizado de payload | Aberto |
| RK-09 | **Conteúdo técnico sem revisão** publicado | Média | Alto | Fluxo editorial com revisão técnica e de marca obrigatórias | Aberto |
| RK-10 | **Dependência de serviços externos** (e-mail, WhatsApp, hospedagem, analytics) | Média | Médio | Escolhas registradas como decisões abertas; evitar acoplamento rígido | Aberto |
| RK-11 | **Dados pessoais e LGPD** nas cotações (nome, e-mail, telefone, empresa) | Alta | Alto | Política de privacidade e de cookies; base legal; política de retenção das cotações; acesso restrito por permissão; sem exposição pública de leads | Aberto |
| RK-12 | **Promessa comercial indevida** (frete, prazo, disponibilidade) em copy ou conteúdo | Média | Médio | R-11; checklist de revisão de copy | Aberto |
| RK-13 | **Materiais-fonte ausentes** travando as etapas seguintes | Alta | Alto | Registrado em `03-source-inventory.md` | **Encerrado 2026-08-01** — todas as 8 fontes recebidas |
| RK-14 | Percepção de e-commerce pelo visitante (expectativa de preço/compra) | Média | Médio | Vocabulário controlado (`05-business-positioning.md`); avisos no fluxo de cotação | Aberto |
| RK-18 | **Ausência total de dados técnicos por SKU** em todas as fontes (descrição, aplicação, material, segmento) | Alta | Alto | Coleta junto ao fornecedor; publicação apenas de SKU com dado confirmado; placeholder de conteúdo proibido | **Ativo** (confirmado na Etapa 1 — `25-product-source-inventory.md`) |
| RK-15 | **Credencial SMTP e chave secreta do reCAPTCHA expostas em texto claro** no código-fonte atual (`send_email.php`) e trafegada por canal comum | Alta | Alto | Revogar imediatamente a senha de aplicativo e regerar o par de chaves do reCAPTCHA na conta Google (O-27); na v1 usar segredo de servidor, nunca literal em código; nenhum segredo em repositório | **Ativo — ação do usuário** |
| RK-16 | **Grupo e nomes de produto contendo marca de terceiro** ("SOCOREX" como grupo inteiro, 15 SKUs) | Alta | Alto | Decisão L-12 antes da modelagem; separar nome público (funcional) de campo interno de busca | **Ativo** |
| RK-17 | **Colisão de códigos** entre os dois catálogos (AG016, AG022, PE/VR duplicados) usados como chave única | Alta | Alto | Resolver DIV-10 a DIV-16 (L-13) antes de criar o modelo de dados | **Ativo** |
