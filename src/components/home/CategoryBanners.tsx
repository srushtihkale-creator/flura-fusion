import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CategoryBanners() {
  const banners = [
    {
      id: "promo-plants",
      category: "Plants",
      title: "Indoor & Air Purifiers",
      desc: "Lush greens for home & office desks",
      href: "/plants",
      image: "/assets/banners/promo_plants.png",
      accent: "var(--color-category-plants)",
      bg: "var(--color-category-plants-soft)",
    },
    {
      id: "promo-pots",
      category: "Pots",
      title: "Artisan Ceramic & Clay",
      desc: "Breathable hand-thrown planters",
      href: "/pots",
      image: "/assets/banners/promo_pots.png",
      accent: "var(--color-category-pots)",
      bg: "var(--color-category-pots-soft)",
    },
    {
      id: "promo-seeds",
      category: "Seeds",
      title: "Heirloom & Herb Seeds",
      desc: "Grow organic greens & blooms from scratch",
      href: "/seeds",
      image: "/assets/banners/promo_seeds.png",
      accent: "var(--color-category-seeds)",
      bg: "var(--color-category-seeds-soft)",
    },
  ];

  return (
    <section style={{ padding: "var(--space-10) 0" }}>
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "var(--space-6)",
          }}
        >
          {banners.map((b) => (
            <Link
              key={b.id}
              href={b.href}
              style={{
                backgroundColor: b.bg,
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                border: "1px solid var(--color-border-light)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transition: "all var(--duration-fast) var(--ease-standard)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div style={{ padding: "var(--space-6)", zIndex: 1 }}>
                <span
                  style={{
                    fontSize: "var(--text-caption)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: b.accent,
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  {b.category}
                </span>
                <h3 style={{ fontSize: "var(--text-h4)", marginBottom: "4px", color: "var(--color-brand-forest)" }}>
                  {b.title}
                </h3>
                <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-text-secondary)", marginBottom: "var(--space-4)" }}>
                  {b.desc}
                </p>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "var(--text-body-sm)",
                    fontWeight: 600,
                    color: b.accent,
                  }}
                >
                  Explore Collection <ArrowRight size={16} />
                </span>
              </div>

              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "170px",
                  marginTop: "auto",
                }}
              >
                <Image
                  src={b.image}
                  alt={b.title}
                  fill
                  style={{ objectFit: "cover", objectPosition: "center bottom" }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
