import React, { Suspense } from "react";
import type { Metadata } from "next";
import { SearchPageView } from "@/components/search/SearchPageView";

export const metadata: Metadata = {
  title: "Search Plants, Pots & Seeds | Flora Fusion",
  description:
    "Search across Flora Fusion's complete botanical nursery catalog including air-purifying plants, handcrafted planters, and heirloom seeds.",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: "80px 0", textAlign: "center", color: "var(--color-text-muted)" }}>
          Loading search results...
        </div>
      }
    >
      <SearchPageView />
    </Suspense>
  );
}
