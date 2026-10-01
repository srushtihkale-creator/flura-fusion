"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { useFloraStore } from "@/store/useFloraStore";
import { ProductCard } from "@/components/product/ProductCard";

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailView({ product, relatedProducts }: ProductDetailViewProps) {
  const router = useRouter();
  const { addToCart, isInWishlist, toggleWishlist, openFloraAI } = useFloraStore();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.image);

  const isWished = isInWishlist(product.id);
  const meta = (product.metadata || {}) as any;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/checkout");
  };

  return (
    <div className="product-detail-page" style={{ padding: "var(--space-8) 0 var(--space-16)" }}>
      <div className="container">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          style={{
            fontSize: "var(--text-caption)",
            color: "var(--color-text-muted)",
            marginBottom: "var(--space-8)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Link href="/" style={{ color: "var(--color-brand-forest)", textDecoration: "none" }}>
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/${product.category}`}
            style={{ color: "var(--color-brand-forest)", textDecoration: "none", textTransform: "capitalize" }}
          >
            {product.category}
          </Link>
          <span>/</span>
          <span style={{ color: "var(--color-text-secondary)", fontWeight: 500 }}>
            {product.name}
          </span>
        </nav>

        {/* Main Product Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "var(--space-12)",
            alignItems: "start",
            marginBottom: "var(--space-16)",
          }}
        >
          {/* Gallery Column */}
          <div>
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "1 / 1",
                backgroundColor: "var(--color-cream-soft)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                border: "1px solid var(--color-border-light)",
                boxShadow: "var(--shadow-sm)",
                marginBottom: "var(--space-4)",
              }}
            >
              {product.badge && (
                <span
                  className="card-badge"
                  style={{ position: "absolute", top: "16px", left: "16px", zIndex: 2 }}
                >
                  {product.badge}
                </span>
              )}

              <button
                type="button"
                className={`card-wishlist-btn ${isWished ? "active" : ""}`}
                style={{ position: "absolute", top: "16px", right: "16px", zIndex: 2 }}
                title={isWished ? "Remove from wishlist" : "Save to wishlist"}
                onClick={() => toggleWishlist(product.id)}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={isWished ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>

              <img
                src={activeImage}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform var(--duration-normal)",
                }}
                onError={() => {
                  if (product.refImage && activeImage !== product.refImage) {
                    setActiveImage(product.refImage);
                  }
                }}
              />
            </div>

            {/* Thumbnail selector if refImage differs */}
            {product.refImage && (
              <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setActiveImage(product.image)}
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "var(--radius-sm)",
                    overflow: "hidden",
                    border:
                      activeImage === product.image
                        ? "2px solid var(--color-brand-forest)"
                        : "1px solid var(--color-border-light)",
                    padding: 0,
                    cursor: "pointer",
                    background: "#fff",
                  }}
                >
                  <img src={product.image} alt="Studio view" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImage(product.refImage)}
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "var(--radius-sm)",
                    overflow: "hidden",
                    border:
                      activeImage === product.refImage
                        ? "2px solid var(--color-brand-forest)"
                        : "1px solid var(--color-border-light)",
                    padding: 0,
                    cursor: "pointer",
                    background: "#fff",
                  }}
                >
                  <img src={product.refImage} alt="Reference view" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              </div>
            )}
          </div>

          {/* Details / Buy Column */}
          <div>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--color-brand-green)",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Flora Fusion • {product.category}
            </span>

            <h1
              style={{
                fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
                lineHeight: 1.15,
                color: "var(--color-brand-forest)",
                marginBottom: "6px",
              }}
            >
              {product.name}
            </h1>

            <p
              style={{
                fontSize: "1.0625rem",
                color: "var(--color-brand-green)",
                fontStyle: "italic",
                marginBottom: "12px",
              }}
            >
              {product.tagline}
            </p>

            {/* Ratings & Stock */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                fontSize: "var(--text-body-sm)",
                marginBottom: "16px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--color-brand-forest)", fontWeight: 600 }}>
                <span style={{ color: "#E5A93C" }}>★</span> {product.rating}
                <span style={{ color: "var(--color-text-muted)", fontWeight: 400 }}>
                  ({product.reviewCount} customer reviews)
                </span>
              </div>
              <span>•</span>
              <div style={{ color: "var(--color-brand-green)", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--color-brand-green)", display: "inline-block" }}></span>
                In Stock & Ready to Dispatch
              </div>
            </div>

            {/* Pricing */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "20px" }}>
              <span
                style={{
                  fontSize: "2.25rem",
                  fontWeight: 700,
                  color: "var(--color-brand-deep)",
                }}
              >
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <>
                  <span
                    style={{
                      fontSize: "1.25rem",
                      color: "var(--color-text-muted)",
                      textDecoration: "line-through",
                    }}
                  >
                    ₹{product.originalPrice}
                  </span>
                  <span
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "var(--color-brand-forest)",
                      backgroundColor: "var(--color-brand-sage-light)",
                      padding: "3px 8px",
                      borderRadius: "var(--radius-pill)",
                    }}
                  >
                    Save ₹{product.originalPrice - product.price}
                  </span>
                </>
              )}
            </div>

            {/* Editorial Description */}
            <p
              style={{
                fontSize: "0.9375rem",
                lineHeight: 1.7,
                color: "var(--color-text-secondary)",
                marginBottom: "24px",
              }}
            >
              {product.description}
            </p>

            {/* Specifications Box */}
            <div
              style={{
                background: "var(--color-cream-soft)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border-light)",
                padding: "16px 20px",
                marginBottom: "24px",
              }}
            >
              <h4
                style={{
                  fontSize: "0.8125rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--color-brand-forest)",
                  marginBottom: "12px",
                }}
              >
                Botanical Specifications
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                  gap: "12px",
                  fontSize: "0.8125rem",
                }}
              >
                {product.category === "plants" && (
                  <>
                    <div>
                      <div style={{ color: "var(--color-text-muted)" }}>Placement</div>
                      <div style={{ fontWeight: 600, color: "var(--color-brand-forest)" }}>{meta.placement || "Indoor"}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--color-text-muted)" }}>Water Frequency</div>
                      <div style={{ fontWeight: 600, color: "var(--color-brand-forest)" }}>{meta.water || "Low Water"}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--color-text-muted)" }}>Sunlight</div>
                      <div style={{ fontWeight: 600, color: "var(--color-brand-forest)" }}>{meta.light || "Indirect"}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--color-text-muted)" }}>Difficulty</div>
                      <div style={{ fontWeight: 600, color: "var(--color-brand-forest)" }}>{meta.difficulty || "Beginner"}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--color-text-muted)" }}>Air Purifier</div>
                      <div style={{ fontWeight: 600, color: "var(--color-brand-forest)" }}>{meta.airPurifying ? "Yes (NASA)" : "Standard"}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--color-text-muted)" }}>Pet Friendly</div>
                      <div style={{ fontWeight: 600, color: "var(--color-brand-forest)" }}>{meta.petFriendly ? "Yes" : "Caution"}</div>
                    </div>
                  </>
                )}
                {product.category === "pots" && (
                  <>
                    <div>
                      <div style={{ color: "var(--color-text-muted)" }}>Material</div>
                      <div style={{ fontWeight: 600, color: "var(--color-brand-forest)" }}>{meta.material || "Ceramic"}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--color-text-muted)" }}>Diameter</div>
                      <div style={{ fontWeight: 600, color: "var(--color-brand-forest)" }}>{meta.size || "8 inch"}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--color-text-muted)" }}>Drainage Hole</div>
                      <div style={{ fontWeight: 600, color: "var(--color-brand-forest)" }}>{meta.drainage || "Included"}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--color-text-muted)" }}>Style</div>
                      <div style={{ fontWeight: 600, color: "var(--color-brand-forest)" }}>{meta.style || "Minimal"}</div>
                    </div>
                  </>
                )}
                {product.category === "seeds" && (
                  <>
                    <div>
                      <div style={{ color: "var(--color-text-muted)" }}>Type</div>
                      <div style={{ fontWeight: 600, color: "var(--color-brand-forest)" }}>{meta.type || "Organic"}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--color-text-muted)" }}>Germination</div>
                      <div style={{ fontWeight: 600, color: "var(--color-brand-forest)" }}>{meta.germination || "5-8 Days"}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--color-text-muted)" }}>Harvest Window</div>
                      <div style={{ fontWeight: 600, color: "var(--color-brand-forest)" }}>{meta.harvestTime || "4-5 Weeks"}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--color-text-muted)" }}>Difficulty</div>
                      <div style={{ fontWeight: 600, color: "var(--color-brand-forest)" }}>{meta.difficulty || "Easy"}</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Quantity & CTA Buttons */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
                marginBottom: "20px",
              }}
            >
              {/* Stepper */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-pill)",
                  backgroundColor: "#fff",
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    padding: "10px 16px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1.1rem",
                    color: "var(--color-brand-forest)",
                  }}
                  title="Decrease"
                >
                  −
                </button>
                <span
                  style={{
                    minWidth: "32px",
                    textAlign: "center",
                    fontWeight: 600,
                    fontSize: "var(--text-body-sm)",
                  }}
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    padding: "10px 16px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1.1rem",
                    color: "var(--color-brand-forest)",
                  }}
                  title="Increase"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                className="btn-primary"
                onClick={handleAddToCart}
                style={{ flex: "1 1 180px", padding: "14px 24px" }}
              >
                Add to Cart 🛒
              </button>

              {/* Buy Now */}
              <button
                type="button"
                className="btn-secondary"
                onClick={handleBuyNow}
                style={{ flex: "1 1 140px", padding: "14px 20px" }}
              >
                Buy Now
              </button>
            </div>

            {/* Nursery Transit Assurance Badge */}
            <div
              style={{
                padding: "12px 16px",
                backgroundColor: "var(--color-surface-soft)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border-light)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "0.8125rem",
                color: "var(--color-brand-forest)",
                marginBottom: "24px",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>
                <strong>Nursery Fresh Assurance:</strong> Transit-safe bio-packaging with healthy root guarantee. Free delivery above ₹799.
              </span>
            </div>

            {/* Flora AI Prompt Chip */}
            <div
              style={{
                padding: "14px 18px",
                background: "linear-gradient(135deg, #E8EFE5 0%, var(--color-cream-soft) 100%)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-brand-sage)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <div>
                <strong style={{ fontSize: "0.875rem", color: "var(--color-brand-forest)", display: "block" }}>
                  Need personalized advice for this {product.category.slice(0, -1)}?
                </strong>
                <span style={{ fontSize: "0.78125rem", color: "var(--color-text-secondary)" }}>
                  Flora AI can guide you on watering, pot pairing, and room placement.
                </span>
              </div>
              <button
                type="button"
                className="home-filter-chip active"
                onClick={openFloraAI}
                style={{ whiteSpace: "nowrap", flexShrink: 0 }}
              >
                Ask Flora 🍃
              </button>
            </div>
          </div>
        </div>

        {/* Care Guide Section */}
        {product.careGuide && (
          <section
            style={{
              backgroundColor: "var(--color-white)",
              padding: "var(--space-8)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border-light)",
              marginBottom: "var(--space-16)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "var(--space-6)" }}>
              <span style={{ fontSize: "1.5rem" }}>🌿</span>
              <h2 style={{ fontSize: "var(--text-heading-lg)", color: "var(--color-brand-forest)", margin: 0 }}>
                Care Guide for {product.name}
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "var(--space-6)",
              }}
            >
              <div style={{ padding: "16px", background: "var(--color-cream-soft)", borderRadius: "var(--radius-md)" }}>
                <strong style={{ display: "block", color: "var(--color-brand-forest)", marginBottom: "4px" }}>
                  💧 Watering
                </strong>
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>
                  {product.careGuide.watering}
                </p>
              </div>

              <div style={{ padding: "16px", background: "var(--color-cream-soft)", borderRadius: "var(--radius-md)" }}>
                <strong style={{ display: "block", color: "var(--color-brand-forest)", marginBottom: "4px" }}>
                  ☀️ Sunlight & Temperature
                </strong>
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>
                  {product.careGuide.sunlight}
                </p>
              </div>

              <div style={{ padding: "16px", background: "var(--color-cream-soft)", borderRadius: "var(--radius-md)" }}>
                <strong style={{ display: "block", color: "var(--color-brand-forest)", marginBottom: "4px" }}>
                  🏺 Repotting & Soil
                </strong>
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>
                  {product.careGuide.repotting}
                </p>
              </div>

              <div style={{ padding: "16px", background: "var(--color-cream-soft)", borderRadius: "var(--radius-md)" }}>
                <strong style={{ display: "block", color: "var(--color-brand-forest)", marginBottom: "4px" }}>
                  💡 Nursery Pro Tip
                </strong>
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>
                  {product.careGuide.proTip}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Related Products / Frequently Bought Together */}
        {relatedProducts.length > 0 && (
          <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "var(--space-6)" }}>
              <div>
                <h2 style={{ fontSize: "var(--text-heading-lg)", color: "var(--color-brand-forest)", marginBottom: "4px" }}>
                  Frequently Paired Together
                </h2>
                <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", margin: 0 }}>
                  Curated companions and artisan planters designed for this item.
                </p>
              </div>
              <Link
                href={`/${product.category}`}
                style={{ fontWeight: 600, color: "var(--color-brand-green)", fontSize: "0.875rem" }}
              >
                View all {product.category} →
              </Link>
            </div>

            <div className="product-grid">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
