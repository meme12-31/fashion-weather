import { getWeatherEmoji } from "@/lib/utils/weatherIcons";
import type { MainOutfitSuggestion, WeatherData } from "@/lib/types";

interface MainOutfitCardProps {
  weather: WeatherData;
  suggestion: MainOutfitSuggestion;
}

export function MainOutfitCard({ weather, suggestion }: MainOutfitCardProps) {
  const weatherEmoji = getWeatherEmoji(weather.currentWeatherCode);

  return (
    <section className="mx-4 mt-4 overflow-hidden rounded-3xl bg-card shadow-md">
      <div className="bg-gradient-to-br from-accent-blue/30 to-accent-pink/20 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted">今日の天気</p>
            <div className="mt-1 flex items-end gap-2">
              <span className="text-4xl">{weatherEmoji}</span>
              <span className="text-3xl font-bold">
                {Math.round(weather.currentTemperature)}℃
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm">
              最高{" "}
              <span className="font-bold text-red-500">
                {weather.maxTemperature}℃
              </span>
            </p>
            <p className="text-sm">
              最低{" "}
              <span className="font-bold text-blue-500">
                {weather.minTemperature}℃
              </span>
            </p>
            <p className="mt-1 text-xs text-muted">
              降水確率 {weather.currentPrecipitationProbability}%
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 py-5">
        <div className="flex items-start gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-accent-yellow/30 text-4xl">
            {suggestion.category.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-accent-pink">
              メインおすすめコーデ
            </p>
            <h2 className="mt-1 text-base font-bold leading-snug">
              {suggestion.category.label}
            </h2>
            {suggestion.hasTemperatureGap && (
              <span className="mt-1.5 inline-block rounded-full bg-accent-yellow/40 px-2 py-0.5 text-[10px] font-semibold">
                ⚠️ 寒暖差注意
              </span>
            )}
          </div>
        </div>

        <p className="mt-4 rounded-2xl bg-background px-4 py-3 text-sm leading-relaxed">
          {suggestion.advice}
        </p>

        {suggestion.itemAdvices.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold text-accent-pink">
              持ち物・アドバイス
            </p>
            <ul className="flex flex-col gap-2">
              {suggestion.itemAdvices.map((item) => (
                <li
                  key={item.text}
                  className="flex items-center gap-3 rounded-2xl bg-background px-4 py-2.5"
                >
                  <span className="shrink-0 text-lg leading-none">
                    {item.icon}
                  </span>
                  <span className="text-sm leading-snug">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
