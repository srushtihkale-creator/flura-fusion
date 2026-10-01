"use client";

import React, { useEffect, useRef } from "react";
import { gsap, isReducedMotion } from "@/lib/motion";

interface BadgeData {
  id: string;
  theme: "forest" | "cream" | "terracotta";
  label: string;
  pathId: string;
  motto: string;
  motif: React.ReactNode;
}

const BADGES: BadgeData[] = [
  {
    id: "badge-0",
    theme: "forest",
    label: "People Grow Plants • Plants Grow People",
    pathId: "ff-p-0",
    motto: "• PEOPLE GROW PLANTS • PLANTS GROW PEOPLE",
    motif: (
      <g className="badge-motif badge-motif--sage" transform="translate(60,60) scale(1.15)">
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
    motto: "• FLORA FUSION • NATURE MEETS YOUR SPACE",
    motif: (
      <g className="badge-motif badge-motif--forest" transform="translate(60,60) scale(1.1)">
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
    motto: "• A GREENER TOMORROW • FLORA FUSION",
    motif: (
      <g className="badge-motif badge-motif--forest" transform="translate(60,60) scale(1.15)">
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
    label: "People Grow Plants • Plants Grow People",
    pathId: "ff-p-3",
    motto: "• PEOPLE GROW PLANTS • PLANTS GROW PEOPLE",
    motif: (
      <g className="badge-motif badge-motif--sage" transform="translate(60,60) scale(1.15)">
        <path d="M0,15 Q-1,4 0,-13" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <path d="M0,6 C6,2 10,6 0,11" fill="currentColor" />
        <path d="M0,-1 C-6,-5 -10,-1 0,4" fill="currentColor" />
        <path d="M0,-8 C6,-12 10,-8 0,-3" fill="currentColor" />
        <path d="M0,-13 C-2,-19 2,-19 0,-13" fill="currentColor" />
      </g>
    ),
  },
  {
    id: "badge-4",
    theme: "cream",
    label: "Flora Fusion • Nature Meets Your Space",
    pathId: "ff-p-4",
    motto: "• FLORA FUSION • NATURE MEETS YOUR SPACE",
    motif: (
      <g className="badge-motif badge-motif--forest" transform="translate(60,60) scale(1.1)">
        <path d="M0,14 C-1,6 -10,2 -10,-8 C-10,-14 -4,-18 0,-8 C4,-18 10,-14 10,-8 C10,2 1,6 0,14 Z" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <path d="M0,14 V-8" stroke="currentColor" strokeWidth="1.1" />
        <path d="M0,-2 C-4,-5 -7,-4 -7,-7" stroke="currentColor" strokeWidth="0.9" fill="none" />
        <path d="M0,-2 C4,-5 7,-4 7,-7" stroke="currentColor" strokeWidth="0.9" fill="none" />
      </g>
    ),
  },
  {
    id: "badge-5",
    theme: "terracotta",
    label: "A Greener Tomorrow • Flora Fusion",
    pathId: "ff-p-5",
    motto: "• A GREENER TOMORROW • FLORA FUSION",
    motif: (
      <g className="badge-motif badge-motif--forest" transform="translate(60,60) scale(1.15)">
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
    id: "badge-6",
    theme: "forest",
    label: "People Grow Plants • Plants Grow People",
    pathId: "ff-p-6",
    motto: "• PEOPLE GROW PLANTS • PLANTS GROW PEOPLE",
    motif: (
      <g className="badge-motif badge-motif--sage" transform="translate(60,60) scale(1.15)">
        <path d="M0,15 Q-1,4 0,-13" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <path d="M0,6 C6,2 10,6 0,11" fill="currentColor" />
        <path d="M0,-1 C-6,-5 -10,-1 0,4" fill="currentColor" />
        <path d="M0,-8 C6,-12 10,-8 0,-3" fill="currentColor" />
        <path d="M0,-13 C-2,-19 2,-19 0,-13" fill="currentColor" />
      </g>
    ),
  },
  {
    id: "badge-7",
    theme: "cream",
    label: "Flora Fusion • Nature Meets Your Space",
    pathId: "ff-p-7",
    motto: "• FLORA FUSION • NATURE MEETS YOUR SPACE",
    motif: (
      <g className="badge-motif badge-motif--forest" transform="translate(60,60) scale(1.1)">
        <path d="M0,14 C-1,6 -10,2 -10,-8 C-10,-14 -4,-18 0,-8 C4,-18 10,-14 10,-8 C10,2 1,6 0,14 Z" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <path d="M0,14 V-8" stroke="currentColor" strokeWidth="1.1" />
        <path d="M0,-2 C-4,-5 -7,-4 -7,-7" stroke="currentColor" strokeWidth="0.9" fill="none" />
        <path d="M0,-2 C4,-5 7,-4 7,-7" stroke="currentColor" strokeWidth="0.9" fill="none" />
      </g>
    ),
  },
  {
    id: "badge-8",
    theme: "terracotta",
    label: "A Greener Tomorrow • Flora Fusion",
    pathId: "ff-p-8",
    motto: "• A GREENER TOMORROW • FLORA FUSION",
    motif: (
      <g className="badge-motif badge-motif--forest" transform="translate(60,60) scale(1.15)">
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
    id: "badge-9",
    theme: "forest",
    label: "People Grow Plants • Plants Grow People",
    pathId: "ff-p-9",
    motto: "• PEOPLE GROW PLANTS • PLANTS GROW PEOPLE",
    motif: (
      <g className="badge-motif badge-motif--sage" transform="translate(60,60) scale(1.15)">
        <path d="M0,15 Q-1,4 0,-13" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <path d="M0,6 C6,2 10,6 0,11" fill="currentColor" />
        <path d="M0,-1 C-6,-5 -10,-1 0,4" fill="currentColor" />
        <path d="M0,-8 C6,-12 10,-8 0,-3" fill="currentColor" />
        <path d="M0,-13 C-2,-19 2,-19 0,-13" fill="currentColor" />
      </g>
    ),
  },
  {
    id: "badge-10",
    theme: "cream",
    label: "Flora Fusion • Nature Meets Your Space",
    pathId: "ff-p-10",
    motto: "• FLORA FUSION • NATURE MEETS YOUR SPACE",
    motif: (
      <g className="badge-motif badge-motif--forest" transform="translate(60,60) scale(1.1)">
        <path d="M0,14 C-1,6 -10,2 -10,-8 C-10,-14 -4,-18 0,-8 C4,-18 10,-14 10,-8 C10,2 1,6 0,14 Z" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <path d="M0,14 V-8" stroke="currentColor" strokeWidth="1.1" />
        <path d="M0,-2 C-4,-5 -7,-4 -7,-7" stroke="currentColor" strokeWidth="0.9" fill="none" />
        <path d="M0,-2 C4,-5 7,-4 7,-7" stroke="currentColor" strokeWidth="0.9" fill="none" />
      </g>
    ),
  },
  {
    id: "badge-11",
    theme: "terracotta",
    label: "A Greener Tomorrow • Flora Fusion",
    pathId: "ff-p-11",
    motto: "• A GREENER TOMORROW • FLORA FUSION",
    motif: (
      <g className="badge-motif badge-motif--forest" transform="translate(60,60) scale(1.15)">
        <path d="M0,15 C0,4 -1,-5 0,-13" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <path d="M0,4 C5,1 9,5 0,10" fill="currentColor" />
        <path d="M0,4 C-5,1 -9,5 0,10" fill="currentColor" />
        <path d="M0,-5 C6,-8 9,-4 0,1" fill="currentColor" />
        <path d="M0,-5 C-6,-8 -9,-4 0,1" fill="currentColor" />
        <circle cx="0" cy="-14" r="2.2" fill="currentColor" />
      </g>
    ),
  },
];

export function RotatingBadgeStrip() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotion() || !trackRef.current) return;

    const items = trackRef.current.querySelectorAll<HTMLElement>(".overlapping-badge-item");
    const cleanups: (() => void)[] = [];

    items.forEach((item, index) => {
      const svg = item.querySelector<SVGElement>(".overlapping-badge-svg");
      if (!svg) return;

      const duration = 22 + (index % 5) * 3;
      const direction = index % 2 === 0 ? 360 : -360;

      let loopTween: gsap.core.Tween | null = gsap.to(svg, {
        rotation: direction,
        duration: duration,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });

      let isSpinningOnClick = false;

      const handleClick = () => {
        if (isSpinningOnClick) return;
        isSpinningOnClick = true;

        if (loopTween) loopTween.kill();

        const currentRot = gsap.getProperty(svg, "rotation") as number;
        const targetRot = currentRot + (direction > 0 ? 360 : -360);

        gsap.to(svg, {
          rotation: targetRot,
          duration: 0.9,
          ease: "back.out(1.7)",
          transformOrigin: "50% 50%",
          onComplete: () => {
            isSpinningOnClick = false;
            loopTween = gsap.to(svg, {
              rotation: `${direction > 0 ? "+=360" : "-=360"}`,
              duration: duration,
              repeat: -1,
              ease: "none",
              transformOrigin: "50% 50%",
            });
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
    <section className="overlapping-badges-strip" aria-label="Botanical Emblems">
      <div ref={trackRef} className="overlapping-badges-track">
        {BADGES.map((b) => {
          const isForest = b.theme === "forest";
          const isCream = b.theme === "cream";

          return (
            <div
              key={b.id}
              className={`overlapping-badge-item badge--${b.theme}`}
              role="img"
              aria-label={b.label}
              title={b.label}
            >
              <svg className="overlapping-badge-svg" viewBox="0 0 120 120">
                <defs>
                  <path id={b.pathId} d="M 60,60 m -42,0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0" />
                </defs>
                <circle cx="60" cy="60" r="58" className={`badge-bg badge-bg--${b.theme}`} />
                <circle
                  cx="60"
                  cy="60"
                  r="51"
                  className={`badge-ring ${isForest ? "badge-ring--sage" : "badge-ring--forest"}`}
                />
                <text
                  className={`badge-text ${isForest ? "badge-text--cream" : "badge-text--forest"}`}
                  textLength="250"
                  lengthAdjust="spacing"
                >
                  <textPath href={`#${b.pathId}`} startOffset="3px">
                    {b.motto}
                  </textPath>
                </text>
                {b.motif}
              </svg>
            </div>
          );
        })}
      </div>
    </section>
  );
}
