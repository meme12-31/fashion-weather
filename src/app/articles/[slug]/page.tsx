import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ArticleBody } from "@/components/articles/ArticleBody";
import { ArticleIcon } from "@/components/articles/ArticleIcon";
import { ArticleTableOfContents } from "@/components/articles/ArticleTableOfContents";
import { BackToHomeButton } from "@/components/articles/BackToHomeButton";
import {
  getArticleBySlug,
  getArticleSlugs,
} from "@/lib/data/articles";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) {
    return { title: "記事が見つかりません | 今日の服装ナビ" };
  }
  return {
    title: `${article.title} | 今日の服装ナビ`,
    description: article.summary,
  };
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-lg bg-background pb-10">
      <header className="sticky top-0 z-40 border-b border-accent-blue/20 bg-card/95 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            href="/articles"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-blue/20 transition-colors hover:bg-accent-blue/30 focus:outline-none focus:ring-2 focus:ring-accent-blue/40"
            aria-label="コラム一覧へ戻る"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <span className="rounded-full bg-accent-blue/15 px-2.5 py-0.5 text-[10px] font-bold">
            {article.tag}
          </span>
        </div>
      </header>

      <article className="px-4 pt-5">
        <div className="rounded-3xl bg-gradient-to-br from-accent-blue/25 via-card to-accent-pink/20 p-5 shadow-md">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-card/80 shadow-sm">
            <ArticleIcon slug={article.slug} className="h-7 w-7 text-foreground" />
          </span>
          <h1 className="mt-3 text-lg font-bold leading-snug text-foreground">
            {article.title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {article.summary}
          </p>
        </div>

        <div className="mt-5">
          <ArticleTableOfContents sections={article.sections} />
        </div>

        <div className="mt-6">
          <ArticleBody sections={article.sections} />
        </div>

        <div className="mt-8 space-y-3">
          <Link
            href="/articles"
            className="inline-flex w-full items-center justify-center rounded-full bg-accent-blue px-6 py-3 text-sm font-bold text-foreground shadow-sm transition-colors hover:bg-accent-blue/80 focus:outline-none focus:ring-2 focus:ring-accent-blue/40"
          >
            コラム一覧に戻る
          </Link>
          <BackToHomeButton />
        </div>
      </article>
    </main>
  );
}
