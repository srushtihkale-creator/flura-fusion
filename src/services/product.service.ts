/**
 * Flora Fusion — Product Service Layer
 * Clean abstraction separating UI from data source (Mock now, Spring Boot API later)
 * per frontendprompt.md Section 5 & 26
 */

import { Product, ProductCategory } from "@/types/product";
import { FLORA_CATALOG, getAllProducts, getProductById, getProductBySlug } from "@/data/catalog";

export const ProductService = {
  /**
   * Fetch all products across all categories
   */
  async getAll(): Promise<Product[]> {
    return getAllProducts();
  },

  /**
   * Fetch products by category with optional subcategory filtering
   */
  async getByCategory(category: ProductCategory, filter: string = "all"): Promise<Product[]> {
    const list = FLORA_CATALOG[category] || [];
    const normalizedFilter = filter.toLowerCase().trim();

    if (normalizedFilter === "all") {
      return list;
    }

    return list.filter((item) => {
      const sub = (item.subCategory || "").toLowerCase();
      if (sub.includes(normalizedFilter)) return true;
      if (item.metadata && Object.values(item.metadata).some((v) => String(v).toLowerCase().includes(normalizedFilter))) {
        return true;
      }
      return false;
    });
  },

  /**
   * Fetch single product by slug
   */
  async getBySlug(slug: string): Promise<Product | null> {
    return getProductBySlug(slug) || null;
  },

  /**
   * Fetch single product by ID
   */
  async getById(id: string): Promise<Product | null> {
    return getProductById(id) || null;
  },

  /**
   * Search catalog by keyword
   */
  async search(query: string): Promise<Product[]> {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    return getAllProducts().filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        (p.metadata && Object.values(p.metadata).some((v) => String(v).toLowerCase().includes(q)))
      );
    });
  },

  /**
   * Get bestseller / featured products for homepage
   */
  async getFeatured(): Promise<Product[]> {
    return getAllProducts().filter((p) => p.badge === "Bestseller" || p.rating >= 4.7);
  },

  /**
   * Get related products for cross-selling
   */
  async getRelated(product: Product, limit: number = 4): Promise<Product[]> {
    return getAllProducts()
      .filter((p) => p.id !== product.id && (p.category === product.category || p.category === "pots"))
      .slice(0, limit);
  },
};
