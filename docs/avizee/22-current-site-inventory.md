# 22 — Inventário do Site Atual (publicado)

Origem: `CURRENT_SITE` (S-01 + S-02).

## Identidade técnica

| Item | Estado |
|---|---|
| Domínio | `avizee.com.br` |
| Stack | PHP puro, sem framework, sem banco de dados |
| Includes | `header.php`, `footer.php`, `head-meta.php`, `produtos-data.php` |
| Dados de produto | `assets/data/produtos.csv` lido em runtime (117 linhas) |
| Dependência externa | `phpmailer/phpmailer ^6.9` (Composer) — única dependência |
| Servidor | Apache + `.htaccess` (remove `.php`; 301 de barra final); handler PHP do cPanel |
| Total de arquivos | 174 (inclui `vendor/`) — ver `data/files.csv` |

## Páginas públicas

| URL | Arquivo | Função |
|---|---|---|
| `/` | `index.php` | Home |
| `/produtos` | `produtos.php` | Listagem completa do CSV |
| `/sobre` | `sobre.php` | Institucional |
| `/contato` | `contato.php` | Formulário + mapa |
| `/blog` | `blog.php` | 3 cards estáticos, links `#` |

Nenhuma página individual de produto existe. Detalhe em `data/pages.csv`.

## Serviços de terceiros embutidos

| Serviço | Onde | Observação |
|---|---|---|
| Google Fonts (Montserrat 400/600/700) | head de todas as páginas | caminho crítico externo |
| Google Maps (iframe) | `/contato` | carregado no load |
| Google reCAPTCHA | `/contato` + `send_email.php` | chave secreta literal no código |
| EmbedSocial (`embedsocial.com/cdn/ht.js`) | `/blog` e home | widget social |
| WhatsApp (`wa.me/5519998982930`) | botão flutuante + CTA por produto | canal de conversão atual |
| Gmail SMTP | `send_email.php` | credencial em texto claro (F-01) |

## Dados de contato publicados

- Endereço: Rua Ada Caroline Scarano, 259 — João Aranha, Paulínia/SP
- Telefone/WhatsApp: (19) 99898-2930
- E-mail: comercial@avizee.com.br
- Instagram `@avizee.equipamentos` · LinkedIn `company/avizee`
- Rodapé: "© 2025 AviZee. Todos os direitos reservados."

`TECHNICAL_INFERENCE` — Raciocínio: os dados acima aparecem em `contato.php` e
`includes/footer.php` como literais, sem fonte de dados única. Na v1 devem vir de uma
configuração central para evitar divergência entre páginas. Nenhuma confirmação de que
permanecem válidos foi solicitada — ver `38-stage-01-open-questions.md`.
