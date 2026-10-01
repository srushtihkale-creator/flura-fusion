import React from "react";
import type { Metadata } from "next";
import { CartPageView } from "@/components/cart/CartPageView";

export const metadata: Metadata = {
  title: "Shopping Cart | Flora Fusion",
  description: "View your selected botanical companions, apply discounts, and proceed to secure checkout.",
};

export default function CartPage() {
  return <CartPageView />;
}
