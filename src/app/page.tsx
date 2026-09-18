import type { Metadata } from "next";
import { ClientHome } from "@/components/ClientHome";

export const metadata: Metadata = {
  title: "服装ナビ | 今日の天気に合わせた最適なコーデを提案",
  description:
    "今日の天気や気温に合わせたおすすめの服装をひと目でチェック！毎朝の「何を着ていけばいいかわからない」を解決するお手軽コーディネート提案ツールです。",
  openGraph: {
    title: "服装ナビ | 今日の天気に合わせた最適なコーデを提案",
    description:
      "今日の天気や気温に合わせたおすすめの服装をひと目でチェック！毎朝の「何を着ていけばいいかわからない」を解決するお手軽コーディネート提案ツールです。",
    url: "https://www.hit-tool.com/fashion-weather?v=1",
    siteName: "hit-tool.com",
    images: [
      {
        url: "https://www.hit-tool.com/fashion-weather/og-image.png?v=1",
        width: 1200,
        height: 630,
        alt: "服装ナビ OGP画像",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
};

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-lg flex-1">
      <ClientHome />
    </main>
  );
}
