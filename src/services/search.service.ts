/**
 * Flora Fusion — Search Service Layer
 * Clean domain boundary per frontendprompt.md Section 26
 * Current: Client mock search with filters
 * Future: Spring Boot Elasticsearch / PostgreSQL pg_trgm REST API
 */

import { Product, ProductCategory } from "@/types/product";
import { getAllProducts } from "@/data/catalog";

export interface SearchFilters {
  query: string;
  category?: ProductCategory | "all";
  sortBy?: "relevance" | "price-low" | "price-high" | "rating";
}

export const SearchService = {
  /**
   * Search products with optional category filter and sorting
   */
  async search(filters: SearchFilters): Promise<Product[]> {
    const q = (filters.query || "").toLowerCase().trim();
    const category = filters.category || "all";
    const sortBy = filters.sortBy || "relevance";

    let results = getAllProducts();

    // 1. Text match
    if (q) {
      results = results.filter((p) => {
        const name = p.name.toLowerCase();
        const tagline = p.tagline.toLowerCase();
        const desc = p.description.toLowerCase();
        const cat = p.category.toLowerCase();
        const sub = (p.subCategory || "").toLowerCase();
        const metaValues = p.metadata
          ? Object.values(p.metadata).join(" ").toLowerCase()
          : "";

        return (
          name.includes(q) ||
          tagline.includes(q) ||
          desc.includes(q) ||
          cat.includes(q) ||
          sub.includes(q) ||
          metaValues.includes(q)
        );
      });
    }

    // 2. Category filter
    if (category !== "all") {
      results = results.filter((p) => p.category === category);
    }

    // 3. Sorting
    const sorted = [...results];
    if (sortBy === "price-low") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      sorted.sort((a, b) => b.rating - a.rating);
    } else {
      // Relevance / Bestseller priority
      sorted.sort((a, b) => {
        if (a.badge === "Bestseller" && b.badge !== "Bestseller") return -1;
        if (b.badge === "Bestseller" && a.badge !== "Bestseller") return 1;
        return b.rating - a.rating;
      });
    }

    return sorted;
  },

  /**
   * Popular search suggestions
   */
  getPopularSuggestions(): string[] {
    return [
      "Monstera",
      "Snake Plant",
      "Ceramic Pot",
      "Basil Seeds",
      "Peace Lily",
      "Air Purifying",
      "Low Light",
      "Terracotta",
    ];
  },
};
