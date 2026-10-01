"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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

  const plantFilterOptions = [
    { label: "All", value: "all" },
    { label: "Indoor", value: "indoor" },
    { label: "Outdoor", value: "outdoor" },
    { label: "Flowering", value: "flowering" },
    { label: "Air Purifying", value: "air-purifying" },
    { label: "Succulents", value: "succulents" },
  ];

  const potFilterOptions = [
    { label: "All", value: "all" },
    { label: "Ceramic", value: "ceramic" },
    { label: "Terracotta", value: "terracotta" },
    { label: "Hanging", value: "hanging" },
    { label: "Decorative", value: "decorative" },
    { label: "Self-Watering", value: "self-watering" },
  ];

  const seedFilterOptions = [
    { label: "All", value: "all" },
    { label: "Flower", value: "flower" },
    { label: "Vegetable", value: "vegetable" },
    { label: "Herb", value: "herb" },
    { label: "Fruit", value: "fruit" },
  ];

  return (
    <>
      {/* 4. PLANTS CATALOG */}
      <section className="container" style={{ marginTop: "var(--space-8)" }}>
        <div className="home-section-header">
          <div className="home-section-title-wrap">
            <div className="category-icon-badge">
              <svg viewBox="0 0 24 24">
                <path d="M12 2L8 9h8l-4-7z" />
                <path d="M12 9l-5 8h10l-5-8z" />
                <path d="M12 17v5" />
              </svg>
            </div>
            <div>
              <h2>Plants</h2>
              <p className="section-tagline">Green companions for a healthier, happier you.</p>
            </div>
          </div>

          <div className="home-filter-chips" data-category="plants">
            {plantFilterOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`home-filter-chip ${activePlantFilter === opt.value ? "active" : ""}`}
                onClick={() => setActivePlantFilter(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <Link href="/plants" className="nav-link" style={{ fontWeight: 600, color: "var(--color-brand-green)" }}>
            View all 11 plants →
          </Link>
        </div>

        <div id="home-plants-grid" className="product-grid">
          {plants.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 5. POTS CATALOG */}
      <section className="container" style={{ marginTop: "var(--space-8)" }}>
        <div className="home-section-header">
          <div className="home-section-title-wrap">
            <div className="category-icon-badge">
              <svg viewBox="0 0 24 24">
                <path d="M6 3h12l2 7-3 11H7L4 10l2-7z" />
                <path d="M4 10h16" />
              </svg>
            </div>
            <div>
              <h2>Pots</h2>
              <p className="section-tagline">The perfect home for your plants.</p>
            </div>
          </div>

          <div className="home-filter-chips" data-category="pots">
            {potFilterOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`home-filter-chip ${activePotFilter === opt.value ? "active" : ""}`}
                onClick={() => setActivePotFilter(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <Link href="/pots" className="nav-link" style={{ fontWeight: 600, color: "var(--color-brand-green)" }}>
            View all 10 pots →
          </Link>
        </div>

        <div id="home-pots-grid" className="product-grid">
          {pots.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 6. SEEDS CATALOG */}
      <section className="container" style={{ marginTop: "var(--space-8)" }}>
        <div className="home-section-header">
          <div className="home-section-title-wrap">
            <div className="category-icon-badge">
              <svg viewBox="0 0 24 24">
                <path d="M12 2C8 2 4 6 4 11c0 6 8 11 8 11s8-5 8-11c0-5-4-9-8-9z" />
                <path d="M12 7v5" />
              </svg>
            </div>
            <div>
              <h2>Seeds</h2>
              <p className="section-tagline">Small seeds. Big green dreams.</p>
            </div>
          </div>

          <div className="home-filter-chips" data-category="seeds">
            {seedFilterOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`home-filter-chip ${activeSeedFilter === opt.value ? "active" : ""}`}
                onClick={() => setActiveSeedFilter(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <Link href="/seeds" className="nav-link" style={{ fontWeight: 600, color: "var(--color-brand-green)" }}>
            View all 10 seeds →
          </Link>
        </div>

        <div id="home-seeds-grid" className="product-grid">
          {seeds.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>
    </>
  );
}
