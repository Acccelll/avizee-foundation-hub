# 169 — Direitos de Imagem e Quarentena

- Estados de direito: `OWNED`, `AUTHORIZED_BY_SUPPLIER`, `LICENSED`, `RIGHTS_UNCONFIRMED`,
  `RESTRICTED`, `EXPIRED`, `DO_NOT_PUBLISH`.
- Estados de revisão de imagem cobrem marca visível, baixa qualidade, imagem incorreta,
  direito pendente, ausência de imagem e não publicar.
- Toda imagem entra em quarentena por padrão (D-048). Publicação exige direito confirmado.
- Cada mudança de estado é registrada em `image_review_events`.
