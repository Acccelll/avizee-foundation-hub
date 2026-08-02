# 171 — Fila de Normalização

- `normalization_tasks` + `normalization_task_events` registram tudo que não pode entrar no
  catálogo canônico: identidade ausente, conflito de código, revisão de nome, marca, imagem,
  direitos, taxonomia e suspeita de duplicidade.
- A importação nunca descarta uma linha: linha bloqueada vira tarefa com prioridade e evidência.
- Na carga canônica não houve linha bloqueada (0 tarefas geradas), porque o lote foi previamente
  restrito aos 97 SKUs aprovados. Os 77 SKUs restantes permanecem fora do banco, na matriz
  documental, aguardando dados confiáveis.
