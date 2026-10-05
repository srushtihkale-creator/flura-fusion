/**
 * Flora Fusion — Coupon & Offers Service Layer
 * Domain boundary per frontendprompt.md Section 26 & technical.md
 * Communicates with Spring Boot /api/v1/coupons REST endpoint with authoritative fallback
 */

import { apiFetch, IS_BACKEND_CONFIGURED } from "@/lib/api";

export interface CouponResponse {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT" | "BUNDLE" | "FREE_SHIPPING";
  discountValue: number;
  minCartValue: number;
  maxDiscount?: number;
  title: string;
  description: string;
  terms: string;
  bannerText: string;
  autoApply: boolean;
  applicableCategory: string;
  applicableProductIds?: string;
  targetLink: string;
  bundleQty?: number;
  bundlePrice?: number;
  displayOrder: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

export interface AdminOfferPayload {
  code: string;
  title?: string;
  bannerText?: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT" | "BUNDLE" | "FREE_SHIPPING";
  discountValue: number;
  minCartValue?: number;
  maxDiscount?: number;
  bundleQty?: number;
  bundlePrice?: number;
  applicableCategory?: string;
  applicableProductIds?: string;
  targetLink?: string;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  isActive?: boolean;
  autoApply?: boolean;
  displayOrder?: number;
}

// Seed-matched fallback matching backend/sql/02_seed_data.sql & V3 migration
export const FALLBACK_ACTIVE_COUPONS: CouponResponse[] = [
  {
    id: "c1000000-0000-0000-0000-000000000004",
    code: "PLANTBUNDLE4",
    discountType: "BUNDLE",
    discountValue: 1199,
    minCartValue: 0,
    title: "Buy Any 4 Plants @ ₹1,199",
    bannerText: "🌿 BUY ANY 4 PLANTS @ ₹1,199",
    description: "Special Botanical Bundle: Any 4 plants at ₹1,199",
    terms: "Applicable on all live nursery plants",
    applicableCategory: "plants",
    targetLink: "/plants",
    bundleQty: 4,
    bundlePrice: 1199,
    displayOrder: 1,
    autoApply: true,
    startDate: new Date().toISOString(),
    isActive: true,
  },
  {
    id: "c1000000-0000-0000-0000-000000000001",
    code: "FLORA10",
    discountType: "PERCENTAGE",
    discountValue: 10,
    minCartValue: 1499,
    maxDiscount: 500,
    title: "10% OFF",
    bannerText: "🎉 GET 10% OFF ON ORDERS ABOVE ₹1,499",
    description: "10% off on orders above ₹1,499",
    terms: "Min. cart value ₹1,499 • Max discount ₹500",
    applicableCategory: "all",
    targetLink: "/plants",
    displayOrder: 2,
    autoApply: true,
    startDate: new Date().toISOString(),
    isActive: true,
  },
  {
    id: "c1000000-0000-0000-0000-000000000005",
    code: "FREESHIP499",
    discountType: "FREE_SHIPPING",
    discountValue: 79,
    minCartValue: 499,
    maxDiscount: 79,
    title: "Free Shipping",
    bannerText: "🚚 FREE SHIPPING ABOVE ₹499",
    description: "Free doorstep delivery across India on orders above ₹499",
    terms: "Min. cart value ₹499",
    applicableCategory: "all",
    targetLink: "/plants",
    displayOrder: 3,
    autoApply: true,
    startDate: new Date().toISOString(),
    isActive: true,
  },
  {
    id: "c1000000-0000-0000-0000-000000000002",
    code: "NATURE20",
    discountType: "PERCENTAGE",
    discountValue: 20,
    minCartValue: 1000,
    maxDiscount: 1000,
    title: "20% OFF",
    bannerText: "🌱 GET 20% OFF ON ORDERS ABOVE ₹1,000",
    description: "20% off on orders above ₹1,000",
    terms: "Min. cart value ₹1,000 • Max discount ₹1,000",
    applicableCategory: "all",
    targetLink: "/plants",
    displayOrder: 4,
    autoApply: false,
    startDate: new Date().toISOString(),
    isActive: true,
  },
  {
    id: "c1000000-0000-0000-0000-000000000003",
    code: "WELCOME50",
    discountType: "FIXED_AMOUNT",
    discountValue: 50,
    minCartValue: 499,
    maxDiscount: 50,
    title: "FLAT ₹50 OFF",
    bannerText: "✨ FLAT ₹50 OFF ON ORDERS ABOVE ₹499",
    description: "Flat ₹50 discount on your order",
    terms: "Min. cart value ₹499 • Welcome offer",
    applicableCategory: "all",
    targetLink: "/plants",
    displayOrder: 5,
    autoApply: false,
    startDate: new Date().toISOString(),
    isActive: true,
  },
];

export const CouponService = {
  /**
   * Fetch active offers and discount vouchers from backend/PostgreSQL database
   */
  async getActiveCoupons(): Promise<CouponResponse[]> {
    if (IS_BACKEND_CONFIGURED) {
      try {
        const coupons = await apiFetch<CouponResponse[]>("/coupons");
        if (coupons && coupons.length > 0) {
          return coupons;
        }
      } catch (err) {
        console.warn("Could not fetch coupons from backend, using active fallback:", err);
      }
    }

    return FALLBACK_ACTIVE_COUPONS;
  },

  /**
   * Admin: Get all offers including inactive / expired
   */
  async getAllOffersAdmin(): Promise<CouponResponse[]> {
    if (IS_BACKEND_CONFIGURED) {
      try {
        return await apiFetch<CouponResponse[]>("admin/offers");
      } catch (err) {
        console.error("Admin fetch offers error:", err);
        throw err;
      }
    }
    return FALLBACK_ACTIVE_COUPONS;
  },

  /**
   * Admin: Create a new offer
   */
  async createOfferAdmin(payload: AdminOfferPayload): Promise<CouponResponse> {
    return await apiFetch<CouponResponse>("admin/offers", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Admin: Update offer
   */
  async updateOfferAdmin(id: string, payload: AdminOfferPayload): Promise<CouponResponse> {
    return await apiFetch<CouponResponse>(`admin/offers/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Admin: Toggle active status
   */
  async toggleOfferAdmin(id: string, isActive: boolean): Promise<CouponResponse> {
    return await apiFetch<CouponResponse>(`admin/offers/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ isActive }),
    });
  },

  /**
   * Admin: Delete offer
   */
  async deleteOfferAdmin(id: string): Promise<void> {
    await apiFetch(`admin/offers/${id}`, {
      method: "DELETE",
    });
  },
};
