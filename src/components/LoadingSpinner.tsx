import { Shirt } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-blue/30 animate-bounce-soft">
        <Shirt className="h-8 w-8 text-accent-blue" />
      </div>
      <p className="text-sm text-muted animate-pulse-soft">
        今日の服装を準備中...
      </p>
    </div>
  );
}
