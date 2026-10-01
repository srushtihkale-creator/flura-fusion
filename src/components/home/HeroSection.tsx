"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { gsap, isReducedMotion } from "@/lib/motion";

export function HeroSection() {
  const heroCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotion() || !heroCardRef.current) return;

    const card = heroCardRef.current;
    const heroSection = card.closest<HTMLElement>(".hero-section");
    if (!heroSection) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

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

    heroSection.addEventListener("mousemove", handleMouseMove);
    heroSection.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      heroSection.removeEventListener("mousemove", handleMouseMove);
      heroSection.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section className="hero-section">
      <div className="container hero-grid">
        {/* Hero Text */}
        <div className="hero-text-content">
          <div className="hero-eyebrow">
            <span>🍃</span> GREEN SPACES. HAPPIER PLACES.
          </div>
          <h1 className="hero-title">
            Bring Nature<br />
            <span>Home</span>
          </h1>
          <p className="hero-description">
            Discover a wide range of healthy plants, beautiful pots and quality seeds — all in one place.
          </p>
          <div className="hero-cta-group">
            <Link href="/plants" className="btn-primary">
              Shop Now →
            </Link>
          </div>
        </div>

        {/* Hero Visual & Floating Badge */}
        <div className="hero-visual-wrapper">
          {/* Decorative Floating SVG Leaves */}
          <svg className="floating-leaf-svg leaf-1 animate-levitate" viewBox="0 0 64 64" fill="currentColor">
            <path d="M12 54C28 54 52 42 54 10C34 12 10 32 12 54Z" fill="#A9BDA3" fillOpacity="0.3"></path>
            <path d="M12 54C28 42 42 28 54 10" stroke="#173F2B" strokeWidth="2"></path>
          </svg>
          <svg className="floating-leaf-svg leaf-2 animate-levitate" viewBox="0 0 64 64" fill="currentColor">
            <path d="M52 54C36 54 12 42 10 10C30 12 54 32 52 54Z" fill="#24583B" fillOpacity="0.25"></path>
            <path d="M52 54C36 42 22 28 10 10" stroke="#24583B" strokeWidth="2"></path>
          </svg>

          {/* Main Hero Card */}
          <div ref={heroCardRef} className="hero-main-card">
            <img
              src="/assets/hero/hero_plants.png"
              alt="Flora Fusion Botanical Collection"
              className="hero-image"
            />

            {/* Floating Nursery Badge */}
            <div className="hero-floating-badge animate-levitate">
              <div className="floating-badge-icon">🌿</div>
              <div>
                <h4 className="floating-badge-title">100% Nursery Fresh</h4>
                <p className="floating-badge-sub">Transit-safe bio packaging</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
