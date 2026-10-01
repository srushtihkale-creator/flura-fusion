"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap, isReducedMotion } from "@/lib/motion";

export function HeroSection() {
  const heroCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotion() || !heroCardRef.current) return;

    const card = heroCardRef.current;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // Restrained 3D tilt (max +-3 degrees per specification)
      gsap.to(card, {
        rotationY: x * 6,
        rotationX: -y * 6,
        ease: "power1.out",
        duration: 0.5,
        transformPerspective: 1000,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotationY: 0,
        rotationX: 0,
        ease: "power2.out",
        duration: 0.8,
      });
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section
      style={{
        paddingTop: "var(--space-12)",
        paddingBottom: "var(--space-12)",
        backgroundColor: "var(--color-cream)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "var(--space-12)",
            alignItems: "center",
          }}
        >
          {/* Hero Copy */}
          <div>
            <div className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>
              <span>🍃</span> GREEN SPACES. HAPPIER PLACES.
            </div>
            <h1 className="display-xl" style={{ marginBottom: "var(--space-4)" }}>
              Bring Nature <br />
              <span style={{ color: "var(--color-brand-green)" }}>Home</span>
            </h1>
            <p
              style={{
                fontSize: "var(--text-body-lg)",
                color: "var(--color-text-secondary)",
                lineHeight: 1.7,
                maxWidth: "520px",
                marginBottom: "var(--space-8)",
              }}
            >
              Discover a wide range of healthy plants, beautiful pots and quality seeds — all in one place.
            </p>

            <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap", alignItems: "center" }}>
              <Link href="/plants" className="btn-primary" style={{ padding: "0 var(--space-8)", height: "52px" }}>
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link href="/plant-care" className="btn-secondary" style={{ padding: "0 var(--space-6)", height: "52px" }}>
                Plant Care Guide
              </Link>
            </div>
          </div>

          {/* Hero Visual with Restrained 3D & Zero Gravity Floating Badge */}
          <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
            <div
              ref={heroCardRef}
              style={{
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                boxShadow: "var(--shadow-lg)",
                position: "relative",
                maxWidth: "560px",
                width: "100%",
                aspectRatio: "4 / 3",
                backgroundColor: "var(--color-cream-soft)",
                transformStyle: "preserve-3d",
              }}
            >
              <Image
                src="/assets/hero/hero_lush.jpg"
                alt="Flora Fusion Sunlit Arched Room with Lush Plants"
                fill
                priority
                style={{ objectFit: "cover" }}
              />

              {/* Floating Nursery Fresh Badge */}
              <div
                className="animate-float-badge"
                style={{
                  position: "absolute",
                  bottom: "var(--space-6)",
                  left: "var(--space-6)",
                  backgroundColor: "rgba(255, 255, 255, 0.94)",
                  backdropFilter: "blur(8px)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-3) var(--space-4)",
                  boxShadow: "var(--shadow-md)",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "999px",
                    backgroundColor: "var(--color-brand-sage-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.3rem",
                  }}
                >
                  🌿
                </div>
                <div>
                  <h4 style={{ fontSize: "var(--text-body)", fontWeight: 600, margin: 0 }}>
                    100% Nursery Fresh
                  </h4>
                  <p style={{ fontSize: "var(--text-caption)", color: "var(--color-text-muted)", margin: 0 }}>
                    Transit-safe bio packaging
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
