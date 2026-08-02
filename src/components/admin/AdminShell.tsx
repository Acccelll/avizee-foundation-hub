import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import type { ReactNode } from "react";

import { APP_ENV, ENV_LABEL } from "@/lib/env";
import { supabase } from "@/integrations/supabase/client";
import type { SessionUser } from "@/auth/contract";
import type { Permission } from "@/permissions/model";

interface NavItem {
  label: string;
  to: string;
  permission?: Permission;
  enabled: boolean;
}

const NAV: { group: string; items: NavItem[] }[] = [
  { group: "Geral", items: [{ label: "Início", to: "/admin", enabled: true }] },
  {
    group: "Catálogo",
    items: [
      { label: "Famílias", to: "/admin/catalogo/familias", permission: "catalog.read", enabled: true },
      { label: "SKUs", to: "/admin/catalogo/skus", permission: "catalog.read", enabled: true },
      { label: "Taxonomia", to: "/admin/catalogo/taxonomia", permission: "catalog.read", enabled: true },
      { label: "Conflitos de código", to: "/admin/conflitos", permission: "catalog.read", enabled: true },
      { label: "Fila de normalização", to: "/admin/normalizacao", permission: "catalog.read", enabled: true },
    ],
  },
  {
    group: "Mídia",
    items: [{ label: "Imagens", to: "/admin/midia", permission: "media.read", enabled: true }],
  },
  {
    group: "Operações",
    items: [
      { label: "Importação", to: "/admin/importacao", permission: "import.execute", enabled: true },
      { label: "Auditoria", to: "/admin/auditoria", permission: "audit.read", enabled: true },
    ],
  },
  {
    group: "Em breve",
    items: [
      { label: "Conteúdos", to: "/admin", enabled: false },
      { label: "Cotações", to: "/admin", enabled: false },
      { label: "Configurações", to: "/admin", enabled: false },
    ],
  },
];

export function AdminShell({ user, children }: { user: SessionUser; children: ReactNode }) {
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
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
            <span className="hidden opacity-80 sm:inline">
              {ENV_LABEL[APP_ENV]} · {user.name} ({user.roles.join(", ") || "sem papel"})
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
        <nav aria-label="Navegação administrativa" className="shrink-0 md:w-60">
          {NAV.map((group) => (
            <div key={group.group} className="mb-5">
              <p className="px-3 pb-1 text-[12px] font-bold uppercase tracking-wide text-text-muted">
                {group.group}
              </p>
              <ul className="space-y-1 text-[15px]">
                {group.items.map((item) => {
                  const allowed =
                    item.enabled && (!item.permission || user.permissions.includes(item.permission));
                  return (
                    <li key={item.label}>
                      {allowed ? (
                        <Link
                          to={item.to}
                          className="block rounded-[8px] px-3 py-2 hover:bg-surface-alt"
                          activeProps={{ className: "block rounded-[8px] px-3 py-2 bg-surface-alt font-semibold" }}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <span
                          aria-disabled="true"
                          className="block cursor-not-allowed rounded-[8px] px-3 py-2 text-text-muted"
                        >
                          {item.label}
                          {item.enabled ? " · sem permissão" : " · em breve"}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <main id="admin-conteudo" className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
