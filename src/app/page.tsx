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
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "「今日の服装ナビ」ではどのような情報が確認できますか？",
            acceptedAnswer: {
              "@type": "Answer",
              text: "選択した地域（または現在地）のリアルタイムな天気・気温・降水確率に基づき、通勤・通学、デート、アクティブ、休日などの用途別に最適な服装・持ち物・寒暖差対策のアドバイスをひと目で確認できます。",
            },
          },
          {
            "@type": "Question",
            name: "利用料金や会員登録は必要ですか？",
            acceptedAnswer: {
              "@type": "Answer",
              text: "登録不要・完全無料でご利用いただけます。お気に入り地域や設定情報はお使いのブラウザ内にのみ安全に保存されます。",
            },
          },
          {
            "@type": "Question",
            name: "現在地以外の天気や服装も調べられますか？",
            acceptedAnswer: {
              "@type": "Answer",
              text: "右上の「地域変更」ボタンから全国の市区町村を検索して自由に切り替えることができます。よく使う地域はお気に入り登録も可能です。",
            },
          },
          {
            "@type": "Question",
            name: "降水確率が何パーセントから傘が必要ですか？",
            acceptedAnswer: {
              "@type": "Answer",
              text: "当ツールでは降水確率30%以上で折りたたみ傘や雨対策のアドバイスを提示し、50%以上では長傘や防水アイテムをおすすめしています。",
            },
          },
        ],
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

      {/* SEO用静的セクション（UIデザインを保ちつつ、生HTML内に概要・使い方・FAQ・コラム10本を出力） */}
      <section
        className="sr-only"
        aria-label="サービス概要・使い方ガイド・よくある質問・コラム一覧"
      >
        <h2>気温や天候に合わせた最適なコーディネートや服装を提案するツール</h2>
        <p>
          「今日の服装ナビ」は、毎日の天気・気温・降水確率・寒暖差に合わせて、朝・昼・夜の最適なコーディネートや持ち物を提案するWebツールです。通勤・通学、デート、休日のお出かけなど、シーンに合わせて快適な服装選びをサポートします。
        </p>

        <h2>今日の服装ナビの使い方ガイド</h2>
        <ol>
          <li>
            <strong>STEP 1. 地域を選択：</strong>
            位置情報を許可するか、右上の「地域変更」からお好みの市区町村を選択します。
          </li>
          <li>
            <strong>STEP 2. シチュエーションを選択：</strong>
            「通勤・通学」「デート・お出かけ」「アクティブ・屋外」「休日・リラックス」から今日の予定を選びます。
          </li>
          <li>
            <strong>STEP 3. コーデと持ち物を確認：</strong>
            最高・最低気温や時間帯別の気温推移（タイムライン）、傘の必要性などを確認して服装を決定します。
          </li>
        </ol>

        <h2>よくある質問（FAQ）</h2>
        <dl>
          <dt>Q. 「今日の服装ナビ」ではどのような情報が確認できますか？</dt>
          <dd>
            A.
            選択した地域のリアルタイムな天気・気温・降水確率に基づき、通勤・通学、デート、アクティブ、休日などの用途別に最適な服装・持ち物・寒暖差対策のアドバイスをひと目で確認できます。
          </dd>
          <dt>Q. 利用料金や会員登録は必要ですか？</dt>
          <dd>
            A.
            登録不要・完全無料でご利用いただけます。お気に入り地域や設定情報はお使いのブラウザ内にのみ安全に保存されます。
          </dd>
          <dt>Q. 現在地以外の天気や服装も調べられますか？</dt>
          <dd>
            A.
            右上の「地域変更」ボタンから全国の市区町村を検索して自由に切り替えることができます。よく使う地域はお気に入り登録も可能です。
          </dd>
          <dt>Q. 降水確率が何パーセントから傘が必要ですか？</dt>
          <dd>
            A.
            当ツールでは降水確率30%以上で折りたたみ傘や雨対策のアドバイスを提示し、50%以上では長傘や防水アイテムをおすすめしています。
          </dd>
        </dl>

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
