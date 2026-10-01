import React from "react";
import type { Metadata } from "next";
import { ProductService } from "@/services/product.service";
import { CategoryCatalogView } from "@/components/catalog/CategoryCatalogView";

export const metadata: Metadata = {
  title: "Organic Heirloom Seeds | Flora Fusion",
  description:
    "Grow your own organic kitchen herbs, flowers, and crisp vegetables from certified non-GMO heirloom seeds with high germination rates.",
  openGraph: {
    title: "Seeds Collection | Flora Fusion",
    description: "Certified non-GMO organic seeds for vibrant home gardens.",
    images: ["/assets/banners/promo_seeds.png"],
  },
};

export default async function SeedsPage() {
  const initialProducts = await ProductService.getByCategory("seeds");

  return <CategoryCatalogView category="seeds" initialProducts={initialProducts} />;
}
