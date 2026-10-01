"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useFloraStore } from "@/store/useFloraStore";
import { WishlistService } from "@/services/wishlist.service";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/product/ProductCard";

export function WishlistPageView() {
  const { wishlist } = useFloraStore();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setLoading(true);
    WishlistService.getWishlistProducts(wishlist).then((resolved) => {
      setItems(resolved);
      setLoading(false);
    });
  }, [wishlist, mounted]);

  if (!mounted || loading) {
    return (
      <div style={{ padding: "80px 0", textAlign: "center", color: "var(--color-text-muted)" }}>
        Loading your green wishlist...
      </div>
    );
  }

  return (
    <div className="wishlist-page-container" style={{ padding: "var(--space-8) 0 var(--space-16)" }}>
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
            Saved Wishlist
          </span>
        </nav>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "var(--space-8)" }}>
          <div>
            <h1
              style={{
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                color: "var(--color-brand-forest)",
                marginBottom: "6px",
              }}
            >
              Saved Green Wishlist
            </h1>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9375rem", margin: 0 }}>
              Your handpicked nursery favorites, ready whenever you are.
            </p>
          </div>
          <span style={{ fontSize: "var(--text-caption)", color: "var(--color-text-muted)", fontWeight: 500 }}>
            {items.length} {items.length === 1 ? "item" : "items"} saved
          </span>
        </div>

        {items.length > 0 ? (
          <div className="product-grid">
            {items.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          /* Approved Empty State per Section 25 */
          <div
            style={{
              padding: "80px 20px",
              textAlign: "center",
              background: "var(--color-white)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border-light)",
            }}
          >
            <div style={{ fontSize: "3.5rem", marginBottom: "16px" }}>🌿</div>
            <h2
              style={{
                fontSize: "var(--text-heading-lg)",
                color: "var(--color-brand-forest)",
                marginBottom: "8px",
              }}
            >
              Your green wishlist is waiting.
            </h2>
            <p
              style={{
                color: "var(--color-text-secondary)",
                maxWidth: "420px",
                margin: "0 auto 24px",
                lineHeight: 1.6,
              }}
            >
              Tap the heart icon on any plant, pot, or seed you love to keep it saved for your future urban garden.
            </p>
            <Link href="/plants" className="btn-primary" style={{ padding: "14px 28px" }}>
              Start Browsing →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
