export type Situation = "work" | "date" | "active" | "relax";

export interface Location {
  name: string;
  lat: number;
  lon: number;
}

export interface UserSetting {
  selectedLocation: Location;
  selectedSituation: Situation;
  favoriteLocations?: Location[];
}

export interface HourlyWeather {
  time: string;
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
  /** 1時間あたりの降水量 (mm/h) */
  precipitation: number;
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  currentTemperature: number;
  maxTemperature: number;
  minTemperature: number;
  currentWeatherCode: number;
  currentPrecipitationProbability: number;
  hourly: HourlyWeather[];
}

export interface OutfitCategory {
  label: string;
  emoji: string;
  layer: string;
}

export interface OutfitItemAdvice {
  icon: string;
  text: string;
}

export interface MainOutfitSuggestion {
  category: OutfitCategory;
  advice: string;
  hasTemperatureGap: boolean;
  itemAdvices: OutfitItemAdvice[];
}

export interface TimelineSlot {
  time: string;
  hour: number;
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
  /** 3時間枠内の最大降水量 (mm/h) */
  precipitation: number;
  outfitIcon: string;
  outfitLabel: string;
  extraNote?: string;
}

export interface TimeSlotAdvice {
  period: string;
  timeRange: string;
  temperature: number;
  advice: string;
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  country?: string;
  country_code?: string;
  feature_code?: string;
}
