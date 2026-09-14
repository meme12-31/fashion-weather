import type { LucideIcon } from "lucide-react";
import {
  CloudRain,
  Droplets,
  Flower2,
  Footprints,
  Luggage,
  Snowflake,
  Sun,
  Umbrella,
  Wind,
} from "lucide-react";
import type { ArticleSlug } from "@/lib/data/articles/catalog";

const ARTICLE_ICONS: Record<ArticleSlug, LucideIcon> = {
  "temperature-outfit-15-20-25": Sun,
  "rainy-office-casual": CloudRain,
  "daily-temperature-swing-outer": Wind,
  "rain-probability-umbrella-guide": Umbrella,
  "winter-layering-under-10": Snowflake,
  "seasonal-wardrobe-spring-autumn": Flower2,
  "extreme-heat-uv-style": Sun,
  "rain-boots-care-guide": Footprints,
  "humid-season-hair-clothes": Droplets,
  "travel-weather-packing": Luggage,
};

interface ArticleIconProps {
  slug: string;
  className?: string;
}

export function ArticleIcon({ slug, className = "h-7 w-7" }: ArticleIconProps) {
  const Icon =
    ARTICLE_ICONS[slug as ArticleSlug] ?? Sun;
  return <Icon className={className} strokeWidth={2} aria-hidden />;
}
