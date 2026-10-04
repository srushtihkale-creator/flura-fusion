"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Flora Fusion Runtime Exception:", error);
  }, [error]);

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
      <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🌱</div>
      <h1
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "clamp(2rem, 4vw, 3rem)",
          color: "var(--color-brand-forest)",
          marginBottom: "12px",
        }}
      >
        Something went wrong
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
        A temporary error occurred while tending to this page. Our botanical team has been notified.
      </p>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          type="button"
          onClick={() => reset()}
          className="btn-primary"
        >
          Try Again ↺
        </button>
        <Link href="/" className="btn-secondary">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
