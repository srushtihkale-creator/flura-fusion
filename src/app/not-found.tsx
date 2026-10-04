import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | Flora Fusion",
  description: "The botanical page or product you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div
      style={{
        padding: "100px 20px",
        textAlign: "center",
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🌿</div>
      <h1
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "clamp(2rem, 4vw, 3rem)",
          color: "var(--color-brand-forest)",
          marginBottom: "12px",
        }}
      >
        Page Not Found
      </h1>
      <p
        style={{
          color: "var(--color-text-secondary)",
          maxWidth: "460px",
          margin: "0 auto 32px",
          lineHeight: 1.6,
          fontSize: "1rem",
        }}
      >
        We couldn&apos;t find the botanical page, plant, or nursery story you were looking for. Let&apos;s guide you back to our living garden.
      </p>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/" className="btn-primary">
          Back to Home →
        </Link>
        <Link href="/plants" className="btn-secondary">
          Explore Plants
        </Link>
      </div>
    </div>
  );
}
