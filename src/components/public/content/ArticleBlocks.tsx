import { Link } from "@tanstack/react-router";

import type { ContentBlock } from "@/content/blocks";

/**
 * Renderização dos blocos do artigo (Etapa 10).
 *
 * NUNCA usa `dangerouslySetInnerHTML`: cada bloco vira um componente React com
 * texto puro. É a contrapartida da validação de blocos no servidor.
 */
function Heading({ level, text }: { level: 2 | 3; text: string }) {
  const className =
    level === 2 ? "mt-10 text-[26px] font-extrabold" : "mt-8 text-[20px] font-bold";
  return level === 2 ? <h2 className={className}>{text}</h2> : <h3 className={className}>{text}</h3>;
}

export function ArticleBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="mt-8">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        switch (block.type) {
          case "heading":
            return <Heading key={key} level={block.level} text={block.text} />;

          case "paragraph":
            return (
              <p key={key} className="mt-4 text-[17px] leading-relaxed text-text-secondary">
                {block.text}
              </p>
            );

          case "list":
            return block.ordered ? (
              <ol key={key} className="mt-4 list-decimal space-y-2 pl-6 text-[17px] text-text-secondary">
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul key={key} className="mt-4 list-disc space-y-2 pl-6 text-[17px] text-text-secondary">
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            );

          case "quote":
            return (
              <figure key={key} className="mt-6 border-l-4 border-emphasis pl-5">
                <blockquote className="text-[18px] italic text-text-secondary">
                  {block.text}
                </blockquote>
                {block.attribution && (
                  <figcaption className="mt-2 text-[14px] text-text-muted">
                    {block.attribution}
                  </figcaption>
                )}
              </figure>
            );

          case "image":
            return (
              <figure key={key} className="mt-8">
                {block.url ? (
                  <img
                    src={block.url}
                    alt={block.alt}
                    loading="lazy"
                    className="w-full rounded-[12px] border border-border-subtle"
                  />
                ) : (
                  <div className="flex aspect-16/9 items-center justify-center rounded-[12px] border border-border bg-surface px-6 text-center text-[13px] text-text-muted">
                    Imagem em atualização — {block.alt}
                  </div>
                )}
                {(block.caption || block.credit) && (
                  <figcaption className="mt-2 text-[14px] text-text-muted">
                    {block.caption}
                    {block.credit && <span className="ml-2">({block.credit})</span>}
                  </figcaption>
                )}
              </figure>
            );

          case "callout":
            return (
              <aside
                key={key}
                role="note"
                className={`mt-6 rounded-[8px] border-l-4 p-4 ${
                  block.tone === "warning" ? "border-warning bg-surface" : "border-info bg-surface"
                }`}
              >
                {block.title && <p className="text-[15px] font-bold">{block.title}</p>}
                <p className="text-[16px] text-text-secondary">{block.text}</p>
              </aside>
            );

          case "table":
            return (
              <div key={key} className="mt-6 overflow-x-auto">
                <table className="w-full border-collapse text-[15px]">
                  {block.caption && (
                    <caption className="mb-2 text-left text-[14px] text-text-muted">
                      {block.caption}
                    </caption>
                  )}
                  <thead>
                    <tr>
                      {block.headers.map((header, i) => (
                        <th
                          key={i}
                          scope="col"
                          className="border-b border-border px-3 py-2 text-left font-bold"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className="border-b border-border-subtle px-3 py-2 text-text-secondary"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "faq":
            return (
              <section key={key} className="mt-8 space-y-4">
                {block.items.map((item, i) => (
                  <details key={i} className="rounded-[8px] border border-border p-4">
                    <summary className="cursor-pointer text-[16px] font-semibold">
                      {item.question}
                    </summary>
                    <p className="mt-2 text-[16px] text-text-secondary">{item.answer}</p>
                  </details>
                ))}
              </section>
            );

          case "product_relation":
            return (
              <div key={key} className="mt-6 rounded-[12px] border border-border p-5">
                <p className="text-[13px] font-semibold uppercase tracking-wide text-text-muted">
                  Relacionado no catálogo
                </p>
                {block.note && (
                  <p className="mt-2 text-[16px] text-text-secondary">{block.note}</p>
                )}
                <Link
                  to="/produtos"
                  search={{ q: block.familySlug.replace(/-/g, " ") }}
                  className="mt-3 inline-flex text-[15px] font-semibold text-emphasis hover:underline"
                >
                  Ver no catálogo
                </Link>
              </div>
            );

          case "divider":
            return <hr key={key} className="mt-8 border-border-subtle" />;

          default:
            return null;
        }
      })}
    </div>
  );
}
