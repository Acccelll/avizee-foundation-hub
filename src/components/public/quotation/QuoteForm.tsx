import { useEffect, useRef, useState } from "react";

import {
  BRAZIL_UFS,
  CONSENT_TEXT_MARKETING,
  PRIVACY_NOTICE_QUOTATION,
} from "@/quotation/model";

export interface QuoteFormValues {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  city: string;
  stateUf: string;
  preferredChannel: "email" | "telefone" | "whatsapp";
  message: string;
  consentContact: boolean;
  consentMarketing: boolean;
  honeypot: string;
  elapsedMs: number;
}

const inputClass =
  "h-12 w-full rounded-[8px] border border-border bg-background px-3 text-[16px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emphasis";

type DescriptionOptions = { hint?: boolean; error?: boolean };

function describedBy(id: string, options: DescriptionOptions): string | undefined {
  const ids = [options.hint ? `${id}-hint` : null, options.error ? `${id}-error` : null].filter(
    Boolean,
  );
  return ids.length > 0 ? ids.join(" ") : undefined;
}

function Field({
  label,
  id,
  required,
  error,
  children,
  hint,
}: {
  label: string;
  id: string;
  required?: boolean;
  error?: string | undefined;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[14px] font-semibold">
        {label}
        {required && (
          <>
            <span className="text-emphasis" aria-hidden="true">
              {" "}*
            </span>
            <span className="sr-only"> (obrigatório)</span>
          </>
        )}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-[13px] text-text-muted">
          {hint}
        </p>
      )}
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-[13px] font-medium text-emphasis">
          {error}
        </p>
      )}
    </div>
  );
}

const ERROR_FIELD_ORDER = [
  "companyName",
  "contactName",
  "contactEmail",
  "contactPhone",
  "city",
  "stateUf",
  "preferredChannel",
  "message",
] as const;

/**
 * Dados de contato da Lista de Cotação. Minimização de dados (doc 113):
 * apenas o necessário para responder. Consentimento de marketing separado,
 * opcional e desmarcado por padrão.
 */
export function QuoteForm({
  disabled,
  submitting,
  errors,
  onSubmit,
}: {
  disabled: boolean;
  submitting: boolean;
  errors: Record<string, string>;
  onSubmit: (values: QuoteFormValues) => void;
}) {
  const openedAt = useRef<number>(Date.now());
  const [values, setValues] = useState<Omit<QuoteFormValues, "elapsedMs">>({
    companyName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    city: "",
    stateUf: "",
    preferredChannel: "email",
    message: "",
    consentContact: false,
    consentMarketing: false,
    honeypot: "",
  });

  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  const firstInvalidField = ERROR_FIELD_ORDER.find((field) => Boolean(errors[field]));
  const errorSignature = ERROR_FIELD_ORDER.filter((field) => Boolean(errors[field])).join("|");

  useEffect(() => {
    if (!firstInvalidField) return;
    const element = document.getElementById(firstInvalidField);
    if (element instanceof HTMLElement) element.focus();
  }, [errorSignature, firstInvalidField]);

  const set = <K extends keyof typeof values>(key: K, value: (typeof values)[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const visibleErrors = ERROR_FIELD_ORDER.flatMap((field) => {
    const message = errors[field];
    return message ? [{ field, message }] : [];
  });

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ ...values, elapsedMs: Date.now() - openedAt.current });
      }}
      className="grid gap-6"
    >
      {visibleErrors.length > 0 && (
        <div role="alert" aria-live="assertive" className="sr-only">
          <p>Há campos que precisam ser corrigidos antes do envio.</p>
          <ul>
            {visibleErrors.map(({ field, message }) => (
              <li key={field}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Empresa" id="companyName" required error={errors["companyName"]}>
          <input
            id="companyName"
            name="organization"
            autoComplete="organization"
            required
            className={inputClass}
            value={values.companyName}
            onChange={(e) => set("companyName", e.target.value)}
            aria-invalid={Boolean(errors["companyName"])}
            aria-describedby={describedBy("companyName", {
              error: Boolean(errors["companyName"]),
            })}
          />
        </Field>

        <Field label="Nome do contato" id="contactName" required error={errors["contactName"]}>
          <input
            id="contactName"
            autoComplete="name"
            required
            className={inputClass}
            value={values.contactName}
            onChange={(e) => set("contactName", e.target.value)}
            aria-invalid={Boolean(errors["contactName"])}
            aria-describedby={describedBy("contactName", {
              error: Boolean(errors["contactName"]),
            })}
          />
        </Field>

        <Field label="E-mail" id="contactEmail" required error={errors["contactEmail"]}>
          <input
            id="contactEmail"
            type="email"
            autoComplete="email"
            required
            className={inputClass}
            value={values.contactEmail}
            onChange={(e) => set("contactEmail", e.target.value)}
            aria-invalid={Boolean(errors["contactEmail"])}
            aria-describedby={describedBy("contactEmail", {
              error: Boolean(errors["contactEmail"]),
            })}
          />
        </Field>

        <Field label="Telefone" id="contactPhone" required error={errors["contactPhone"]}>
          <input
            id="contactPhone"
            type="tel"
            autoComplete="tel"
            required
            className={inputClass}
            value={values.contactPhone}
            onChange={(e) => set("contactPhone", e.target.value)}
            aria-invalid={Boolean(errors["contactPhone"])}
            aria-describedby={describedBy("contactPhone", {
              error: Boolean(errors["contactPhone"]),
            })}
          />
        </Field>

        <Field label="Cidade" id="city" error={errors["city"]}>
          <input
            id="city"
            autoComplete="address-level2"
            className={inputClass}
            value={values.city}
            onChange={(e) => set("city", e.target.value)}
            aria-invalid={Boolean(errors["city"])}
            aria-describedby={describedBy("city", { error: Boolean(errors["city"]) })}
          />
        </Field>

        <Field label="UF" id="stateUf" error={errors["stateUf"]}>
          <select
            id="stateUf"
            className={inputClass}
            value={values.stateUf}
            onChange={(e) => set("stateUf", e.target.value)}
            aria-invalid={Boolean(errors["stateUf"])}
            aria-describedby={describedBy("stateUf", { error: Boolean(errors["stateUf"]) })}
          >
            <option value="">Selecione</option>
            {BRAZIL_UFS.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Canal preferido de retorno" id="preferredChannel">
          <select
            id="preferredChannel"
            className={inputClass}
            value={values.preferredChannel}
            onChange={(e) =>
              set("preferredChannel", e.target.value as QuoteFormValues["preferredChannel"])
            }
          >
            <option value="email">E-mail</option>
            <option value="telefone">Telefone</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </Field>
      </div>

      <Field
        label="Mensagem"
        id="message"
        hint="Contexto de aplicação, porte da operação ou detalhes técnicos relevantes."
      >
        <textarea
          id="message"
          rows={4}
          maxLength={2000}
          className="w-full rounded-[8px] border border-border bg-background p-3 text-[16px]"
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          aria-describedby={describedBy("message", { hint: true })}
        />
      </Field>

      {/* Honeypot: invisível para pessoas, ignorado por leitores de tela. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company-website">Não preencha este campo</label>
        <input
          id="company-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.honeypot}
          onChange={(e) => set("honeypot", e.target.value)}
        />
      </div>

      <fieldset className="grid gap-3 rounded-[8px] border border-border p-4">
        <legend className="px-1 text-[14px] font-semibold">Privacidade</legend>
        {/* §6 — aviso de privacidade: informa a finalidade, não pede
            consentimento para o tratamento necessário à resposta. */}
        <p className="text-[15px]">{PRIVACY_NOTICE_QUOTATION}</p>
        <label className="flex items-start gap-3 text-[15px]">
          <input
            type="checkbox"
            className="mt-1 h-5 w-5"
            checked={values.consentMarketing}
            onChange={(e) => set("consentMarketing", e.target.checked)}
          />
          <span>{CONSENT_TEXT_MARKETING}</span>
        </label>
      </fieldset>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={disabled || submitting}
          className="inline-flex h-12 items-center rounded-[8px] bg-primary px-6 font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Enviando..." : "Enviar lista de cotação"}
        </button>
        <p className="text-[14px] text-text-muted">
          Nenhum pagamento é solicitado. Você recebe um protocolo de acompanhamento.
        </p>
      </div>
    </form>
  );
}
