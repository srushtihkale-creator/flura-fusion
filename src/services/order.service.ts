/**
 * Flora Fusion — Order Service Layer
 * Domain boundary per frontendprompt.md Section 26
 * Current: Client mock order engine with realistic tracking progression & authoritative validation
 * Future: Spring Boot /api/v1/orders REST API
 */

import { CartItem, Order, OrderTrackingStep, ShippingAddress } from "@/types/cart";
import { CartService } from "./cart.service";
import { getProductById } from "@/data/catalog";
import { apiFetch, IS_BACKEND_CONFIGURED } from "@/lib/api";

export interface CreateOrderParams {
  items: CartItem[];
  shippingAddress: ShippingAddress;
  deliveryMethod: "Standard" | "Express";
  paymentMethod: "UPI" | "Card" | "NetBanking" | "COD";
  couponCode: string | null;
}

export const OrderService = {
  /**
   * Create and format a new nursery order with authoritative stock & price validation
   */
  async createOrder(params: CreateOrderParams): Promise<Order> {
    if (IS_BACKEND_CONFIGURED) {
      return apiFetch<Order>("orders", {
        method: "POST",
        body: JSON.stringify(params),
      });
    }

    const { items, shippingAddress, deliveryMethod, paymentMethod, couponCode } = params;

    // 1. Authoritative Stock Verification
    for (const item of items) {
      const catalogProduct = getProductById(item.id);
      if (catalogProduct && !catalogProduct.inStock) {
        throw new Error(`"${item.name}" is currently out of stock.`);
      }
    }

    // 2. Authoritative Price Resolution
    const authoritativeItems = items.map((item) => {
      const catalogProduct = getProductById(item.id);
      return {
        ...item,
        price: catalogProduct ? catalogProduct.price : item.price,
      };
    });

    // 3. Authoritative Order Calculations
    const totals = CartService.calculateTotals(authoritativeItems, couponCode);

    // If express delivery is chosen, add ₹99
    const deliveryFee = deliveryMethod === "Express" ? 99 : totals.shipping;
    const finalTotal = totals.subtotal + deliveryFee - totals.discount;

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `FF-${randomNum}`;

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const deliveryDate = new Date(now.getTime() + (deliveryMethod === "Express" ? 2 : 4) * 86400000);
    const estimatedDelivery = deliveryDate.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

    const trackingSteps: OrderTrackingStep[] = [
      {
        label: "Order Placed & Verified",
        time: "Just now",
        completed: true,
      },
      {
        label: "Confirmed by Partner Nursery",
        time: "Roots & foliage inspected",
        completed: true,
      },
      {
        label: "Eco Transit Packaging",
        time: "Scheduled next morning",
        completed: false,
      },
      {
        label: "Dispatched via Express Flora",
        time: deliveryMethod === "Express" ? "In 12 hours" : "In 24-36 hours",
        completed: false,
      },
      {
        label: "Out for Delivery",
        time: `Estimated ${estimatedDelivery}`,
        completed: false,
      },
      {
        label: "Delivered to Doorstep",
        time: "Hand-delivered with botanical care card",
        completed: false,
      },
    ];

    return {
      orderId,
      date: formattedDate,
      timestamp: now.getTime(),
      items: authoritativeItems,
      subtotal: totals.subtotal,
      shipping: deliveryFee,
      discount: totals.discount,
      total: finalTotal,
      shippingAddress,
      deliveryMethod,
      paymentMethod,
      status: "Confirmed",
      estimatedDelivery,
      trackingSteps,
    };
  },

  /**
   * Fetch single order by ID (with future Spring Boot endpoint fallback)
   */
  async getById(orderId: string): Promise<Order | null> {
    if (IS_BACKEND_CONFIGURED) {
      try {
        return await apiFetch<Order>(`orders/${orderId}`);
      } catch {
        return null;
      }
    }
    return null;
  },
};
