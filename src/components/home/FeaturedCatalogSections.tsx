"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Leaf, Box, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductService } from "@/services/product.service";
import { FLORA_CATALOG } from "@/data/catalog";
import { Product } from "@/types/product";

export function FeaturedCatalogSections() {
  const [plants, setPlants] = useState<Product[]>(FLORA_CATALOG.plants);
  const [pots, setPots] = useState<Product[]>(FLORA_CATALOG.pots);
  const [seeds, setSeeds] = useState<Product[]>(FLORA_CATALOG.seeds);

  const [activePlantFilter, setActivePlantFilter] = useState("all");
  const [activePotFilter, setActivePotFilter] = useState("all");
  const [activeSeedFilter, setActiveSeedFilter] = useState("all");

  useEffect(() => {
    async function loadData() {
      const p = await ProductService.getByCategory("plants", activePlantFilter);
      setPlants(p);
    }
    loadData();
  }, [activePlantFilter]);

  useEffect(() => {
    async function loadData() {
      const pt = await ProductService.getByCategory("pots", activePotFilter);
      setPots(pt);
    }
    loadData();
  }, [activePotFilter]);

  useEffect(() => {
    async function loadData() {
      const s = await ProductService.getByCategory("seeds", activeSeedFilter);
      setSeeds(s);
    }
    loadData();
  }, [activeSeedFilter]);

  const plantFilters = ["All", "Indoor", "Outdoor", "Flowering", "Air Purifying", "Succulents"];
  const potFilters = ["All", "Ceramic", "Terracotta", "Hanging", "Decorative", "Self-Watering"];
  const seedFilters = ["All", "Flower", "Vegetable", "Herb", "Fruit"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-16)" }}>
      {/* 1. PLANTS SECTION */}
      <section>
        <div className="container">
          <div className="section-header">
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "var(--radius-pill)",
                  backgroundColor: "var(--color-category-plants-soft)",
                  color: "var(--color-brand-forest)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Leaf size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: "var(--text-h2)", margin: 0 }}>Plants</h2>
                <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-text-secondary)", margin: 0 }}>
                  Green companions for a healthier, happier you.
                </p>
              </div>
            </div>

            {/* Filter Chips */}
            <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", alignItems: "center" }}>
              {plantFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActivePlantFilter(f.toLowerCase())}
                  className={`filter-chip ${activePlantFilter === f.toLowerCase() ? "active" : ""}`}
                >
                  {f}
                </button>
              ))}
              <Link
                href="/plants"
                style={{
                  fontSize: "var(--text-body-sm)",
                  fontWeight: 600,
                  color: "var(--color-brand-green)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  marginLeft: "var(--space-2)",
                }}
              >
                View all 11 plants <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Product Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "var(--space-6)",
            }}
          >
            {plants.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* 2. POTS SECTION */}
      <section>
        <div className="container">
          <div className="section-header">
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "var(--radius-pill)",
                  backgroundColor: "var(--color-category-pots-soft)",
                  color: "var(--color-category-pots)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: "var(--text-h2)", margin: 0 }}>Pots</h2>
                <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-text-secondary)", margin: 0 }}>
                  The perfect home for your plants.
                </p>
              </div>
            </div>

            {/* Filter Chips */}
            <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", alignItems: "center" }}>
              {potFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActivePotFilter(f.toLowerCase())}
                  className={`filter-chip ${activePotFilter === f.toLowerCase() ? "active" : ""}`}
                >
                  {f}
                </button>
              ))}
              <Link
                href="/pots"
                style={{
                  fontSize: "var(--text-body-sm)",
                  fontWeight: 600,
                  color: "var(--color-brand-green)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  marginLeft: "var(--space-2)",
                }}
              >
                View all 10 pots <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Product Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "var(--space-6)",
            }}
          >
            {pots.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. SEEDS SECTION */}
      <section>
        <div className="container">
          <div className="section-header">
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "var(--radius-pill)",
                  backgroundColor: "var(--color-category-seeds-soft)",
                  color: "var(--color-category-seeds)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sparkles size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: "var(--text-h2)", margin: 0 }}>Seeds</h2>
                <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-text-secondary)", margin: 0 }}>
                  Small seeds. Big green dreams.
                </p>
              </div>
            </div>

            {/* Filter Chips */}
            <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", alignItems: "center" }}>
              {seedFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveSeedFilter(f.toLowerCase())}
                  className={`filter-chip ${activeSeedFilter === f.toLowerCase() ? "active" : ""}`}
                >
                  {f}
                </button>
              ))}
              <Link
                href="/seeds"
                style={{
                  fontSize: "var(--text-body-sm)",
                  fontWeight: 600,
                  color: "var(--color-brand-green)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  marginLeft: "var(--space-2)",
                }}
              >
                View all 10 seeds <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Product Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "var(--space-6)",
            }}
          >
            {seeds.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
