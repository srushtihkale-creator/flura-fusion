import React from "react";
import type { Metadata } from "next";
import { CheckoutPageView } from "@/components/checkout/CheckoutPageView";

export const metadata: Metadata = {
  title: "Secure Checkout | Flora Fusion",
  description: "Complete your botanical order with nursery-fresh guarantee and secure Indian payment options.",
};

export default function CheckoutPage() {
  return <CheckoutPageView />;
}
