"use client";

import React, { useState, useEffect } from "react";
import { useFloraStore } from "@/store/useFloraStore";
import { ProductService } from "@/services/product.service";
import { ProductCard } from "@/components/product/ProductCard";
import { Product } from "@/types/product";

export function WishlistModal() {
  const { wishlist, isWishlistOpen, closeWishlist } = useFloraStore();
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


  return (
    <div
      id="wishlist-modal"
      className={`modal-backdrop ${isWishlistOpen ? "open" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeWishlist();
      }}
    >
      <div className="modal-container" style={{ maxWidth: "840px" }}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={closeWishlist}
          title="Close"
        >
          ✕
        </button>

        <div style={{ marginBottom: "var(--space-6)" }}>
          <h2>Saved Green Wishlist</h2>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem" }}>
            Your favorite plants, pots, and seeds saved for your space.
          </p>
        </div>

        {wishedProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>💚</div>
            <h4 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>
              Your green wishlist is empty
            </h4>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem" }}>
              Click the heart icon on any plant, pot, or seeds to save them here for later!
            </p>
          </div>
        ) : (
          <div id="wishlist-items-grid" className="product-grid" style={{ marginBottom: 0 }}>
            {wishedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
