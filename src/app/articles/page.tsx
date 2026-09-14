import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Shirt } from "lucide-react";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { BackToHomeButton } from "@/components/articles/BackToHomeButton";
import { getAllArticles } from "@/lib/data/articles";

export const metadata: Metadata = {
  title: "お役立ちコラム一覧 | 今日の服装ナビ",
  description:
    "天気と服装選びに役立つコラム10本。寒暖差・雨対策・通勤コーデなど、毎日の迷いを減らすヒントをまとめました。",
};

export default function ArticlesIndexPage() {
  const articles = getAllArticles();

  return (
    <main className="mx-auto min-h-screen w-full max-w-lg bg-background pb-10">
      <header className="sticky top-0 z-40 border-b border-accent-blue/20 bg-card/95 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-blue/20 transition-colors hover:bg-accent-blue/30 focus:outline-none focus:ring-2 focus:ring-accent-blue/40"
            aria-label="トップへ戻る"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-pink/40">
              <Shirt className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold leading-tight">
                お役立ちコラム
              </h1>
              <p className="text-xs text-muted">天気×服装の読みもの 全10本</p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 pt-5">
        <p className="rounded-2xl bg-gradient-to-r from-accent-yellow/25 to-accent-pink/20 px-4 py-3 text-xs leading-relaxed text-muted">
          毎朝の「何を着ればいい？」をサポートするコラムです。気になるテーマから読んでみてください。
        </p>

        <ul className="mt-5 space-y-4">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </ul>

        <div className="mt-8">
          <BackToHomeButton />
        </div>
      </div>
    </main>
  );
}
