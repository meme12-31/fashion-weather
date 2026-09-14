import type { ArticleSection } from "@/lib/data/articles";

interface ArticleTableOfContentsProps {
  sections: ArticleSection[];
}

export function ArticleTableOfContents({
  sections,
}: ArticleTableOfContentsProps) {
  return (
    <nav
      aria-label="目次"
      className="rounded-3xl border border-accent-blue/25 bg-card/80 p-4 shadow-sm"
    >
      <p className="mb-3 text-xs font-bold tracking-wide text-muted">目次</p>
      <ol className="space-y-2">
        {sections.map((section, index) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="flex gap-2 rounded-xl px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-accent-blue/10 focus:bg-accent-blue/10 focus:outline-none"
            >
              <span className="shrink-0 font-bold text-accent-blue">
                {index + 1}.
              </span>
              <span className="leading-snug">{section.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
