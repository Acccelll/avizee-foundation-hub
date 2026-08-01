# 46 — Mapa de Migração de URLs

Status: `PENDENTE_DE_APROVAÇÃO` · Dados: `data/url-migrations.csv`
Nenhum redirecionamento real foi criado. Baseia-se em `19-url-inventory.md` e `31-seo-inventory.md`.

| URL atual | Situação | Destino | HTTP | Risco SEO | Observação |
|---|---|---|---|---|---|
| `/` | Ativa | `/` | 200 | Baixo | Conteúdo novo, URL preservada |
| `/index.php` | Ativa (`.htaccess` já normaliza) | `/` | 301 | Baixo | Manter a regra atual |
| `/produtos` | Ativa | `/produtos` | 200 | **Médio** | Mesma URL, conteúdo e estrutura totalmente novos |
| `/produtos.php` | Ativa | `/produtos` | 301 | Baixo | — |
| `/produtos.html` | **Não existe** no pacote S-02 | `/produtos` | 301 | Nenhum | Regra defensiva, custo zero |
| `/sobre` · `/sobre.php` | Ativa | `/sobre` | 200 / 301 | Baixo | — |
| `/contato` · `/contato.php` | Ativa | `/contato` | 200 / 301 | Baixo | — |
| `/blog` · `/blog.php` | Ativa, sem artigo real | `/conteudos` | 301 | Baixo | D-024; os 3 títulos viram backlog (D-043) |
| `/assets/docs/catalogo.pdf` | Ativa | `/produtos` | **301** | **Médio** | **D-038** — PDF aposentado. PDF pode ter backlink e uso direto por compradores; monitorar |
| `/send_email.php` | Endpoint POST | — | **410** | Nenhum | Substituído por função de servidor; nunca redirecionar POST para o novo formulário |
| `/assets/img/products/{codigo}.jpg` | 72 arquivos | novo caminho de mídia | 301 | Baixo | Só para as imagens que sobreviverem à triagem de direito de uso (D-050) |
| `/assets/*` (css, js, vendor) | Ativa | — | 410 | Nenhum | Stack antiga descontinuada |
| `robots.txt` · `sitemap.xml` | **Inexistentes** | criar na v1 | — | — | Publicação só no lançamento (§32 do escopo) |

## Regras

1. Nenhuma URL antiga é removida sem destino declarado.
2. Redirecionamento é sempre **um salto** — nada de cadeia `/blog.php` → `/blog` → `/conteudos`.
3. `301` para conteúdo equivalente; `410` para o que deixou de existir; nunca `302` em migração.
4. As categorias novas (`/produtos/{categoria}`) não têm URL antiga correspondente: são criação,
   não migração. Não há histórico de indexação de SKU a preservar (DIV-05).
5. Antes do lançamento: capturar as URLs indexadas reais no Search Console (O-16) e reconciliar
   com esta tabela — este mapa é derivado do código-fonte, não do índice do Google.
