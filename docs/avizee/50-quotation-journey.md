# 50 — Jornada e Arquitetura da Cotação

Status: `PENDENTE_DE_APROVAÇÃO` · Vocabulário obrigatório: **Lista de cotação** ·
**Solicitar cotação** · **Itens para cotação**. Proibido: carrinho, checkout, finalizar compra,
pedido, comprar (R-02, D-044).

## 1. Jornada

```text
1 encontra a família (busca · categoria · solução · artigo · WhatsApp)
2 seleciona a variação na tabela
3 informa a quantidade
4 adiciona à lista        → confirmação discreta, sem tirar a pessoa da página
5 continua navegando      → contador visível no cabeçalho
6 revisa em /cotacao
7 edita quantidade e observação por item
8 informa os dados de contato
9 aceita o aviso de privacidade
10 envia
11 recebe protocolo em /cotacao/enviada
12 equipe comercial recebe a oportunidade
```

Regra crítica **L-03 / RK-07**: a solicitação é **persistida antes** de qualquer tentativa de
envio de e-mail ou abertura de WhatsApp. Falha de e-mail nunca pode perder o lead, e o usuário
sempre vê confirmação com protocolo.

## 2. Páginas e estados

| Estado | Comportamento |
|---|---|
| Lista vazia | Explica o que é a lista, sem tom de erro, e leva a `/produtos` |
| Lista preenchida | Itens agrupados por família, com imagem/placeholder, referência e quantidade |
| Formulário | Abaixo da lista, na mesma página; sem etapas artificiais |
| Validação | Por campo, no blur e no envio; foco no primeiro erro |
| Enviando | Botão bloqueado, estado explícito, sem duplo envio |
| Sucesso | `/cotacao/enviada` com protocolo, resumo e próximos passos, sem prometer prazo (RK-12, O-10) |
| Erro | Mensagem clara, dados preservados, alternativa por WhatsApp e telefone |
| Indisponibilidade | "Não conseguimos registrar agora" + canais alternativos; nunca descartar em silêncio |
| Item removido do catálogo | Marcado na lista como "não disponível para cotação", sem bloquear o envio dos demais |
| Retorno ao catálogo | "Continue sua cotação" volta à última categoria |

## 3. Campos preliminares (`PENDENTE_DE_APROVAÇÃO`, DEC-12 em `58`)

**Por item**: família · referência/SKU · rótulo da variação · quantidade · unidade · observação ·
URL de origem.
**Solicitante**: nome* · empresa* · e-mail* · telefone/WhatsApp* · cidade* · estado* ·
CNPJ (opcional) · setor ou cargo (opcional) · mensagem (opcional) · aceite de privacidade*.
(*) obrigatório proposto. Dependências: base legal D-047, texto jurídico Q-13, endereço de
destino O-05 e provedor de e-mail O-06.

Justificativa do mínimo: cidade e estado permitem o atendimento consultivo nacional sem pedir
endereço completo — dado pessoal a mais é passivo de LGPD (RK-11), não vantagem comercial.

## 4. Persistência e comportamento

| Tema | Recomendação |
|---|---|
| Persistência | Local no navegador, 30 dias, sem conta e sem cookie de terceiro |
| Entre páginas | Contador global no cabeçalho, sempre visível |
| Mobile | Barra inferior persistente com "N itens · Solicitar cotação" |
| Item duplicado | Soma quantidade em vez de criar linha nova |
| Variações da mesma família | Linhas distintas, agrupadas visualmente |
| Limite por item | 9.999 unidades (guarda de digitação, não regra comercial) |
| Limite de itens | 50 famílias distintas; acima disso, sugerir contato direto |
| Antispam | Honeypot + limitação de taxa por IP e por sessão + validação no servidor; reCAPTCHA a reavaliar após a rotação da chave (Q-01) |
| Origem | Registrar página de origem, termo de busca e canal (interno, nunca público) |

## 5. WhatsApp contextual

| Cenário | Comportamento |
|---|---|
| Consultar um produto | CTA **secundário** na família; mensagem com nome público, referência, variação e URL |
| Consultar uma variação | Idem, com a variação selecionada |
| Enviar a lista inteira | `DECISÃO_NECESSÁRIA` (DEC-11) |
| Produto não encontrado | CTA no estado vazio da busca |
| Contato geral | Rodapé e `/contato` |

Mensagem **pode** conter: nome público · referência · variação · quantidade · URL · origem.
**Nunca**: marca interna, custo, fornecedor, dado administrativo, preço ou disponibilidade não
confirmados.

`LOVABLE_RECOMMENDATION` — quando a lista inteira for enviada por WhatsApp, **registrar a cotação
antes de abrir o aplicativo**, gerando protocolo e enviando a mensagem já com ele. Sem isso o lead
existe apenas no celular de quem atende, contrariando D-044 e RK-07. Alternativas registradas em
`58` (DEC-11).
