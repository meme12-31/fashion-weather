import { ThermometerSun } from "lucide-react";
import type { TimeSlotAdvice } from "@/lib/types";

interface TemperatureAdviceProps {
  advices: TimeSlotAdvice[];
}

export function TemperatureAdvice({ advices }: TemperatureAdviceProps) {
  return (
    <section className="mx-4 mt-6">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
        <ThermometerSun className="h-4 w-4 text-accent-pink" />
        時間帯別寒暖差対策
      </h3>
      <div className="flex flex-col gap-3">
        {advices.map((item) => (
          <div
            key={item.period}
            className="rounded-2xl bg-card px-4 py-3 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-accent-blue/20 px-3 py-1 text-xs font-bold">
                {item.period}
              </span>
              <span className="text-xs text-muted">{item.timeRange}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed">{item.advice}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
