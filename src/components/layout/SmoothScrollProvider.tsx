"use client";

import React, { ReactNode } from "react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useSmoothScroll();
  return <>{children}</>;
}
