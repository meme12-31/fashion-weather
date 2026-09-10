"use client";

import {
  type ChangeEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Globe, Heart, Loader2, MapPin, Star, X } from "lucide-react";
import {
  fetchRemoteGlobalCities,
  formatGeocodingResultLabel,
  formatGeocodingResultSubtitle,
  geocodingResultToGlobalLocation,
} from "@/lib/api/weather";
import {
  cityToLocation,
  DEFAULT_CITY_NAME,
  extractCityNameFromLocation,
  findCityForLocation,
  findPrefectureForLocation,
  getCitiesForPrefecture,
  mergeHybridCityResults,
  PREFECTURES,
  searchDomesticCities,
} from "@/lib/data/japanLocations";
import type { GeocodingResult, Location } from "@/lib/types";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (location: Location) => void;
  currentLocation: Location;
  favoriteLocations: Location[];
  onAddFavorite: (location: Location) => void;
  onRemoveFavorite: (location: Location) => void;
}

function isFavorite(location: Location, favorites: Location[]): boolean {
  return favorites.some(
    (fav) =>
      fav.lat === location.lat &&
      fav.lon === location.lon &&
      fav.name === location.name,
  );
}

type LocationSelectionSource = "domestic" | "global" | null;

function resolveInitialSelection(currentLocation: Location) {
  const prefectureName = findPrefectureForLocation(currentLocation);
  const cities = getCitiesForPrefecture(prefectureName);
  const city =
    findCityForLocation(currentLocation, prefectureName) ??
    cities.find((c) => c.name === DEFAULT_CITY_NAME) ??
    cities[0];

  return {
    prefectureName,
    cityName: city?.name ?? extractCityNameFromLocation(currentLocation, prefectureName),
  };
}

const EMPTY_PREFECTURE = "";
const EMPTY_CITY = "";
const SEARCH_DEBOUNCE_MS = 250;

function normalizeSearchQuery(value: string): string {
  return value.normalize("NFKC").replace(/\u0000/g, "").trim();
}

interface LocationModalFormProps {
  currentLocation: Location;
  favoriteLocations: Location[];
  onClose: () => void;
  onSelect: (location: Location) => void;
  onAddFavorite: (location: Location) => void;
  onRemoveFavorite: (location: Location) => void;
}

function LocationModalForm({
  currentLocation,
  favoriteLocations,
  onClose,
  onSelect,
  onAddFavorite,
  onRemoveFavorite,
}: LocationModalFormProps) {
  const initial = resolveInitialSelection(currentLocation);
  const [selectionSource, setSelectionSource] =
    useState<LocationSelectionSource>("domestic");
  const [selectedPrefecture, setSelectedPrefecture] = useState(
    initial.prefectureName,
  );
  const [selectedCityName, setSelectedCityName] = useState(initial.cityName);
  const [globalQuery, setGlobalQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [globalSelectedLocation, setGlobalSelectedLocation] =
    useState<Location | null>(null);
  const [suggestionsPosition, setSuggestionsPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchIdRef = useRef(0);

  const cities = useMemo(
    () =>
      selectedPrefecture
        ? getCitiesForPrefecture(selectedPrefecture)
        : [],
    [selectedPrefecture],
  );

  const effectiveCityName =
    selectedPrefecture && cities.some((c) => c.name === selectedCityName)
      ? selectedCityName
      : (cities[0]?.name ?? EMPTY_CITY);

  const domesticLocation = useMemo(() => {
    if (!selectedPrefecture || !effectiveCityName) return null;
    const city = cities.find((c) => c.name === effectiveCityName);
    if (!city) return null;
    return cityToLocation(selectedPrefecture, city);
  }, [selectedPrefecture, effectiveCityName, cities]);

  const previewLocation =
    selectionSource === "global"
      ? globalSelectedLocation
      : selectionSource === "domestic"
        ? domesticLocation
        : null;

  const stopPendingSearch = () => {
    fetchIdRef.current += 1;
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  };

  const updateSuggestionsPosition = () => {
    const input = searchInputRef.current;
    if (!input) return;
    const rect = input.getBoundingClientRect();
    setSuggestionsPosition({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
  };

  const clearGlobalSearch = () => {
    stopPendingSearch();
    setGlobalQuery("");
    setSuggestions([]);
    setGlobalSelectedLocation(null);
    setIsSearching(false);
    setHasSearched(false);
    setSuggestionsPosition(null);
  };

  const clearDomesticSelection = () => {
    setSelectedPrefecture(EMPTY_PREFECTURE);
    setSelectedCityName(EMPTY_CITY);
  };

  const handleResetAll = () => {
    clearGlobalSearch();
    clearDomesticSelection();
    setSelectionSource(null);
  };

  const enterGlobalSearchMode = () => {
    clearDomesticSelection();
    setSelectionSource("global");
    setGlobalSelectedLocation(null);
  };

  const runSearch = async (fetchId: number, query: string) => {
    const normalized = normalizeSearchQuery(query);

    if (normalized.length === 0) {
      stopPendingSearch();
      setSuggestions([]);
      setGlobalSelectedLocation(null);
      setIsSearching(false);
      setHasSearched(false);
      setSuggestionsPosition(null);
      setSelectionSource(null);
      return;
    }

    enterGlobalSearchMode();
    updateSuggestionsPosition();

    if (normalized.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      setHasSearched(false);
      return;
    }

    const localResults = searchDomesticCities(normalized);
    if (localResults.length > 0) {
      setSuggestions(localResults);
      updateSuggestionsPosition();
    }

    setIsSearching(true);
    setHasSearched(false);

    try {
      const apiResults = await fetchRemoteGlobalCities(normalized);
      if (fetchId !== fetchIdRef.current) return;
      setSuggestions(
        mergeHybridCityResults(localResults, apiResults),
      );
      setHasSearched(true);
      updateSuggestionsPosition();
    } catch {
      if (fetchId !== fetchIdRef.current) return;
      setSuggestions(localResults);
      setHasSearched(true);
    } finally {
      if (fetchId === fetchIdRef.current) {
        setIsSearching(false);
      }
    }
  };

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    if (value.trim().length === 0) {
      stopPendingSearch();
      setSuggestions([]);
      setGlobalSelectedLocation(null);
      setIsSearching(false);
      setHasSearched(false);
      setSuggestionsPosition(null);
      setSelectionSource(null);
      return;
    }

    fetchIdRef.current += 1;
    const fetchId = fetchIdRef.current;

    debounceRef.current = setTimeout(() => {
      if (fetchId !== fetchIdRef.current) return;
      const keyword = searchInputRef.current?.value ?? value;
      void runSearch(fetchId, keyword);
    }, SEARCH_DEBOUNCE_MS);
  };

  const handleSelectGlobalResult = (result: GeocodingResult) => {
    const location = geocodingResultToGlobalLocation(result);
    stopPendingSearch();
    clearDomesticSelection();
    setSelectionSource("global");
    setGlobalSelectedLocation(location);
    setGlobalQuery(location.name);
    setSuggestions([]);
    setIsSearching(false);
    setHasSearched(false);
    setSuggestionsPosition(null);
  };

  const showSuggestionsPopup =
    globalQuery.trim().length > 0 &&
    (isSearching || hasSearched || suggestions.length > 0);

  useLayoutEffect(() => {
    if (!showSuggestionsPopup) return;
    updateSuggestionsPosition();

    const handleReposition = () => updateSuggestionsPosition();
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);
    return () => {
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [showSuggestionsPopup, globalQuery, suggestions.length, isSearching]);

  const handlePrefectureChange = (value: string) => {
    if (!value) return;
    clearGlobalSearch();
    setSelectedPrefecture(value);
    const nextCities = getCitiesForPrefecture(value);
    setSelectedCityName(nextCities[0]?.name ?? EMPTY_CITY);
    setSelectionSource("domestic");
  };

  const handleCityChange = (value: string) => {
    if (!value) return;
    clearGlobalSearch();
    setSelectedCityName(value);
    setSelectionSource("domestic");
  };

  const handleConfirm = () => {
    if (!previewLocation) return;
    onSelect(previewLocation);
    onClose();
  };

  const handleSelectFavorite = (location: Location) => {
    onSelect(location);
    onClose();
  };

  const favorited = previewLocation
    ? isFavorite(previewLocation, favoriteLocations)
    : false;

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="shrink-0 text-lg font-bold">地域を選択</h2>
          <button
            type="button"
            onClick={handleResetAll}
            className="shrink-0 rounded-full border border-red-500 px-2.5 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/50"
          >
            入力をリセット
          </button>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-full p-2 hover:bg-background focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
          aria-label="閉じる"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative z-30 mb-4">
        <label htmlFor="global-city-search" className="sr-only">
          国内外の都市名を検索
        </label>
        <div className="relative">
          <Globe className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            ref={searchInputRef}
            id="global-city-search"
            type="text"
            value={globalQuery}
            onChange={handleSearchInputChange}
            onFocus={updateSuggestionsPosition}
            placeholder="国内外の都市名を検索"
            autoComplete="off"
            enterKeyHint="search"
            className={`w-full rounded-2xl border border-accent-blue/30 bg-background py-3 pl-10 text-sm focus:border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/30 ${
              isSearching ? "pr-10" : "pr-4"
            }`}
          />
          {isSearching && (
            <Loader2
              aria-hidden
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted"
            />
          )}
        </div>
        {showSuggestionsPopup &&
          suggestionsPosition &&
          createPortal(
            <ul
              role="listbox"
              aria-label="都市の検索候補"
              style={{
                position: "fixed",
                top: suggestionsPosition.top,
                left: suggestionsPosition.left,
                width: suggestionsPosition.width,
              }}
              className="z-[9999] max-h-72 overflow-y-auto rounded-2xl border border-accent-blue/30 bg-card shadow-lg"
            >
              {isSearching && suggestions.length === 0 && (
                <li className="px-4 py-2.5 text-xs text-muted">検索中...</li>
              )}
              {suggestions.map((result) => (
                <li key={result.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={false}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelectGlobalResult(result)}
                    className="flex w-full flex-col gap-0.5 px-4 py-2.5 text-left hover:bg-accent-blue/10 focus:bg-accent-blue/10 focus:outline-none"
                  >
                    <span className="text-sm font-medium">
                      {formatGeocodingResultLabel(result)}
                    </span>
                    <span className="text-xs text-muted">
                      {formatGeocodingResultSubtitle(result)}
                    </span>
                  </button>
                </li>
              ))}
              {hasSearched && !isSearching && suggestions.length === 0 && (
                <li className="px-4 py-2.5 text-xs text-muted">
                  該当する都市が見つかりません
                </li>
              )}
            </ul>,
            document.body,
          )}
      </div>

      {favoriteLocations.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 flex items-center gap-1 text-xs font-semibold text-muted">
            <Star className="h-3 w-3" />
            お気に入り地域
          </p>
          <div className="flex flex-wrap gap-2">
            {favoriteLocations.map((fav) => (
              <button
                key={`${fav.lat}-${fav.lon}`}
                type="button"
                onClick={() => handleSelectFavorite(fav)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  currentLocation.lat === fav.lat &&
                  currentLocation.lon === fav.lon
                    ? "bg-accent-pink text-foreground"
                    : "bg-accent-blue/20 hover:bg-accent-blue/40"
                }`}
              >
                {fav.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="prefecture-select"
            className="mb-1.5 block text-xs font-semibold text-muted"
          >
            都道府県
          </label>
          <div className="relative">
            <select
              id="prefecture-select"
              value={selectedPrefecture}
              onChange={(e) => handlePrefectureChange(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-accent-blue/30 bg-background py-3 pl-4 pr-10 text-sm focus:border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/30"
            >
              <option value={EMPTY_PREFECTURE} disabled>
                都道府県を選択
              </option>
              {PREFECTURES.map((pref) => (
                <option key={pref} value={pref}>
                  {pref}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          </div>
        </div>

        <div>
          <label
            htmlFor="city-select"
            className="mb-1.5 block text-xs font-semibold text-muted"
          >
            市区町村
          </label>
          <div className="relative">
            <select
              id="city-select"
              value={effectiveCityName}
              onChange={(e) => handleCityChange(e.target.value)}
              disabled={!selectedPrefecture || cities.length === 0}
              className="w-full appearance-none rounded-2xl border border-accent-blue/30 bg-background py-3 pl-4 pr-10 text-sm focus:border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value={EMPTY_CITY} disabled>
                市区町村を選択
              </option>
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          </div>
        </div>
      </div>

      {previewLocation && (
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-background px-4 py-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-accent-blue" />
            <span className="text-sm font-medium">{previewLocation.name}</span>
          </div>
          <button
            type="button"
            onClick={() =>
              favorited
                ? onRemoveFavorite(previewLocation)
                : onAddFavorite(previewLocation)
            }
            className="rounded-full p-2 hover:bg-accent-pink/20 focus:outline-none focus:ring-2 focus:ring-accent-pink/50"
            aria-label={favorited ? "お気に入り解除" : "お気に入り追加"}
          >
            <Heart
              className={`h-4 w-4 ${
                favorited ? "fill-accent-pink text-accent-pink" : "text-muted"
              }`}
            />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={handleConfirm}
        disabled={!previewLocation}
        className="mt-5 w-full rounded-full bg-accent-blue py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent-blue/80 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
      >
        この地域で天気を表示
      </button>
    </>
  );
}

export function LocationModal({
  isOpen,
  onClose,
  onSelect,
  currentLocation,
  favoriteLocations,
  onAddFavorite,
  onRemoveFavorite,
}: LocationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="閉じる"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-card p-5 shadow-xl sm:rounded-3xl">
        <LocationModalForm
          key={`${currentLocation.lat}-${currentLocation.lon}-${currentLocation.name}`}
          currentLocation={currentLocation}
          favoriteLocations={favoriteLocations}
          onClose={onClose}
          onSelect={onSelect}
          onAddFavorite={onAddFavorite}
          onRemoveFavorite={onRemoveFavorite}
        />
      </div>
    </div>
  );
}
