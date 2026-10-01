import React from "react";
import type { Metadata } from "next";
import { OrdersListView } from "@/components/account/OrdersListView";

export const metadata: Metadata = {
  title: "Order History | Flora Fusion",
  description: "View and track all your active and delivered nursery orders with Flora Fusion.",
};

export default function OrdersPage() {
  return <OrdersListView />;
}
