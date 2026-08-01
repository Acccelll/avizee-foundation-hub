# 19 — Inventário de URLs e Plano de Redirecionamento

Origem: `CURRENT_SITE` — código-fonte recebido em 2026-08-01 (S-02).

## Stack atual

| Item | Situação |
|---|---|
| Linguagem | PHP puro, sem framework; includes (`header.php`, `footer.php`, `head-meta.php`, `produtos-data.php`) |
| Dados | `assets/data/produtos.csv` lido em runtime por `produtos-data.php` (117 SKUs) — **não há banco de dados** |
| Formulários | `send_email.php` e `contato.php` via PHPMailer/SMTP |
| Servidor | Apache + `.htaccess`: remove `.php` da URL e redireciona `/rota/` → `/rota` (301) |
| Hospedagem | cPanel (handler PHP gerado pelo cPanel no `.htaccess`) |
| Total de arquivos | 174 (inclui `vendor/` do Composer) |

## URLs públicas atuais

| URL canônica | Arquivo | Conteúdo | Destino proposto na v1 |
|---|---|---|---|
| `/` | `index.php` | Home | `/` |
| `/produtos` | `produtos.php` | Listagem completa do CSV | `/produtos` (catálogo com taxonomia — ver `07-product-taxonomy.md`) |
| `/sobre` | `sobre.php` | Institucional | `/sobre` |
| `/contato` | `contato.php` | Formulário | `/contato` |
| `/blog` | `blog.php` | Blog | `/conteudos` (Central de Conteúdos, D-024) — **301** |
| `/produtos.php`, `/index.php`, etc. | — | Variantes com extensão | 301 para a versão sem `.php` |
| `/assets/docs/catalogo.pdf` | PDF | Catálogo em PDF, exibido por `pdf-viewer.js` | Manter URL viva ou 301 para `/catalogo` |
| `/assets/img/products/<codigo>.jpg` | 72 imagens | Imagens de produto | Manter ou 301 para os novos caminhos |
| `/send_email.php` | endpoint POST | Envio do formulário | Substituído por server function — **410/301** |

`TECHNICAL_INFERENCE` — Raciocínio: não existem páginas de produto individuais (DIV-05 confirmada
— os links "Detalhes" apontam para `#` e toda a listagem é renderizada em `/produtos`). Portanto
**não há URL de SKU a preservar**; o plano de 301 é curto e o risco RK-06 cai de Alto para Médio.
As novas URLs de produto serão criadas do zero, sem histórico de indexação a herdar.

## SEO atual (`includes/head-meta.php`)

| Tag | Valor atual | Problema |
|---|---|---|
| `description` | "Soluções em equipamentos para avicultura e suinocultura" | Peso igual à suinocultura (DIV-01) |
| `og:title` | "AviZee - Soluções para Avicultura" | Aproveitável |
| `og:description` | "Equipamentos de alta qualidade para avicultura e suinocultura" | Mesmo conflito |
| `og:image` | `https://avizee.com.br/assets/img/logo-social.jpg` | **Arquivo não existe no código-fonte recebido** |
| `og:url` | fixo em `https://avizee.com.br` | Não varia por página |
| Canonical | **ausente** | Corrigir na v1 |
| `twitter:card` | **ausente** | Corrigir na v1 |
| Título (`<title>`) | definido por página em cada arquivo | Verificar unicidade |
| Fonte | Montserrat via Google Fonts (400/600/700) | Ver O-24 (self-host vs. CDN) |

Não há `robots.txt` nem `sitemap.xml` no pacote recebido.

## Plano de 301 (proposto)

`LOVABLE_RECOMMENDATION` — Status: **PENDENTE_DE_APROVAÇÃO**

1. `/blog` e `/blog.php` → `/conteudos` (301)
2. Qualquer `/<rota>.php` → `/<rota>` (301) — mantém o comportamento atual do `.htaccess`
3. `/produtos` → mantida (mesma URL, novo conteúdo)
4. `/assets/docs/catalogo.pdf` → manter servindo o arquivo (é link direto, provavelmente indexado)
5. `/send_email.php` → 410 Gone
6. Publicar `robots.txt` + `sitemap.xml` no lançamento

## Achado de segurança

`CURRENT_SITE` — **Credencial de e-mail em texto claro** no código-fonte (`send_email.php`:
usuário e senha de aplicativo SMTP do Gmail em variáveis literais). O pacote foi enviado por
canal comum e a senha está exposta. Ver **RK-15** em `12-risk-register.md`.

**Ação recomendada e imediata**: revogar a senha de aplicativo na conta Google e nunca reutilizá-la
na v1 — o envio passará a usar segredo de servidor, jamais literal em código.
