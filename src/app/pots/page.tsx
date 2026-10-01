import React from "react";
import type { Metadata } from "next";
import { ProductService } from "@/services/product.service";
import { CategoryCatalogView } from "@/components/catalog/CategoryCatalogView";

export const metadata: Metadata = {
  title: "Artisan Pots & Planters | Flora Fusion",
  description:
    "Discover handcrafted ceramic, breathable terracotta, hanging, and self-watering planters designed to keep your botanical companions thriving.",
  openGraph: {
    title: "Pots & Planters Collection | Flora Fusion",
    description: "Artisan pots and planters crafted for modern botanical living.",
    images: ["/assets/banners/promo_pots.png"],
  },
};

export default async function PotsPage() {
  const initialProducts = await ProductService.getByCategory("pots");

  return <CategoryCatalogView category="pots" initialProducts={initialProducts} />;
}
