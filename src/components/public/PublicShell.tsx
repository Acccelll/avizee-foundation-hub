import { Link } from "@tanstack/react-router";
import { Menu, X, Search, ClipboardList } from "lucide-react";
import { useState, type ReactNode } from "react";

import logo from "@/assets/brand/avizee-logo-colorido.svg";
import { APP_ENV, ENV_LABEL, IS_INDEXABLE } from "@/lib/env";
import type { Crumb } from "@/seo/meta";

const NAV = [
  { to: "/produtos", label: "Produtos" },
  { to: "/solucoes", label: "Soluções" },
  { to: "/conteudos", label: "Conteúdos" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
] as const;

function EnvironmentBanner() {
  if (IS_INDEXABLE) return null;
  return (
    <div
      role="status"
      className="bg-inverse px-4 py-1.5 text-center text-[12px] text-inverse-foreground"
    >
      Ambiente de {ENV_LABEL[APP_ENV]} — conteúdo técnico provisório, não indexável.
    </div>
  );
}

function Breadcrumb({ items }: { items: Crumb[] }) {
  if (items.length === 0) return null;
  return (
    <nav aria-label="Você está aqui" className="border-b border-border-subtle">
      <ol className="container-avizee flex flex-wrap items-center gap-2 py-3 text-[14px] text-text-muted">
        <li>
          <Link to="/" className="hover:underline">
            Início
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-2">
            <span aria-hidden="true">/</span>
            {item.to && index < items.length - 1 ? (
              <Link to={item.to} className="hover:underline">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-text-primary">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PublicShell({
  children,
  breadcrumb = [],
}: {
  children: ReactNode;
  breadcrumb?: Crumb[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <a href="#conteudo-principal" className="skip-link">
        Ir para o conteúdo principal
      </a>
      <EnvironmentBanner />

      <header className="sticky top-0 z-50 border-b border-border-subtle bg-background">
        <div className="container-avizee flex h-16 items-center justify-between gap-4">
          <Link to="/" aria-label="AviZee — página inicial" className="flex items-center">
            <img src={logo} alt="AviZee" className="h-9 w-auto" width={140} height={36} />
          </Link>

          <nav aria-label="Navegação principal" className="hidden md:block">
            <ul className="flex items-center gap-6 text-[15px] font-medium">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="py-2 hover:text-emphasis"
                    activeProps={{ className: "py-2 text-emphasis underline underline-offset-8" }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/produtos"
              aria-label="Buscar no catálogo"
              className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] border border-border hover:bg-surface"
            >
              <Search aria-hidden="true" className="h-5 w-5" />
            </Link>
            <Link
              to="/cotacao"
              className="hidden h-11 items-center gap-2 rounded-[8px] bg-primary px-4 text-[15px] font-semibold text-primary-foreground hover:opacity-90 sm:inline-flex"
            >
              <ClipboardList aria-hidden="true" className="h-5 w-5" />
              Lista de cotação
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] border border-border md:hidden"
            >
              {open ? (
                <X aria-hidden="true" className="h-5 w-5" />
              ) : (
                <Menu aria-hidden="true" className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {open && (
          <nav
            id="menu-mobile"
            aria-label="Navegação mobile"
            className="border-t border-border-subtle md:hidden"
          >
            <ul className="container-avizee flex flex-col py-2">
              {[...NAV, { to: "/cotacao", label: "Lista de cotação" } as const].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-[16px] font-medium"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      <Breadcrumb items={breadcrumb} />

      <main id="conteudo-principal" className="flex-1 py-12">
        {children}
      </main>

      <footer className="border-t border-border-subtle bg-inverse text-inverse-foreground">
        <div className="container-avizee grid gap-8 py-12 md:grid-cols-3">
          <div>
            <p className="text-[18px] font-bold">AviZee</p>
            <p className="mt-2 max-w-xs text-[14px] opacity-80">
              Soluções técnicas para avicultura. Atendimento B2B por lista de cotação.
            </p>
          </div>
          <nav aria-label="Navegação do rodapé">
            <p className="text-[14px] font-semibold uppercase tracking-wide opacity-70">
              Navegação
            </p>
            <ul className="mt-3 space-y-2 text-[15px]">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Documentos legais">
            <p className="text-[14px] font-semibold uppercase tracking-wide opacity-70">Legal</p>
            <ul className="mt-3 space-y-2 text-[15px]">
              <li>
                <Link to="/politica-de-privacidade" className="hover:underline">
                  Política de privacidade
                </Link>
              </li>
              <li>
                <Link to="/termos-de-uso" className="hover:underline">
                  Termos de uso
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="border-t border-white/10">
          <p className="container-avizee py-4 text-[12px] opacity-70">
            © {new Date().getFullYear()} AviZee. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
