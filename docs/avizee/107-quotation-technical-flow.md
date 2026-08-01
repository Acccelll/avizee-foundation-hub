# 107 — Fluxo Técnico da Lista de Cotação

## 1. Lista no cliente

- Persistência em `localStorage` (`avizee.quote.v1`) + estado em memória; hidratação após
  montagem para evitar divergência de SSR.
- Itens: `product_id` ou `family_id`, rótulo de variação, quantidade estimada (inteiro ≥ 1,
  máx. 999.999), observação (máx. 300 caracteres).
- Operações: adicionar, editar quantidade, editar observação, remover, limpar, continuar
  navegando. Contador no cabeçalho. Máximo de 50 itens por lista.
- Nenhum valor monetário, subtotal, total, frete, prazo ou disponibilidade em qualquer ponto.
- Item cujo produto foi despublicado é sinalizado como "indisponível para cotação" e pode ser
  removido; não bloqueia o envio dos demais.

## 2. Envio

`submitQuotation` (função de servidor):

1. Validação Zod de todos os campos (servidor é autoridade; cliente apenas antecipa erro).
2. Honeypot invisível + campo de tempo mínimo de preenchimento (3 s).
3. Rate limit: 5 envios / 10 min por IP-hash; 20 / dia.
4. Idempotência: `client_request_id` (UUID gerado no cliente) com unicidade no banco —
   reenvio devolve o mesmo protocolo.
5. Reconciliação: cada item revalidado contra o catálogo; grava-se **snapshot** de nome, SKU
   e variação, garantindo integridade histórica mesmo após despublicação.
6. Persistência transacional: `quotations` + `quotation_items` + `quotation_events`
   (`RECEIVED`) + `consent_records`.
7. Protocolo: `AVZ-{AAAA}-{sequencial 6 dígitos}`, gerado por sequence, único.
8. Enfileiramento em `outbox_messages`: notificação interna e confirmação ao solicitante.
9. Resposta: protocolo + resumo; a lista local é limpa somente após confirmação do servidor.

## 3. Dados registrados

Protocolo, data, origem (`quotation_sources`: página, campanha, UTM, referrer), dados da
empresa e do contato, cidade, UF, itens, quantidades, observações, consentimentos, status e
histórico de eventos. **Nunca**: preço, desconto, frete, total, reserva de estoque ou pedido
confirmado.

## 4. Estados

RECEIVED → IN_REVIEW → WAITING_INFORMATION → IN_SERVICE → RESPONDED → CONVERTED → CLOSED;
laterais: SPAM, CANCELLED. Toda transição grava `quotation_events` com ator e nota interna.
Rótulos públicos em português conforme `102`.

## 5. Cenários de falha

| Cenário | Comportamento |
|---|---|
| E-mail falha | Cotação permanece válida; outbox tenta 5 vezes com backoff; alerta ao operador; painel mostra "notificação pendente" |
| WhatsApp não abre | Exibe número e protocolo em texto copiável |
| Banco indisponível | Erro explícito, lista **preservada** no cliente, botão "tentar novamente", nenhum protocolo falso |
| Item despublicado | Sinalizado; envio prossegue com snapshot; painel destaca o item |
| Produto com conflito de código | Não pode ser adicionado; CTA para cotação livre com descrição |
| Envio duplicado | Idempotência devolve o mesmo protocolo |
| Sessão/lista expirada | `localStorage` com TTL de 30 dias; expirada, lista é limpa com aviso |


## Atualização 2026-08-01 — DT-07 e DT-08 aprovadas

A mesma transação registra cotação, itens, protocolo, origem, consentimentos e o evento de
outbox. Somente após o commit são tentados e-mail interno, e-mail de confirmação e demais
notificações. **Falha de e-mail nunca apaga nem invalida cotação registrada.** Obrigatórios
idempotência, retry, limite de tentativas, dead-letter, auditoria, monitoramento e
reprocessamento administrativo. Proibido enviar e-mail como única ação do formulário.

**WhatsApp**: `wa.me` como canal secundário, preferencialmente após o registro — registrar,
apresentar protocolo, oferecer continuidade. A mensagem pode conter protocolo, família, SKU
validado, variação, quantidade e URL pública; nunca marca interna, fornecedor, custo, observação
administrativa ou dado técnico não confirmado. API oficial permanece evolução futura.
