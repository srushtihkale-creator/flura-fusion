/**
 * Flora Fusion — Wishlist Service Layer
 * Domain boundary per frontendprompt.md Section 26
 * Supports Spring Boot /api/v1/wishlist REST API with fallback
 */

import { Product } from "@/types/product";
import { getProductById } from "@/data/catalog";
import { apiFetch, IS_BACKEND_CONFIGURED } from "@/lib/api";
import { resolveProductId } from "./order.service";

export const WishlistService = {
  /**
   * Resolve an array of wishlist product IDs to Product domain entities
   */
  async getWishlistProducts(ids: string[]): Promise<Product[]> {
    return ids
      .map((id) => getProductById(id))
      .filter((p): p is Product => p !== undefined);
  },

  /**
   * Fetch authenticated customer's persisted wishlist from backend
   */
  async fetchUserWishlist(): Promise<string[]> {
    if (!IS_BACKEND_CONFIGURED) return [];
    try {
      const items = await apiFetch<any[]>("wishlist");
      if (Array.isArray(items)) {
        const setOfIds = new Set<string>();
        items.forEach((p) => {
          if (p.id) setOfIds.add(p.id);
          if (p.slug) setOfIds.add(p.slug);
        });
        return Array.from(setOfIds);
      }
      return [];
    } catch {
      return [];
    }
  },

  /**
   * Toggle product in authenticated customer's backend wishlist
   */
  async toggleWishlistBackend(productId: string): Promise<boolean | null> {
    if (!IS_BACKEND_CONFIGURED) return null;
    try {
      const resolvedId = resolveProductId(productId);
      const res = await apiFetch<{ productId: string; inWishlist: boolean }>(
        `wishlist/toggle/${resolvedId}`,
        { method: "POST" }
      );
      return res.inWishlist;
    } catch {
      return null;
    }
  },
};
