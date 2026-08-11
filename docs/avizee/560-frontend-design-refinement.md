# 560 — Refinamento visual aprovado com frontend-design

Status: `IMPLEMENTADO_EM_BRANCH_PARA_VALIDACAO`

Origem da decisão: aprovação explícita do usuário em 2026-08-11 das propostas `AVZ-DES-01` a `AVZ-DES-08`.

Esta intervenção é um **refinamento visual controlado**, não um redesign. Permanecem invariantes o layout estrutural, a arquitetura de informação, o conteúdo aprovado, a taxonomia, o modelo comercial B2B, a ausência de preço público e as regras de publicação.

## Escopo aprovado e implementação

### AVZ-DES-01 — assinatura visual do Hero

- O Hero mantém a mesma sequência: eyebrow → H1 → posicionamento → CTA duplo.
- A assinatura passa a usar um filete institucional de blocos sólidos Vinho + Terracota.
- Não foram introduzidas fotografias ou grafismos sem asset oficial disponível no repositório.

### AVZ-DES-02 — saneamento de utilities incompatíveis

Foram removidas do vocabulário visual as utilities decorativas que conflitavam com `10-brand-guidelines.md`:

- `hero-atmosphere` com gradientes e malha;
- `reveal` e seu keyframe decorativo;
- `card-lift` com translação e sombra decorativa;
- `brand-rule` anterior baseada em gradiente.

Foram introduzidas duas utilities compatíveis:

- `brand-rule`: filete sólido com Vinho e Terracota;
- `brand-interactive`: transição funcional somente de borda.

### AVZ-DES-03 — hierarquia tipográfica

As principais superfícies públicas passaram a consumir os tokens semânticos existentes (`text-display`, `text-h1`, `text-h2`, `text-h3`, `text-h4`, `text-body-lg`, `text-body`, `text-body-sm`, `text-caption`) em vez de escalas arbitrárias quando o papel semântico já estava definido.

Escopo coberto nesta intervenção:

- Home;
- Shell público, breadcrumb e footer;
- Contato;
- Sobre;
- catálogo principal;
- categoria de catálogo;
- card de família;
- ficha de família;
- soluções e solução por aplicação;
- artigo público.

Montserrat convencional permanece como única família tipográfica.

### AVZ-DES-04 — redução da linguagem de cards em blocos institucionais

- Cards funcionais de produto, conteúdo e navegação permanecem.
- Diferenciais e etapas de cotação da Home deixam de depender de caixas completas e passam a usar divisores/ênfases sólidas.
- A página Sobre mantém a mesma grade e sequência, mas troca parte das caixas por filetes, borda lateral e superfície institucional.
- CTAs institucionais continuam em blocos sólidos oficiais.

### AVZ-DES-05 — breakpoints

Foram alinhados ao comportamento responsivo aprovado em `87-responsive-behavior.md`:

- `FamilyGrid`: 1 coluna base, 2 colunas em `md` (≥ 768 px), 3 colunas em `lg` (≥ 1024 px);
- navegação pública: menu horizontal somente em `lg` (≥ 1024 px), mantendo menu móvel abaixo desse limiar.

### AVZ-DES-06 — footer

O texto simples “AviZee” foi substituído visualmente pela geometria do SVG oficial já existente, aplicada como máscara monocromática em Creme sobre fundo Preto. Nenhum novo desenho de logotipo foi criado e a estrutura de três colunas do footer permanece inalterada.

### AVZ-DES-07 — página Sobre

A página recebeu tratamento institucional com a assinatura aprovada, filetes Vinho/Terracota, borda de ação Terracota e superfície neutra derivada. Conteúdo, ordem, semântica e CTA permanecem inalterados.

### AVZ-DES-08 — assinatura recorrente

A assinatura recorrente escolhida é o **filete de dois blocos sólidos Vinho + Terracota**. Ela deriva diretamente da linguagem de blocos sólidos do manual e não cria novo grafismo. O uso é restrito a pontos institucionais, evitando repetição decorativa.

## Restrições preservadas

- nenhuma fonte adicional;
- nenhuma Montserrat Alternates;
- nenhuma nova cor de marca;
- nenhum gradiente;
- nenhuma sombra decorativa;
- nenhuma animação de entrada gratuita;
- nenhum glassmorphism;
- nenhum grafismo novo;
- nenhuma estética de marketplace/e-commerce;
- nenhuma alteração de preço, estoque, fornecedor ou marca de terceiro;
- nenhuma alteração de taxonomia ou conteúdo institucional não confirmado.

## Gate de integração

A branch só pode ser integrada após CI verde e revisão do diff contra `main`. O PR é a evidência operacional desta implementação e deve registrar os checks finais antes do merge.
