/**
 * Flora Fusion — Cart Service Layer
 * Domain boundary per frontendprompt.md Section 26
 * Current: Delegates to Zustand store & localStorage
 * Future: Spring Boot /api/v1/cart REST endpoint
 */

import { CartItem } from "@/types/cart";
import { Product } from "@/types/product";

export interface CartCalculation {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  freeShippingProgress: number; // 0 to 100
  freeShippingThreshold: number;
}

export const CartService = {
  FREE_SHIPPING_THRESHOLD: 799,
  STANDARD_SHIPPING_FEE: 79,

  /**
   * Calculate totals given cart items and coupon code
   */
  calculateTotals(items: CartItem[], couponCode: string | null): CartCalculation {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= this.FREE_SHIPPING_THRESHOLD || items.length === 0 ? 0 : this.STANDARD_SHIPPING_FEE;

    let discount = 0;
    if (couponCode === "FLORA10") {
      discount = Math.round(subtotal * 0.1);
    } else if (couponCode === "NATURE20") {
      discount = Math.round(subtotal * 0.2);
    } else if (couponCode === "WELCOME50") {
      discount = Math.min(50, subtotal);
    }

    const total = Math.max(0, subtotal + shipping - discount);
    const progress = Math.min(100, Math.round((subtotal / this.FREE_SHIPPING_THRESHOLD) * 100));

    return {
      subtotal,
      shipping,
      discount,
      total,
      freeShippingProgress: progress,
      freeShippingThreshold: this.FREE_SHIPPING_THRESHOLD,
    };
  },

  /**
   * Validate coupon code
   */
  validateCoupon(code: string, subtotal: number): { valid: boolean; message: string; discountRate: number } {
    const clean = code.trim().toUpperCase();
    if (clean === "FLORA10") {
      return { valid: true, message: "10% botanical discount applied!", discountRate: 0.1 };
    }
    if (clean === "NATURE20") {
      if (subtotal < 1000) {
        return { valid: false, message: "NATURE20 requires a minimum order of ₹1000.", discountRate: 0 };
      }
      return { valid: true, message: "20% festive green discount applied!", discountRate: 0.2 };
    }
    if (clean === "WELCOME50") {
      if (subtotal < 499) {
        return { valid: false, message: "WELCOME50 requires a minimum order of ₹499.", discountRate: 0 };
      }
      return { valid: true, message: "Flat ₹50 botanical welcome discount applied!", discountRate: 0 };
    }
    return { valid: false, message: "Invalid coupon code. Try FLORA10 or NATURE20.", discountRate: 0 };
  },

  /**
   * Fetch authenticated customer's persisted shopping cart from Spring Boot
   */
  async fetchUserCart(): Promise<CartItem[]> {
    if (typeof window === "undefined" || !localStorage.getItem("flora_token")) return [];
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
      const token = localStorage.getItem("flora_token");
      const res = await fetch(`${apiUrl.replace(/\/+$/, "")}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return [];
      const data = await res.json();
      if (!data?.items) return [];
      return data.items.map((it: any) => ({
        id: it.productId,
        slug: "",
        name: it.productName,
        price: Number(it.unitPrice),
        image: it.productImage || "/assets/products/plants/money-plant-1.jpg",
        category: "plants",
        quantity: it.quantity,
      }));
    } catch {
      return [];
    }
  },

  /**
   * Sync adding item to backend cart
   */
  async syncAddToCart(productId: string, quantity: number): Promise<void> {
    if (typeof window === "undefined" || !localStorage.getItem("flora_token")) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
      const token = localStorage.getItem("flora_token");
      await fetch(`${apiUrl.replace(/\/+$/, "")}/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });
    } catch {
      // Non-blocking background sync
    }
  },

  /**
   * Clear user's backend cart
   */
  async syncClearCart(): Promise<void> {
    if (typeof window === "undefined" || !localStorage.getItem("flora_token")) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
      const token = localStorage.getItem("flora_token");
      await fetch(`${apiUrl.replace(/\/+$/, "")}/cart`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Non-blocking
    }
  },
};
