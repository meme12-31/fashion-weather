import type {
  HourlyWeather,
  MainOutfitSuggestion,
  OutfitCategory,
  OutfitItemAdvice,
  Situation,
  TimelineSlot,
  TimeSlotAdvice,
  WeatherData,
} from "../types";

function getBaseCategory(maxTemp: number): OutfitCategory {
  if (maxTemp >= 26) {
    return {
      label: "半袖・ノースリーブ",
      emoji: "👕",
      layer: "Tシャツ",
    };
  }
  if (maxTemp >= 21) {
    return {
      label: "長袖シャツ・薄手カットソー",
      emoji: "👔",
      layer: "長袖シャツ",
    };
  }
  if (maxTemp >= 16) {
    return {
      label: "カーディガン・パーカー",
      emoji: "🧥",
      layer: "長袖＋羽織り",
    };
  }
  if (maxTemp >= 12) {
    return {
      label: "ジャケット・トレンチコート",
      emoji: "🧥",
      layer: "ジャケット",
    };
  }
  return {
    label: "厚手コート・ダウン",
    emoji: "🧣",
    layer: "コート",
  };
}

function getHourlyOutfit(temp: number): { icon: string; label: string } {
  if (temp >= 26) return { icon: "👕", label: "Tシャツ" };
  if (temp >= 21) return { icon: "👔", label: "長袖シャツ" };
  if (temp >= 16) return { icon: "🧥", label: "薄手羽織り" };
  if (temp >= 12) return { icon: "🧥", label: "ジャケット" };
  return { icon: "🧣", label: "コート" };
}

function hasTemperatureGap(maxTemp: number, minTemp: number): boolean {
  return maxTemp - minTemp >= 8;
}

/** 20〜22℃前後の気温帯 */
function isMildTempRange(maxTemp: number): boolean {
  return maxTemp >= 20 && maxTemp <= 22;
}

const MILD_TEMP_OUTFITS: Record<
  Situation,
  { category: OutfitCategory; advice: string }
> = {
  work: {
    category: {
      label: "長袖シャツ / ブラウス",
      emoji: "👔",
      layer: "長袖",
    },
    advice:
      "通勤・通学は長袖シャツ / ブラウスがおすすめ。きちんとした印象がありつつも移動時も快適に過ごせます。",
  },
  date: {
    category: {
      label: "ブラウス / キレイめシャツ",
      emoji: "👚",
      layer: "長袖",
    },
    advice:
      "お出かけ・デートはブラウス / キレイめシャツで。寒く見えすぎず、屋内と屋外の温度差にも対応できるバランスが◎です。",
  },
  active: {
    category: {
      label: "ロンT / パーカー",
      emoji: "👕",
      layer: "カジュアル",
    },
    advice:
      "アクティブな一日はロンT / パーカーで動きやすく。体温調整しやすいレイヤードがポイントです。",
  },
  relax: {
    category: {
      label: "長袖カットソー / スウェット",
      emoji: "👕",
      layer: "カジュアル",
    },
    advice:
      "休日のリラックスタイムは長袖カットソー / スウェットで過ごしやすく。快適さ重視のコーディネートを楽しみましょう。",
  },
};

function getSituationCategory(
  situation: Situation,
  maxTemp: number,
): OutfitCategory {
  switch (situation) {
    case "work":
      if (maxTemp >= 26) {
        return {
          label: "半袖シャツ / ポロシャツ",
          emoji: "👔",
          layer: "半袖",
        };
      }
      if (maxTemp >= 23) {
        return {
          label: "長袖シャツ / ブラウス",
          emoji: "👔",
          layer: "長袖",
        };
      }
      if (maxTemp >= 16) {
        return {
          label: "ニット / シャツ",
          emoji: "👔",
          layer: "長袖",
        };
      }
      if (maxTemp >= 12) {
        return {
          label: "トレンチコート / ジャケット",
          emoji: "🧥",
          layer: "ジャケット",
        };
      }
      return {
        label: "コート / ダウンジャケット",
        emoji: "🧣",
        layer: "コート",
      };

    case "date":
      if (maxTemp >= 26) {
        return {
          label: "リネンシャツ / 軽やかなブラウス",
          emoji: "👚",
          layer: "半袖",
        };
      }
      if (maxTemp >= 23) {
        return {
          label: "ブラウス / キレイめシャツ",
          emoji: "👚",
          layer: "長袖",
        };
      }
      if (maxTemp >= 16) {
        return {
          label: "ニット / ブラウス",
          emoji: "👚",
          layer: "長袖",
        };
      }
      if (maxTemp >= 12) {
        return {
          label: "ワンピ / セットアップ",
          emoji: "👗",
          layer: "コート",
        };
      }
      return {
        label: "暖かめワンピ / コート",
        emoji: "🧣",
        layer: "ダウン",
      };

    case "active":
      if (maxTemp >= 26) {
        return {
          label: "速乾Tシャツ / タンクトップ",
          emoji: "👕",
          layer: "半袖",
        };
      }
      if (maxTemp >= 23) {
        return {
          label: "ロンT / パーカー",
          emoji: "👕",
          layer: "カジュアル",
        };
      }
      if (maxTemp >= 16) {
        return {
          label: "フリース / スウェット",
          emoji: "👕",
          layer: "長袖",
        };
      }
      if (maxTemp >= 12) {
        return {
          label: "中綿ジャケット / ソフトシェル",
          emoji: "🧥",
          layer: "ジャケット",
        };
      }
      return {
        label: "ダウン / 中綿ジャケット",
        emoji: "🧣",
        layer: "ダウン",
      };

    case "relax":
      if (maxTemp >= 26) {
        return {
          label: "半袖T / ルームウェア風トップス",
          emoji: "👕",
          layer: "半袖",
        };
      }
      if (maxTemp >= 23) {
        return {
          label: "長袖カットソー / スウェット",
          emoji: "👕",
          layer: "カジュアル",
        };
      }
      if (maxTemp >= 16) {
        return {
          label: "スウェット / パジャマ風セット",
          emoji: "👕",
          layer: "カジュアル",
        };
      }
      if (maxTemp >= 12) {
        return {
          label: "もこもこカーディガン / コート",
          emoji: "🧥",
          layer: "コート",
        };
      }
      return {
        label: "ダウン / 厚手コート",
        emoji: "🧣",
        layer: "ダウン",
      };

    default:
      return getBaseCategory(maxTemp);
  }
}

function getSituationAdvice(
  situation: Situation,
  category: OutfitCategory,
): string {
  switch (situation) {
    case "work":
      return `通勤・通学は${category.label}がおすすめ。きちんとした印象がありつつも移動時も快適に過ごせます。`;
    case "date":
      return `お出かけ・デートは${category.label}で。寒く見えすぎず、屋内と屋外の温度差にも対応できるバランスが◎です。`;
    case "active":
      return `アクティブな一日は${category.label}で動きやすく。体温調整しやすいレイヤードがポイントです。`;
    case "relax":
      return `休日のリラックスタイムは${category.label}で過ごしやすく。快適さ重視のコーディネートを楽しみましょう。`;
    default:
      return `${category.label}が今日のおすすめです。`;
  }
}

function isRainExpected(weather: WeatherData): boolean {
  const maxProb = Math.max(
    weather.currentPrecipitationProbability,
    ...weather.hourly.map((h) => h.precipitationProbability),
  );
  const maxPrecip = Math.max(
    0,
    ...weather.hourly.map((h) => h.precipitation),
  );
  const hasRainCode =
    weather.currentWeatherCode >= 51 ||
    weather.hourly.some((h) => h.weatherCode >= 51 && h.weatherCode <= 67);

  return maxProb >= 40 || maxPrecip >= 0.1 || hasRainCode;
}

function isSunnyOrClear(weather: WeatherData): boolean {
  return (
    weather.currentWeatherCode <= 2 ||
    weather.hourly.some((h) => h.weatherCode <= 2)
  );
}

function getItemAdvices(
  weather: WeatherData,
  situation: Situation,
  gapFlag: boolean,
): OutfitItemAdvice[] {
  const advices: OutfitItemAdvice[] = [];
  const rainExpected = isRainExpected(weather);
  const sunny = isSunnyOrClear(weather);

  if (rainExpected) {
    advices.push({
      icon: "🌂",
      text: "折りたたみ傘があると安心",
    });
    if (situation === "active" || situation === "work") {
      advices.push({
        icon: "👟",
        text: "濡れても良い靴推奨",
      });
    }
  }

  if (gapFlag) {
    advices.push({
      icon: "🧥",
      text: "羽織ものを持参（朝晩の寒暖差対策）",
    });
  }

  if (sunny && weather.maxTemperature >= 20) {
    advices.push({
      icon: "🕶️",
      text: "サングラス・UV対策推奨",
    });
  } else if (!rainExpected && weather.maxTemperature >= 24 && sunny) {
    advices.push({
      icon: "🕶️",
      text: "日差しが強い日はUVケアを",
    });
  }

  if (
    !rainExpected &&
    !gapFlag &&
    weather.maxTemperature >= 16 &&
    weather.maxTemperature < 22
  ) {
    advices.push({
      icon: "🧥",
      text: "気温変化に備えて薄手のアウターを",
    });
  }

  return advices;
}

export function getMainOutfitSuggestion(
  weather: WeatherData,
  situation: Situation,
): MainOutfitSuggestion {
  const gapFlag = hasTemperatureGap(
    weather.maxTemperature,
    weather.minTemperature,
  );

  let category: OutfitCategory;
  let advice: string;

  if (isMildTempRange(weather.maxTemperature)) {
    const preset = MILD_TEMP_OUTFITS[situation];
    category = preset.category;
    advice = preset.advice;
  } else {
    category = getSituationCategory(situation, weather.maxTemperature);
    advice = getSituationAdvice(situation, category);
  }

  const itemAdvices = getItemAdvices(weather, situation, gapFlag);

  return {
    category,
    advice,
    hasTemperatureGap: gapFlag,
    itemAdvices,
  };
}

function getHourFromTime(time: string): number {
  return new Date(time).getHours();
}

function getAverageTempForHours(
  hourly: HourlyWeather[],
  startHour: number,
  endHour: number,
): number {
  const matching = hourly.filter((h) => {
    const hour = getHourFromTime(h.time);
    return hour >= startHour && hour <= endHour;
  });

  if (matching.length === 0) return 0;

  const sum = matching.reduce((acc, h) => acc + h.temperature, 0);
  return Math.round(sum / matching.length);
}

function generatePeriodAdvice(
  period: string,
  timeRange: string,
  avgTemp: number,
  minTemp: number,
  gapFlag: boolean,
): string {
  if (avgTemp >= 26) {
    return `${period}（${timeRange}）は${avgTemp}℃前後。半袖で十分ですが、日差し対策も忘れずに。`;
  }
  if (avgTemp >= 21) {
    return `${period}（${timeRange}）は${avgTemp}℃前後。長袖シャツ1枚で快適に過ごせます。`;
  }
  if (avgTemp >= 16) {
    const note = gapFlag ? "脱ぎ着しやすい羽織もの推奨。" : "";
    return `${period}（${timeRange}）は${avgTemp}℃前後。薄手の羽織りがあると安心です。${note}`;
  }
  if (avgTemp >= 12) {
    return `${period}（${timeRange}）は${avgTemp}℃前後。ジャケットやトレンチコートがおすすめです。`;
  }
  const belowMin = avgTemp < minTemp + 2;
  if (belowMin) {
    return `${period}（${timeRange}）は${avgTemp}℃と冷え込みます。${minTemp}℃を下回る可能性があるため、コートやダウンが必須です。`;
  }
  return `${period}（${timeRange}）は${avgTemp}℃前後。しっかり暖かい上着を用意しましょう。`;
}

export function getTimeSlotAdvices(weather: WeatherData): TimeSlotAdvice[] {
  const gapFlag = hasTemperatureGap(
    weather.maxTemperature,
    weather.minTemperature,
  );

  const periods: { period: string; timeRange: string; start: number; end: number }[] =
    [
      { period: "朝", timeRange: "6〜9時", start: 6, end: 9 },
      { period: "昼", timeRange: "11〜15時", start: 11, end: 15 },
      { period: "夜", timeRange: "18〜22時", start: 18, end: 22 },
    ];

  return periods.map(({ period, timeRange, start, end }) => {
    const avgTemp = getAverageTempForHours(weather.hourly, start, end);
    return {
      period,
      timeRange,
      temperature: avgTemp,
      advice: generatePeriodAdvice(
        period,
        timeRange,
        avgTemp,
        weather.minTemperature,
        gapFlag,
      ),
    };
  });
}

export function getTimelineSlots(weather: WeatherData): TimelineSlot[] {
  const gapFlag = hasTemperatureGap(
    weather.maxTemperature,
    weather.minTemperature,
  );

  const slots: TimelineSlot[] = [];

  for (let hour = 0; hour < 24; hour += 3) {
    const windowHours = weather.hourly.filter((h) => {
      const hHour = getHourFromTime(h.time);
      return hHour >= hour && hHour < hour + 3;
    });

    if (windowHours.length === 0) continue;

    const matching = windowHours.find((h) => getHourFromTime(h.time) === hour);
    const data = matching ?? windowHours[0];

    const precipitation = Math.max(
      ...windowHours.map((h) => h.precipitation),
    );
    const precipitationProbability = Math.max(
      ...windowHours.map((h) => h.precipitationProbability),
    );

    const outfit = getHourlyOutfit(data.temperature);
    const isMorningOrNight = hour <= 9 || hour >= 18;
    const extraNote =
      gapFlag && isMorningOrNight
        ? "脱ぎ着しやすい羽織もの推奨"
        : undefined;

    slots.push({
      time: `${String(hour).padStart(2, "0")}:00`,
      hour,
      temperature: Math.round(data.temperature),
      weatherCode: data.weatherCode,
      precipitationProbability,
      precipitation,
      outfitIcon: outfit.icon,
      outfitLabel: outfit.label,
      extraNote,
    });
  }

  return slots;
}
