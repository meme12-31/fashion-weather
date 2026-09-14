import type { ArticleSection } from "../types";
import type { ArticleSlug } from "../catalog";
import { sections as temperatureOutfit152025 } from "./temperature-outfit-15-20-25";
import { sections as rainyOfficeCasual } from "./rainy-office-casual";
import { sections as dailyTemperatureSwingOuter } from "./daily-temperature-swing-outer";
import { sections as rainProbabilityUmbrellaGuide } from "./rain-probability-umbrella-guide";
import { sections as winterLayeringUnder10 } from "./winter-layering-under-10";
import { sections as seasonalWardrobeSpringAutumn } from "./seasonal-wardrobe-spring-autumn";
import { sections as extremeHeatUvStyle } from "./extreme-heat-uv-style";
import { sections as rainBootsCareGuide } from "./rain-boots-care-guide";
import { sections as humidSeasonHairClothes } from "./humid-season-hair-clothes";
import { sections as travelWeatherPacking } from "./travel-weather-packing";

export const ARTICLE_BODIES: Record<ArticleSlug, ArticleSection[]> = {
  "temperature-outfit-15-20-25": temperatureOutfit152025,
  "rainy-office-casual": rainyOfficeCasual,
  "daily-temperature-swing-outer": dailyTemperatureSwingOuter,
  "rain-probability-umbrella-guide": rainProbabilityUmbrellaGuide,
  "winter-layering-under-10": winterLayeringUnder10,
  "seasonal-wardrobe-spring-autumn": seasonalWardrobeSpringAutumn,
  "extreme-heat-uv-style": extremeHeatUvStyle,
  "rain-boots-care-guide": rainBootsCareGuide,
  "humid-season-hair-clothes": humidSeasonHairClothes,
  "travel-weather-packing": travelWeatherPacking,
};
