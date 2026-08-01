# 103 — Classificação de Dados Públicos e Internos

Matriz completa em `architecture/fields-classification.csv`.

## 1. Classes

| Classe | Definição | Exposição |
|---|---|---|
| PUBLIC | Pode aparecer em HTML, API pública, sitemap, JSON-LD | Livre |
| DERIVED_PUBLIC | Derivado de dado interno, sem revelar a origem (ex.: contagem de SKUs) | Livre |
| ADMIN_ONLY | Operacional interno (marca, fornecedor, código original, notas) | Apenas painel autenticado |
| SENSITIVE | Dado pessoal ou de contato | Painel autenticado + papel comercial; nunca em log/analytics |
| SECRET | Credencial, chave, token, assinatura | Somente secrets manager; nunca no banco comum nem no bundle |
| INTERNAL_OPERATIONAL | Métricas, jobs, filas, auditoria | Painel restrito |

## 2. Mecanismo de garantia (não depende de disciplina do desenvolvedor)

1. **Views públicas** (`v_public_products`, `v_public_families`, `v_public_articles`,
   `v_public_media`) contendo **apenas** colunas PUBLIC/DERIVED_PUBLIC.
2. `GRANT SELECT` para `anon` **somente** nessas views; nunca nas tabelas base.
3. RLS nas tabelas base restringindo leitura a papéis autenticados.
4. Serializers públicos com allowlist explícita de campos.
5. Índice de busca pública construído a partir das views públicas.
6. Testes automatizados de vazamento (`123` §R-05): API pública, HTML renderizado, sitemap,
   JSON-LD, resposta de busca e mensagem de WhatsApp.

## 3. Amostra da matriz

| Entidade | Campo | Classe | API pública | API admin | Indexável | Exportável | Logável | Retenção |
|---|---|---|---|---|---|---|---|---|
| products | public_name | PUBLIC | Sim | Sim | Sim | Sim | Sim | Permanente |
| products | public_sku | PUBLIC (se validado) | Sim | Sim | Sim | Sim | Sim | Permanente |
| products | internal_brand | ADMIN_ONLY | **Não** | Sim | Não | Restrito | Não | Permanente |
| products | supplier | ADMIN_ONLY | **Não** | Sim | Não | Restrito | Não | Permanente |
| products | original_code | ADMIN_ONLY | **Não** | Sim | Não | Restrito | Não | Permanente |
| products | internal_notes | ADMIN_ONLY | **Não** | Sim | Não | Não | Não | Permanente |
| media_assets | alt_text | PUBLIC | Sim | Sim | Sim | Sim | Sim | Permanente |
| media_assets | marca_detectada | ADMIN_ONLY | **Não** | Sim | Não | Não | Não | Permanente |
| quotations | protocolo | PUBLIC ao titular | Restrito | Sim | Não | Sim | Sim | Ver `113` |
| quotations | email/telefone | SENSITIVE | Não | Sim | Não | Restrito | **Não** | Ver `113` |
| audit_logs | diff | INTERNAL_OPERATIONAL | Não | Restrito | Não | Não | — | 12 meses (proposto) |
| settings | smtp_* | SECRET | Não | **Não** | Não | Não | Não | Secrets manager |

## 4. Minimização

Só é coletado o necessário à cotação: empresa, contato, e-mail, telefone, cidade, UF,
itens, quantidades, observação e consentimentos. CNPJ é **opcional** e só entra se houver
necessidade comercial aprovada. Nada de dado pessoal em URL, em evento de analytics, em
mensagem de WhatsApp automática ou em log de aplicação.
