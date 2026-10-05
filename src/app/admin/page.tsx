import React from "react";
import type { Metadata } from "next";
import { AdminDashboardView } from "@/components/admin/AdminDashboardView";

export const metadata: Metadata = {
  title: "Admin Dashboard | Flora Fusion",
  description: "Flora Fusion administrative control plane and commerce operations.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminDashboardView />;
}
