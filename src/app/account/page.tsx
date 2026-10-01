import React from "react";
import type { Metadata } from "next";
import { AccountPageView } from "@/components/account/AccountPageView";

export const metadata: Metadata = {
  title: "My Account | Flora Fusion",
  description: "Manage your Flora Fusion profile, saved delivery addresses, and plant orders.",
};

export default function AccountPage() {
  return <AccountPageView />;
}
