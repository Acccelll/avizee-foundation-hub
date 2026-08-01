# 32 — Inventário Funcional

## O que existe hoje

| Funcionalidade | Implementação | Estado |
|---|---|---|
| Listagem de produtos | leitura do CSV em runtime, agrupada por nome | funciona |
| Filtro de produtos | JavaScript no cliente, sobre a lista já renderizada | funciona, não escala |
| Carrossel de destaques | JS próprio em `index.php` | funciona |
| Modal de produto | JS próprio, exibe imagem e variações | funciona |
| Contato por WhatsApp | link `wa.me` + `web.whatsapp.com/send` com mensagem pré-montada | funciona |
| Formulário de contato | POST para `send_email.php` (PHPMailer/SMTP) com honeypot e reCAPTCHA | funciona |
| Visualizador de PDF | `pdf-viewer.js` sobre `assets/docs/catalogo.pdf` | a aposentar (D-038) |
| Menu mobile | botão com `aria-expanded` | funciona |
| Widget social | EmbedSocial | terceiro |

## O que não existe

- Lista de Cotação (D-007) — o modelo de conversão aprovado **não está implementado**.
- Página de produto individual e página de família.
- Taxonomia navegável (Segmento → Solução → Categoria → Família).
- Busca no catálogo.
- Banco de dados, área administrativa, autenticação.
- Central de Conteúdos com artigos reais.
- Analytics, consentimento de cookies, política de privacidade.
- Persistência de lead (o formulário envia e-mail e não guarda nada — risco RK-07).

## Fluxo de conversão atual vs. aprovado

| Etapa | Hoje | Aprovado |
|---|---|---|
| Descoberta | listagem única | taxonomia + busca |
| Interesse | modal | página de família/SKU |
| Ação | WhatsApp por produto | **adicionar à Lista de Cotação** |
| Registro | nenhum | cotação persistida antes do envio |
| Retorno | conversa avulsa | lead rastreável |

`TECHNICAL_INFERENCE` — Raciocínio: como o site atual não persiste nada, **não há histórico de
leads nem base de dados a migrar**. A v1 parte de estado zero em dados transacionais — o que
elimina risco de migração e concentra o esforço no catálogo.
