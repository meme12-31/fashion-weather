import { getExpandedSearchPlan } from "../data/globalCitySearchAliases";
import {
  mergeHybridCityResults,
  searchDomesticCities,
} from "../data/japanLocations";
import {
  localizeUsGeocodingName,
  normalizeUsGeocodingResult,
  pickUsGeocodingDisplayName,
  toUsCityKatakana,
} from "../data/usPlaceNameKatakana";
import type { GeocodingResult, HourlyWeather, WeatherData } from "../types";

const FETCH_TIMEOUT_MS = 15000;
const GEOCODING_SEARCH_COUNT = 20;

interface ForecastApiResponse {
  latitude: number;
  longitude: number;
  current?: {
    time: string;
    temperature_2m: number;
    weather_code: number;
    precipitation_probability?: number;
  };
  daily?: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
  hourly?: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation_probability: number[];
    precipitation: number[];
  };
}

interface GeocodingApiResponse {
  results?: GeocodingResult[];
}

function formatLocationName(result: GeocodingResult): string {
  const parts = [result.name];
  if (result.admin1 && result.admin1 !== result.name) {
    parts.push(result.admin1);
  }
  return parts.join(", ");
}

function formatGlobalLocationName(result: GeocodingResult): string {
  const cityName = localizeUsGeocodingName(
    result.name,
    result.country_code,
    "city",
  );
  const parts = [cityName];
  if (result.admin1 && result.admin1 !== result.name) {
    parts.push(
      localizeUsGeocodingName(result.admin1, result.country_code, "admin1"),
    );
  }
  const countryLabel = localizeUsGeocodingName(
    result.country ?? result.country_code,
    result.country_code,
    "country",
  );
  if (countryLabel) {
    parts.push(countryLabel);
  }
  return parts.join(", ");
}

export function formatGeocodingResultLabel(result: GeocodingResult): string {
  if (result.country_code === "US") {
    return pickUsGeocodingDisplayName(result.name, result.name);
  }
  return localizeUsGeocodingName(result.name, result.country_code, "city");
}

export function formatGeocodingResultSubtitle(result: GeocodingResult): string {
  const cityLabel = formatGeocodingResultLabel(result);
  const parts: string[] = [];
  if (result.admin1 && result.admin1 !== result.name) {
    parts.push(
      localizeUsGeocodingName(result.admin1, result.country_code, "admin1"),
    );
  }
  const countryLabel = localizeUsGeocodingName(
    result.country ?? result.country_code,
    result.country_code,
    "country",
  );
  if (countryLabel && countryLabel !== cityLabel) {
    parts.push(countryLabel);
  }
  return parts.join(" · ");
}

function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("通信がタイムアウトしました。時間をおいて再試行してください。");
    }
    throw new Error("天気情報を読み込めませんでした");
  } finally {
    clearTimeout(timeoutId);
  }
}

/** API取得失敗時の概算フォールバックデータ */
export function createFallbackWeather(
  lat: number,
  lon: number,
): WeatherData {
  const now = new Date();
  const baseTemp = 20;
  const hourly: HourlyWeather[] = Array.from({ length: 24 }, (_, hour) => {
    const slot = new Date(now);
    slot.setHours(hour, 0, 0, 0);
    return {
      time: slot.toISOString(),
      temperature: baseTemp,
      weatherCode: 2,
      precipitationProbability: 0,
      precipitation: 0,
    };
  });

  return {
    latitude: lat,
    longitude: lon,
    currentTemperature: baseTemp,
    maxTemperature: 22,
    minTemperature: 15,
    currentWeatherCode: 0,
    currentPrecipitationProbability: 0,
    hourly,
  };
}

export async function fetchWeather(
  lat: number,
  lon: number,
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: "temperature_2m,weather_code,precipitation_probability",
    daily: "temperature_2m_max,temperature_2m_min",
    hourly:
      "temperature_2m,weather_code,precipitation_probability,precipitation",
    timezone: "auto",
    forecast_days: "2",
  });

  const response = await fetchWithTimeout(
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error("天気情報を読み込めませんでした");
  }

  const data = (await response.json()) as ForecastApiResponse;

  if (
    !data.current ||
    !data.daily?.temperature_2m_max?.[0] ||
    data.daily.temperature_2m_min?.[0] === undefined ||
    !data.hourly
  ) {
    throw new Error("天気データの形式が不正です");
  }

  const todayStr = getLocalDateString(new Date());

  const mappedHourly: HourlyWeather[] = data.hourly.time.map((time, index) => ({
    time,
    temperature: data.hourly!.temperature_2m[index],
    weatherCode: data.hourly!.weather_code[index],
    precipitationProbability: Math.round(
      data.hourly!.precipitation_probability[index] ?? 0,
    ),
    precipitation: data.hourly!.precipitation[index] ?? 0,
  }));

  let hourly = mappedHourly.filter((item) => item.time.startsWith(todayStr));

  if (hourly.length === 0) {
    hourly = mappedHourly.slice(0, 24);
  }

  let currentPrecipitationProbability = normalizePrecipitationProbability(
    data.current.precipitation_probability,
  );

  if (
    currentPrecipitationProbability === 0 &&
    hourly.length > 0 &&
    data.current.precipitation_probability == null
  ) {
    const now = new Date();
    const currentHour = now.getHours();
    const matchedHour = hourly.find(
      (item) => new Date(item.time).getHours() === currentHour,
    );
    if (matchedHour) {
      currentPrecipitationProbability = matchedHour.precipitationProbability;
    }
  }

  return {
    latitude: data.latitude,
    longitude: data.longitude,
    currentTemperature: data.current.temperature_2m,
    maxTemperature: Math.round(data.daily.temperature_2m_max[0]),
    minTemperature: Math.round(data.daily.temperature_2m_min[0]),
    currentWeatherCode: data.current.weather_code,
    currentPrecipitationProbability,
    hourly,
  };
}

function normalizePrecipitationProbability(
  value: number | undefined | null,
): number {
  if (value == null || Number.isNaN(value)) {
    return 0;
  }
  return Math.max(0, Math.round(value));
}

export async function searchLocations(
  query: string,
): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (trimmed.length === 0) {
    return [];
  }

  const params = new URLSearchParams({
    name: trimmed,
    count: "20",
    language: "ja",
    country: "JP",
    format: "json",
  });

  const response = await fetchWithTimeout(
    `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error("地域の検索に失敗しました");
  }

  const data = (await response.json()) as GeocodingApiResponse;
  return data.results ?? [];
}

async function fetchGeocodingSearch(
  query: string,
  language = "ja",
): Promise<GeocodingResult[]> {
  const keyword = query.trim();
  if (!keyword) {
    return [];
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(keyword)}&count=${GEOCODING_SEARCH_COUNT}&language=${language}&format=json`;
  const response = await fetch(url);

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as GeocodingApiResponse;
  return data.results ?? [];
}

function isCountryLevelResult(result: GeocodingResult): boolean {
  return result.feature_code === "PCLI" || result.feature_code === "PCL";
}

const FEATURE_PRIORITY: Record<string, number> = {
  PPLC: 0,
  PPLA: 1,
  PPLA2: 2,
  PPLA3: 3,
  PPL: 4,
};

function rankGeocodingResult(result: GeocodingResult): number {
  if (!result.feature_code) return 5;
  return FEATURE_PRIORITY[result.feature_code] ?? 6;
}

function nameMatchScore(result: GeocodingResult, query: string): number {
  const normalizedQuery = query.trim().toLowerCase();
  const mappedQuery =
    result.country_code === "US"
      ? toUsCityKatakana(query).trim().toLowerCase()
      : normalizedQuery;
  const candidates = [
    result.name,
    toUsCityKatakana(result.name),
    pickUsGeocodingDisplayName(result.name, result.name),
  ];

  let best = 3;
  for (const candidate of candidates) {
    const normalizedName = candidate.trim().toLowerCase();
    if (normalizedName === normalizedQuery || normalizedName === mappedQuery) {
      best = Math.min(best, 0);
      continue;
    }
    if (
      normalizedName.includes(normalizedQuery) ||
      normalizedQuery.includes(normalizedName) ||
      normalizedName.includes(mappedQuery) ||
      mappedQuery.includes(normalizedName)
    ) {
      best = Math.min(best, 1);
    }
  }
  return best;
}

function normalizeGeocodingResultsForDisplay(
  results: GeocodingResult[],
): GeocodingResult[] {
  return results.map((result) =>
    result.country_code === "US"
      ? normalizeUsGeocodingResult(result)
      : result,
  );
}

function filterGeocodingResults(
  results: GeocodingResult[],
  searchQuery: string,
  countryCode?: string,
): GeocodingResult[] {
  let filtered = results.filter((result) => !isCountryLevelResult(result));
  if (filtered.length === 0) {
    filtered = results;
  }

  if (countryCode) {
    const inCountry = filtered.filter(
      (result) => result.country_code === countryCode,
    );
    if (inCountry.length > 0) {
      filtered = inCountry;
    }
  }

  return [...filtered].sort((a, b) => {
    const nameScore =
      nameMatchScore(a, searchQuery) - nameMatchScore(b, searchQuery);
    if (nameScore !== 0) return nameScore;
    return rankGeocodingResult(a) - rankGeocodingResult(b);
  });
}

async function searchGeocodingQuery(
  searchQuery: string,
  countryCode?: string,
): Promise<GeocodingResult[]> {
  let results = await fetchGeocodingSearch(searchQuery, "ja");

  if (results.length === 0 && /^[\x00-\x7F\s-]+$/.test(searchQuery.trim())) {
    results = await fetchGeocodingSearch(searchQuery, "en");
  }

  const filtered = filterGeocodingResults(results, searchQuery, countryCode);
  return normalizeGeocodingResultsForDisplay(filtered);
}

function mergeMultiQueryResults(
  perQueryResults: GeocodingResult[][],
): GeocodingResult[] {
  const seen = new Set<number>();
  const merged: GeocodingResult[] = [];

  for (const group of perQueryResults) {
    const best = group[0];
    if (best && !seen.has(best.id)) {
      seen.add(best.id);
      merged.push(best);
    }
  }

  return merged;
}

export async function fetchRemoteGlobalCities(
  query: string,
): Promise<GeocodingResult[]> {
  const trimmed = query.trim().normalize("NFKC");
  if (trimmed.length < 2) {
    return [];
  }

  const plan = getExpandedSearchPlan(trimmed);
  if (plan.queries.length === 0) {
    return [];
  }

  const perQueryResults = await Promise.all(
    plan.queries.map((searchQuery) =>
      searchGeocodingQuery(searchQuery, plan.countryCode),
    ),
  );

  if (plan.queries.length > 1) {
    return mergeMultiQueryResults(perQueryResults);
  }

  return perQueryResults[0] ?? [];
}

export async function searchGlobalCities(
  query: string,
): Promise<GeocodingResult[]> {
  const trimmed = query.trim().normalize("NFKC");
  if (trimmed.length < 2) {
    return [];
  }

  const localResults = searchDomesticCities(trimmed, GEOCODING_SEARCH_COUNT);
  const apiResults = await fetchRemoteGlobalCities(trimmed);
  return mergeHybridCityResults(
    localResults,
    apiResults,
    GEOCODING_SEARCH_COUNT,
  );
}

function normalizePrefectureName(name: string): string {
  return name.replace(/\s/g, "");
}

function matchesPrefecture(
  result: GeocodingResult,
  prefecture: string,
): boolean {
  if (!result.admin1) return false;
  return normalizePrefectureName(result.admin1) === normalizePrefectureName(prefecture);
}

export async function searchLocationsInPrefecture(
  query: string,
  prefecture: string,
): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (trimmed.length === 0) {
    return [];
  }

  const results = await searchLocations(trimmed);
  const filtered = results.filter((result) => matchesPrefecture(result, prefecture));

  if (filtered.length > 0) {
    return filtered;
  }

  // 都道府県名を付けて再検索（例: "神奈川 茅ヶ崎"）
  const prefShort = prefecture.replace(/[都道府県]$/, "");
  const combinedResults = await searchLocations(`${prefShort} ${trimmed}`);
  return combinedResults.filter((result) => matchesPrefecture(result, prefecture));
}

export function geocodingResultToLocationInPrefecture(
  result: GeocodingResult,
  prefecture: string,
): { name: string; lat: number; lon: number } {
  return {
    name: `${prefecture} ${result.name}`,
    lat: result.latitude,
    lon: result.longitude,
  };
}

export async function reverseGeocode(
  lat: number,
  lon: number,
): Promise<string> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    language: "ja",
    count: "1",
    format: "json",
  });

  const response = await fetchWithTimeout(
    `https://geocoding-api.open-meteo.com/v1/reverse?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error("現在地の地名取得に失敗しました");
  }

  const data = (await response.json()) as GeocodingApiResponse;
  const result = data.results?.[0];
  if (!result) {
    return "現在地";
  }

  return formatLocationName(result);
}

export function geocodingResultToLocation(
  result: GeocodingResult,
): { name: string; lat: number; lon: number } {
  return {
    name: formatLocationName(result),
    lat: result.latitude,
    lon: result.longitude,
  };
}

export function geocodingResultToGlobalLocation(
  result: GeocodingResult,
): { name: string; lat: number; lon: number } {
  if (result.country_code === "JP" && result.admin1) {
    return {
      name: `${result.admin1} ${result.name}`,
      lat: result.latitude,
      lon: result.longitude,
    };
  }

  return {
    name: formatGlobalLocationName(result),
    lat: result.latitude,
    lon: result.longitude,
  };
}
