# 23 — Inventário do Código-Fonte

Origem: `CURRENT_SITE` (S-02). Lista completa em `data/files.csv` (174 arquivos).

## Distribuição

| Bloco | Conteúdo |
|---|---|
| Raiz | `index.php`, `produtos.php`, `sobre.php`, `contato.php`, `blog.php`, `send_email.php`, `.htaccess`, `composer.json/lock` |
| `includes/` | `header.php` (238 linhas), `footer.php` (27), `head-meta.php` (15), `produtos-data.php` (71) |
| `assets/css/` | `style.css` (614 linhas), `responsive.css` (78), `footer.css` (49) |
| `assets/js/` | `main.js`, `pdf-viewer.js` |
| `assets/data/` | `produtos.csv` (117 linhas) |
| `assets/img/products/` | 72 imagens JPG |
| `assets/docs/` | `catalogo.pdf` |
| `vendor/` | PHPMailer instalado via Composer |

## Tamanho das páginas

| Arquivo | Linhas |
|---|---|
| `produtos.php` | 448 |
| `index.php` | 283 |
| `contato.php` | 277 |
| `includes/header.php` | 238 |
| `sobre.php` | 170 |
| `blog.php` | 102 |

## Achados estruturais

1. **Documento HTML inválido** (F-13): `index.php` imprime uma `<meta>` **antes** do
   `<!DOCTYPE>` e `includes/header.php` abre um segundo `<html><head>` com `<title>AviZee</title>`
   dentro do documento já aberto pela página. Resultado: dois `<html>`, dois `<head>` e dois
   `<title>` no HTML entregue.
2. **CSS de página embutido**: `contato.php`, `blog.php` e `header.php` carregam blocos `<style>`
   extensos, duplicando regras entre páginas.
3. **Camada de dados acoplada à view**: `produtos-data.php` lê e agrupa o CSV a cada requisição;
   `index.php` repete a lógica de agrupamento por nome dentro da própria página.
4. **Sem camada de rota**: as URLs limpas dependem exclusivamente do `.htaccess`.
5. **Sem testes, sem build, sem lint, sem versionamento visível** no pacote recebido.

## Reaproveitamento na v1

`LOVABLE_RECOMMENDATION` — Status: **PENDENTE_DE_APROVAÇÃO**

| Item | Reaproveitar? |
|---|---|
| Estrutura de URLs (`/produtos`, `/sobre`, `/contato`) | SIM |
| Dados do `produtos.csv` | SIM, como fonte de migração (não como runtime) |
| Imagens de produto | SIM, após triagem de direito de uso |
| CSS, JS e markup atuais | NÃO — design system novo |
| `send_email.php` | NÃO — substituído por server function |
| PHPMailer / Composer | NÃO — stack diferente |
