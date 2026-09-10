import { MapPin, Search, Shirt } from "lucide-react";
import type { Location } from "@/lib/types";

interface HeaderProps {
  location: Location;
  onChangeLocation: () => void;
}

export function Header({ location, onChangeLocation }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-accent-blue/20 bg-card/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-pink/40">
              <Shirt className="h-5 w-5 text-foreground" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold leading-tight">
                今日の服装ナビ
              </h1>
              <p className="flex items-center gap-1 truncate text-xs text-muted">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{location.name}</span>
              </p>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onChangeLocation}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-accent-blue px-4 py-2.5 text-sm font-bold text-foreground shadow-sm transition-colors hover:bg-accent-blue/80 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
        >
          <Search className="h-4 w-4" />
          <span>地域変更</span>
        </button>
      </div>
    </header>
  );
}
