# 257 — Etapa 9: Dados Pendentes e Tratamento na Interface

Status: `PENDENTE_DE_APROVAÇÃO`.

## 1. Princípio

Dado não confirmado nunca é inventado, nunca é substituído por exemplo plausível e nunca é
ocultado sem explicação. A interface declara a ausência com o rótulo normativo
**"informação em confirmação"**, exposto de forma acessível (texto real, não apenas cor ou ícone).

## 2. Campos pendentes

| Campo | Decisão | Onde apareceria | Tratamento atual |
|---|---|---|---|
| Telefone | Q-08 | Contato, rodapé | "informação em confirmação" |
| WhatsApp | Q-08 | Contato, canal secundário | Bloco desativado |
| E-mail | Q-08 | Contato, páginas legais | "informação em confirmação" |
| Endereço | Q-08 | Contato, mapa, JSON-LD | Sem mapa, sem `PostalAddress` |
| Horário de atendimento | Q-08 | Contato | "informação em confirmação" |
| Razão social | Q-13 | Termos, Privacidade, rodapé | "informação em confirmação" |
| CNPJ | Q-13 | Termos, Privacidade | "informação em confirmação" |
| Controlador LGPD e canal do titular | Q-13 | Privacidade | "informação em confirmação" |
| Prazo de resposta comercial | O-10 | Home, Contato, Cotação | Nenhuma promessa exibida |

## 3. Efeitos técnicos

- JSON-LD `Organization` é emitido **sem** `telephone`, `email` e `address`: campo ausente é
  preferível a campo falso, e dado inventado em dado estruturado é penalizado por buscador.
- As páginas legais são `noindex` e removidas do `sitemap.xml` enquanto estiverem em rascunho.
- O CTA principal de Contato direciona à Lista de Cotação, que é o canal operacional real e não
  depende de nenhum dado pendente.

## 4. Critério de saída

Confirmadas Q-08 e Q-13, basta preencher `src/content/institutional.ts`, trocar o status dos
documentos legais para `VIGENTE` com data de vigência, remover o `noindex` dessas rotas e
reincluí-las no sitemap. Nenhuma alteração estrutural de layout é necessária.
