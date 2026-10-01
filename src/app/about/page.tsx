"use client";

import React from "react";
import Link from "next/link";
import { useFloraStore } from "@/store/useFloraStore";

export default function AboutPage() {
  const { openFloraAI } = useFloraStore();

  return (
    <div className="about-page-container" style={{ padding: "var(--space-12) 0 var(--space-16)" }}>
      <div className="container" style={{ maxWidth: "var(--container-reading)" }}>
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          style={{
            fontSize: "var(--text-caption)",
            color: "var(--color-text-muted)",
            marginBottom: "var(--space-8)",
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
            Our Story
          </span>
        </nav>

        {/* Editorial Title */}
        <div style={{ textAlign: "center", marginBottom: "var(--space-10)" }}>
          <span style={{ fontSize: "2.5rem", display: "inline-block", marginBottom: "8px" }}>🌿</span>
          <h1
            style={{
              fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
              color: "var(--color-brand-forest)",
              lineHeight: 1.15,
              marginBottom: "12px",
            }}
          >
            Nature Meets Your Space
          </h1>
          <p
            style={{
              fontSize: "1.125rem",
              color: "var(--color-brand-green)",
              fontStyle: "italic",
              maxWidth: "520px",
              margin: "0 auto",
            }}
          >
            Connecting Indian urban apartments with hand-nurtured nursery greenery
          </p>
        </div>

        {/* Story Card */}
        <div
          style={{
            background: "var(--color-white)",
            padding: "var(--space-10)",
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--color-border-light)",
            lineHeight: 1.85,
            fontSize: "1.0625rem",
            color: "var(--color-text-primary)",
            boxShadow: "var(--shadow-xs)",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", color: "var(--color-brand-forest)", marginBottom: "16px" }}>
            Our Botanical Philosophy
          </h2>
          <p style={{ marginBottom: "20px" }}>
            Flora Fusion began with a humble realization: modern urban living increasingly disconnects us from the calm, grounding rhythms of the natural world. Our mission is to bridge this gap by delivering wholesome nursery plants, artisan hand-thrown pots, and non-GMO heirloom seeds directly to your living rooms, balconies, and workspaces.
          </p>

          <h2 style={{ fontSize: "1.5rem", color: "var(--color-brand-forest)", margin: "32px 0 16px" }}>
            Curated for Real Indian Homes
          </h2>
          <p style={{ marginBottom: "20px" }}>
            Every single plant in our collection is carefully acclimatized in partner nurseries across Maharashtra and Karnataka, conditioned for ambient apartment lighting, and packaged in custom biodegradable transit pods that protect delicate foliage and root soil throughout transit.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              margin: "32px 0",
            }}
          >
            <div style={{ padding: "16px", background: "var(--color-cream-soft)", borderRadius: "var(--radius-md)" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>🌱</div>
              <strong style={{ color: "var(--color-brand-forest)", display: "block" }}>100% Acclimatized</strong>
              <span style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
                Conditioned for indoor apartment light and temperatures.
              </span>
            </div>
            <div style={{ padding: "16px", background: "var(--color-cream-soft)", borderRadius: "var(--radius-md)" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>📦</div>
              <strong style={{ color: "var(--color-brand-forest)", display: "block" }}>Transit Safe Pods</strong>
              <span style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
                Zero soil spillage with breathable eco-packaging.
              </span>
            </div>
            <div style={{ padding: "16px", background: "var(--color-cream-soft)", borderRadius: "var(--radius-md)" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>🤝</div>
              <strong style={{ color: "var(--color-brand-forest)", display: "block" }}>Local Growers</strong>
              <span style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
                Direct partnerships with sustainable generational nurseries.
              </span>
            </div>
          </div>

          <div
            style={{
              marginTop: "40px",
              padding: "24px",
              background: "var(--color-surface-soft)",
              borderRadius: "var(--radius-lg)",
              borderLeft: "4px solid var(--color-brand-forest)",
            }}
          >
            <h3 style={{ fontSize: "1.1rem", color: "var(--color-brand-forest)", marginBottom: "6px" }}>
              Got questions about plant parenting?
            </h3>
            <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", marginBottom: "16px" }}>
              Our customer assistant Flora AI is always ready to recommend the ideal plant for your lighting conditions, space, and pet-friendliness requirements.
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={openFloraAI}
              style={{ padding: "10px 22px", fontSize: "0.875rem" }}
            >
              Talk with Flora AI 🍃
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
