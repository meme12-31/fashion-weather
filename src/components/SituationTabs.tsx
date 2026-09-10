import { SITUATIONS } from "@/lib/constants";
import type { Situation } from "@/lib/types";

interface SituationTabsProps {
  selected: Situation;
  onChange: (situation: Situation) => void;
}

export function SituationTabs({ selected, onChange }: SituationTabsProps) {
  return (
    <div className="mx-4 mt-4">
      <p className="mb-2 text-xs font-semibold text-muted">シチュエーション</p>
      <div className="flex flex-wrap gap-2">
        {SITUATIONS.map((item) => {
          const isActive = selected === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`rounded-full px-3 py-2 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-accent-pink/50 ${
                isActive
                  ? "bg-accent-pink text-foreground shadow-sm"
                  : "bg-card text-muted hover:bg-accent-blue/20"
              }`}
            >
              {item.emoji} {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
