import { Link } from "@tanstack/react-router";
import { ImageOff } from "lucide-react";

import type { FamilyCard as FamilyCardData } from "@/catalog/public/read.server";

/**
 * Cartão de família (Etapa 7). Nunca exibe preço, marca de terceiro
 * ou estado interno. Ausência de imagem usa placeholder e NÃO despriorizana
 * ordenação (D-050 / R-09).
 */
export function FamilyCard({ family }: { family: FamilyCardData }) {
  const variacoes =
    family.variationCount === 1 ? "1 variação" : `${family.variationCount} variações`;

  return (
    <article className="brand-interactive relative flex h-full flex-col overflow-hidden rounded-[12px] border border-border bg-background">
      <div className="relative aspect-4/3 bg-surface">
        {family.image.is_placeholder ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-text-muted">
            <ImageOff aria-hidden="true" className="h-8 w-8" />
            <span className="px-4 text-center text-caption">{family.image.alt}</span>
          </div>
        ) : (
          <img
            src={family.image.url}
            alt={family.image.alt}
            width={800}
            height={600}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="text-caption font-semibold uppercase tracking-wide text-text-muted">
          {family.categoryName}
        </p>

        <h3 className="text-h4 font-bold leading-snug">
          <Link
            to="/produtos/$categorySlug/$familySlug"
            params={{ categorySlug: family.categorySlug, familySlug: family.slug }}
            className="after:absolute after:inset-0 hover:underline"
          >
            {family.name}
          </Link>
        </h3>

        {family.summary && (
          <p className="line-clamp-3 text-body-sm text-text-secondary">{family.summary}</p>
        )}

        {family.matchedSku && (
          <p className="text-body-sm text-text-secondary">
            Referência encontrada:{" "}
            <span className="font-semibold tabular-nums">{family.matchedSku}</span>
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          <span className="rounded-full border border-border-subtle px-3 py-1 text-caption text-text-secondary">
            {variacoes}
          </span>
          {family.applications.slice(0, 2).map((app) => (
            <span
              key={app}
              className="rounded-full border border-border-subtle px-3 py-1 text-caption text-text-secondary"
            >
              {app}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export function FamilyGrid({ families }: { families: FamilyCardData[] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {families.map((family) => (
        <li key={family.id}>
          <FamilyCard family={family} />
        </li>
      ))}
    </ul>
  );
}
