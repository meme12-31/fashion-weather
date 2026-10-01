"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { RefreshCw } from "lucide-react";
import { Header } from "./Header";
import { LoadingSpinner } from "./LoadingSpinner";
import { LocationModal } from "./LocationModal";
import { LocationNotice } from "./LocationNotice";
import { MainOutfitCard } from "./MainOutfitCard";
import { SituationTabs } from "./SituationTabs";
import { TemperatureAdvice } from "./TemperatureAdvice";
import { Timeline } from "./Timeline";
import {
  createFallbackWeather,
  fetchWeather,
  reverseGeocode,
} from "@/lib/api/weather";
import { DEFAULT_LOCATION } from "@/lib/constants";
import {
  getMainOutfitSuggestion,
  getTimelineSlots,
  getTimeSlotAdvices,
} from "@/lib/utils/outfitLogic";
import {
  addFavoriteLocation,
  getServerSettingsSnapshot,
  getSettingsSnapshot,
  removeFavoriteLocation,
  subscribeSettings,
  updateLocation,
  updateSituation,
} from "@/lib/utils/storage";
import type { Location, Situation, WeatherData } from "@/lib/types";

type GeolocationStatus = "pending" | "granted" | "denied" | "unsupported";

const GEO_INIT_TIMEOUT_MS = 12000;

export function FashionWeatherClient() {
  const settings = useSyncExternalStore(
    subscribeSettings,
    getSettingsSnapshot,
    getServerSettingsSnapshot,
  );

  const [activeLocation, setActiveLocation] = useState<Location | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [geoStatus, setGeoStatus] = useState<GeolocationStatus>("pending");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLocationBannerVisible, setIsLocationBannerVisible] = useState(true);

  const situation = settings.selectedSituation;
  const favoriteLocations = settings.favoriteLocations ?? [];
  const currentLocation = activeLocation ?? settings.selectedLocation ?? DEFAULT_LOCATION;

  const loadWeather = useCallback(async (loc: Location) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchWeather(loc.lat, loc.lon);
      setWeather(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "天気情報を読み込めませんでした";
      setWeather(createFallbackWeather(loc.lat, loc.lon));
      setError(`${message}（概算データを表示しています）`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const weatherFetchStartedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const initialLocation = settings.selectedLocation ?? DEFAULT_LOCATION;

    const fetchForLocation = async (loc: Location) => {
      if (cancelled || weatherFetchStartedRef.current) return;
      weatherFetchStartedRef.current = true;
      await loadWeather(loc);
    };

    const fallbackTimer = window.setTimeout(() => {
      if (cancelled || weatherFetchStartedRef.current) return;
      setGeoStatus((prev) => (prev === "pending" ? "denied" : prev));
      void fetchForLocation(initialLocation);
    }, GEO_INIT_TIMEOUT_MS);

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      queueMicrotask(() => {
        if (!cancelled) setGeoStatus("unsupported");
      });
      void fetchForLocation(initialLocation);
      return () => {
        cancelled = true;
        clearTimeout(fallbackTimer);
        weatherFetchStartedRef.current = false;
      };
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (cancelled) return;
        clearTimeout(fallbackTimer);
        setGeoStatus("granted");
        try {
          const name = await reverseGeocode(
            position.coords.latitude,
            position.coords.longitude,
          );
          const geoLocation: Location = {
            name,
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          setActiveLocation(geoLocation);
          updateLocation(geoLocation);
          await fetchForLocation(geoLocation);
        } catch {
          await fetchForLocation(initialLocation);
        }
      },
      () => {
        if (cancelled) return;
        clearTimeout(fallbackTimer);
        setGeoStatus("denied");
        void fetchForLocation(initialLocation);
      },
      { timeout: 10000, maximumAge: 300000 },
    );

    return () => {
      cancelled = true;
      clearTimeout(fallbackTimer);
      weatherFetchStartedRef.current = false;
    };
  }, [loadWeather, settings.selectedLocation]);

  const handleSituationChange = (newSituation: Situation) => {
    updateSituation(newSituation);
  };

  const handleLocationSelect = (newLocation: Location) => {
    setActiveLocation(newLocation);
    updateLocation(newLocation);
    void loadWeather(newLocation);
  };

  const handleAddFavorite = (loc: Location) => {
    addFavoriteLocation(loc);
  };

  const handleRemoveFavorite = (loc: Location) => {
    removeFavoriteLocation(loc);
  };

  const handleRetry = () => {
    void loadWeather(currentLocation);
  };

  const showLocationNotice =
    (geoStatus === "denied" || geoStatus === "unsupported") &&
    isLocationBannerVisible;

  const suggestion = weather
    ? getMainOutfitSuggestion(weather, situation)
    : null;
  const timelineSlots = weather ? getTimelineSlots(weather) : [];
  const timeAdvices = weather ? getTimeSlotAdvices(weather) : [];

  return (
    <div id="page-top" className="scroll-mt-0">
      <Header
        location={currentLocation}
        onChangeLocation={() => setIsModalOpen(true)}
      />

      {showLocationNotice && (
        <LocationNotice onDismiss={() => setIsLocationBannerVisible(false)} />
      )}

      <SituationTabs selected={situation} onChange={handleSituationChange} />

      {isLoading && <LoadingSpinner />}

      {!isLoading && error && (
        <div className="mx-4 mt-4 rounded-2xl border border-accent-yellow/50 bg-accent-yellow/15 px-4 py-3 text-center text-xs text-muted">
          {error}
        </div>
      )}

      {!isLoading && !weather && (
        <div className="mx-4 mt-6 flex flex-col items-center gap-4 rounded-3xl bg-card px-6 py-10 shadow-sm">
          <p className="text-center text-sm text-muted">
            天気の取得に失敗しました
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className="flex items-center gap-2 rounded-full bg-accent-blue px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-accent-blue/80 focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
          >
            <RefreshCw className="h-4 w-4" />
            再読み込み
          </button>
        </div>
      )}

      {!isLoading && weather && suggestion && (
        <>
          <MainOutfitCard weather={weather} suggestion={suggestion} />
          <Timeline slots={timelineSlots} />
          <TemperatureAdvice advices={timeAdvices} />
        </>
      )}

      <LocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleLocationSelect}
        currentLocation={currentLocation}
        favoriteLocations={favoriteLocations}
        onAddFavorite={handleAddFavorite}
        onRemoveFavorite={handleRemoveFavorite}
      />
    </div>
  );
}
