import React from "react";
import type { Metadata } from "next";
import { ProductService } from "@/services/product.service";
import { CategoryCatalogView } from "@/components/catalog/CategoryCatalogView";

export const metadata: Metadata = {
  title: "Indoor & Outdoor Plants | Flora Fusion",
  description:
    "Explore healthy, nursery-grown indoor and outdoor plants, air purifiers, and succulents delivered straight to your home with safe packaging.",
  openGraph: {
    title: "Plants Collection | Flora Fusion",
    description: "Hand-nurtured nursery plants for greener homes and happier places.",
    images: ["/assets/banners/promo_plants.png"],
  },
};

export default async function PlantsPage({
  searchParams,
}: {
  searchParams?: { filter?: string; search?: string };
}) {
  const filter = typeof searchParams?.filter === "string" ? searchParams.filter : "all";
  const search = typeof searchParams?.search === "string" ? searchParams.search : "";
  const initialProducts = await ProductService.getByCategory("plants", filter);

  return (
    <CategoryCatalogView
      category="plants"
      initialProducts={initialProducts}
      initialFilter={filter}
      initialSearch={search}
    />
  );
}
