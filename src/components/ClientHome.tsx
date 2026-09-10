"use client";

import dynamic from "next/dynamic";
import { LoadingSpinner } from "./LoadingSpinner";

const HomePage = dynamic(
  () => import("./HomePage").then((mod) => mod.HomePage),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-background">
        <LoadingSpinner />
      </div>
    ),
  },
);

export function ClientHome() {
  return <HomePage />;
}
