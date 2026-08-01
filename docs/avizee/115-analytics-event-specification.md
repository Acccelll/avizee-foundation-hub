# 115 — Especificação de Eventos de Analytics

**Nenhum rastreamento é ativado nesta etapa.** Apenas a especificação. Detalhe em
`architecture/events.csv`.

## 1. Eventos

| Evento | Parâmetros permitidos |
|---|---|
| `search_performed` | `query_length`, `results_count`, `has_results` |
| `filter_applied` | `filter_key`, `filter_value_code`, `results_count` |
| `product_family_viewed` | `family_slug`, `category_slug` |
| `sku_selected` | `product_slug`, `family_slug` |
| `quotation_item_added` | `product_slug`, `family_slug`, `item_count` |
| `quotation_item_removed` | `product_slug`, `item_count` |
| `quotation_started` | `item_count`, `entry_page` |
| `quotation_submitted` | `item_count`, `has_observation`, `uf` |
| `quotation_error` | `error_code`, `step` |
| `whatsapp_clicked` | `context` (produto/família/cotação/rodapé) |
| `article_viewed` | `article_slug`, `editorial_category` |
| `article_product_clicked` | `article_slug`, `product_slug` |
| `document_downloaded` | `document_slug` |
| `product_not_found_requested` | `query_length` |

## 2. Regras

- **Proibido** enviar: nome, e-mail, telefone, CNPJ, empresa, mensagem, observação, protocolo,
  IP bruto, qualquer campo ADMIN_ONLY ou marca interna.
- `query_length` substitui o termo buscado quando o termo puder conter dado pessoal; a
  curadoria de termos ocorre no banco (busca interna), não na ferramenta externa.
- Nomes em `snake_case`, ASCII, estáveis; alteração exige nova decisão.
- Anonimização de IP na ferramenta; sem identificador persistente entre sites.
- **Consentimento obrigatório** antes de qualquer coleta não essencial; sem consentimento,
  nenhum script de analytics é carregado.
- UTMs capturados na cotação ficam no banco (`quotation_sources`), não na ferramenta.

## 3. Métricas de negócio (calculadas no banco, sem ferramenta externa)

Cotações por período, itens por cotação, famílias mais cotadas, taxa de conversão de
visita → cotação (quando analytics for ativado), buscas sem resultado.


## Atualização 2026-08-01 — DT-20 aprovada

Eventos aprovados, **sem ativação imediata** e condicionados a consentimento quando aplicável.
Proibida coleta de nome, e-mail, telefone, CNPJ e conteúdo de mensagem. Eventos desacoplados do
fornecedor por `AnalyticsProvider`; preview sem analytics real; UTMs controladas; política de
privacidade atualizada; modo de desenvolvimento verificável.
