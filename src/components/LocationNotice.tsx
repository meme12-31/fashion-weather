import { MapPinOff, X } from "lucide-react";

interface LocationNoticeProps {
  onDismiss: () => void;
}

export function LocationNotice({ onDismiss }: LocationNoticeProps) {
  return (
    <div className="mx-4 mt-3 flex items-start gap-3 rounded-2xl border border-accent-yellow/60 bg-accent-yellow/20 px-4 py-3">
      <MapPinOff className="mt-0.5 h-5 w-5 shrink-0 text-foreground" />
      <p className="flex-1 text-sm leading-relaxed">
        位置情報がオフになっています。ONにすると正確な位置情報で天気情報を取得可能です。手動で地域を選択することもできます。
      </p>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded-full p-1.5 transition-colors hover:bg-accent-yellow/40 focus:outline-none focus:ring-2 focus:ring-accent-yellow/60"
        aria-label="通知を閉じる"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
