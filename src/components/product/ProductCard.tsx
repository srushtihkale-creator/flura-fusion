"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { useFloraStore } from "@/store/useFloraStore";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, toggleWishlist, addToCart } = useFloraStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isWished = mounted ? isInWishlist(product.id) : false;

  // Format botanical tags to match prototype
  let tagContent = null;
  const meta = (product.metadata || {}) as any;

  if (product.category === "plants") {
    tagContent = (
      <>
        <span>☀️ {meta.placement || "Indoor"}</span> • <span>💧 {(meta.water || "").split(" ")[0]} Water</span>
      </>
    );
  } else if (product.category === "pots") {
    tagContent = (
      <>
        <span>📏 {(meta.size || "").split(" ")[0]}</span> • <span>🏺 {(meta.material || "").split(" ")[0]}</span>
      </>
    );
  } else {
    tagContent = (
      <>
        <span>🌿 {(meta.type || "").split(" ")[0]}</span> • <span>⚡ {(meta.difficulty || "").split(" ")[0]}</span>
      </>
    );
  }

  return (
    <div className="product-card" data-slug={product.slug} data-id={product.id}>
      <Link href={`/product/${product.slug}`} style={{ display: "contents" }}>
        <div className="product-img-wrapper">
          {product.badge && <span className="card-badge">{product.badge}</span>}
          
          <button
            type="button"
            className={`card-wishlist-btn ${isWished ? "active" : ""}`}
            data-id={product.id}
            title={isWished ? "Remove from wishlist" : "Save to wishlist"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={isWished ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          <img
            src={product.image}
            alt={product.name}
            className="product-card-img"
            loading="lazy"
            onError={(e) => {
              if (product.refImage) {
                (e.currentTarget as HTMLImageElement).src = product.refImage;
              }
            }}
          />
        </div>

        <h4 className="product-name" title={product.name}>
          {product.name}
        </h4>
        <p className="product-short-desc">{product.tagline}</p>
        
        <div className="product-meta-row">
          <div className="product-rating">
            <span className="star">★</span> {product.rating}{" "}
            <span style={{ color: "var(--color-text-muted)" }}>({product.reviewCount})</span>
          </div>
          <div className="product-price">
            ₹{product.price}
            {product.originalPrice && (
              <span className="product-price-original">₹{product.originalPrice}</span>
            )}
          </div>
        </div>

        <div className="product-card-tags">
          {tagContent}
        </div>
      </Link>

      <button
        type="button"
        className="card-quick-add"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          addToCart(product, 1);
        }}
      >
        Add to Cart +
      </button>
    </div>
  );
}
