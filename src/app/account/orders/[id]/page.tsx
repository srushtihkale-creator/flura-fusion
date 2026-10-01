import React from "react";
import type { Metadata } from "next";
import { OrderDetailView } from "@/components/account/OrderDetailView";

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `Track Order ${params.id} | Flora Fusion`,
    description: `Real-time nursery shipment and delivery tracking for order ${params.id}.`,
  };
}

export default function OrderTrackingPage({ params }: PageProps) {
  return <OrderDetailView orderId={params.id} />;
}
