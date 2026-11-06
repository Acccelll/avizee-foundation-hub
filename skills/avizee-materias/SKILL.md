---
name: avizee-materias
description: Cria matérias educativas e informativas da AviZee (avicultura B2B) para a Central de Conteúdos do site e o post correspondente no Instagram, com fontes verificadas, otimização para SEO e as regras de marca da AviZee. Use sempre que pedirem pauta, matéria, artigo, conteúdo, post, texto para o site ou para o Instagram da AviZee, calendário editorial, ou quando for publicar ou revisar conteúdo pelo ERP AviZee.
---

# Matérias AviZee

A Central de Conteúdos tem um objetivo: transformar o site da AviZee em **referência de consulta em avicultura** e gerar tráfego orgânico (SEO). Cada matéria nasce para o site e dá origem a um post no Instagram (decisão D-024).

A AviZee é uma empresa especializada em equipamentos, componentes, peças de reposição e soluções para avicultura, com atendimento B2B em todo o Brasil. **O site não é uma loja.** A matéria educa; o catálogo esclarece; a Lista de Cotação converte.

## Fluxo obrigatório

Siga as etapas na ordem. Não pule a verificação de fontes.

1. **Pauta.** Defina o tema, a pergunta que a matéria responde, a palavra-chave principal, 2–4 palavras-chave secundárias, o público (gerente de granja, técnico de incubatório, comprador de manutenção etc.) e a categoria editorial. Veja `references/seo.md` e `references/categorias.md`.
   - Com o conector do ERP disponível, consulte as matérias já publicadas e as que estão em andamento para evitar duplicidade (canibalização de palavra-chave).
2. **Pesquisa.** Levante fontes confiáveis e anote o que cada uma sustenta. Use a hierarquia de `references/fontes.md`. Toda afirmação técnica, número, prazo, dose, temperatura ou percentual precisa de uma fonte. O que não tiver fonte sai do texto.
3. **Redação da matéria do site.** Escreva conforme `references/padrao-editorial.md` e monte o corpo nos blocos aceitos pelo site (`references/blocos-site.md`).
4. **Post do Instagram.** Derive o post seguindo **exatamente** `references/instagram.md`.
5. **Checklist.** Rode `references/checklist.md` item a item. Corrija o que falhar antes de entregar.
6. **Entrega ou envio.**
   - **Com o conector do ERP** (ferramentas `avizee_*`): crie o rascunho e envie para revisão técnica. Veja "Publicação pelo ERP" abaixo.
   - **Sem conector:** entregue o pacote no formato de `references/formato-saida.md`, pronto para colar no ERP.

## Regras inegociáveis

- **Só o nome da fonte, nunca o link**, tanto no site quanto no Instagram: `Fonte: Embrapa Suínos e Aves`. Guarde os links só nas notas internas de pesquisa, para o revisor conferir.
- **Nenhuma marca de terceiro**, fabricante ou nome comercial de produto em texto público. Fale pela função ("vacinador automático de seringa", "bebedouro tipo nipple"). O site rejeita automaticamente os termos de marca conhecidos.
- **Nada de preço, promoção, prazo de entrega, estoque ou frete.** Vocabulário proibido: comprar, carrinho, preço, a partir de R$, frete grátis, pronta-entrega, em estoque, promoção, desconto, parcelamos.
- **Sem prescrição.** Não indique dose, protocolo vacinal, medicamento ou tratamento como recomendação. Descreva o que a literatura diz e oriente a seguir o médico-veterinário responsável e a bula ou o manual do fabricante.
- **Sem promessa de resultado** ("aumenta a produtividade em 20%") que não venha de uma fonte citada, e mesmo assim atribuída à fonte.
- **Avicultura em primeiro lugar.** Suinocultura e bovinocultura só como tema complementar e pontual.
- **Nada inventado.** Se não encontrou fonte para algo, diga isso a quem pediu em vez de preencher.

## Revisão técnica

Toda matéria passa por revisão técnica humana antes de ir ao ar (`requires_technical_review = true`). O Claude **cria e envia para revisão**; quem publica é o revisor aprovado no ERP. Nunca tente contornar essa etapa, mesmo que peçam. Se pedirem para "publicar direto", explique que a publicação acontece depois da aprovação do revisor.

## Publicação pelo ERP

Quando o conector do ERP AviZee estiver disponível, o fluxo é:

1. `avizee_listar_categorias` e `avizee_listar_familias` para pegar categorias e famílias válidas (use só slugs retornados; nunca invente slug de família).
2. `avizee_buscar_materias` com a palavra-chave principal, para checar duplicidade.
3. `avizee_criar_rascunho` com o pacote completo (matéria + post do Instagram + fontes + notas ao revisor).
4. Se a ferramenta devolver erros de validação, corrija e reenvie. Não remova conteúdo só para passar; ajuste o texto.
5. `avizee_enviar_revisao` com uma nota curta ao revisor (o que verificar com mais atenção).
6. Informe ao usuário o identificador da matéria e o status.

Se as ferramentas tiverem nomes diferentes destes, use as equivalentes que o conector oferecer. Se o conector não estiver conectado, use a entrega manual.
