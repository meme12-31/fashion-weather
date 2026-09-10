import type { GeocodingResult } from "../types";

/** アメリカの都市名（英語）→ カタカナ */
export const US_CITY_KATAKANA: Record<string, string> = {
  York: "ヨーク",
  "Los Angeles": "ロサンゼルス",
  "New York": "ニューヨーク",
  "New York City": "ニューヨーク",
  Chicago: "シカゴ",
  Houston: "ヒューストン",
  Phoenix: "フェニックス",
  Philadelphia: "フィラデルフィア",
  "San Antonio": "サンアントニオ",
  "San Diego": "サンディエゴ",
  Dallas: "ダラス",
  "San Jose": "サンノゼ",
  Austin: "オースティン",
  Jacksonville: "ジャクソンビル",
  "San Francisco": "サンフランシスコ",
  Columbus: "コロンバス",
  Indianapolis: "インディアナポリス",
  Seattle: "シアトル",
  Denver: "デンバー",
  Washington: "ワシントン",
  "Washington, D.C.": "ワシントンD.C.",
  Boston: "ボストン",
  Nashville: "ナッシュビル",
  Detroit: "デトロイト",
  Portland: "ポートランド",
  "Las Vegas": "ラスベガス",
  Honolulu: "ホノルル",
  Miami: "マイアミ",
  Atlanta: "アトランタ",
  Minneapolis: "ミネアポリス",
  Tampa: "タンパ",
  "St. Louis": "セントルイス",
  Pittsburgh: "ピッツバーグ",
  Cincinnati: "シンシナティ",
  Orlando: "オーランド",
  Cleveland: "クリーブランド",
  "Salt Lake City": "ソルトレイクシティ",
  Charlotte: "シャーロット",
  Milwaukee: "ミルウォーキー",
  Baltimore: "ボルチモア",
  Sacramento: "サクラメント",
  "Kansas City": "カンザスシティ",
  "New Orleans": "ニューオーリンズ",
  Memphis: "メンフィス",
  Louisville: "ルイビル",
  Raleigh: "ローリー",
  Omaha: "オマハ",
  Oakland: "オークランド",
  Tulsa: "タルサ",
  Arlington: "アーリントン",
  Wichita: "ウィチタ",
  Bakersfield: "ベイカーズフィールド",
  Aurora: "オーロラ",
  Anaheim: "アナハイム",
  Riverside: "リバーサイド",
  Stockton: "ストックトン",
  Irvine: "アーバイン",
  Fremont: "フリーモント",
  "Santa Ana": "サンタアナ",
  "Long Beach": "ロングビーチ",
  "Colorado Springs": "コロラドスプリングス",
  Mesa: "メサ",
  "Virginia Beach": "バージニアビーチ",
};

/** アメリカの州名（英語）→ カタカナ */
export const US_STATE_KATAKANA: Record<string, string> = {
  Alabama: "アラバマ州",
  Alaska: "アラスカ州",
  Arizona: "アリゾナ州",
  Arkansas: "アーカンソー州",
  California: "カリフォルニア州",
  Colorado: "コロラド州",
  Connecticut: "コネチカット州",
  Delaware: "デラウェア州",
  Florida: "フロリダ州",
  Georgia: "ジョージア州",
  Hawaii: "ハワイ州",
  Idaho: "アイダホ州",
  Illinois: "イリノイ州",
  Indiana: "インディアナ州",
  Iowa: "アイオワ州",
  Kansas: "カンザス州",
  Kentucky: "ケンタッキー州",
  Louisiana: "ルイジアナ州",
  Maine: "メイン州",
  Maryland: "メリーランド州",
  Massachusetts: "マサチューセッツ州",
  Michigan: "ミシガン州",
  Minnesota: "ミネソタ州",
  Mississippi: "ミシシッピ州",
  Missouri: "ミズーリ州",
  Montana: "モンタナ州",
  Nebraska: "ネブラスカ州",
  Nevada: "ネバダ州",
  "New Hampshire": "ニューハンプシャー州",
  "New Jersey": "ニュージャージー州",
  "New Mexico": "ニューメキシコ州",
  "New York": "ニューヨーク州",
  "North Carolina": "ノースカロライナ州",
  "North Dakota": "ノースダコタ州",
  Ohio: "オハイオ州",
  Oklahoma: "オクラホマ州",
  Oregon: "オレゴン州",
  Pennsylvania: "ペンシルベニア州",
  "Rhode Island": "ロードアイランド州",
  "South Carolina": "サウスカロライナ州",
  "South Dakota": "サウスダコタ州",
  Tennessee: "テネシー州",
  Texas: "テキサス州",
  Utah: "ユタ州",
  Vermont: "バーモント州",
  Virginia: "バージニア州",
  Washington: "ワシントン州",
  "West Virginia": "ウェストバージニア州",
  Wisconsin: "ウィスコンシン州",
  Wyoming: "ワイオミング州",
  "District of Columbia": "コロンビア特別区",
};

const US_COUNTRY_LABEL = "アメリカ合衆国";

function isJapaneseScript(text: string): boolean {
  return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text);
}

function hasLatinLetters(text: string): boolean {
  return /[A-Za-z]/.test(text);
}

function lookupKatakana(
  name: string,
  map: Record<string, string>,
): string | undefined {
  if (map[name]) return map[name];
  const lower = name.toLowerCase();
  const key = Object.keys(map).find((entry) => entry.toLowerCase() === lower);
  return key ? map[key] : undefined;
}

export function isUnitedStatesGeocodingResult(countryCode?: string): boolean {
  return countryCode === "US";
}

export function toUsCityKatakana(name: string): string {
  if (!name || isJapaneseScript(name)) return name;
  const direct = lookupKatakana(name, US_CITY_KATAKANA);
  if (direct) return direct;
  return name;
}

export function pickUsGeocodingDisplayName(
  jaName: string | undefined,
  enName: string | undefined,
): string {
  const candidates = [jaName, enName].filter(
    (value): value is string => Boolean(value),
  );

  for (const candidate of candidates) {
    if (isJapaneseScript(candidate)) {
      return candidate;
    }
  }

  for (const candidate of candidates) {
    const mapped = toUsCityKatakana(candidate);
    if (!hasLatinLetters(mapped)) {
      return mapped;
    }
  }

  return toUsCityKatakana(enName ?? jaName ?? "");
}

export function toUsStateKatakana(name: string): string {
  if (!name || isJapaneseScript(name)) return name;
  return lookupKatakana(name, US_STATE_KATAKANA) ?? name;
}

export function toUsCountryKatakana(name?: string): string {
  if (!name) return US_COUNTRY_LABEL;
  if (isJapaneseScript(name)) return name;
  if (
    name === "United States" ||
    name === "United States of America" ||
    name === "USA" ||
    name === "US"
  ) {
    return US_COUNTRY_LABEL;
  }
  return name;
}

export function localizeUsGeocodingName(
  name: string | undefined,
  countryCode?: string,
  field: "city" | "admin1" | "country" = "city",
): string {
  if (!name) return "";
  if (!isUnitedStatesGeocodingResult(countryCode)) return name;

  switch (field) {
    case "admin1":
      return toUsStateKatakana(name);
    case "country":
      return toUsCountryKatakana(name);
    default:
      return toUsCityKatakana(name);
  }
}

export function normalizeUsGeocodingResult(
  result: GeocodingResult,
  jaName?: string,
  enName?: string,
): GeocodingResult {
  if (!isUnitedStatesGeocodingResult(result.country_code)) {
    return result;
  }

  const displayName = pickUsGeocodingDisplayName(
    jaName ?? result.name,
    enName ?? result.name,
  );

  return {
    ...result,
    name: displayName,
    admin1: result.admin1
      ? localizeUsGeocodingName(result.admin1, result.country_code, "admin1")
      : result.admin1,
    country: localizeUsGeocodingName(
      result.country ?? result.country_code,
      result.country_code,
      "country",
    ),
  };
}
