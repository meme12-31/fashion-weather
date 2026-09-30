import type { Metadata } from "next";
import Link from "next/link";
import { AdBanner } from "@/components/AdBanner";
import { FashionWeatherClient } from "@/components/FashionWeatherClient";
import { ArticlesColumnBanner } from "@/components/articles/ArticlesColumnBanner";
import { getAllArticles } from "@/lib/data/articles";

export const metadata: Metadata = {
  metadataBase: new URL("https://hit-tool.com"),
  title: "今日の服装ナビ｜天気に合わせた服装提案",
  description:
    "今日の天気や気温に合わせたおすすめの服装をひと目でチェック！毎朝の「何を着ていけばいいかわからない」を解決するお手軽コーディネート提案ツールです。",
  alternates: {
    canonical: "/fashion-weather",
  },
  openGraph: {
    title: "今日の服装ナビ｜天気に合わせた服装提案",
    description:
      "今日の天気や気温に合わせたおすすめの服装をひと目でチェック！毎朝の「何を着ていけばいいかわからない」を解決するお手軽コーディネート提案ツールです。",
    url: "https://hit-tool.com/fashion-weather",
    siteName: "hit-tool.com",
    images: [
      {
        url: "https://hit-tool.com/fashion-weather/og-image.png?v=1",
        width: 1200,
        height: 630,
        alt: "服装ナビ OGP画像",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "今日の服装ナビ｜天気に合わせた服装提案",
    description:
      "今日の天気や気温に合わせたおすすめの服装をひと目でチェック！毎朝の「何を着ていけばいいかわからない」を解決するお手軽コーディネート提案ツールです。",
    images: ["https://hit-tool.com/fashion-weather/og-image.png?v=1"],
  },
};

export default function Home() {
  const articles = getAllArticles();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "今日の服装ナビ",
        url: "https://hit-tool.com/fashion-weather",
        description:
          "今日の天気や気温に合わせたおすすめの服装をひと目でチェックできるコーディネート提案Webツールです。",
        applicationCategory: "WeatherApplication",
        operatingSystem: "All",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "JPY",
        },
      },
    ],
  };

  return (
    <main className="mx-auto w-full max-w-lg flex-1 bg-background pb-4">
      {/* 構造化データ（JSON-LD） */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 画面最上部〜メインUI（ヘッダーH1 ＞ 位置情報通知 ＞ シチュエーション ＞ 天気カード ＞ タイムライン ＞ 夜の天気枠） */}
      <FashionWeatherClient />

      {/* コラム一覧バナー（コンパクトな1枚のカード型リンク） */}
      <div className="mx-4 mt-8 border-t border-accent-blue/25 pt-6">
        <ArticlesColumnBanner embedded />
      </div>

      {/* 広告枠 */}
      <AdBanner />

      {/* お役立ちコラム一覧（全10本）SEO用静的セクション */}
      <section className="sr-only" aria-label="お役立ちコラム一覧">
        <h2>お役立ちコラム一覧（全10本）</h2>
        <ul>
          {articles.map((article) => (
            <li key={article.slug}>
              <Link href={`/articles/${article.slug}`}>
                <h3>{article.title}</h3>
                <p>{article.summary}</p>
                <span>{article.tag}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
