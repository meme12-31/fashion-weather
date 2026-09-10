import { getTimelineWeatherIcon } from "@/lib/utils/weatherIcons";
import type { TimelineSlot } from "@/lib/types";

interface TimelineProps {
  slots: TimelineSlot[];
}

export function Timeline({ slots }: TimelineProps) {
  return (
    <section className="mx-4 mt-6">
      <h3 className="mb-3 text-sm font-bold">3時間ごとのタイムライン</h3>
      <div className="timeline-scroll flex gap-3 overflow-x-auto pb-2">
        {slots.map((slot) => {
          const WeatherIcon = getTimelineWeatherIcon(
            slot.weatherCode,
            slot.precipitation,
            slot.precipitationProbability,
          );

          return (
            <div
              key={slot.time}
              className="flex min-w-[100px] shrink-0 flex-col items-center rounded-2xl bg-card px-3 py-4 shadow-sm"
            >
              <span className="text-xs font-semibold text-muted">
                {slot.time}
              </span>
              <WeatherIcon
                className="mt-1.5 h-7 w-7 text-accent-blue"
                aria-hidden
              />
              <span className="mt-1 text-lg font-bold">
                {slot.temperature}℃
              </span>
              <span className="mt-1 whitespace-nowrap text-[9px] leading-tight text-muted">
                降水確率 {slot.precipitationProbability}%
              </span>
              <div className="mt-2 flex flex-col items-center">
                <span className="text-xl">{slot.outfitIcon}</span>
                <span className="mt-0.5 text-[10px] font-medium">
                  {slot.outfitLabel}
                </span>
              </div>
              {slot.extraNote && (
                <span className="mt-2 rounded-full bg-accent-yellow/30 px-2 py-0.5 text-[9px] leading-tight text-center">
                  {slot.extraNote}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
