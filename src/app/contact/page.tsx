import type { Metadata } from "next";
import { LegalPageShell } from "@/components/LegalPageShell";

export const metadata: Metadata = {
  title: "お問い合わせ | 服装×天気",
};

export default function ContactPage() {
  return (
    <LegalPageShell title="お問い合わせ">
      <p>
        サービスに関するご質問・不具合のご報告・取材等のお問い合わせは、下記メールアドレスまでご連絡ください。
      </p>
      <p className="rounded-2xl bg-accent-blue/10 px-4 py-3 text-center font-medium">
        （お問い合わせ先メールアドレスは準備中です）
      </p>
      <p className="text-xs text-muted">
        返信までにお時間をいただく場合があります。あらかじめご了承ください。
      </p>
    </LegalPageShell>
  );
}
