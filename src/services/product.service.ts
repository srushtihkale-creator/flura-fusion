/**
 * Flora Fusion — Product Service Layer
 * Clean abstraction separating UI from data source (Mock now, Spring Boot API later)
 * per frontendprompt.md Section 5 & 26
 */

import { Product, ProductCategory } from "@/types/product";
import { FLORA_CATALOG, getAllProducts, getProductById, getProductBySlug } from "@/data/catalog";
import { apiFetch, IS_BACKEND_CONFIGURED } from "@/lib/api";

export const ProductService = {
  /**
   * Fetch all products across all categories
   */
  async getAll(): Promise<Product[]> {
    if (IS_BACKEND_CONFIGURED) {
      try {
        const response = await apiFetch<{ content: Product[] } | Product[]>("products?size=100");
        const list = Array.isArray(response) ? response : response?.content || [];
        if (list.length > 0) return list;
      } catch (err) {
        console.warn("API product fetch failed, falling back to local catalog:", err);
      }
    }
    return getAllProducts();
  },

  /**
   * Fetch products by category with optional subcategory filtering and sorting
   */
  async getByCategory(
    category: ProductCategory,
    filter: string = "all",
    sort: string = "featured"
  ): Promise<Product[]> {
    if (IS_BACKEND_CONFIGURED) {
      try {
        const response = await apiFetch<{ content: Product[] } | Product[]>(
          `products?category=${category}&sort=${sort}&size=100`
        );
        const apiList = Array.isArray(response) ? response : response?.content || [];
        if (apiList.length > 0) {
          const normalizedFilter = filter.toLowerCase().replace(/[\s-_]+/g, "");
          if (normalizedFilter !== "all" && normalizedFilter !== "") {
            return apiList.filter((item) => {
              const sub = (item.subCategory || "").toLowerCase().replace(/[\s-_]+/g, "");
              const name = item.name.toLowerCase().replace(/[\s-_]+/g, "");
              const tagline = item.tagline.toLowerCase().replace(/[\s-_]+/g, "");
              return sub.includes(normalizedFilter) || name.includes(normalizedFilter) || tagline.includes(normalizedFilter);
            });
          }
          return apiList;
        }
      } catch (err) {
        console.warn("API category fetch failed, falling back to local catalog:", err);
      }
    }

    const list = FLORA_CATALOG[category] || [];
    const normalizedFilter = filter.toLowerCase().replace(/[\s-_]+/g, "");

    let filtered = list;

    if (normalizedFilter !== "all" && normalizedFilter !== "") {
      filtered = list.filter((item) => {
        const sub = (item.subCategory || "").toLowerCase().replace(/[\s-_]+/g, "");
        const name = item.name.toLowerCase().replace(/[\s-_]+/g, "");
        const tagline = item.tagline.toLowerCase().replace(/[\s-_]+/g, "");
        const meta = (item.metadata || {}) as any;

        if (normalizedFilter === "airpurifying") {
          return meta.airPurifying === true || sub.includes("airpurifying");
        }
        if (normalizedFilter === "succulents" || normalizedFilter === "succulent") {
          return (
            sub.includes("succulent") ||
            name.includes("jade") ||
            name.includes("aloe") ||
            name.includes("zz")
          );
        }
        if (normalizedFilter === "flowering") {
          return sub.includes("flowering") || name.includes("lily") || name.includes("lavender") || name.includes("sunflower") || name.includes("marigold") || name.includes("wildflower");
        }
        if (normalizedFilter === "indoor") {
          return String(meta.placement || "").toLowerCase().includes("indoor") || sub.includes("indoor");
        }
        if (normalizedFilter === "outdoor") {
          return String(meta.placement || "").toLowerCase().includes("outdoor") || sub.includes("outdoor");
        }
        if (normalizedFilter === "lowlight" || normalizedFilter === "low" || normalizedFilter === "lowlightplants") {
          return (
            String(meta.light || "").toLowerCase().includes("low") ||
            name.includes("zz") ||
            name.includes("snake") ||
            name.includes("peace lily")
          );
        }
        if (normalizedFilter === "easycare" || normalizedFilter === "easy" || normalizedFilter === "easycareplants") {
          return (
            String(meta.difficulty || "").toLowerCase().includes("easy") ||
            String(meta.difficulty || "").toLowerCase().includes("indestructible") ||
            String(meta.difficulty || "").toLowerCase().includes("beginner") ||
            name.includes("money") ||
            name.includes("snake") ||
            name.includes("zz") ||
            name.includes("jade") ||
            name.includes("aloe")
          );
        }
        if (normalizedFilter === "large" || normalizedFilter === "largeplants") {
          return (
            String(meta.size || "").toLowerCase().includes("large") ||
            String(meta.size || "").toLowerCase().includes("tall") ||
            name.includes("monstera") ||
            name.includes("areca") ||
            name.includes("ficus") ||
            name.includes("rubber")
          );
        }

        if (sub.includes(normalizedFilter)) return true;
        if (name.includes(normalizedFilter)) return true;
        if (tagline.includes(normalizedFilter)) return true;

        if (meta && Object.values(meta).some((v) => String(v).toLowerCase().replace(/[\s-_]+/g, "").includes(normalizedFilter))) {
          return true;
        }

        return false;
      });
    }

    // Apply sorting
    const sorted = [...filtered];
    if (sort === "price-low") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      sorted.sort((a, b) => b.rating - a.rating);
    } else {
      // "featured" default: bestsellers first, then high rating
      sorted.sort((a, b) => {
        if (a.badge === "Bestseller" && b.badge !== "Bestseller") return -1;
        if (b.badge === "Bestseller" && a.badge !== "Bestseller") return 1;
        return b.rating - a.rating;
      });
    }

    return sorted;
  },

  /**
   * Fetch single product by slug
   */
  async getBySlug(slug: string): Promise<Product | null> {
    if (IS_BACKEND_CONFIGURED) {
      try {
        const product = await apiFetch<Product>(`products/${slug}`);
        if (product) return product;
      } catch (err) {
        console.warn("API slug fetch failed, falling back to local catalog:", err);
      }
    }
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

    if (IS_BACKEND_CONFIGURED) {
      try {
        const response = await apiFetch<{ content: Product[] } | Product[]>(`search?q=${encodeURIComponent(q)}&size=50`);
        const list = Array.isArray(response) ? response : response?.content || [];
        if (list.length > 0) return list;
      } catch (err) {
        console.warn("API search failed, falling back to local catalog search:", err);
      }
    }

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
