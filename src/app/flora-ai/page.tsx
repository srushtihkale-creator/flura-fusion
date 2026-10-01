import React from "react";
import type { Metadata } from "next";
import { FloraAIPageView } from "@/components/flora-ai/FloraAIPageView";

export const metadata: Metadata = {
  title: "Flora AI Botanical Assistant | Flora Fusion",
  description:
    "Consult Flora AI for personalized plant recommendations, watering frequencies, room placement, and botanical health guidance.",
};

export default function FloraAIPage() {
  return <FloraAIPageView />;
}
