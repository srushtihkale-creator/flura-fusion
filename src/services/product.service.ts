/**
 * Flora Fusion — Product Service Layer
 * Clean abstraction separating UI from data source (Mock catalog fallback & Spring Boot REST API)
 * Follows strict architecture: UI -> Services -> API Client -> Spring Boot
 */

import { Product, ProductCategory, AdminProductPayload, AdminCategory } from "@/types/product";
import { FLORA_CATALOG, getAllProducts, getProductById, getProductBySlug } from "@/data/catalog";
import { apiFetch, IS_BACKEND_CONFIGURED } from "@/lib/api";

export interface AdminProductFilterParams {
  category?: string;
  status?: string;
  search?: string;
  sort?: string;
  page?: number;
  size?: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const ProductService = {
  /**
   * Fetch all products across all categories (Customer Storefront)
   */
  async getAll(): Promise<Product[]> {
    if (IS_BACKEND_CONFIGURED) {
      try {
        const response = await apiFetch<{ content: Product[] } | Product[]>("products?size=100");
        const list = Array.isArray(response) ? response : response?.content || [];
        return list;
      } catch (err) {
        console.warn("API product fetch failed, falling back to local catalog:", err);
      }
    }
    return getAllProducts();
  },

  /**
   * Fetch products by category with optional subcategory filtering and sorting (Customer Storefront)
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
        const normalizedFilter = filter.toLowerCase().replace(/[\s-_]+/g, "");
        if (normalizedFilter !== "all" && normalizedFilter !== "") {
          return apiList.filter((item) => {
            const sub = (item.subCategory || "").toLowerCase().replace(/[\s-_]+/g, "");
            const name = item.name.toLowerCase().replace(/[\s-_]+/g, "");
            const tagline = item.tagline?.toLowerCase().replace(/[\s-_]+/g, "") || "";
            return sub.includes(normalizedFilter) || name.includes(normalizedFilter) || tagline.includes(normalizedFilter);
          });
        }
        return apiList;
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
        const tagline = (item.tagline || "").toLowerCase().replace(/[\s-_]+/g, "");
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
   * Fetch single product by slug (Customer Storefront)
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
        (p.tagline && p.tagline.toLowerCase().includes(q)) ||
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

  // =========================================================================
  // ADMIN MANAGEMENT API METHODS (ROLE_ADMIN REQUIRED)
  // =========================================================================

  /**
   * Get paginated products for admin with filtering and search
   */
  async getAllAdmin(params: AdminProductFilterParams = {}): Promise<{ products: Product[]; totalElements: number; totalPages: number }> {
    const query = new URLSearchParams();
    if (params.category && params.category !== "all") query.set("category", params.category);
    if (params.status && params.status !== "all") query.set("status", params.status);
    if (params.search?.trim()) query.set("search", params.search.trim());
    if (params.sort) query.set("sort", params.sort);
    query.set("page", String(params.page ?? 0));
    query.set("size", String(params.size ?? 50));

    if (IS_BACKEND_CONFIGURED) {
      try {
        const response = await apiFetch<PaginatedResponse<Product> | Product[]>(`admin/products?${query.toString()}`);
        if (Array.isArray(response)) {
          return { products: response, totalElements: response.length, totalPages: 1 };
        }
        return {
          products: response.content || [],
          totalElements: response.totalElements || 0,
          totalPages: response.totalPages || 1,
        };
      } catch (err) {
        console.warn("API admin/products fetch failed, falling back to local catalog:", err);
      }
    }

    // Local fallback for offline / mock testing
    let list = getAllProducts();
    if (params.category && params.category !== "all") {
      list = list.filter((p) => p.category === params.category);
    }
    if (params.search?.trim()) {
      const q = params.search.toLowerCase().trim();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q)));
    }
    return { products: list, totalElements: list.length, totalPages: 1 };
  },

  /**
   * Get complete product details by ID for admin editor
   */
  async getAdminById(id: string): Promise<Product> {
    if (IS_BACKEND_CONFIGURED) {
      return apiFetch<Product>(`admin/products/${id}`);
    }
    const product = getProductById(id);
    if (!product) throw new Error(`Product not found with ID ${id}`);
    return product;
  },

  /**
   * Create a new product in the catalog
   */
  async createProduct(payload: AdminProductPayload): Promise<Product> {
    if (IS_BACKEND_CONFIGURED) {
      return apiFetch<Product>("admin/products", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }
    throw new Error("Backend connection is required to create catalog products.");
  },

  /**
   * Update an existing product
   */
  async updateProduct(id: string, payload: AdminProductPayload): Promise<Product> {
    if (IS_BACKEND_CONFIGURED) {
      return apiFetch<Product>(`admin/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    }
    throw new Error("Backend connection is required to update catalog products.");
  },

  /**
   * Archive a product safely (soft delete)
   */
  async archiveProduct(id: string): Promise<{ message: string; id: string; status: string }> {
    if (IS_BACKEND_CONFIGURED) {
      return apiFetch<{ message: string; id: string; status: string }>(`admin/products/${id}`, {
        method: "DELETE",
      });
    }
    return { message: "Product archived in local state", id, status: "ARCHIVED" };
  },

  /**
   * Change product status (ACTIVE, INACTIVE, ARCHIVED)
   */
  async updateProductStatus(id: string, status: "ACTIVE" | "INACTIVE" | "ARCHIVED"): Promise<Product> {
    if (IS_BACKEND_CONFIGURED) {
      return apiFetch<Product>(`admin/products/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    }
    throw new Error("Backend connection is required to change product status.");
  },

  /**
   * Quick update product stock quantity
   */
  async updateStock(id: string, stockQuantity: number): Promise<Product> {
    if (IS_BACKEND_CONFIGURED) {
      return apiFetch<Product>(`admin/products/${id}/stock`, {
        method: "PUT",
        body: JSON.stringify({ stockQuantity }),
      });
    }
    throw new Error("Backend connection is required to update inventory stock.");
  },

  /**
   * Quick update product selling price and original price
   */
  async updatePrice(id: string, price: number, originalPrice?: number): Promise<Product> {
    if (IS_BACKEND_CONFIGURED) {
      return apiFetch<Product>(`admin/products/${id}/price`, {
        method: "PUT",
        body: JSON.stringify({ price, originalPrice }),
      });
    }
    throw new Error("Backend connection is required to update product prices.");
  },

  /**
   * Update product gallery and primary images
   */
  async updateImages(id: string, primaryImage: string, galleryImages: string[]): Promise<Product> {
    if (IS_BACKEND_CONFIGURED) {
      return apiFetch<Product>(`admin/products/${id}/images`, {
        method: "PUT",
        body: JSON.stringify({ primaryImage, galleryImages }),
      });
    }
    throw new Error("Backend connection is required to update product images.");
  },

  /**
   * Update product 360 sequential turntable frames
   */
  async update360Images(id: string, images360: string[]): Promise<Product> {
    if (IS_BACKEND_CONFIGURED) {
      return apiFetch<Product>(`admin/products/${id}/360`, {
        method: "PUT",
        body: JSON.stringify({ images360 }),
      });
    }
    throw new Error("Backend connection is required to update 360 degree frames.");
  },

  /**
   * Get all categories for admin
   */
  async getCategoriesAdmin(): Promise<AdminCategory[]> {
    if (IS_BACKEND_CONFIGURED) {
      return apiFetch<AdminCategory[]>("admin/categories");
    }
    return [
      { id: "cat-1", name: "Plants", slug: "plants", displayOrder: 1, isActive: true },
      { id: "cat-2", name: "Pots & Planters", slug: "pots", displayOrder: 2, isActive: true },
      { id: "cat-3", name: "Seeds", slug: "seeds", displayOrder: 3, isActive: true },
    ];
  },

  /**
   * Toggle category active status
   */
  async toggleCategoryStatus(id: string, isActive: boolean): Promise<AdminCategory> {
    if (IS_BACKEND_CONFIGURED) {
      return apiFetch<AdminCategory>(`admin/categories/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isActive }),
      });
    }
    throw new Error("Backend connection is required to update category status.");
  },
};
