-- Etapa 14.1 — passo 1 do agendamento editorial.
-- O novo valor do enum precisa existir em uma transação anterior antes de ser
-- usado por índices, policies ou funções em migrations subsequentes.
ALTER TYPE public.content_status ADD VALUE IF NOT EXISTS 'SCHEDULED';
