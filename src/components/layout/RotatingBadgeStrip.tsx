"use client";

import React, { useEffect, useRef } from "react";
import { gsap, isReducedMotion } from "@/lib/motion";

interface BadgeData {
  id: string;
  theme: "forest" | "cream" | "terracotta";
  label: string;
  pathId: string;
  pathD: string;
  motto: string;
  motif: React.ReactNode;
}

const BADGES: BadgeData[] = [
  {
    id: "badge-0",
    theme: "forest",
    label: "People Grow Plants • Plants Grow People",
    pathId: "ff-p-0",
    pathD: "M 60,60 m -42,0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0",
    motto: "• PEOPLE GROW PLANTS • PLANTS GROW PEOPLE",
    motif: (
      <g transform="translate(60,60) scale(1.15)">
        <path d="M0,15 Q-1,4 0,-13" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <path d="M0,6 C6,2 10,6 0,11" fill="currentColor" />
        <path d="M0,-1 C-6,-5 -10,-1 0,4" fill="currentColor" />
        <path d="M0,-8 C6,-12 10,-8 0,-3" fill="currentColor" />
        <path d="M0,-13 C-2,-19 2,-19 0,-13" fill="currentColor" />
      </g>
    ),
  },
  {
    id: "badge-1",
    theme: "cream",
    label: "Flora Fusion • Nature Meets Your Space",
    pathId: "ff-p-1",
    pathD: "M 60,60 m -42,0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0",
    motto: "• FLORA FUSION • NATURE MEETS YOUR SPACE",
    motif: (
      <g transform="translate(60,60) scale(1.1)">
        <path d="M0,14 C-1,6 -10,2 -10,-8 C-10,-14 -4,-18 0,-8 C4,-18 10,-14 10,-8 C10,2 1,6 0,14 Z" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <path d="M0,14 V-8" stroke="currentColor" strokeWidth="1.1" />
        <path d="M0,-2 C-4,-5 -7,-4 -7,-7" stroke="currentColor" strokeWidth="0.9" fill="none" />
        <path d="M0,-2 C4,-5 7,-4 7,-7" stroke="currentColor" strokeWidth="0.9" fill="none" />
      </g>
    ),
  },
  {
    id: "badge-2",
    theme: "terracotta",
    label: "A Greener Tomorrow • Flora Fusion",
    pathId: "ff-p-2",
    pathD: "M 60,60 m -42,0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0",
    motto: "• A GREENER TOMORROW • FLORA FUSION",
    motif: (
      <g transform="translate(60,60) scale(1.15)">
        <path d="M0,15 C0,4 -1,-5 0,-13" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <path d="M0,4 C5,1 9,5 0,10" fill="currentColor" />
        <path d="M0,4 C-5,1 -9,5 0,10" fill="currentColor" />
        <path d="M0,-5 C6,-8 9,-4 0,1" fill="currentColor" />
        <path d="M0,-5 C-6,-8 -9,-4 0,1" fill="currentColor" />
        <circle cx="0" cy="-14" r="2.2" fill="currentColor" />
      </g>
    ),
  },
  {
    id: "badge-3",
    theme: "forest",
    label: "Grow Good Vibes • Pure Nursery Living",
    pathId: "ff-p-3",
    pathD: "M 60,60 m -42,0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0",
    motto: "• GROW GOOD VIBES • PURE NURSERY LIVING",
    motif: (
      <g transform="translate(60,60) scale(1.1)">
        <circle cx="0" cy="0" r="12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" />
        <path d="M0,8 C-5,3 -7,-2 0,-9 C7,-2 5,3 0,8 Z" fill="currentColor" />
      </g>
    ),
  },
  {
    id: "badge-4",
    theme: "cream",
    label: "Breathe Clean Air • Indian Plant Care",
    pathId: "ff-p-4",
    pathD: "M 60,60 m -42,0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0",
    motto: "• BREATHE CLEAN AIR • INDIAN PLANT CARE",
    motif: (
      <g transform="translate(60,60) scale(1.15)">
        <path d="M0,12 C-6,7 -9,2 0,-12 C9,2 6,7 0,12 Z" fill="currentColor" />
        <path d="M0,12 V-10" stroke="#FBF9F4" strokeWidth="1" />
      </g>
    ),
  },
  {
    id: "badge-5",
    theme: "terracotta",
    label: "Hand-Nurtured With Love • 100% Organic",
    pathId: "ff-p-5",
    pathD: "M 60,60 m -42,0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0",
    motto: "• HAND-NURTURED • 100% ORGANIC NURSERY",
    motif: (
      <g transform="translate(60,60) scale(1.1)">
        <path d="M0,14 C-1,6 -8,2 -8,-7 C-8,-12 -3,-15 0,-7 C3,-15 8,-12 8,-7 C8,2 1,6 0,14 Z" fill="currentColor" />
      </g>
    ),
  },
  {
    id: "badge-6",
    theme: "forest",
    label: "Nature In Every Home • Flora Fusion 2026",
    pathId: "ff-p-6",
    pathD: "M 60,60 m -42,0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0",
    motto: "• NATURE IN EVERY HOME • FLORA FUSION",
    motif: (
      <g transform="translate(60,60) scale(1.15)">
        <path d="M0,15 Q-1,4 0,-13" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <path d="M0,6 C6,2 10,6 0,11" fill="currentColor" />
        <path d="M0,-1 C-6,-5 -10,-1 0,4" fill="currentColor" />
        <path d="M0,-8 C6,-12 10,-8 0,-3" fill="currentColor" />
        <path d="M0,-13 C-2,-19 2,-19 0,-13" fill="currentColor" />
      </g>
    ),
  },
];

export function RotatingBadgeStrip() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotion() || !containerRef.current) return;

    const items = containerRef.current.querySelectorAll<HTMLElement>(".rotating-badge-wrapper");
    const cleanups: Array<() => void> = [];

    items.forEach((item, index) => {
      const svg = item.querySelector<SVGSVGElement>("svg");
      if (!svg) return;

      const direction = index % 2 === 0 ? 1 : -1;
      const duration = 24 + (index % 4) * 3;
      let loopTween: gsap.core.Tween | null = null;
      let isSpinningOnClick = false;

      const startRotation = () => {
        if (loopTween) loopTween.kill();
        loopTween = gsap.to(svg, {
          rotation: `+=${direction * 360}`,
          duration: duration,
          ease: "none",
          repeat: -1,
          transformOrigin: "50% 50%",
        });
      };

      startRotation();

      const handleClick = () => {
        if (isSpinningOnClick) return;
        isSpinningOnClick = true;

        if (loopTween) {
          loopTween.kill();
          loopTween = null;
        }

        gsap.to(item, {
          scale: 1.12,
          duration: 0.18,
          yoyo: true,
          repeat: 1,
          ease: "power1.out",
        });

        gsap.to(svg, {
          rotation: `+=${direction * 360}`,
          duration: 0.85,
          ease: "power2.out",
          transformOrigin: "50% 50%",
          onComplete: () => {
            isSpinningOnClick = false;
            startRotation();
          },
        });
      };

      item.addEventListener("click", handleClick);

      cleanups.push(() => {
        if (loopTween) loopTween.kill();
        item.removeEventListener("click", handleClick);
      });
    });

    return () => {
      cleanups.forEach((c) => c());
    };
  }, []);

  return (
    <section
      style={{
        width: "100%",
        overflow: "hidden",
        backgroundColor: "var(--color-brand-forest)",
        padding: "var(--space-6) 0",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
      }}
      aria-label="Botanical Rotating Badges"
    >
      <div
        ref={containerRef}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "var(--space-4)",
          flexWrap: "nowrap",
          overflowX: "hidden",
          padding: "0 var(--space-4)",
        }}
      >
        {BADGES.map((b) => {
          const isForest = b.theme === "forest";
          const isCream = b.theme === "cream";
          const isTerracotta = b.theme === "terracotta";

          const bgFill = isForest ? "#173F2B" : isCream ? "#FBF9F4" : "#F1E1D4";
          const ringStroke = isForest ? "#A9BDA3" : "#173F2B";
          const textColor = isForest ? "#FBF9F4" : "#173F2B";
          const motifColor = isForest ? "#A9BDA3" : "#173F2B";

          return (
            <div
              key={b.id}
              className="rotating-badge-wrapper"
              style={{
                width: "108px",
                height: "108px",
                flexShrink: 0,
                cursor: "pointer",
                borderRadius: "999px",
                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
                transition: "transform 0.2s var(--ease-standard)",
              }}
              title={b.label}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.currentTarget.click();
                }
              }}
            >
              <svg viewBox="0 0 120 120" style={{ width: "100%", height: "100%", display: "block" }}>
                <defs>
                  <path id={b.pathId} d={b.pathD} />
                </defs>
                <circle cx="60" cy="60" r="58" fill={bgFill} />
                <circle cx="60" cy="60" r="51" fill="none" stroke={ringStroke} strokeWidth="1" strokeDasharray="3 2" />
                <text fill={textColor} fontSize="8.5px" fontFamily="var(--font-body)" fontWeight="600" letterSpacing="0.05em">
                  <textPath href={`#${b.pathId}`} startOffset="3px">
                    {b.motto}
                  </textPath>
                </text>
                <g color={motifColor}>{b.motif}</g>
              </svg>
            </div>
          );
        })}
      </div>
    </section>
  );
}
