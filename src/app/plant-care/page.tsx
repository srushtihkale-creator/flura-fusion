import React from "react";
import type { Metadata } from "next";
import { PlantCareService } from "@/services/plantCare.service";
import { PlantCareListingView } from "@/components/plant-care/PlantCareListingView";

export const metadata: Metadata = {
  title: "Plant Care Guides & Wisdom | Flora Fusion",
  description:
    "Expert botanical guides on watering, apartment sunlight, potting soil compositions, and diagnosing plant health issues.",
};

export default async function PlantCarePage() {
  const articles = await PlantCareService.getAll();
  return <PlantCareListingView initialArticles={articles} />;
}
