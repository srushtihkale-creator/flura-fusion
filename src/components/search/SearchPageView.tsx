"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Product, ProductCategory } from "@/types/product";
import { SearchService } from "@/services/search.service";
import { ProductCard } from "@/components/product/ProductCard";

export function SearchPageView() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get("q") || "";
  const initialCategory = (searchParams.get("category") as ProductCategory | "all") || "all";

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<ProductCategory | "all">(initialCategory);
  const [sortBy, setSortBy] = useState<"relevance" | "price-low" | "price-high" | "rating">("relevance");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const suggestions = useMemo(() => SearchService.getPopularSuggestions(), []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    SearchService.search({ query, category, sortBy }).then((res) => {
      if (isMounted) {
        setResults(res);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [query, category, sortBy]);

  const handleSuggestionClick = (keyword: string) => {
    setQuery(keyword);
    router.replace(`/search?q=${encodeURIComponent(keyword)}`);
  };

  return (
    <div className="search-page-container" style={{ padding: "var(--space-8) 0 var(--space-16)" }}>
      <div className="container">
        {/* Header Breadcrumb */}
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
            Search Catalog
          </span>
        </nav>

        {/* Search Input Box */}
        <div
          style={{
            background: "var(--color-white)",
            padding: "var(--space-8)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border-light)",
            boxShadow: "var(--shadow-sm)",
            marginBottom: "var(--space-8)",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
              color: "var(--color-brand-forest)",
              marginBottom: "8px",
            }}
          >
            Search Nursery Catalog
          </h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9375rem", marginBottom: "20px" }}>
            Find your favorite air purifiers, handcrafted pots, and heirloom seeds.
          </p>

          <div style={{ position: "relative", marginBottom: "16px" }}>
            <input
              type="text"
              placeholder="Search by plant name, light requirements, pot size, or seed type..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                router.replace(`/search?q=${encodeURIComponent(e.target.value)}`);
              }}
              style={{
                width: "100%",
                padding: "14px 44px 14px 46px",
                borderRadius: "var(--radius-pill)",
                border: "1.5px solid var(--color-brand-forest)",
                fontSize: "1rem",
                color: "var(--color-brand-deep)",
                outline: "none",
                backgroundColor: "var(--color-cream-soft)",
              }}
              autoFocus
            />
            <svg
              style={{
                position: "absolute",
                left: "18px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "20px",
                height: "20px",
                color: "var(--color-brand-green)",
              }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  router.replace("/search");
                }}
                style={{
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  fontSize: "1.1rem",
                  color: "var(--color-text-muted)",
                  cursor: "pointer",
                }}
                title="Clear query"
              >
                ✕
              </button>
            )}
          </div>

          {/* Popular Search Suggestions */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase" }}>
              Popular:
            </span>
            {suggestions.map((sug) => (
              <button
                key={sug}
                type="button"
                className="home-filter-chip"
                style={{ padding: "4px 12px", fontSize: "0.75rem" }}
                onClick={() => handleSuggestionClick(sug)}
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Filter & Sort Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "var(--space-6)",
            padding: "12px 16px",
            backgroundColor: "var(--color-white)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border-light)",
          }}
        >
          {/* Category Tabs */}
          <div className="home-filter-chips">
            <button
              type="button"
              className={`home-filter-chip ${category === "all" ? "active" : ""}`}
              onClick={() => setCategory("all")}
            >
              All Categories
            </button>
            <button
              type="button"
              className={`home-filter-chip ${category === "plants" ? "active" : ""}`}
              onClick={() => setCategory("plants")}
            >
              Plants (11)
            </button>
            <button
              type="button"
              className={`home-filter-chip ${category === "pots" ? "active" : ""}`}
              onClick={() => setCategory("pots")}
            >
              Pots (10)
            </button>
            <button
              type="button"
              className={`home-filter-chip ${category === "seeds" ? "active" : ""}`}
              onClick={() => setCategory("seeds")}
            >
              Seeds (10)
            </button>
          </div>

          {/* Sort Selector & Count */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ fontSize: "var(--text-caption)", color: "var(--color-text-muted)" }}>
              {results.length} {results.length === 1 ? "product" : "products"} found
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: "6px 12px",
                borderRadius: "var(--radius-pill)",
                border: "1px solid var(--color-border-light)",
                backgroundColor: "var(--color-cream-soft)",
                fontSize: "0.8125rem",
                color: "var(--color-brand-forest)",
                fontWeight: 500,
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="relevance">Sort: Best Match</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
            </select>
          </div>
        </div>

        {/* Results Grid or Empty State */}
        {loading ? (
          <div style={{ padding: "60px 0", textAlign: "center", color: "var(--color-text-muted)" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>🌱</div>
            Searching Flora Fusion catalog...
          </div>
        ) : results.length > 0 ? (
          <div className="product-grid">
            {results.map((product) => (
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
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🌿</div>
            <h3
              style={{
                fontSize: "var(--text-heading-md)",
                color: "var(--color-brand-forest)",
                marginBottom: "8px",
              }}
            >
              We couldn&apos;t find that plant yet.
            </h3>
            <p
              style={{
                color: "var(--color-text-secondary)",
                maxWidth: "460px",
                margin: "0 auto 24px",
                lineHeight: 1.6,
              }}
            >
              Try checking your spelling, using broader search terms, or explore our nursery bestsellers below.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                }}
              >
                Clear Search
              </button>
              <Link href="/plants" className="btn-secondary">
                Browse All Plants →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
