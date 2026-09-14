import type { Metadata } from "next";
import { LegalPageShell } from "@/components/LegalPageShell";

export const metadata: Metadata = {
  title: "プライバシーポリシー | 服装×天気",
};

export default function PrivacyPage() {
  return (
    <LegalPageShell title="プライバシーポリシー">
      <p>
        本サービスでは、ユーザー登録を必要とせず、お選びいただいた地域・シチュエーションなどの設定は、お使いの端末内（ブラウザのローカルストレージ）にのみ保存されます。当該データを運営者のサーバーへ送信することはありません（天気情報の取得のため、位置情報に基づく緯度経度を天気APIに渡す場合を除く）。
      </p>
      <p>
        広告配信を行う場合、第三者配信事業者によるCookie等の利用があることがあります。詳細は各事業者のポリシーをご確認ください。
      </p>
      <p>
        本ポリシーの内容は、必要に応じて更新することがあります。
      </p>
    </LegalPageShell>
  );
}
