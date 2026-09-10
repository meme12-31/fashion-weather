import { DEFAULT_LOCATION, STORAGE_KEY } from "../constants";
import type { Location, Situation, UserSetting } from "../types";

const DEFAULT_SETTINGS: UserSetting = {
  selectedLocation: DEFAULT_LOCATION,
  selectedSituation: "work",
  favoriteLocations: [],
};

function isValidLocation(value: unknown): value is Location {
  if (!value || typeof value !== "object") return false;
  const loc = value as Record<string, unknown>;
  return (
    typeof loc.name === "string" &&
    typeof loc.lat === "number" &&
    typeof loc.lon === "number" &&
    Number.isFinite(loc.lat) &&
    Number.isFinite(loc.lon)
  );
}

function isValidSituation(value: unknown): value is Situation {
  return (
    value === "work" ||
    value === "date" ||
    value === "active" ||
    value === "relax"
  );
}

function parseSettings(raw: string): UserSetting {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return DEFAULT_SETTINGS;
    }

    const data = parsed as Record<string, unknown>;
    const selectedLocation = isValidLocation(data.selectedLocation)
      ? data.selectedLocation
      : DEFAULT_SETTINGS.selectedLocation;
    const selectedSituation = isValidSituation(data.selectedSituation)
      ? data.selectedSituation
      : DEFAULT_SETTINGS.selectedSituation;

    let favoriteLocations: Location[] = [];
    if (Array.isArray(data.favoriteLocations)) {
      favoriteLocations = data.favoriteLocations.filter(isValidLocation);
    }

    return {
      selectedLocation,
      selectedSituation,
      favoriteLocations,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function loadSettings(): UserSetting {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return parseSettings(raw);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSetting): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // LocalStorage unavailable or quota exceeded — silently ignore
  }
}

export function updateLocation(location: Location): UserSetting {
  const current = loadSettings();
  const updated: UserSetting = {
    ...current,
    selectedLocation: location,
  };
  saveSettings(updated);
  return updated;
}

export function updateSituation(situation: Situation): UserSetting {
  const current = loadSettings();
  const updated: UserSetting = {
    ...current,
    selectedSituation: situation,
  };
  saveSettings(updated);
  return updated;
}

export function addFavoriteLocation(location: Location): UserSetting {
  const current = loadSettings();
  const favorites = current.favoriteLocations ?? [];
  const exists = favorites.some(
    (fav) =>
      fav.lat === location.lat &&
      fav.lon === location.lon &&
      fav.name === location.name,
  );

  if (exists) return current;

  const updated: UserSetting = {
    ...current,
    favoriteLocations: [...favorites, location],
  };
  saveSettings(updated);
  return updated;
}

export function removeFavoriteLocation(location: Location): UserSetting {
  const current = loadSettings();
  const favorites = current.favoriteLocations ?? [];
  const updated: UserSetting = {
    ...current,
    favoriteLocations: favorites.filter(
      (fav) =>
        !(
          fav.lat === location.lat &&
          fav.lon === location.lon &&
          fav.name === location.name
        ),
    ),
  };
  saveSettings(updated);
  return updated;
}
