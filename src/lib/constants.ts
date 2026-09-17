import type { Location, Situation } from "./types";

export const BASE_PATH = "/fashion-weather";

export const DEFAULT_LOCATION: Location = {
  name: "東京都 千代田区",
  lat: 35.694,
  lon: 139.7536,
};

export const STORAGE_KEY = "fuku-navi-settings";

export const SITUATIONS: {
  id: Situation;
  label: string;
  emoji: string;
}[] = [
  { id: "work", label: "通勤・通学", emoji: "💼" },
  { id: "date", label: "デート・お出かけ", emoji: "❤️" },
  { id: "active", label: "アクティブ・屋外", emoji: "🏃" },
  { id: "relax", label: "休日・リラックス", emoji: "🏠" },
];

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-KXFP18WL67";

export const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "";

export const ADSENSE_SLOT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID ?? "";
