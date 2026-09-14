import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/operator", label: "運営者情報" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/contact", label: "お問い合わせ" },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto border-t border-accent-blue/25 bg-gradient-to-b from-accent-blue/5 to-background">
      <div className="mx-auto w-full max-w-lg px-4 py-8">
        <p className="text-center text-xs leading-relaxed text-muted">
          登録不要・完全無料 / データはこの端末内にのみ保存されます
        </p>

        <nav
          aria-label="フッターナビゲーション"
          className="mt-5 flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-[11px] text-muted"
        >
          {FOOTER_LINKS.map(({ href, label }, index) => (
            <span key={href} className="inline-flex items-center">
              {index > 0 ? (
                <span className="mx-2 text-accent-blue/30" aria-hidden>
                  |
                </span>
              ) : null}
              <Link
                href={href}
                className="underline-offset-2 transition-colors hover:text-foreground hover:underline focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:ring-offset-2"
              >
                {label}
              </Link>
            </span>
          ))}
        </nav>

        <p className="mt-6 text-center text-[11px] text-muted">
          © 2026 服装×天気 All rights reserved.
        </p>
      </div>
    </footer>
  );
}
