# 109 — Arquitetura de Imagens e Documentos

## 1. Buckets

| Bucket | Visibilidade | Conteúdo |
|---|---|---|
| `private-media` | Privado | **Padrão de todo upload**; pendentes, reprovados, originais, material interno |
| `public-media` | Público | Somente ativos com `review_status = APPROVED` e `rights_status ∈ {OWN, CONTRACTED, AUTHORIZED}` |

A privacidade **não** depende do nome da pasta: é garantida por bucket + políticas RLS em
`storage.objects` + tabela `media_assets` como autoridade. Um arquivo só é copiado para
`public-media` no momento da aprovação, por função de servidor auditada.

## 2. Caminhos

- Privado: `private-media/{ano}/{uuid}/original.{ext}`
- Público: `public-media/{familia-slug}/{uuid}-{papel}-{largura}.webp`
- Nome público **por função** (D-035): nunca contém marca, fornecedor ou código original.

## 3. Metadados obrigatórios

`alt_text` (público, obrigatório para publicar), título interno, fonte, `rights_status`,
`review_status`, autor/contratante, data, hash SHA-256 (deduplicação), dimensões,
`marca_detectada` (ADMIN_ONLY), observações de revisão.

## 4. Ciclo de revisão

`PENDING → APPROVED | REJECTED | REPLACED`. Reprovado permanece **para sempre** em
`private-media` e é fisicamente inalcançável pelo frontend público. Substituição mantém o
histórico (`image_review_events`) e não reaproveita URL pública.

## 5. Resolução na exibição

Imagem específica aprovada → imagem de família aprovada → **placeholder oficial**
(`81-image-and-placeholder-specification.md`). Ausência de imagem nunca bloqueia produto com
dados confiáveis.

## 6. Documentos

`documents`: status, título público, arquivo, data, versão, indexável (bool), direito de
publicação, produto/família relacionados. Documento sem direito confirmado permanece privado.
**O catálogo PDF antigo não é publicado** (D-038); sua URL redireciona para `/produtos`.

## 7. Exclusão

Exclusão lógica por padrão. Exclusão física apenas por ADMINISTRADOR, com registro de
auditoria, após verificação de que nenhum registro publicado referencia o ativo.


## Atualização 2026-08-01 — DT-12 aprovada e DT-13 condicionada

**Storage (DT-12, aprovada)**: privado por padrão — área privada de origem, de quarentena e de
documentos comprobatórios; área pública **somente** para derivados aprovados; URLs temporárias
para ativos privados; políticas de acesso; validação de MIME; limite de tamanho; nomes internos
seguros; metadados e direitos de uso. Mover ou copiar arquivo para a área pública exige
aprovação. **Nome de pasta não é controle de segurança.**

**Processamento de imagens (DT-13, condicionada a prova técnica)**: derivados gerados no upload;
transformação pública sob demanda **não** é a arquitetura principal. WASM é a **primeira
alternativa a validar**, não obrigação. A prova técnica mede compatibilidade com o runtime,
memória, tempo, qualidade, formatos, tamanho, concorrência, falha, custo e comportamento em
arquivos grandes. Derivados: thumbnail, card, galeria, WebP e fallback quando necessário.
Se os critérios não forem atendidos, **interromper** e apresentar alternativas (pré-processamento
no cliente, função dedicada compatível, serviço gerenciado, processamento assíncrono).
**Proibido** mudar automaticamente para transformação sob demanda e **proibido** remover marcas
por processamento automático.
