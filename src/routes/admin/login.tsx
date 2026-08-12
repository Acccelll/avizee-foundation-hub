import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { buildMeta } from "@/seo/meta";
import { signInAdmin } from "@/auth/sign-in-admin";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  head: () => buildMeta({ title: "Acesso administrativo", description: "Área restrita AviZee." }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    let result: Awaited<ReturnType<typeof signInAdmin>> = "INVALID";
    try {
      result = await signInAdmin(email, password);
    } finally {
      setPending(false);
    }

    if (result === "INVALID") {
      // Mensagem genérica: não revela se o e-mail existe.
      setError("Credenciais inválidas ou acesso temporariamente bloqueado.");
      return;
    }
    if (result === "OK_RELOAD") {
      window.location.assign("/admin");
      return;
    }
    navigate({ to: "/admin", replace: true });
  }


  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-[12px] border border-border bg-background p-6"
      >
        <h1 className="text-[22px] font-extrabold">Acesso administrativo</h1>
        <p className="mt-2 text-[14px] text-text-muted">Área restrita à equipe AviZee.</p>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-[8px] p-3 text-[14px] text-error"
            style={{ backgroundColor: "var(--feedback-error-bg)" }}
          >
            {error}
          </p>
        )}

        <label htmlFor="email" className="mt-6 block text-[14px] font-semibold">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="mt-1 h-11 w-full rounded-[8px] border border-border bg-background px-3"
        />

        <label htmlFor="password" className="mt-4 block text-[14px] font-semibold">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 h-11 w-full rounded-[8px] border border-border bg-background px-3"
        />

        <button
          type="submit"
          disabled={pending}
          className="mt-6 h-11 w-full rounded-[8px] bg-primary font-semibold text-primary-foreground disabled:opacity-60"
        >
          {pending ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
