import type { GeocodingResult, Location } from "../types";
import municipalitiesData from "./municipalities.json";

export interface CityEntry {
  name: string;
  lat: number;
  lon: number;
}

export const MUNICIPALITIES_BY_PREFECTURE: Record<string, CityEntry[]> =
  municipalitiesData;

/** 全国47都道府県 */
export const PREFECTURES: string[] = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
];

export const DEFAULT_PREFECTURE = "東京都";
export const DEFAULT_CITY_NAME = "千代田区";

export function getCitiesForPrefecture(prefecture: string): CityEntry[] {
  return MUNICIPALITIES_BY_PREFECTURE[prefecture] ?? [];
}

export function cityToLocation(
  prefecture: string,
  city: CityEntry,
): Location {
  return {
    name: `${prefecture} ${city.name}`,
    lat: city.lat,
    lon: city.lon,
  };
}

export function findPrefectureForLocation(location: Location): string {
  for (const pref of PREFECTURES) {
    if (location.name.startsWith(pref)) {
      return pref;
    }
  }
  for (const pref of PREFECTURES) {
    if (location.name.includes(pref)) {
      return pref;
    }
  }
  return DEFAULT_PREFECTURE;
}

export function findCityForLocation(
  location: Location,
  prefecture: string,
): CityEntry | undefined {
  const cities = getCitiesForPrefecture(prefecture);
  if (location.name.startsWith(prefecture)) {
    const cityName = location.name.slice(prefecture.length).trim();
    const exact = cities.find((c) => c.name === cityName);
    if (exact) return exact;
  }

  let closest: CityEntry | undefined;
  let minDistance = Infinity;

  for (const city of cities) {
    const dist =
      (location.lat - city.lat) ** 2 + (location.lon - city.lon) ** 2;
    if (dist < minDistance) {
      minDistance = dist;
      closest = city;
    }
  }

  return closest;
}

export function extractCityNameFromLocation(
  location: Location,
  prefecture: string,
): string {
  const city = findCityForLocation(location, prefecture);
  if (city) return city.name;

  if (location.name.startsWith(prefecture)) {
    return location.name.slice(prefecture.length).trim();
  }
  const commaParts = location.name.split(/[,、]/);
  if (commaParts.length >= 2) {
    const cityPart = commaParts[0].trim();
    if (cityPart) return cityPart;
  }
  return location.name;
}

function normalizeDomesticSearchText(text: string): string {
  return text
    .normalize("NFKC")
    .replace(/\s/g, "")
    .replace(/[ヶが]/g, "ケ");
}

function domesticResultId(prefecture: string, cityName: string): number {
  const key = `${prefecture}:${cityName}`;
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  return hash > 0 ? -hash : hash - 1;
}

function domesticCityToGeocodingResult(
  prefecture: string,
  city: CityEntry,
): GeocodingResult {
  return {
    id: domesticResultId(prefecture, city.name),
    name: city.name,
    latitude: city.lat,
    longitude: city.lon,
    admin1: prefecture,
    country: "日本",
    country_code: "JP",
    feature_code: "PPLA2",
  };
}

function domesticResultKey(result: GeocodingResult): string {
  return `${result.admin1 ?? ""}:${result.name}`;
}

export function searchDomesticCities(
  query: string,
  limit = 20,
): GeocodingResult[] {
  const trimmed = query.trim().normalize("NFKC");
  if (trimmed.length < 2) {
    return [];
  }

  const normalizedQuery = normalizeDomesticSearchText(trimmed);
  const queryCore = normalizedQuery.replace(/[市区町村]$/, "");
  const results: GeocodingResult[] = [];
  const seen = new Set<string>();

  for (const prefecture of PREFECTURES) {
    for (const city of getCitiesForPrefecture(prefecture)) {
      const normalizedCity = normalizeDomesticSearchText(city.name);
      const cityCore = normalizedCity.replace(/[市区町村]$/, "");
      const matches =
        normalizedCity.includes(normalizedQuery) ||
        normalizedQuery.includes(cityCore) ||
        (queryCore.length >= 2 && cityCore.includes(queryCore));

      if (!matches) continue;

      const key = `${prefecture}:${city.name}`;
      if (seen.has(key)) continue;
      seen.add(key);
      results.push(domesticCityToGeocodingResult(prefecture, city));

      if (results.length >= limit) {
        return results;
      }
    }
  }

  return results;
}

export function mergeDomesticSearchResults(
  apiResults: GeocodingResult[],
  domesticResults: GeocodingResult[],
): GeocodingResult[] {
  return mergeHybridCityResults(domesticResults, apiResults);
}

/** ローカル候補を先頭に、API候補を重複除外して結合 */
export function mergeHybridCityResults(
  localResults: GeocodingResult[],
  apiResults: GeocodingResult[],
  limit = 20,
): GeocodingResult[] {
  const seen = new Set(localResults.map((result) => domesticResultKey(result)));
  const merged = [...localResults];

  for (const result of apiResults) {
    const key = domesticResultKey(result);
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(result);
    if (merged.length >= limit) break;
  }

  return merged.slice(0, limit);
}

export function containsJapaneseCharacters(text: string): boolean {
  return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text);
}
