import { Link } from "@tanstack/react-router";
import { SearchX } from "lucide-react";

/**
 * Estado de zero resultado (doc 106 §3 / doc 49 §4).
 * Nunca sinaliza indisponibilidade ou estoque; conduz à cotação.
 */
export function NoResults({
  term,
  categories,
}: {
  term?: string | undefined;
  categories: { slug: string; name: string }[];
}) {
  return (
    <div className="rounded-[12px] border border-border p-8 text-center">
      <SearchX aria-hidden="true" className="mx-auto h-10 w-10 text-text-muted" />
      <h2 className="mt-4 text-[20px] font-bold">
        {term ? `Não localizamos resultados para “${term}”` : "Nenhum item para estes filtros"}
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-[16px] text-text-secondary">
        Tente outro termo, revise a referência ou navegue pelas categorias. Se precisar de um item
        específico, a equipe AviZee pode avaliar o pedido pela lista de cotação.
      </p>

      {categories.length > 0 && (
        <ul className="mt-6 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                to="/produtos/$categorySlug"
                params={{ categorySlug: category.slug }}
                className="inline-flex min-h-11 items-center rounded-full border border-border px-4 text-[15px] hover:bg-surface"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link
        to="/cotacao"
        className="mt-8 inline-flex h-12 items-center rounded-[8px] bg-primary px-6 font-semibold text-primary-foreground hover:opacity-90"
      >
        Não encontrou? Solicite pela lista de cotação
      </Link>
    </div>
  );
}
