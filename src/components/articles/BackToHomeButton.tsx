import Link from "next/link";

interface BackToHomeButtonProps {
  label?: string;
}

export function BackToHomeButton({
  label = "🌤 今日の服装チェックに戻る",
}: BackToHomeButtonProps) {
  return (
    <Link
      href="/#page-top"
      className="inline-flex w-full items-center justify-center rounded-full border-2 border-accent-blue/40 bg-card px-6 py-3.5 text-sm font-bold text-foreground shadow-sm transition-colors hover:bg-accent-blue/10 focus:outline-none focus:ring-2 focus:ring-accent-blue/40"
    >
      {label}
    </Link>
  );
}
