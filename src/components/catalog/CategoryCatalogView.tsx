"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Product, ProductCategory } from "@/types/product";
import { ProductService } from "@/services/product.service";
import { ProductCard } from "@/components/product/ProductCard";

interface CategoryCatalogViewProps {
  category: ProductCategory;
  initialProducts: Product[];
  initialFilter?: string;
  initialSearch?: string;
}

const CATEGORY_CONFIG: Record<
  ProductCategory,
  {
    title: string;
    description: string;
    bannerImg: string;
    filters: { label: string; value: string }[];
  }
> = {
  plants: {
    title: "Plants",
    description: "Indoor, outdoor, flowering, succulents & air-purifying botanical companions.",
    bannerImg: "/assets/banners/promo_plants.png",
    filters: [
      { label: "All", value: "all" },
      { label: "Indoor", value: "indoor" },
      { label: "Low Light", value: "low-light" },
      { label: "Flowering", value: "flowering" },
      { label: "Air Purifying", value: "air-purifying" },
      { label: "Easy Care", value: "easy-care" },
      { label: "Large", value: "large" },
      { label: "Outdoor", value: "outdoor" },
      { label: "Succulents", value: "succulents" },
    ],
  },
  pots: {
    title: "Pots & Planters",
    description: "Artisan ceramic, breathable terracotta, hanging, and self-watering planters.",
    bannerImg: "/assets/banners/promo_pots.png",
    filters: [
      { label: "All", value: "all" },
      { label: "Ceramic", value: "ceramic" },
      { label: "Terracotta", value: "terracotta" },
      { label: "Hanging", value: "hanging" },
      { label: "Decorative", value: "decorative" },
      { label: "Self-Watering", value: "self-watering" },
    ],
  },
  seeds: {
    title: "Seeds",
    description: "Grow your own organic dreams, edible garden greens, and kitchen herbs from scratch.",
    bannerImg: "/assets/banners/promo_seeds.png",
    filters: [
      { label: "All", value: "all" },
      { label: "Flower", value: "flower" },
      { label: "Vegetable", value: "vegetable" },
      { label: "Herb", value: "herb" },
      { label: "Fruit", value: "fruit" },
    ],
  },
};

export function CategoryCatalogView({
  category,
  initialProducts,
  initialFilter = "all",
  initialSearch = "",
}: CategoryCatalogViewProps) {
  const config = CATEGORY_CONFIG[category];
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialFilter) {
      setActiveFilter(initialFilter);
    }
  }, [initialFilter]);

  useEffect(() => {
    if (initialSearch !== undefined) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    ProductService.getByCategory(category, activeFilter, sortBy).then((res) => {
      if (isMounted) {
        setProducts(res);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [category, activeFilter, sortBy]);

  // Client-side text filter on top of category filters
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  return (
    <div className="catalog-page-container" style={{ padding: "var(--space-8) 0 var(--space-16)" }}>
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
            {config.title}
          </span>
        </nav>

        {/* Category Hero Banner */}
        <div
          className={`promo-card promo-card-${category}`}
          style={{
            minHeight: "200px",
            marginBottom: "var(--space-8)",
            cursor: "default",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="promo-card-content" style={{ maxWidth: "70%" }}>
            <span
              style={{
                display: "inline-block",
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "6px",
                opacity: 0.85,
              }}
            >
              Curated Catalog
            </span>
            <h1 className="promo-category-name" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", marginBottom: "8px" }}>
              {config.title}
            </h1>
            <p className="promo-desc" style={{ fontSize: "1rem", lineHeight: 1.5, maxWidth: "540px" }}>
              {config.description}
            </p>
          </div>
          <img src={config.bannerImg} alt={config.title} className="promo-bg-img" />
        </div>

        {/* Controls Bar: Filter Chips, Search & Sort */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
            marginBottom: "var(--space-8)",
            background: "var(--color-white)",
            padding: "var(--space-4) var(--space-6)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border-light)",
            boxShadow: "var(--shadow-xs)",
          }}
        >
          {/* Filter Chips Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div className="home-filter-chips">
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  color: "var(--color-text-muted)",
                  marginRight: "4px",
                }}
              >
                Filters:
              </span>
              {config.filters.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  className={`home-filter-chip ${activeFilter === f.value ? "active" : ""}`}
                  onClick={() => setActiveFilter(f.value)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Total Results Count */}
            <div
              style={{
                fontSize: "var(--text-caption)",
                color: "var(--color-text-muted)",
                fontWeight: 500,
              }}
            >
              Showing {filteredProducts.length} items
            </div>
          </div>

          {/* Search Within Category & Sort Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
              paddingTop: "12px",
              borderTop: "1px solid var(--color-border-light)",
            }}
          >
            {/* Search Input */}
            <div style={{ position: "relative", minWidth: "240px", flex: "1 1 240px", maxWidth: "400px" }}>
              <input
                type="text"
                placeholder={`Search within ${config.title}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 14px 8px 36px",
                  borderRadius: "var(--radius-pill)",
                  border: "1px solid var(--color-border-light)",
                  backgroundColor: "var(--color-cream-soft)",
                  fontSize: "var(--text-body-sm)",
                  color: "var(--color-brand-deep)",
                  outline: "none",
                }}
              />
              <svg
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "16px",
                  height: "16px",
                  color: "var(--color-text-muted)",
                }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--color-text-muted)",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                  }}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <label
                htmlFor="catalog-sort"
                style={{
                  fontSize: "var(--text-caption)",
                  fontWeight: 600,
                  color: "var(--color-text-secondary)",
                }}
              >
                Sort By:
              </label>
              <select
                id="catalog-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "var(--radius-pill)",
                  border: "1px solid var(--color-border-light)",
                  backgroundColor: "var(--color-white)",
                  fontSize: "var(--text-body-sm)",
                  color: "var(--color-brand-forest)",
                  fontWeight: 500,
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="featured">Featured / Bestseller</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid or Empty State */}
        {loading ? (
          <div style={{ padding: "60px 0", textAlign: "center", color: "var(--color-text-muted)" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>🌱</div>
            Refreshing catalog...
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
              background: "var(--color-white)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border-light)",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🍃</div>
            <h3 style={{ fontSize: "var(--text-heading-md)", color: "var(--color-brand-forest)", marginBottom: "8px" }}>
              No products found for this selection
            </h3>
            <p style={{ color: "var(--color-text-secondary)", maxWidth: "400px", margin: "0 auto 20px" }}>
              Try adjusting your filter chips or search keywords to explore more of our nursery collection.
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setActiveFilter("all");
                setSearchQuery("");
                setSortBy("featured");
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
