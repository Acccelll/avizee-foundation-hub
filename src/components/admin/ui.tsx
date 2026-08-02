/**
 * Componentes de interface do núcleo administrativo.
 * Estados obrigatórios (§45): vazio, carregando, erro, sucesso, bloqueado.
 */
import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-[26px] font-extrabold">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-[15px] text-text-secondary">{description}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </header>
  );
}

const TONE_CLASS: Record<string, string> = {
  neutral: "bg-surface-alt text-text-secondary",
  success: "text-success",
  info: "text-info",
  warning: "text-warning",
  danger: "text-error",
};

export function StatusBadge({ value }: { value: string | null | undefined }) {
  const text = value ?? "—";
  const tone = text.startsWith("BLOCKED")
    ? "danger"
    : text === "PUBLISHED" || text === "READY_TO_PUBLISH" || text === "APROVADA"
      ? "success"
      : text.startsWith("PENDENTE") || text === "UNDER_REVIEW"
        ? "warning"
        : "neutral";
  return (
    <span
      className={`inline-flex items-center rounded-[6px] border border-border px-2 py-1 text-[12px] font-semibold ${TONE_CLASS[tone]}`}
    >
      {text}
    </span>
  );
}

export function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warning" | "danger" | "success";
  title: string;
  children?: ReactNode;
}) {
  return (
    <div role="status" className={`rounded-[8px] border border-border p-4 ${TONE_CLASS[tone]}`}>
      <p className="font-semibold">{title}</p>
      {children && <div className="mt-1 text-[14px] text-text-secondary">{children}</div>}
    </div>
  );
}

export function QueryState({
  isLoading,
  error,
  isEmpty,
  emptyLabel,
  children,
}: {
  isLoading: boolean;
  error: unknown;
  isEmpty?: boolean;
  emptyLabel?: string;
  children: ReactNode;
}) {
  if (isLoading) return <p className="py-8 text-text-muted">Carregando…</p>;
  if (error)
    return (
      <Callout tone="danger" title="Não foi possível carregar os dados">
        {readableError(error)}
      </Callout>
    );
  if (isEmpty)
    return <p className="py-8 text-text-muted">{emptyLabel ?? "Nenhum registro encontrado."}</p>;
  return <>{children}</>;
}

export function readableError(error: unknown): string {
  if (!error) return "";
  const anyError = error as { detail?: string; message?: string };
  return anyError.detail || anyError.message || "Erro inesperado.";
}

export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-[8px] border border-border">
      <table className="w-full border-collapse text-[14px]">
        <thead className="bg-surface-alt text-left">
          <tr>
            {head.map((label) => (
              <th key={label} scope="col" className="px-3 py-2 font-semibold">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Pagination({
  page,
  total,
  pageSize,
  onChange,
}: {
  page: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <nav aria-label="Paginação" className="mt-4 flex items-center gap-3 text-[14px]">
      <button
        type="button"
        className="h-9 rounded-[6px] border border-border px-3 disabled:opacity-50"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        Anterior
      </button>
      <span>
        Página {page} de {pages} · {total} registros
      </span>
      <button
        type="button"
        className="h-9 rounded-[6px] border border-border px-3 disabled:opacity-50"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
      >
        Próxima
      </button>
    </nav>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[14px] font-semibold">{label}</span>
      {hint && <span className="block text-[13px] text-text-muted">{hint}</span>}
      <span className="mt-1 block">{children}</span>
    </label>
  );
}

export const inputClass =
  "h-10 w-full rounded-[8px] border border-border bg-background px-3 text-[14px]";
export const buttonClass =
  "inline-flex h-10 items-center justify-center rounded-[8px] bg-primary px-4 text-[14px] font-semibold text-primary-foreground disabled:opacity-60";
export const secondaryButtonClass =
  "inline-flex h-10 items-center justify-center rounded-[8px] border border-border px-4 text-[14px] font-semibold disabled:opacity-60";
