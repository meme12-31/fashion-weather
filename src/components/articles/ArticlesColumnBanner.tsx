import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface ArticlesColumnBannerProps {
  /** 親コンテナ（mx-4 済み）内に置くとき true */
  embedded?: boolean;
}

export function ArticlesColumnBanner({
  embedded = false,
}: ArticlesColumnBannerProps) {
  return (
    <section
      className={embedded ? "" : "mx-4 mt-6"}
      aria-labelledby="articles-column-banner"
    >
      <Link
        href="/articles"
        id="articles-column-banner"
        className="group flex items-center gap-3 rounded-3xl border border-accent-pink/40 bg-gradient-to-r from-accent-pink/25 via-card to-accent-blue/20 px-5 py-4 shadow-md transition-all hover:border-accent-blue/50 hover:shadow-lg active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-accent-blue/40"
      >
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-card text-2xl shadow-sm"
          aria-hidden
        >
          👗
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold leading-snug text-foreground">
            天気と言いわけ・服装選びの
            <br />
            お役立ちコラム一覧を見る
          </span>
          <span className="mt-1 block text-xs text-muted">
            10本の読み物で、毎日のコーデがラクに
          </span>
        </span>
        <ChevronRight
          className="h-5 w-5 shrink-0 text-accent-blue transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </Link>
    </section>
  );
}
