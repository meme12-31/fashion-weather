/** アメリカ国名検索時に優先表示する主要都市（API検索クエリ） */
export const US_MAJOR_CITY_QUERIES = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Diego",
  "Dallas",
  "San Jose",
  "Honolulu",
] as const;

/** 国名として扱い、主要都市サジェストへ展開する入力 */
export const US_COUNTRY_QUERY_KEYS = new Set([
  "アメリカ",
  "米国",
  "USA",
  "US",
  "アメリカ合衆国",
  "United States",
  "United States of America",
]);

export function isUsCountryQuery(query: string): boolean {
  return US_COUNTRY_QUERY_KEYS.has(query.trim());
}
