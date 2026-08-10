import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { Callout, inputClass, readableError, secondaryButtonClass } from "@/components/admin/ui";
import {
  cancelContentArticleSchedule,
  scheduleContentArticle,
} from "@/content/editorial.functions";
import type { ContentStatus } from "@/content/workflow";

export function ScheduleControls({
  articleId,
  status,
  scheduledAt,
  attempts,
  lastError,
}: {
  articleId: string;
  status: ContentStatus;
  scheduledAt: string | null;
  attempts: number;
  lastError: string | null;
}) {
  const queryClient = useQueryClient();
  const schedule = useServerFn(scheduleContentArticle);
  const cancel = useServerFn(cancelContentArticleSchedule);
  const [localDateTime, setLocalDateTime] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin", "content"] });
  };

  const scheduleMutation = useMutation({
    mutationFn: schedule,
    onSuccess: async () => {
      setFeedback("Publicação agendada.");
      setLocalDateTime("");
      await refresh();
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancel,
    onSuccess: async () => {
      setFeedback("Agendamento cancelado.");
      await refresh();
    },
  });

  if (status !== "READY_TO_PUBLISH" && status !== "SCHEDULED") return null;

  return (
    <div className="mt-4 rounded-[10px] border border-border-subtle p-4">
      <h3 className="text-[16px] font-bold">Agendamento editorial</h3>

      {feedback && (
        <div className="mt-3">
          <Callout tone="success" title={feedback} />
        </div>
      )}
      {scheduleMutation.error && (
        <div className="mt-3">
          <Callout tone="danger" title="Não foi possível agendar">
            {readableError(scheduleMutation.error)}
          </Callout>
        </div>
      )}
      {cancelMutation.error && (
        <div className="mt-3">
          <Callout tone="danger" title="Não foi possível cancelar o agendamento">
            {readableError(cancelMutation.error)}
          </Callout>
        </div>
      )}

      {status === "READY_TO_PUBLISH" && (
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <label className="min-w-[260px]">
            <span className="text-[13px] font-semibold">Data e horário</span>
            <input
              type="datetime-local"
              className={inputClass}
              value={localDateTime}
              onChange={(event) => setLocalDateTime(event.target.value)}
            />
          </label>
          <button
            type="button"
            className={secondaryButtonClass}
            disabled={!localDateTime || scheduleMutation.isPending}
            onClick={() => {
              const date = new Date(localDateTime);
              if (Number.isNaN(date.getTime())) return;
              scheduleMutation.mutate({
                data: { id: articleId, scheduledAt: date.toISOString(), note: null },
              });
            }}
          >
            Agendar publicação
          </button>
          <p className="w-full text-[12px] text-text-muted">
            O horário informado é interpretado no fuso local do navegador e armazenado em UTC.
          </p>
        </div>
      )}

      {status === "SCHEDULED" && (
        <div className="mt-3 space-y-3">
          <p className="text-[14px] text-text-secondary">
            Publicação prevista para{" "}
            <strong>
              {scheduledAt ? new Date(scheduledAt).toLocaleString("pt-BR") : "data não informada"}
            </strong>
            .
          </p>
          <p className="text-[13px] text-text-muted">Tentativas com falha: {attempts}</p>
          {lastError && (
            <Callout tone="danger" title="Última tentativa não foi concluída">
              {lastError}
            </Callout>
          )}
          <button
            type="button"
            className={secondaryButtonClass}
            disabled={cancelMutation.isPending}
            onClick={() => cancelMutation.mutate({ data: { id: articleId, note: null } })}
          >
            Cancelar agendamento
          </button>
        </div>
      )}
    </div>
  );
}
