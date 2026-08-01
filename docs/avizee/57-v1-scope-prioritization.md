# 57 — Priorização da v1

Status: `PENDENTE_DE_APROVAÇÃO`. O escopo obrigatório de §27 do prompt está **integralmente
contemplado**; nada foi reduzido.

## ESSENCIAL_V1
Home · Produtos · Categorias · Famílias · Busca · Filtros básicos (categoria e família) ·
Lista de cotação e confirmação · Sobre · Contato · Central de Conteúdos · Artigos ·
Política de Privacidade · 404 · Redirecionamentos · SEO estrutural (canônicas, sitemap,
robots, breadcrumbs, títulos e descrições únicos) · Painel conceitual (arquitetura de `43`).

## IMPORTANTE_V1
Soluções (hub + 3 páginas) · Categorias editoriais · Página `/busca` dedicada ·
Filtro por aplicação (após normalização) · Política de Cookies · Blocos de relação
(produtos relacionados, conteúdos recomendados) · WhatsApp contextual por produto.

## PODE_ENTRAR_V1
Termos de Uso · Páginas de SKU excepcionais · FAQ dentro de `/cotacao` e `/contato` ·
Envio da lista inteira por WhatsApp (depende de DEC-11) · Histórico local de busca.

## EVOLUÇÃO
Autores · Tags públicas · Central de materiais · Glossário · Página de bovinocultura ·
Comparador de produtos · Filtro "possui imagem" · Área autenticada de cliente ·
Notícias e mercado · Integração com CRM (O-19).

## NÃO_RECOMENDADO
Hub de segmentos · Página de suinocultura · Resultados de busca indexáveis ·
Status de cotação sem autenticação · Página de tag na v1 · Mega menu com famílias ·
URL por variação de medida · Qualquer superfície com preço, carrinho ou checkout.

## Dependências que condicionam o escopo

| ID | Dependência | Bloqueia |
|---|---|---|
| DEP-01 | Classificação família → categoria → aplicação (D-042) | Categorias, filtros, soluções |
| DEP-02 | Texto próprio de categoria e solução | Indexação dessas páginas |
| DEP-03 | Direito de uso das imagens (Q-02) | Uso de foto real; placeholder cobre a v1 |
| DEP-04 | Dados de contato (Q-08) | Rodapé e `/contato` |
| DEP-05 | Textos legais e CNPJ (Q-13) | Páginas legais e formulário |
| DEP-06 | Provedor de e-mail e destinatário (O-05, O-06) | Envio da cotação |
| DEP-07 | Rotação das credenciais (Q-01, O-27) | Lançamento seguro |
| DEP-08 | Aprovação de L-01 a L-07 | Cores funcionais, dicionário de marcas, URLs |
