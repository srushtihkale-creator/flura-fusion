"use client";

import { useEffect, useRef } from "react";
import { initSmoothScroll, Lenis } from "@/lib/motion";

export function useSmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const { lenis, cleanup } = initSmoothScroll();
    lenisRef.current = lenis;

    return () => {
      cleanup();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}
