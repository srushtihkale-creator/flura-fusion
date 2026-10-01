/**
 * Flora Fusion — Motion Engine Setup
 * Source of Truth: Consolidated Motion Specification in frontendprompt.md
 * Integrates GSAP 3.12, ScrollTrigger, and Lenis with SSR safeguards.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Register ScrollTrigger only in browser environment
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger, Lenis };

/**
 * Checks if user prefers reduced motion
 */
export function isReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Initialize Lenis smooth scroll and synchronize with GSAP ticker
 */
export function initSmoothScroll(): { lenis: Lenis | null; cleanup: () => void } {
  if (typeof window === "undefined") {
    return { lenis: null, cleanup: () => {} };
  }

  // If user prefers reduced motion, disable smooth scroll interpolation
  if (isReducedMotion()) {
    return { lenis: null, cleanup: () => {} };
  }

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    touchMultiplier: 2,
  });

  // Synchronize Lenis with GSAP's requestAnimationFrame ticker
  function updateTicker(time: number) {
    lenis.raf(time * 1000);
  }

  gsap.ticker.add(updateTicker);
  gsap.ticker.lagSmoothing(0);

  // Update ScrollTrigger on scroll
  lenis.on("scroll", ScrollTrigger.update);

  const cleanup = () => {
    gsap.ticker.remove(updateTicker);
    lenis.destroy();
  };

  return { lenis, cleanup };
}
