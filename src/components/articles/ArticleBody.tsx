import type { ArticleBlock, ArticleSection } from "@/lib/data/articles";

interface ArticleBodyProps {
  sections: ArticleSection[];
}

function ArticleBlockView({
  block,
  blockKey,
}: {
  block: ArticleBlock;
  blockKey: string;
}) {
  switch (block.type) {
    case "paragraph":
      return (
        <p
          key={blockKey}
          className="text-sm leading-[1.85] text-foreground/90"
        >
          {block.text}
        </p>
      );
    case "h3":
      return (
        <h3
          key={blockKey}
          className="mt-4 text-sm font-bold leading-snug text-foreground first:mt-0"
        >
          {block.title}
        </h3>
      );
    case "list":
      return (
        <ul
          key={blockKey}
          className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90"
        >
          {block.items.map((item, index) => (
            <li key={`${blockKey}-li-${index}`}>{item}</li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div
          key={blockKey}
          className="overflow-x-auto rounded-2xl border border-accent-blue/20"
        >
          <table className="w-full min-w-[280px] text-left text-xs">
            <thead>
              <tr className="border-b border-accent-blue/20 bg-accent-blue/10">
                {block.headers.map((header, index) => (
                  <th key={index} className="px-3 py-2.5 font-bold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-accent-blue/10 last:border-0"
                >
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-3 py-2.5 align-top">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}

export function ArticleBody({ sections }: ArticleBodyProps) {
  return (
    <div className="space-y-5">
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="scroll-mt-24 rounded-3xl border border-accent-blue/15 bg-card p-5 shadow-sm"
        >
          <h2 className="mb-4 border-l-4 border-accent-pink/70 pl-3 text-base font-bold leading-snug text-foreground">
            {section.title}
          </h2>
          <div className="space-y-3">
            {section.blocks.map((block, index) => (
              <ArticleBlockView
                key={`${section.id}-block-${index}`}
                block={block}
                blockKey={`${section.id}-block-${index}`}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
