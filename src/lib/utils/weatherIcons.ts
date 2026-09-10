import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
  type LucideIcon,
} from "lucide-react";

/** 小雨と本降りの境界 (mm/h) */
const HEAVY_RAIN_THRESHOLD_MM = 1.5;
/** タイムラインで雨アイコン表示に必要な降水確率の下限（41%以上） */
const TIMELINE_RAIN_PROB_THRESHOLD = 40;

export function getWeatherLabel(code: number): string {
  if (code === 0) return "快晴";
  if (code <= 3) return "くもり";
  if (code <= 49) return "霧";
  if (code <= 59) return "霧雨";
  if (code <= 69) return "雨";
  if (code <= 79) return "雪";
  if (code <= 82) return "にわか雨";
  if (code <= 86) return "にわか雪";
  if (code <= 99) return "雷雨";
  return "不明";
}

export function getWeatherIcon(code: number): LucideIcon {
  if (code === 0) return Sun;
  if (code <= 2) return CloudSun;
  if (code <= 3) return Cloud;
  if (code <= 49) return CloudFog;
  if (code <= 69) return CloudRain;
  if (code <= 79) return CloudSnow;
  if (code <= 86) return CloudDrizzle;
  if (code <= 99) return CloudLightning;
  return Cloud;
}

export function getWeatherEmoji(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 2) return "⛅";
  if (code <= 3) return "☁️";
  if (code <= 49) return "🌫️";
  if (code <= 69) return "🌧️";
  if (code <= 79) return "❄️";
  if (code <= 86) return "🌦️";
  if (code <= 99) return "⛈️";
  return "🌤️";
}

function isSnowCode(code: number): boolean {
  return (code >= 71 && code <= 77) || (code >= 85 && code <= 86);
}

function isThunderCode(code: number): boolean {
  return code >= 95;
}

function isHeavyRainCode(code: number): boolean {
  return code === 65 || code === 82;
}

function isLightRainCode(code: number): boolean {
  return (
    (code >= 51 && code <= 55) ||
    code === 61 ||
    code === 80 ||
    code === 81
  );
}

function getTimelineClearSkyIcon(weatherCode: number): LucideIcon {
  if (weatherCode === 0) return Sun;
  if (weatherCode <= 2) return CloudSun;
  if (weatherCode <= 48) return Cloud;
  return Cloud;
}

function meetsTimelineRainConditions(
  weatherCode: number,
  precipitationMmH: number,
): boolean {
  if (isThunderCode(weatherCode)) return true;
  if (isHeavyRainCode(weatherCode)) return true;
  if (isLightRainCode(weatherCode)) return true;
  if (precipitationMmH >= 0.1) return true;
  if (weatherCode >= 51 && weatherCode <= 67) return true;
  return false;
}

/**
 * タイムライン用: 降水量・降水確率・天気コードを組み合わせてアイコンを判定
 * - 降水確率40%以下: 降水量に関わらず雨アイコンは使わず曇り（晴れ系は天気コードに応じて表示）
 * - 降水確率41%以上かつ雨条件を満たす場合のみ雨アイコンを表示
 */
export function getTimelineWeatherIcon(
  weatherCode: number,
  precipitationMmH: number,
  precipitationProbability: number,
): LucideIcon {
  if (precipitationProbability <= TIMELINE_RAIN_PROB_THRESHOLD) {
    return getTimelineClearSkyIcon(weatherCode);
  }

  if (!meetsTimelineRainConditions(weatherCode, precipitationMmH)) {
    return getTimelineClearSkyIcon(weatherCode);
  }

  if (isThunderCode(weatherCode)) {
    return CloudLightning;
  }

  if (isSnowCode(weatherCode)) {
    return CloudSnow;
  }

  const hasHeavyRain =
    precipitationMmH >= HEAVY_RAIN_THRESHOLD_MM || isHeavyRainCode(weatherCode);

  if (hasHeavyRain) {
    return CloudRain;
  }

  return CloudDrizzle;
}
