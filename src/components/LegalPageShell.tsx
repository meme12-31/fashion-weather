import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface LegalPageShellProps {
  title: string;
  children: ReactNode;
}

export function LegalPageShell({ title, children }: LegalPageShellProps) {
  return (
    <main className="mx-auto min-h-0 w-full max-w-lg flex-1 bg-background px-4 pb-8 pt-4">
      <header className="mb-6 flex items-center gap-3">
        <Link
          href="/"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-blue/20 transition-colors hover:bg-accent-blue/30 focus:outline-none focus:ring-2 focus:ring-accent-blue/40"
          aria-label="トップへ戻る"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-base font-bold">{title}</h1>
      </header>
      <article className="space-y-4 rounded-3xl border border-accent-blue/15 bg-card p-5 text-sm leading-relaxed text-foreground/90 shadow-sm">
        {children}
      </article>
    </main>
  );
}
