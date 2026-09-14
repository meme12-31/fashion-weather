import type { Metadata } from "next";
import { LegalPageShell } from "@/components/LegalPageShell";

export const metadata: Metadata = {
  title: "運営者情報 | 服装×天気",
};

export default function OperatorPage() {
  return (
    <LegalPageShell title="運営者情報">
      <p>
        本サービス「服装×天気（今日の服装ナビ）」は、天気に合わせた服装の参考情報を提供するWebアプリケーションです。
      </p>
      <p>
        運営者情報の詳細は、サービス公開に合わせて本ページに掲載します。お問い合わせは「お問い合わせ」ページよりご連絡ください。
      </p>
    </LegalPageShell>
  );
}
