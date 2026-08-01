# Memória Permanente do Projeto AviZee

Fonte única de verdade do novo site institucional e catálogo B2B da AviZee.

> **Protocolo obrigatório**: antes de iniciar QUALQUER etapa futura, ler nesta ordem:
> 1. este README
> 2. `01-approved-decisions.md`
> 3. `02-non-negotiable-rules.md`
> 4. `16-change-log.md`
> 5. `13-open-decisions.md`
>
> Depois: identificar o escopo da etapa atual, verificar conflitos com decisões anteriores,
> registrar novas decisões aprovadas e **nunca** substituir documentação anterior silenciosamente.

## Índice

| Arquivo | Conteúdo |
|---|---|
| `00-project-charter.md` | Visão, propósito, objetivos, critérios de sucesso |
| `01-approved-decisions.md` | Decisões aprovadas (somente aprovadas) |
| `02-non-negotiable-rules.md` | Regras não negociáveis |
| `03-source-inventory.md` | Inventário e status das fontes |
| `04-traceability-matrix.md` | Matriz decisão → requisito → fonte → etapa |
| `05-business-positioning.md` | Posicionamento e tom de comunicação |
| `06-personas-and-audiences.md` | Personas preliminares (hipóteses marcadas) |
| `07-product-taxonomy.md` | Segmento → Solução → Categoria → Família → SKU |
| `08-content-strategy.md` | Central de Conteúdos e pilares editoriais |
| `09-image-policy.md` | Estados de imagem e regras de publicação |
| `10-brand-guidelines.md` | Paleta, tipografia, logotipo, grafismos |
| `11-scope-and-out-of-scope.md` | Escopo previsto e fora de escopo |
| `12-risk-register.md` | Riscos identificados |
| `13-open-decisions.md` | Decisões operacionais em aberto |
| `14-glossary.md` | Glossário de termos do projeto |
| `15-acceptance-criteria.md` | Critérios de aceite da Etapa 0 e adiante |
| `16-change-log.md` | Histórico de mudanças |
| `17-image-inventory.md` | Inventário e triagem das imagens de produto (3 acervos) |
| `18-catalog-audit.md` | Auditoria do catálogo: ~172 SKUs, divergências e cobertura |
| `19-url-inventory.md` | URLs do site atual, SEO e plano de redirecionamento 301 |
| `20-resolved-recommendations.md` | Textos normativos de L-08 a L-15 (D-031 a D-038) — encerram a Etapa 0 |

## Etiquetas de origem (rastreabilidade)

`USER_DECISION` · `BRANDING` · `CATALOG` · `CURRENT_SITE` · `IMAGE_ASSET` · `TECHNICAL_INFERENCE` · `LOVABLE_RECOMMENDATION`

- Todo item `TECHNICAL_INFERENCE` traz o raciocínio explícito.
- Todo item `LOVABLE_RECOMMENDATION` recebe status **PENDENTE_DE_APROVAÇÃO** e nunca substitui uma decisão do usuário.

## Ordem de precedência das fontes

1. Decisões explícitas do usuário
2. Branding oficial AviZee
3. Catálogo e dados técnicos
4. Imagens e arquivos de produto
5. Conteúdo do site atual
6. Recomendações do Lovable

## Estado atual

**Etapa 0 — Constituição do Projeto**: documentação criada. Nenhuma implementação, nenhum
layout alterado, nenhum banco de dados criado.

**Materiais recebidos e analisados**: manual de branding, acervo de imagens e tipografia
(2026-07-31); **catálogo em PDF, logotipo vetorial e código-fonte do site atual** (2026-08-01).
**Todas as 8 fontes previstas foram analisadas — não há mais bloqueio de material.**

**Pendências que bloqueiam a Etapa 1** (decisão, não material):
- **L-12** — tratamento do grupo "SOCOREX" e demais nomes com marca de terceiro (R-05)
- **L-13** — divergências de código DIV-10 a DIV-16 (chave única do catálogo)
- **L-14** — entrada ou não dos 55 SKUs do catálogo complementar
- **O-26** — versões complementares do logotipo (mono, negativa, símbolo, favicon)
- **O-27 / RK-15** — revogar a credencial SMTP exposta no código-fonte atual
