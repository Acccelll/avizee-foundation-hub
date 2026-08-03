# 346 — Storage backup validation

> Etapa 11 — Consolidação técnica e preparação pré-produção.
> Release candidate: **RC-AVIZEE-01** · Data: 2026-08-03 · Ambiente: homologação/preview.
> **Produção não alterada. DNS não alterado. Site atual intacto.**

## Escopo coberto
Imagens públicas e privadas, documentos, evidências, arquivos de direito, derivados e metadados.

## Situação
Nenhum bucket de storage está provisionado nesta etapa; os ativos de imagem permanecem versionados no repositório e em inventário documental. A correspondência banco ↔ objeto ↔ hash ↔ caminho ↔ status é validada em `stage-11-media-migration.csv`.

O backup de banco não substitui o backup de storage: quando os buckets forem provisionados na Etapa 12, a rotina de cópia e verificação de hash torna-se obrigatória antes do cutover (PENDENTE_DE_APROVAÇÃO).
