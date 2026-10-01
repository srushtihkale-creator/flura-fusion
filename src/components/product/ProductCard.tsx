"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
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

  // Botanical tags format matching prototype
  let tagString = "";
  if (product.category === "plants") {
    const meta = product.metadata as any;
    tagString = `☀️ ${meta.placement || "Indoor"} • 💧 ${(meta.water || "").split(" ")[0]} Water`;
  } else if (product.category === "pots") {
    const meta = product.metadata as any;
    tagString = `📏 ${(meta.size || "").split(" ")[0]} • 🏺 ${(meta.material || "").split(" ")[0]}`;
  } else {
    const meta = product.metadata as any;
    tagString = `🌿 ${(meta.type || "").split(" ")[0]} • ⚡ ${(meta.difficulty || "").split(" ")[0]}`;
  }

  return (
    <div
      style={{
        backgroundColor: "var(--color-surface)",
        borderRadius: "var(--product-card-radius)",
        border: "1px solid var(--product-card-border)",
        padding: "var(--product-card-padding)",
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        flexDirection: "column",
        transition: "all var(--duration-fast) var(--ease-standard)",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
      }}
    >
      {/* Image Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: "var(--radius-sm)",
          overflow: "hidden",
          backgroundColor: "var(--color-cream-soft)",
          marginBottom: "var(--space-3)",
        }}
      >
        <Link href={`/product/${product.slug}`} style={{ display: "block", width: "100%", height: "100%" }}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            style={{ objectFit: "cover" }}
            loading="lazy"
          />
        </Link>

        {/* Badge */}
        {product.badge && (
          <span
            className="badge badge-forest"
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              fontSize: "10px",
              padding: "2px 8px",
            }}
          >
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            width: "34px",
            height: "34px",
            borderRadius: "999px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isWished ? "var(--color-category-pots)" : "var(--color-text-secondary)",
            boxShadow: "var(--shadow-xs)",
            transition: "all var(--duration-fast)",
          }}
          aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={16} fill={isWished ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Product Details */}
      <Link href={`/product/${product.slug}`}>
        <h4
          style={{
            fontSize: "var(--text-body)",
            fontWeight: 600,
            marginBottom: "2px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={product.name}
        >
          {product.name}
        </h4>
      </Link>

      <p
        style={{
          fontSize: "var(--text-body-sm)",
          color: "var(--color-text-muted)",
          marginBottom: "var(--space-2)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {product.tagline}
      </p>

      {/* Rating & Price */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "var(--text-caption)" }}>
          <span style={{ color: "var(--rating-star)" }}>★</span>
          <span style={{ fontWeight: 600 }}>{product.rating}</span>
          <span style={{ color: "var(--color-text-muted)" }}>({product.reviewCount})</span>
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
          <span style={{ fontSize: "var(--text-body)", fontWeight: 700, color: "var(--color-brand-deep)" }}>
            ₹{product.price}
          </span>
          {product.originalPrice && (
            <span style={{ fontSize: "var(--text-caption)", color: "var(--color-text-muted)", textDecoration: "line-through" }}>
              ₹{product.originalPrice}
            </span>
          )}
        </div>
      </div>

      {/* Botanical Tag */}
      <div
        style={{
          fontSize: "11px",
          color: "var(--color-text-muted)",
          backgroundColor: "var(--color-cream-soft)",
          padding: "4px 8px",
          borderRadius: "var(--radius-xs)",
          marginBottom: "var(--space-3)",
        }}
      >
        {tagString}
      </div>

      {/* Quick Add Button */}
      <button
        onClick={() => addToCart(product, 1)}
        className="btn-primary"
        style={{
          width: "100%",
          height: "38px",
          fontSize: "var(--text-body-sm)",
          padding: "0 var(--space-4)",
          marginTop: "auto",
        }}
      >
        Add to Cart +
      </button>
    </div>
  );
}
