import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import {
  fetchGlobalSuggestions,
  type GlobalSuggestion,
} from "@/search/global.functions";

/**
 * Combobox de busca global (WCAG 2.2 AA):
 * - funciona sem JavaScript (submit do formulário navega para /busca);
 * - sugestões com `role="listbox"`, navegação por setas e Escape;
 * - mínimo de 2 caracteres, debounce de 250 ms (doc 49 / doc 106 §3);
 * - resultados agrupados pela ordem Produtos → Soluções → Conteúdos.
 */
export function SearchBox({
  defaultValue = "",
  autoFocusOnMount = false,
}: {
  defaultValue?: string;
  autoFocusOnMount?: boolean;
}) {
  const navigate = useNavigate();
  const listId = useId();
  const inputId = useId();
  const [term, setTerm] = useState(defaultValue);
  const [items, setItems] = useState<GlobalSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => setTerm(defaultValue), [defaultValue]);

  useEffect(() => {
    const value = term.trim();
    if (value.length < 2) {
      setItems([]);
      setOpen(false);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      void fetchGlobalSuggestions({ data: { q: value } })
        .then((result) => {
          if (cancelled) return;
          setItems(result.suggestions as GlobalSuggestion[]);
          setOpen(result.suggestions.length > 0);
          setActive(-1);
        })
        .catch(() => {
          if (!cancelled) setItems([]);
        });
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [term]);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function submit(value: string) {
    setOpen(false);
    void navigate({ to: "/busca", search: { q: value.trim() } });
  }

  function choose(item: GlobalSuggestion) {
    setOpen(false);
    if (item.kind === "solution") {
      void navigate({
        to: "/solucoes/$applicationSlug",
        params: { applicationSlug: item.applicationSlug },
      });
      return;
    }
    if (item.kind === "content") {
      void navigate({
        to: "/conteudos/$articleSlug",
        params: { articleSlug: item.articleSlug },
      });
      return;
    }
    submit(item.kind === "sku" && item.sku ? item.sku : item.label);
  }

  return (
    <div ref={boxRef} className="relative">
      <form
        role="search"
        action="/busca"
        method="get"
        onSubmit={(event) => {
          event.preventDefault();
          submit(term);
        }}
      >
        <label htmlFor={inputId} className="mb-2 block text-[14px] font-semibold">
          Buscar no site
        </label>
        <div className="flex gap-2">
          <input
            id={inputId}
            name="q"
            type="search"
            value={term}
            autoFocus={autoFocusOnMount}
            onChange={(event) => setTerm(event.target.value)}
            onKeyDown={(event) => {
              if (!open || items.length === 0) return;
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActive((i) => (i + 1) % items.length);
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActive((i) => (i <= 0 ? items.length - 1 : i - 1));
              } else if (event.key === "Escape") {
                setOpen(false);
              } else if (event.key === "Enter" && active >= 0) {
                event.preventDefault();
                const item = items[active];
                if (item) choose(item);
              }
            }}
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
            placeholder="Produto, aplicação, conteúdo ou referência (ex.: AG011)"
            className="h-12 w-full rounded-[8px] border border-border bg-background px-4 text-[16px] placeholder:text-text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emphasis"
          />
          <button
            type="submit"
            className="inline-flex h-12 min-w-12 items-center justify-center gap-2 rounded-[8px] bg-primary px-4 font-semibold text-primary-foreground hover:opacity-90"
          >
            <Search aria-hidden="true" className="h-5 w-5" />
            <span className="sr-only sm:not-sr-only">Buscar</span>
          </button>
        </div>
      </form>

      {open && items.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Sugestões de busca"
          className="absolute z-40 mt-2 w-full overflow-hidden rounded-[8px] border border-border bg-background shadow-lg"
        >
          {items.map((item, index) => (
            <li
              key={`${item.kind}-${item.label}-${index}`}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === active}
            >
              <button
                type="button"
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(item)}
                className={`flex w-full min-h-11 items-center justify-between gap-3 px-4 py-2 text-left text-[15px] ${
                  index === active ? "bg-surface" : ""
                }`}
              >
                <span className={item.kind === "sku" ? "font-semibold tabular-nums" : ""}>
                  {item.label}
                </span>
                {item.sublabel && (
                  <span className="text-[13px] text-text-muted">{item.sublabel}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
