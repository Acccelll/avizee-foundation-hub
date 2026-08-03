# 12 — Registro de Riscos

Escala: Probabilidade / Impacto — Baixa · Média · Alta

| ID | Risco | Prob. | Impacto | Mitigação prevista | Status |
|---|---|---|---|---|---|
| RK-01 | **Exposição de marcas de terceiros** — quantificada na Etapa 1: 16 SKUs e 33 imagens em nomes, slugs, alt, SEO, dados estruturados, WhatsApp ou nomes de arquivo | Alta | Alto | Separação estrita público/interno (D-012); dicionário de marcas proibidas; verificação automatizada no build e antes de publicar (a definir) | Aberto |
| RK-02 | **Imagens sem autorização** ou com direito de uso não confirmado — 188 arquivos, 0 aprovados (Etapa 1) | Alta | Alto | Estados `PENDENTE_DIREITO_DE_USO` e `NÃO_PUBLICAR`; **D-050** (Q-02): só imagem própria/contratada/autorizada publica; origem desconhecida ou marca visível → placeholder; imagem bloqueada não bloqueia o produto | **Mitigado por política** — origem do acervo ainda não confirmada |
| RK-03 | **Catálogo inconsistente** entre PDF, site atual e imagens | Alta | Alto | Auditoria com registro de divergências, sem reconciliação silenciosa; matriz de origem por SKU | **Reduzido 2026-08-01** — D-039 (família BI), D-040 (BI999) e D-051 (AG019/AG016) encerram 8 das 10 divergências; restam **AG005** e **AG022** |
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
| RK-18 | **Ausência total de dados técnicos por SKU** em todas as fontes (descrição, aplicação, material, segmento) | Alta | Alto | **D-041** (completude progressiva): bloqueio por campo e por registro, campo ausente fica oculto e placeholder de conteúdo continua proibido; coleta junto ao fornecedor | **Ativo** (confirmado na Etapa 1 — `25-product-source-inventory.md`) |
| RK-15 | **Credencial SMTP e chave secreta do reCAPTCHA expostas em texto claro** no código-fonte atual (`send_email.php`) e trafegada por canal comum | Alta | Alto | Revogar imediatamente a senha de aplicativo e regerar o par de chaves do reCAPTCHA na conta Google (O-27); na v1 usar segredo de servidor, nunca literal em código; nenhum segredo em repositório | **Ativo — ação do usuário** (Q-01 NÃO CONFIRMADO: credenciais consideradas comprometidas; encerramento exige data, responsável, segredo substituído e prova de uso via cofre/variável de ambiente) |
| RK-16 | **Grupo e nomes de produto contendo marca de terceiro** ("SOCOREX" como grupo inteiro, 15 SKUs) | Alta | Alto | Decisão L-12 antes da modelagem; separar nome público (funcional) de campo interno de busca | **Ativo** |
| RK-17 | **Colisão de códigos** entre os dois catálogos (AG016, AG022, PE/VR duplicados) usados como chave única | Alta | Alto | Resolver DIV-10 a DIV-16 (L-13) antes de criar o modelo de dados | **Ativo** |

## Riscos identificados na Etapa 2

| ID | Risco | Prob. | Impacto | Mitigação prevista | Status |
|---|---|---|---|---|---|
| RK-19 | **Páginas de família nascerem finas** por ausência de dado técnico (desdobramento de RK-18 no SEO) | Alta | Alto | Conteúdo mínimo publicável por tipo de página; `noindex` até cumprir o critério (`55`) | Aberto |
| RK-20 | **Página de solução virar cópia da página de categoria**, gerando conteúdo duplicado | Média | Médio | Solução lista famílias, não as reproduz; canônica única por família; breadcrumb sempre pela categoria | Aberto |
| RK-21 | **Comprador que só conhece a marca não encontrar o item** — efeito colateral legítimo de R-05 | Alta | Médio | Dicionário de sinônimos funcionais; estado de busca com sugestão; consulta assistida (DEC-08) | Aberto |
| RK-22 | **`/produtos` mudar de conteúdo mantendo a URL**, com oscilação de posição | Média | Médio | Monitoramento no Search Console após o lançamento (O-16) | Aberto |

## Riscos identificados na Etapa 2.1

| ID | Risco | Prob. | Impacto | Mitigação prevista | Status |
|---|---|---|---|---|---|
| RK-23 | **34 SKUs sem nome de produto em nenhuma das 8 fontes** (`PE`×28, `CN`×3, `BO`×3) — impedem qualquer classificação legítima | Alta | Alto | DECT-08: obter lista código × nome × função com a AviZee; contingência é excluir da v1 (DECT-14). Classificação por prefixo **rejeitada** | **Ativo — depende do usuário** |
| RK-24 | **Famílias de conexão classificadas por inferência** (FAM-016 a FAM-019, 22 SKUs): podem pertencer a ar comprimido, não a pulverização | Média | Médio | Marcadas `INFERENCE_MEDIUM`; DECT-05 propõe divisão por uso real quando conhecido | Aberto |
| RK-25 | **Aprovação em bloco das 43 famílias mascarar erro individual** de classificação | Média | Médio | Aprovação por blocos A–F (DECT-01 alternativa B) e lista dos 7 casos que exigem decisão individual (`71`) | Aberto |
| RK-26 | **Etapa 3 travar indefinidamente** aguardando 100% de cobertura taxonômica que depende de material externo | Alta | Alto | DECT-10: liberação parcial com as 31 famílias prontas, que já exercitam todos os tipos de página | Aberto |

**RK-18 — atualização**: permanece **Ativo**, mas com abrangência reduzida. A ausência de dado
técnico deixou de ser universal: 140 dos 174 SKUs (80,5%) agora têm categoria, aplicação e
segmento propostos. O risco concentra-se nos 34 SKUs de RK-23.

**RK-16 — atualização**: permanece **Ativo**. Os nomes de **família** já são neutros
(FAM-010 a FAM-012, FAM-041); falta o nome público por SKU (DECT-11).

## Riscos da Etapa 3

| ID | Risco | Prob. | Impacto | Mitigação | Status |
|---|---|---|---|---|---|
| RK-27 | Protótipo com dado provisório ser confundido com conteúdo aprovado | Média | Alto | Rota `/prototipo` não indexável, marcação explícita de conteúdo provisório, uso restrito às 31 famílias (D-053) | Aberto |
| RK-28 | Estados genéricos de "SKU bloqueado" revelarem indiretamente produtos pendentes | Baixa | Alto | `83` proíbe exibir código, nome ou imagem do registro bloqueado; o estado é genérico e sem identificador | Mitigado por especificação |
| RK-29 | Cores funcionais improvisadas fora da paleta oficial | Média | Médio | L-01 endereçada por `76`/`78` com proposta derivada da paleta, `PENDENTE_DE_APROVAÇÃO`; nenhum valor aplicado sem aprovação | Aberto |
| RK-30 | Design system precisar de retrabalho quando as 12 famílias pendentes entrarem | Baixa | Médio | Componentes desenhados por tipo de dado, não por família; as 31 famílias já exercitam todos os tipos de página | Mitigado |

**RK-25 — atualização**: **mitigado**. A aprovação em bloco das 43 famílias não ocorreu; D-052
aprovou apenas as 31 prontas.
**RK-26 — atualização**: **encerrado**. DECT-10 liberou a Etapa 3 sem aguardar 100% de cobertura.
**RK-23 e RK-16**: permanecem **Ativos** — B-02 e B-03 estão contidos, não encerrados.


## Atualização 2026-08-01 — aprovação da Etapa 3

| ID | Risco | Estado |
|---|---|---|
| RK-29 | Cor funcional improvisada fora da paleta | **Mitigado** — D-056 fixa verde `#1f6b3c` e azul `#12557e` com valores exatos e uso restrito; escolha ad hoc na implementação é defeito |
| RK-31 | Verde/azul funcionais vazarem para peça institucional ou promocional, diluindo a marca | **Aberto — controlado** por `10-brand-guidelines.md` e `76` §4.1; verificado no checklist de `91` |
| RK-32 | Implementação alterar silenciosamente estrutura ou aparência aprovada | **Aberto — controlado** por DES-10: revisão visual obrigatória por tipo de página antes da implementação |
| RK-28 | Estado de "item em revisão" vazar registro bloqueado | **Controle reforçado** — proibido expor código conflitante, nome interno, marca de terceiro, motivo administrativo, fornecedor, referência original ou identidade não validada |


## Atualização 2026-08-01 — Etapa 4 (riscos técnicos)

Novos riscos **RK-33 a RK-50**, com probabilidade, impacto, prevenção, detecção, resposta,
responsável e status, registrados em `128-stage-04-risks.md` e
`architecture/risk-controls.csv`.

Destaques: **RK-42** (credenciais antigas ainda válidas) permanece **Aberto e crítico** —
só encerra com evidência de revogação (Q-01/O-27). **RK-41** (backup não testado) e
**RK-49** (`pg_cron` não confirmado no plano) bloqueiam critérios do Incremento 1 e 8.


## Atualização 2026-08-01 — riscos decorrentes da aprovação das DT

| ID | Risco | Origem | Tratamento |
|---|---|---|---|
| RK-51 | Homologação sem instância de backend separada leva ao uso indevido da base de produção como preview | DT-18 com alteração estrutural | Proibição expressa; se a separação exigir projeto/instância adicional, documentar custo, sincronização de migrations e procedimento de promoção antes de criar o ambiente |
| RK-52 | Backup do banco tratado como cobertura total, deixando objetos de storage sem proteção | DT-19 com complemento | Inventário de arquivos, backup de públicos, privados, metadados e documentos; teste de restauração e validação de correspondência banco × arquivo |
| RK-53 | Processamento WASM de imagens não atender ao runtime, memória, tempo ou qualidade | DT-13 condicionada | Prova técnica com critérios medidos; em caso de falha, interromper e apresentar alternativas — proibida a mudança automática para transformação sob demanda |
| RK-54 | Publicação no painel não refletida no site por dependência de novo deploy | DT-04 com ajuste | Invalidação explícita de cache em publicação, despublicação, mudança de slug, metadados, família, produto e artigo |
| RK-55 | Operação privilegiada executada sem AAL2 | DT-14 | Verificação de AAL no servidor para usuários, permissões, publicação, importação, rollback, aprovação de imagem, resolução de conflito, configuração e documentos sensíveis |

RK-33 (dependência do ambiente Lovable) permanece **aceito como risco controlado** por decisão
expressa em DT-01.

## Riscos da Etapa 11

| ID | Risco | Probabilidade | Impacto | Mitigação | Estado |
|---|---|---|---|---|---|
| RK-51 | Credencial SMTP legada não revogada (O-27) | Média | Crítico | Revogação e comprovação pelo cliente | Aberto (P0) |
| RK-52 | Go-live sem teste de restauração | Média | Crítico | Executar teste em instância isolada | Aberto (P1) |
| RK-53 | Notificação de cotação indisponível por DEP-T1 | Alta | Alto | Cotação persistida antes de notificar; outbox com retentativa | Mitigado |
| RK-54 | Publicação com texto jurídico incompleto (Q-13) | Média | Crítico | Bloqueio formal de produção | Aberto (P1) |
| RK-55 | Indexação acidental do ambiente de homologação | Baixa | Alto | `noindex` por ambiente e robots restritivo | Mitigado |
| RK-56 | Retenção indefinida por ausência de DEP-T5 | Alta | Alto | Automação destrutiva desativada | Aberto (P1) |
