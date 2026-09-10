"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT_ID, ADSENSE_SLOT_ID } from "@/lib/constants";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

export function AdBanner() {
  const adRef = useRef<HTMLModElement>(null);
  const isConfigured = Boolean(ADSENSE_CLIENT_ID && ADSENSE_SLOT_ID);

  useEffect(() => {
    if (!isConfigured || !adRef.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense script may not be loaded yet
    }
  }, [isConfigured]);

  if (!isConfigured) {
    return (
      <div className="mx-4 mt-6 mb-8">
        <div className="flex h-24 items-center justify-center rounded-2xl border border-dashed border-muted/30 bg-card/50">
          <p className="text-xs text-muted">広告枠（AdSense設定後に表示）</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 mt-6 mb-8 flex justify-center">
      <ins
        ref={adRef}
        className="adsbygoogle block w-full"
        style={{ display: "block", minHeight: "90px" }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={ADSENSE_SLOT_ID}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
