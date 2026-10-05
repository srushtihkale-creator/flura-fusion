/**
 * Flora Fusion — Cart & State Interfaces
 * Strict TypeScript Models as defined in frontendprompt.md Section 8 & technical.md
 */

import { Product } from "./product";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  quantity: number;
  selectedOption?: string;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  discountAmount?: number;
  discountType?: "PERCENTAGE" | "FIXED_AMOUNT" | "BUNDLE" | "FREE_SHIPPING";
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
  terms?: string;
  title?: string;
  targetCategory?: string;
  targetLink?: string;
  bannerText?: string;
  autoApply?: boolean;
  bundleQty?: number;
  bundlePrice?: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderTrackingStep {
  label: string;
  time: string;
  completed: boolean;
}

export type OrderStatus = "Placed" | "Confirmed" | "Packed" | "Dispatched" | "Out for Delivery" | "Delivered";

export interface Order {
  orderId: string; // e.g. "FF-482910"
  date: string;
  timestamp: number;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: ShippingAddress;
  deliveryMethod: "Standard" | "Express";
  paymentMethod: "UPI" | "Card" | "NetBanking" | "COD" | string;
  status: OrderStatus;
  estimatedDelivery: string;
  trackingSteps: OrderTrackingStep[];
}
