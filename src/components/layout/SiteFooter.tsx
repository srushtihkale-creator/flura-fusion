"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useFloraStore } from "@/store/useFloraStore";

export function SiteFooter() {
  const { addToast, openAI } = useFloraStore();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    addToast("Subscribed! Welcome to the Flora Fusion nursery family 🌿", "success");
    setEmail("");
  };

  return (
    <footer
      style={{
        backgroundColor: "var(--color-surface)",
        borderTop: "1px solid var(--color-border-light)",
        paddingTop: "var(--space-16)",
        paddingBottom: "var(--space-12)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "var(--space-8)",
            marginBottom: "var(--space-12)",
          }}
        >
          {/* Brand Info */}
          <div>
            <Link href="/" style={{ display: "inline-block", marginBottom: "var(--space-4)" }}>
              <Image
                src="/assets/logo.png"
                alt="Flora Fusion"
                width={150}
                height={40}
                style={{ objectFit: "contain", height: "auto", width: "var(--logo-width-desktop)" }}
              />
            </Link>
            <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
              Nature Meets Your Space. Premium nursery plants, handcrafted pots, and organic seeds curated for modern living.
            </p>
          </div>

          {/* Collections */}
          <div>
            <h4 style={{ fontSize: "var(--text-body)", fontWeight: 600, marginBottom: "var(--space-4)" }}>
              Collections
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <Link href="/plants" style={{ fontSize: "var(--text-body-sm)", color: "var(--color-text-secondary)" }}>
                Indoor & Air Purifying Plants
              </Link>
              <Link href="/pots" style={{ fontSize: "var(--text-body-sm)", color: "var(--color-text-secondary)" }}>
                Artisan Ceramic & Terracotta Pots
              </Link>
              <Link href="/seeds" style={{ fontSize: "var(--text-body-sm)", color: "var(--color-text-secondary)" }}>
                Heirloom Organic Seeds
              </Link>
              <Link href="/plants" style={{ fontSize: "var(--text-body-sm)", color: "var(--color-text-secondary)" }}>
                Bestseller Green Picks
              </Link>
            </div>
          </div>

          {/* Care & Support */}
          <div>
            <h4 style={{ fontSize: "var(--text-body)", fontWeight: 600, marginBottom: "var(--space-4)" }}>
              Care & Support
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <Link href="/about" style={{ fontSize: "var(--text-body-sm)", color: "var(--color-text-secondary)" }}>
                About Flora Fusion
              </Link>
              <Link href="/plant-care" style={{ fontSize: "var(--text-body-sm)", color: "var(--color-text-secondary)" }}>
                Plant Care Guide
              </Link>
              <Link href="/account" style={{ fontSize: "var(--text-body-sm)", color: "var(--color-text-secondary)" }}>
                Track Your Order
              </Link>
              <button
                onClick={openAI}
                style={{
                  textAlign: "left",
                  fontSize: "var(--text-body-sm)",
                  color: "var(--color-brand-green)",
                  fontWeight: 600,
                  padding: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                Ask Flora AI Assistant 🌿
              </button>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ fontSize: "var(--text-body)", fontWeight: 600, marginBottom: "var(--space-3)" }}>
              Stay in the Loop
            </h4>
            <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-text-muted)", marginBottom: "var(--space-4)" }}>
              Get weekly plant parenting tips, new botanical arrivals & 10% off your first nursery order.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: "flex", gap: "8px" }}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  fontSize: "var(--text-body-sm)",
                }}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{ width: "44px", height: "44px", padding: 0, borderRadius: "var(--radius-sm)" }}
                aria-label="Subscribe"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}
