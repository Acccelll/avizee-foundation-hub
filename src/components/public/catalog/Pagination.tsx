import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { CatalogSearch } from "@/components/public/catalog/FilterPanel";

/** Paginação por links (`?pagina=N`), indexável com canonical próprio. */
export function Pagination({
  page,
  pageCount,
  search,
}: {
  page: number;
  pageCount: number;
  search: CatalogSearch;
}) {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === pageCount || Math.abs(n - page) <= 1,
  );

  return (
    <nav aria-label="Paginação do catálogo" className="mt-10 flex justify-center">
      <ul className="flex flex-wrap items-center gap-2">
        <li>
          <Link
            to="/produtos"
            search={{ ...search, pagina: page > 1 ? page - 1 : 1 }}
            aria-label="Página anterior"
            aria-disabled={page === 1}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-[8px] border border-border ${
              page === 1 ? "pointer-events-none opacity-40" : "hover:bg-surface"
            }`}
          >
            <ChevronLeft aria-hidden="true" className="h-5 w-5" />
          </Link>
        </li>
        {pages.map((n, index) => (
          <li key={n} className="flex items-center gap-2">
            {index > 0 && n - (pages[index - 1] ?? 0) > 1 && (
              <span aria-hidden="true" className="text-text-muted">
                …
              </span>
            )}
            <Link
              to="/produtos"
              search={{ ...search, pagina: n === 1 ? undefined : n }}
              aria-label={`Página ${n}`}
              aria-current={n === page ? "page" : undefined}
              className={`inline-flex h-11 min-w-11 items-center justify-center rounded-[8px] border px-3 tabular-nums ${
                n === page
                  ? "border-emphasis bg-surface font-bold text-emphasis"
                  : "border-border hover:bg-surface"
              }`}
            >
              {n}
            </Link>
          </li>
        ))}
        <li>
          <Link
            to="/produtos"
            search={{ ...search, pagina: page < pageCount ? page + 1 : pageCount }}
            aria-label="Próxima página"
            aria-disabled={page === pageCount}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-[8px] border border-border ${
              page === pageCount ? "pointer-events-none opacity-40" : "hover:bg-surface"
            }`}
          >
            <ChevronRight aria-hidden="true" className="h-5 w-5" />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
