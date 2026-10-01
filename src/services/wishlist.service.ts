/**
 * Flora Fusion — Wishlist Service Layer
 * Domain boundary per frontendprompt.md Section 26
 * Current: Client localStorage & Zustand
 * Future: Spring Boot /api/v1/wishlist REST API
 */

import { Product } from "@/types/product";
import { getProductById } from "@/data/catalog";

export const WishlistService = {
  /**
   * Resolve an array of wishlist product IDs to Product domain entities
   */
  async getWishlistProducts(ids: string[]): Promise<Product[]> {
    return ids
      .map((id) => getProductById(id))
      .filter((p): p is Product => p !== undefined);
  },
};
