---
name: avizee-materias
description: Cria, revisa com o usuário e publica matérias educativas e informativas da AviZee (avicultura B2B) para a Central de Conteúdos do site e o post correspondente no Instagram, com fontes verificadas, otimização para SEO e as regras de marca da AviZee. Use sempre que pedirem pauta, matéria, artigo, conteúdo, post, texto para o site ou para o Instagram da AviZee, calendário editorial, ou quando for publicar conteúdo pelo ERP AviZee.
---

# Matérias AviZee

A Central de Conteúdos tem um objetivo: transformar o site da AviZee em **referência de consulta em avicultura** e gerar tráfego orgânico (SEO). Cada matéria nasce para o site e dá origem a um post no Instagram (decisão D-024).

A AviZee é uma empresa especializada em equipamentos, componentes, peças de reposição e soluções para avicultura, com atendimento B2B em todo o Brasil. **O site não é uma loja.** A matéria educa; o catálogo esclarece; a Lista de Cotação converte.

## Fluxo obrigatório

Siga as etapas na ordem. Não pule a verificação de fontes nem a aprovação.

1. **Pauta.** Defina o tema, a pergunta que a matéria responde, a palavra-chave principal, 2–4 palavras-chave secundárias, o público (gerente de granja, técnico de incubatório, comprador de manutenção etc.) e a categoria editorial. Veja `references/seo.md` e `references/categorias.md`.
   - Com o conector do ERP disponível, consulte as matérias já publicadas e as que estão em andamento para evitar duplicidade (canibalização de palavra-chave).
2. **Pesquisa.** Levante fontes confiáveis e anote o que cada uma sustenta. Use a hierarquia de `references/fontes.md`. Toda afirmação técnica, número, prazo, dose, temperatura ou percentual precisa de uma fonte. O que não tiver fonte sai do texto.
3. **Redação da matéria do site.** Escreva conforme `references/padrao-editorial.md` e monte o corpo nos blocos aceitos pelo site (`references/blocos-site.md`).
4. **Post do Instagram.** Derive o post seguindo **exatamente** `references/instagram.md`.
5. **Checklist.** Rode `references/checklist.md` item a item. Corrija o que falhar antes de mostrar.
6. **Revisão na conversa.** Apresente ao usuário o pacote completo no formato de `references/formato-saida.md`, incluindo as notas de verificação com os links das fontes, e peça aprovação. Ajuste o que ele pedir e apresente de novo os trechos alterados. Repita até a aprovação.
7. **Publicação.** Só depois de aprovação explícita do usuário nesta conversa ("aprovado", "pode publicar" ou equivalente claro):
   - **Com o conector do ERP** (ferramentas `avizee_*`): publique conforme "Publicação pelo ERP" abaixo.
   - **Sem conector:** entregue o pacote final aprovado, pronto para colar no ERP.

## Regras inegociáveis

- **Só o nome da fonte, nunca o link**, tanto no site quanto no Instagram: `Fonte: Embrapa Suínos e Aves`. Os links aparecem apenas nas notas de verificação mostradas ao usuário na revisão e enviadas como notas internas; nunca no texto público.
- **Nenhuma marca de terceiro**, fabricante ou nome comercial de produto em texto público. Fale pela função ("vacinador automático de seringa", "bebedouro tipo nipple"). O site rejeita automaticamente os termos de marca conhecidos.
- **Nada de preço, promoção, prazo de entrega, estoque ou frete.** Vocabulário proibido: comprar, carrinho, preço, a partir de R$, frete grátis, pronta-entrega, em estoque, promoção, desconto, parcelamos.
- **Sem prescrição.** Não indique dose, protocolo vacinal, medicamento ou tratamento como recomendação. Descreva o que a literatura diz e oriente a seguir o médico-veterinário responsável e a bula ou o manual do fabricante.
- **Sem promessa de resultado** ("aumenta a produtividade em 20%") que não venha de uma fonte citada, e mesmo assim atribuída à fonte.
- **Avicultura em primeiro lugar.** Suinocultura e bovinocultura só como tema complementar e pontual.
- **Nada inventado.** Se não encontrou fonte para algo, diga isso ao usuário em vez de preencher.
- **Nunca publique sem aprovação explícita** do usuário na conversa, nem em tarefas agendadas ou automáticas. Aprovação de uma matéria não vale para outra, nem para uma versão alterada depois da aprovação.

## Revisão técnica

A revisão técnica acontece na conversa: o usuário que aprova é o revisor responsável. Ao publicar, informe o nome dele como revisor (o conector registra quem aprovou). Em temas de vacinação, sanidade e manejo, chame a atenção do usuário para os trechos técnicos mais sensíveis antes de pedir a aprovação.

## Publicação pelo ERP

Quando o conector do ERP AviZee estiver disponível:

1. `avizee_listar_categorias` e `avizee_listar_familias` para pegar categorias e famílias válidas (use só slugs retornados; nunca invente slug de família).
2. `avizee_buscar_materias` com a palavra-chave principal, para checar duplicidade antes de redigir.
3. Após a aprovação, `avizee_salvar_materia` com o pacote completo (matéria, post do Instagram, fontes e notas de verificação).
4. Se a ferramenta devolver erros de validação, corrija. Se a correção mudar o sentido do texto, mostre ao usuário e peça nova aprovação; ajustes puramente de formato não precisam.
5. `avizee_publicar_materia` informando o revisor que aprovou. Devolva ao usuário o endereço público da matéria.
6. Instagram: se a conta estiver conectada no ERP e o usuário quiser postar, `avizee_publicar_instagram` com a imagem que ele indicar. O Instagram não aceita post sem imagem. Sem conta conectada ou sem imagem, entregue a legenda pronta para postagem manual.

Se as ferramentas tiverem nomes diferentes destes, use as equivalentes que o conector oferecer. Se o conector não estiver conectado, use a entrega manual.
