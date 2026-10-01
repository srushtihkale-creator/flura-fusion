"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useFloraStore } from "@/store/useFloraStore";

export function SiteFooter() {
  const { addToast, openAI } = useFloraStore();
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    addToast("Subscribed! Welcome to Flora Fusion 🌿", "success");
    setEmail("");
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <Link href="/" className="brand-logo" title="Flora Fusion Home">
              <img src="/assets/logo.png" alt="Flora Fusion" className="brand-logo-img footer-logo-img" />
            </Link>
            <p className="footer-brand-desc">
              Nature Meets Your Space. Premium nursery plants, handcrafted pots, and organic seeds curated for modern living.
            </p>
          </div>

          {/* Collections */}
          <div>
            <h4 className="footer-heading">Collections</h4>
            <div className="footer-links">
              <Link href="/plants" className="footer-link">Indoor & Air Purifying Plants</Link>
              <Link href="/pots" className="footer-link">Artisan Ceramic & Terracotta</Link>
              <Link href="/seeds" className="footer-link">Heirloom Organic Seeds</Link>
              <Link href="/plants" className="footer-link">Bestseller Green Picks</Link>
            </div>
          </div>

          {/* Care & Support */}
          <div>
            <h4 className="footer-heading">Care & Support</h4>
            <div className="footer-links">
              <Link href="/about" className="footer-link">About Flora Fusion</Link>
              <Link href="/plant-care" className="footer-link">Plant Care Guide</Link>
              <Link href="/account" className="footer-link">Track Your Order</Link>
              <button
                type="button"
                onClick={openAI}
                className="footer-link"
                style={{ textAlign: "left", cursor: "pointer", background: "none", border: "none", padding: 0 }}
              >
                Ask Flora AI Assistant 🌿
              </button>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="footer-heading">Stay in the Loop</h4>
            <p style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)", marginBottom: "8px" }}>
              Get weekly plant parenting tips, new botanical arrivals & 10% off your first nursery order.
            </p>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                className="newsletter-input"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="newsletter-btn" title="Subscribe">
                →
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}
