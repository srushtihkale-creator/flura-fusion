"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import { useFloraStore } from "@/store/useFloraStore";
import { ProductService } from "@/services/product.service";
import { Product } from "@/types/product";

export function WishlistModal() {
  const { wishlist, isWishlistOpen, closeWishlist, toggleWishlist, addToCart } = useFloraStore();
  const [wishedProducts, setWishedProducts] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    async function loadWished() {
      const all = await ProductService.getAll();
      const matched = all.filter((p) => wishlist.includes(p.id));
      setWishedProducts(matched);
    }
    loadWished();
  }, [wishlist, mounted]);

  if (!mounted || !isWishlistOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(18, 50, 34, 0.5)",
        backdropFilter: "blur(6px)",
        zIndex: "var(--z-modal)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-4)",
        animation: "fadeIn 0.2s ease-out",
      }}
    >
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          borderRadius: "var(--radius-lg)",
          maxWidth: "760px",
          width: "100%",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "var(--shadow-lg)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "var(--space-6)",
            borderBottom: "1px solid var(--color-border-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2 style={{ fontSize: "var(--text-h3)", margin: 0 }}>Saved Green Wishlist</h2>
            <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-text-secondary)", margin: 0 }}>
              Your favorite plants, pots, and seeds saved for your space.
            </p>
          </div>
          <button
            onClick={closeWishlist}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "999px",
              color: "var(--color-text-secondary)",
            }}
            aria-label="Close wishlist"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-6)" }}>
          {wishedProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "var(--space-12) 0" }}>
              <div style={{ fontSize: "3rem", marginBottom: "var(--space-3)" }}>💚</div>
              <h4 style={{ fontSize: "var(--text-body-lg)", marginBottom: "var(--space-2)" }}>
                Your green wishlist is waiting.
              </h4>
              <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-text-muted)", marginBottom: "var(--space-6)" }}>
                Save plants, pots and seeds you love to easily find them later.
              </p>
              <button onClick={closeWishlist} className="btn-primary">
                Discover Plants
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "var(--space-4)",
              }}
            >
              {wishedProducts.map((prod) => (
                <div
                  key={prod.id}
                  style={{
                    backgroundColor: "var(--color-white)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-border-light)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1", backgroundColor: "var(--color-cream-soft)" }}>
                    <Image src={prod.image} alt={prod.name} fill style={{ objectFit: "cover" }} />
                    <button
                      onClick={() => toggleWishlist(prod.id)}
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        width: "32px",
                        height: "32px",
                        borderRadius: "999px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--color-error)",
                      }}
                      title="Remove from wishlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={{ padding: "var(--space-3)", flex: 1, display: "flex", flexDirection: "column" }}>
                    <Link
                      href={`/product/${prod.slug}`}
                      onClick={closeWishlist}
                      style={{ fontSize: "var(--text-body-sm)", fontWeight: 600, marginBottom: "4px" }}
                    >
                      {prod.name}
                    </Link>
                    <div style={{ fontSize: "var(--text-body-sm)", fontWeight: 700, color: "var(--color-brand-forest)", marginBottom: "auto" }}>
                      ₹{prod.price}
                    </div>

                    <button
                      onClick={() => addToCart(prod, 1)}
                      className="btn-primary"
                      style={{
                        marginTop: "var(--space-3)",
                        height: "36px",
                        fontSize: "var(--text-body-sm)",
                        padding: "0 var(--space-3)",
                        gap: "6px",
                      }}
                    >
                      <ShoppingBag size={14} /> Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
