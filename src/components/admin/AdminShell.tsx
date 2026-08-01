import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import type { ReactNode } from "react";

import { APP_ENV, ENV_LABEL } from "@/lib/env";

const NAV = [
  { label: "Início", to: "/admin", enabled: true },
  { label: "Catálogo", to: "/admin", enabled: false },
  { label: "Mídia", to: "/admin", enabled: false },
  { label: "Conteúdos", to: "/admin", enabled: false },
  { label: "Cotações", to: "/admin", enabled: false },
  { label: "Configurações", to: "/admin", enabled: false },
] as const;

export function AdminShell({
  user,
  children,
}: {
  user: { name: string; roles: string[] };
  children: ReactNode;
}) {
  const navigate = useNavigate();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    navigate({ to: "/admin/login", replace: true });
  }

  return (
    <div className="min-h-screen bg-surface">
      <a href="#admin-conteudo" className="skip-link">
        Ir para o conteúdo principal
      </a>
      <header className="border-b border-border bg-inverse text-inverse-foreground">
        <div className="container-avizee flex h-16 items-center justify-between gap-4">
          <Link to="/admin" className="font-bold">
            AviZee · Administração
          </Link>
          <div className="flex items-center gap-4 text-[14px]">
            <span className="hidden sm:inline opacity-80">
              {ENV_LABEL[APP_ENV]} · {user.name} ({user.roles.join(", ")})
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-white/30 px-3 font-semibold"
            >
              <LogOut aria-hidden="true" className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="container-avizee flex flex-col gap-8 py-8 md:flex-row">
        <nav aria-label="Navegação administrativa" className="md:w-56 shrink-0">
          <ul className="space-y-1 text-[15px]">
            {NAV.map((item) => (
              <li key={item.label}>
                {item.enabled ? (
                  <Link to={item.to} className="block rounded-[8px] px-3 py-2 hover:bg-surface-alt">
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-disabled="true"
                    className="block cursor-not-allowed rounded-[8px] px-3 py-2 text-text-muted"
                    title="Módulo ainda não implementado"
                  >
                    {item.label} · em breve
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <main id="admin-conteudo" className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
