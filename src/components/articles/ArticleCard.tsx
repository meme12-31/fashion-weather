import Link from "next/link";
import { ArticleIcon } from "@/components/articles/ArticleIcon";
import type { Article } from "@/lib/data/articles";

interface ArticleCardProps {
  article: Pick<
    Article,
    "slug" | "title" | "emoji" | "tag" | "summary"
  >;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <li>
      <Link
        href={`/articles/${article.slug}`}
        className="group flex gap-4 rounded-3xl border border-accent-blue/20 bg-card p-4 shadow-sm transition-all hover:border-accent-blue/40 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent-blue/40"
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-yellow/40 to-accent-pink/30 text-foreground">
          <ArticleIcon slug={article.slug} className="h-7 w-7 text-foreground/85" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="mb-1 inline-block rounded-full bg-accent-blue/15 px-2.5 py-0.5 text-[10px] font-bold text-foreground">
            {article.tag}
          </span>
          <span className="mt-1 block text-sm font-bold leading-snug text-foreground group-hover:text-foreground/90">
            {article.title}
          </span>
          <span className="mt-2 block text-xs leading-relaxed text-muted">
            {article.summary}
          </span>
        </span>
      </Link>
    </li>
  );
}
