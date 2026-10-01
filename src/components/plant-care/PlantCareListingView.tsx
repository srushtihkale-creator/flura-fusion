"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PlantCareArticle } from "@/types/cms";
import { PlantCareService } from "@/services/plantCare.service";
import { useFloraStore } from "@/store/useFloraStore";

interface PlantCareListingViewProps {
  initialArticles: PlantCareArticle[];
}

export function PlantCareListingView({ initialArticles }: PlantCareListingViewProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [articles, setArticles] = useState<PlantCareArticle[]>(initialArticles);
  const { openFloraAI } = useFloraStore();

  useEffect(() => {
    PlantCareService.getAll(activeCategory).then(setArticles);
  }, [activeCategory]);

  const categories = [
    { label: "All Topics", value: "all" },
    { label: "💧 Watering", value: "watering" },
    { label: "☀️ Light", value: "light" },
    { label: "🏺 Potting & Soil", value: "repotting" },
    { label: "🩺 Plant Health", value: "troubleshooting" },
  ];

  return (
    <div className="plant-care-page-container" style={{ padding: "var(--space-8) 0 var(--space-16)" }}>
      <div className="container">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          style={{
            fontSize: "var(--text-caption)",
            color: "var(--color-text-muted)",
            marginBottom: "var(--space-6)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Link href="/" style={{ color: "var(--color-brand-forest)", textDecoration: "none" }}>
            Home
          </Link>
          <span>/</span>
          <span style={{ color: "var(--color-text-secondary)", fontWeight: 500 }}>
            Plant Care Guides
          </span>
        </nav>

        {/* Editorial Header */}
        <div style={{ maxWidth: "700px", marginBottom: "var(--space-8)" }}>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--color-brand-green)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              display: "block",
              marginBottom: "6px",
            }}
          >
            Nursery Knowledge Hub
          </span>
          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              color: "var(--color-brand-forest)",
              marginBottom: "12px",
            }}
          >
            Plant Care & Parenting Guide
          </h1>
          <p
            style={{
              fontSize: "1.0625rem",
              lineHeight: 1.6,
              color: "var(--color-text-secondary)",
            }}
          >
            Simple, trustworthy botanical wisdom curated by nursery arborists to help your living space thrive.
          </p>
        </div>

        {/* Category Filter Chips */}
        <div
          className="home-filter-chips"
          style={{ marginBottom: "var(--space-8)", paddingBottom: "12px", borderBottom: "1px solid var(--color-border-light)" }}
        >
          {categories.map((c) => (
            <button
              key={c.value}
              type="button"
              className={`home-filter-chip ${activeCategory === c.value ? "active" : ""}`}
              onClick={() => setActiveCategory(c.value)}
              style={{ fontSize: "0.8125rem", padding: "8px 16px" }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "var(--space-8)",
            marginBottom: "var(--space-16)",
          }}
        >
          {articles.map((article) => (
            <article
              key={article.id}
              style={{
                background: "var(--color-white)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-border-light)",
                boxShadow: "var(--shadow-xs)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "transform var(--duration-normal), box-shadow var(--duration-normal)",
              }}
            >
              <div style={{ height: "200px", width: "100%", position: "relative", backgroundColor: "var(--color-cream-soft)" }}>
                <img
                  src={article.image}
                  alt={article.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <span
                  style={{
                    position: "absolute",
                    bottom: "12px",
                    left: "12px",
                    backgroundColor: "rgba(23, 63, 43, 0.85)",
                    color: "#FFFFFF",
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: "var(--radius-pill)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {article.readTime}
                </span>
              </div>

              <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-brand-green)", fontWeight: 600, textTransform: "uppercase", marginBottom: "6px" }}>
                    {article.category} • {article.date}
                  </div>
                  <h3 style={{ fontSize: "1.2rem", color: "var(--color-brand-forest)", lineHeight: 1.3, marginBottom: "8px" }}>
                    <Link href={`/plant-care/${article.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                      {article.title}
                    </Link>
                  </h3>
                  <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", lineHeight: 1.5, margin: 0 }}>
                    {article.excerpt}
                  </p>
                </div>

                <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid var(--color-border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>By {article.author}</span>
                  <Link
                    href={`/plant-care/${article.slug}`}
                    style={{ fontSize: "0.8125rem", color: "var(--color-brand-green)", fontWeight: 600, textDecoration: "none" }}
                  >
                    Read Guide →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Flora AI Botanical Assistant Consultation */}
        <div
          style={{
            background: "linear-gradient(135deg, #173F2B 0%, #24583B 100%)",
            color: "#FFFFFF",
            padding: "40px",
            borderRadius: "var(--radius-xl)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "24px",
          }}
        >
          <div style={{ maxWidth: "560px" }}>
            <span style={{ fontSize: "1.75rem", display: "block", marginBottom: "8px" }}>🩺🍃</span>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#FFFFFF", marginBottom: "8px" }}>
              Have a specific plant emergency?
            </h2>
            <p style={{ color: "var(--color-cream)", opacity: 0.9, lineHeight: 1.6, margin: 0 }}>
              Ask Flora AI about drooping stems, yellowing leaves, or how to revive your fiddle-leaf fig. Instant diagnosis based on nursery arborist guidelines.
            </p>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={openFloraAI}
            style={{
              backgroundColor: "#FFFFFF",
              color: "var(--color-brand-forest)",
              padding: "14px 28px",
              boxShadow: "var(--shadow-md)",
            }}
          >
            Consult Flora AI Now 💬
          </button>
        </div>
      </div>
    </div>
  );
}
