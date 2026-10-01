"use client";

import React from "react";
import Link from "next/link";
import { Droplet, Sun, Box, ArrowRight } from "lucide-react";
import { useFloraStore } from "@/store/useFloraStore";

export function StoriesAndCareSection() {
  const { openAI } = useFloraStore();

  return (
    <section style={{ padding: "var(--space-16) 0", backgroundColor: "var(--color-cream-soft)" }}>
      <div className="container" style={{ maxWidth: "var(--container-reading)" }}>
        <div style={{ textAlign: "center", marginBottom: "var(--space-10)" }}>
          <span style={{ fontSize: "2rem" }}>🌿</span>
          <h2 style={{ fontSize: "var(--text-display-md)", marginTop: "8px", marginBottom: "8px" }}>
            Nature Meets Your Space
          </h2>
          <p style={{ fontSize: "var(--text-body-lg)", color: "var(--color-brand-green)", fontStyle: "italic" }}>
            Connecting Indian homes with hand-nurtured greenery
          </p>
        </div>

        <div
          style={{
            backgroundColor: "var(--color-white)",
            padding: "var(--space-8)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border-light)",
            boxShadow: "var(--shadow-sm)",
            lineHeight: 1.8,
            marginBottom: "var(--space-10)",
          }}
        >
          <h3 style={{ fontSize: "var(--text-h4)", marginBottom: "12px" }}>Our Botanical Story</h3>
          <p style={{ fontSize: "var(--text-body)", color: "var(--color-text-secondary)", marginBottom: "16px" }}>
            Flora Fusion began with a humble realization: urban living disconnects us from the grounding rhythm of nature. We set out to bridge this gap by bringing wholesome nursery plants, artisan hand-thrown pots, and non-GMO heirloom seeds directly to your living rooms, balconies, and workspaces.
          </p>
          <h3 style={{ fontSize: "var(--text-h4)", margin: "24px 0 12px" }}>Curated for Real Homes</h3>
          <p style={{ fontSize: "var(--text-body)", color: "var(--color-text-secondary)", marginBottom: "24px" }}>
            Every single plant in our collection is acclimatized in certified nurseries, conditioned for apartment lighting, and packaged in biodegradable transit pods that protect foliage and soil throughout the journey.
          </p>

          <div
            style={{
              padding: "var(--space-5)",
              backgroundColor: "var(--color-surface-soft)",
              borderRadius: "var(--radius-md)",
              borderLeft: "4px solid var(--color-brand-forest)",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <h4 style={{ margin: 0, fontSize: "var(--text-body)", fontWeight: 600 }}>
              Got questions about plant care?
            </h4>
            <p style={{ margin: 0, fontSize: "var(--text-body-sm)", color: "var(--color-text-muted)" }}>
              Our customer assistant Flora AI is always ready to recommend the ideal plant for your light conditions.
            </p>
            <div>
              <button
                onClick={openAI}
                className="btn-primary"
                style={{ height: "36px", padding: "0 16px", fontSize: "var(--text-caption)" }}
              >
                Talk with Flora AI 🍃
              </button>
            </div>
          </div>
        </div>

        {/* Plant Care Quick Guides */}
        <div>
          <h3 style={{ textAlign: "center", fontSize: "var(--text-h3)", marginBottom: "var(--space-6)" }}>
            Plant Care Essentials
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div
              style={{
                backgroundColor: "var(--color-white)",
                padding: "var(--space-5) var(--space-6)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border-light)",
                display: "flex",
                gap: "var(--space-4)",
                alignItems: "flex-start",
              }}
            >
              <div style={{ color: "var(--color-info)", marginTop: "2px" }}>
                <Droplet size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: "var(--text-body)", fontWeight: 600, marginBottom: "4px" }}>
                  The Golden Rule of Watering
                </h4>
                <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-text-secondary)", margin: 0 }}>
                  More indoor plants suffer from over-watering than under-watering. Always insert your index finger 2 inches into the soil. If damp, wait! When watering, pour slowly until water drains freely from the base drainage hole.
                </p>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "var(--color-white)",
                padding: "var(--space-5) var(--space-6)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border-light)",
                display: "flex",
                gap: "var(--space-4)",
                alignItems: "flex-start",
              }}
            >
              <div style={{ color: "var(--color-warning)", marginTop: "2px" }}>
                <Sun size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: "var(--text-body)", fontWeight: 600, marginBottom: "4px" }}>
                  Deciphering Sunlight
                </h4>
                <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-text-secondary)", margin: 0 }}>
                  <strong>Bright Indirect Light:</strong> Within 3-5 feet of an unshaded window.<br />
                  <strong>Low Light:</strong> Interior hallways or north-facing rooms (Snake Plant and ZZ Plant thrive here).<br />
                  <strong>Direct Sun:</strong> Essential for flowering lavender, jade plants, and balcony seeds.
                </p>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "var(--color-white)",
                padding: "var(--space-5) var(--space-6)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border-light)",
                display: "flex",
                gap: "var(--space-4)",
                alignItems: "flex-start",
              }}
            >
              <div style={{ color: "var(--color-category-pots)", marginTop: "2px" }}>
                <Box size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: "var(--text-body)", fontWeight: 600, marginBottom: "4px" }}>
                  Potting & Drainage
                </h4>
                <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-text-secondary)", margin: 0 }}>
                  Always ensure your pot has a drainage hole. If using decorative metal or marble pots without holes, place the plant in a nursery plastic pot inside the decorative container.
                </p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "var(--space-6)" }}>
            <Link
              href="/plant-care"
              style={{
                fontSize: "var(--text-body-sm)",
                fontWeight: 600,
                color: "var(--color-brand-green)",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              Read full botanical care guides <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
