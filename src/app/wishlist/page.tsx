import React from "react";
import type { Metadata } from "next";
import { WishlistPageView } from "@/components/wishlist/WishlistPageView";

export const metadata: Metadata = {
  title: "Saved Wishlist | Flora Fusion",
  description: "View your saved plants, pots, and heirloom seeds saved for your home garden.",
};

export default function WishlistPage() {
  return <WishlistPageView />;
}
