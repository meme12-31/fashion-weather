import {
  isUsCountryQuery,
  US_MAJOR_CITY_QUERIES,
} from "./usMajorCities";

/**
 * Open-Meteo Geocoding は日本語漢字（仁川・釜山など）や国名（韓国）で
 * ヒットしないことがあるため、追加検索クエリへ展開する。
 */
export interface SearchAliasConfig {
  /** 追加で API に投げる検索語 */
  queries: string[];
  /** 指定時はこの国コードの結果のみ採用（ノイズ除去） */
  countryCode?: string;
  /** true のとき元クエリは API に投げず aliases のみ検索 */
  aliasesOnly?: boolean;
}

const QUERY_ALIASES: Record<string, SearchAliasConfig> = {
  // 韓国
  韓国: {
    queries: ["Seoul", "Incheon", "Busan"],
    countryCode: "KR",
    aliasesOnly: true,
  },
  大韓民国: {
    queries: ["Seoul", "Incheon", "Busan"],
    countryCode: "KR",
    aliasesOnly: true,
  },
  北朝鮮: { queries: ["Pyongyang"], countryCode: "KP", aliasesOnly: true },
  仁川: { queries: ["Incheon"], countryCode: "KR" },
  釜山: { queries: ["Busan"], countryCode: "KR" },
  プサン: { queries: ["Busan"], countryCode: "KR" },
  ソウル: { queries: ["Seoul"], countryCode: "KR" },
  大邱: { queries: ["Daegu"], countryCode: "KR" },
  テグ: { queries: ["Daegu"], countryCode: "KR" },
  大田: { queries: ["Daejeon"], countryCode: "KR" },
  テジョン: { queries: ["Daejeon"], countryCode: "KR" },
  光州: { queries: ["Gwangju"], countryCode: "KR" },
  クァンジュ: { queries: ["Gwangju"], countryCode: "KR" },
  // 日本（API未対応の漢字表記）
  東京: { queries: ["Tokyo"], countryCode: "JP" },
  とうきょう: { queries: ["Tokyo"], countryCode: "JP" },
  大阪: { queries: ["Osaka"], countryCode: "JP" },
  おおさか: { queries: ["Osaka"], countryCode: "JP" },
  京都: { queries: ["Kyoto"], countryCode: "JP" },
  きょうと: { queries: ["Kyoto"], countryCode: "JP" },
  横浜: { queries: ["Yokohama"], countryCode: "JP" },
  名古屋: { queries: ["Nagoya"], countryCode: "JP" },
  福岡: { queries: ["Fukuoka"], countryCode: "JP" },
  札幌: { queries: ["Sapporo"], countryCode: "JP" },
  // 中国・台湾
  北京: { queries: ["Beijing"], countryCode: "CN" },
  台北: { queries: ["Taipei"], countryCode: "TW" },
  上海: { queries: ["Shanghai"], countryCode: "CN" },
  // その他主要都市（カタカナ）
  パリ: { queries: ["Paris"], countryCode: "FR" },
  ロンドン: { queries: ["London"], countryCode: "GB" },
  ニューヨーク: { queries: ["New York"], countryCode: "US" },
  ホノルル: { queries: ["Honolulu"], countryCode: "US" },
  シドニー: { queries: ["Sydney"], countryCode: "AU" },
  バンコク: { queries: ["Bangkok"], countryCode: "TH" },
  シンガポール: { queries: ["Singapore"], countryCode: "SG" },
  // 国名 → 主要都市
  中国: {
    queries: ["Beijing", "Shanghai", "Hong Kong"],
    countryCode: "CN",
    aliasesOnly: true,
  },
  台湾: { queries: ["Taipei"], countryCode: "TW", aliasesOnly: true },
  フランス: { queries: ["Paris"], countryCode: "FR", aliasesOnly: true },
  アメリカ: {
    queries: [...US_MAJOR_CITY_QUERIES],
    countryCode: "US",
    aliasesOnly: true,
  },
  米国: {
    queries: [...US_MAJOR_CITY_QUERIES],
    countryCode: "US",
    aliasesOnly: true,
  },
  USA: {
    queries: [...US_MAJOR_CITY_QUERIES],
    countryCode: "US",
    aliasesOnly: true,
  },
  US: {
    queries: [...US_MAJOR_CITY_QUERIES],
    countryCode: "US",
    aliasesOnly: true,
  },
  アメリカ合衆国: {
    queries: [...US_MAJOR_CITY_QUERIES],
    countryCode: "US",
    aliasesOnly: true,
  },
  "United States": {
    queries: [...US_MAJOR_CITY_QUERIES],
    countryCode: "US",
    aliasesOnly: true,
  },
  "United States of America": {
    queries: [...US_MAJOR_CITY_QUERIES],
    countryCode: "US",
    aliasesOnly: true,
  },
  イギリス: { queries: ["London"], countryCode: "GB", aliasesOnly: true },
  英国: { queries: ["London"], countryCode: "GB", aliasesOnly: true },
  ドイツ: { queries: ["Berlin"], countryCode: "DE", aliasesOnly: true },
  イタリア: { queries: ["Rome"], countryCode: "IT", aliasesOnly: true },
  スペイン: { queries: ["Madrid"], countryCode: "ES", aliasesOnly: true },
  タイ: { queries: ["Bangkok"], countryCode: "TH", aliasesOnly: true },
  オーストラリア: {
    queries: ["Sydney"],
    countryCode: "AU",
    aliasesOnly: true,
  },
  カナダ: {
    queries: ["Toronto", "Vancouver"],
    countryCode: "CA",
    aliasesOnly: true,
  },
};

const MAX_SEARCH_QUERIES = 12;

export interface ExpandedSearchPlan {
  queries: string[];
  countryCode?: string;
}

function resolveAliasConfig(key: string): SearchAliasConfig | undefined {
  return QUERY_ALIASES[key];
}

export function getExpandedSearchPlan(query: string): ExpandedSearchPlan {
  const trimmed = query.trim();
  const queries = new Set<string>();
  let countryCode: string | undefined;
  let aliasesOnly = false;

  const applyConfig = (config: SearchAliasConfig, includeOriginal: boolean) => {
    if (config.countryCode) {
      countryCode = config.countryCode;
    }
    if (config.aliasesOnly) {
      aliasesOnly = true;
    }
    if (includeOriginal && !config.aliasesOnly) {
      queries.add(trimmed);
    }
    for (const alias of config.queries) {
      queries.add(alias);
    }
  };

  const direct = resolveAliasConfig(trimmed);
  if (direct) {
    applyConfig(direct, true);
  } else if (isUsCountryQuery(trimmed)) {
    applyConfig(
      {
        queries: [...US_MAJOR_CITY_QUERIES],
        countryCode: "US",
        aliasesOnly: true,
      },
      true,
    );
  } else {
    queries.add(trimmed);
  }

  if (trimmed.endsWith("市")) {
    const base = trimmed.slice(0, -1);
    const baseConfig = resolveAliasConfig(base);
    if (baseConfig) {
      applyConfig(baseConfig, true);
    } else {
      queries.add(base);
    }
  }

  if (trimmed.endsWith("広域市")) {
    const base = trimmed.slice(0, -3);
    const baseConfig = resolveAliasConfig(base);
    if (baseConfig) {
      applyConfig(baseConfig, true);
    } else {
      queries.add(base);
    }
  }

  if (aliasesOnly) {
    queries.delete(trimmed);
  }

  return {
    queries: [...queries].slice(0, MAX_SEARCH_QUERIES),
    countryCode,
  };
}

/** @deprecated use getExpandedSearchPlan */
export function getExpandedSearchQueries(query: string): string[] {
  return getExpandedSearchPlan(query).queries;
}

export const GLOBAL_CITY_SEARCH_HINT =
  "※都市名（例: ソウル、仁川、パリ）を入力してください。国名を入力すると主要都市が候補に表示されます。";
