import { Link } from "@tanstack/react-router";
import { Menu, X, Search, ClipboardList } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

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
      className="bg-inverse px-4 py-1.5 text-center text-caption text-inverse-foreground"
    >
      Ambiente de {ENV_LABEL[APP_ENV]} — conteúdo técnico provisório, não indexável.
    </div>
  );
}

function Breadcrumb({ items }: { items: Crumb[] }) {
  if (items.length === 0) return null;
  return (
    <nav aria-label="Você está aqui" className="border-b border-border-subtle">
      <ol className="container-avizee flex flex-wrap items-center gap-2 py-3 text-body-sm text-text-muted">
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

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

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

          <nav aria-label="Navegação principal" className="hidden lg:block">
            <ul className="flex items-center gap-6 text-body-sm font-medium">
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
              to="/busca"
              search={{ q: "" }}
              aria-label="Buscar no site"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border hover:bg-surface"
            >
              <Search aria-hidden="true" className="h-5 w-5" />
            </Link>
            <Link
              to="/cotacao"
              className="hidden h-11 items-center gap-2 rounded-md bg-primary px-4 text-body-sm font-semibold text-primary-foreground hover:opacity-90 sm:inline-flex"
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
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border lg:hidden"
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
            className="border-t border-border-subtle lg:hidden"
          >
            <ul className="container-avizee flex flex-col py-2">
              {[...NAV, { to: "/cotacao", label: "Lista de cotação" } as const].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-body font-medium"
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
            <span
              role="img"
              aria-label="AviZee"
              className="block h-9 w-[140px] bg-inverse-foreground"
              style={{
                WebkitMaskImage: `url(${logo})`,
                maskImage: `url(${logo})`,
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "left center",
                maskPosition: "left center",
                WebkitMaskSize: "contain",
                maskSize: "contain",
              }}
            />
            <p className="mt-3 max-w-xs text-body-sm opacity-80">
              Soluções técnicas para avicultura. Atendimento B2B por lista de cotação.
            </p>
          </div>
          <nav aria-label="Navegação do rodapé">
            <p className="text-body-sm font-semibold uppercase tracking-wide opacity-70">
              Navegação
            </p>
            <ul className="mt-3 space-y-2 text-body-sm">
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
            <p className="text-body-sm font-semibold uppercase tracking-wide opacity-70">Legal</p>
            <ul className="mt-3 space-y-2 text-body-sm">
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
        <div className="border-t border-inverse-divider">
          <p className="container-avizee py-4 text-caption opacity-70">
            © {new Date().getFullYear()} AviZee. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
