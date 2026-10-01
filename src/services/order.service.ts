/**
 * Flora Fusion — Order Service Layer
 * Domain boundary per frontendprompt.md Section 26
 * Current: Client mock order engine with realistic tracking progression
 * Future: Spring Boot /api/v1/orders REST API
 */

import { CartItem, Order, OrderTrackingStep, ShippingAddress } from "@/types/cart";
import { CartService } from "./cart.service";

export interface CreateOrderParams {
  items: CartItem[];
  shippingAddress: ShippingAddress;
  deliveryMethod: "Standard" | "Express";
  paymentMethod: "UPI" | "Card" | "NetBanking" | "COD";
  couponCode: string | null;
}

export const OrderService = {
  /**
   * Create and format a new nursery order
   */
  createOrder(params: CreateOrderParams): Order {
    const { items, shippingAddress, deliveryMethod, paymentMethod, couponCode } = params;
    const totals = CartService.calculateTotals(items, couponCode);

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
      items: [...items],
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
};
