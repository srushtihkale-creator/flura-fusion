/**
 * Flora Fusion — Order Service Layer
 * Domain boundary per frontendprompt.md Section 26
 * Supports Spring Boot /api/v1/orders REST API with local mock fallback
 */

import { CartItem, Order, OrderStatus, OrderTrackingStep, ShippingAddress } from "@/types/cart";
import { CartService } from "./cart.service";
import { getProductById } from "@/data/catalog";
import { apiFetch, IS_BACKEND_CONFIGURED } from "@/lib/api";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const PRODUCT_UUID_MAP: Record<string, string> = {
  "plant-1": "a1000001-0000-0000-0000-000000000001",
  "plant-2": "a1000001-0000-0000-0000-000000000002",
  "plant-3": "a1000001-0000-0000-0000-000000000003",
  "plant-4": "a1000001-0000-0000-0000-000000000004",
  "plant-5": "a1000001-0000-0000-0000-000000000005",
  "plant-6": "a1000001-0000-0000-0000-000000000006",
  "plant-7": "a1000001-0000-0000-0000-000000000007",
  "plant-8": "a1000001-0000-0000-0000-000000000008",
  "plant-9": "a1000001-0000-0000-0000-000000000009",
  "plant-10": "a1000001-0000-0000-0000-000000000010",
  "plant-11": "a1000001-0000-0000-0000-000000000011",

  "pot-1": "a2000001-0000-0000-0000-000000000001",
  "pot-2": "a2000001-0000-0000-0000-000000000002",
  "pot-3": "a2000001-0000-0000-0000-000000000003",
  "pot-4": "a2000001-0000-0000-0000-000000000004",
  "pot-5": "a2000001-0000-0000-0000-000000000005",
  "pot-6": "a2000001-0000-0000-0000-000000000006",
  "pot-7": "a2000001-0000-0000-0000-000000000007",
  "pot-8": "a2000001-0000-0000-0000-000000000008",
  "pot-9": "a2000001-0000-0000-0000-000000000009",
  "pot-10": "a2000001-0000-0000-0000-000000000010",

  "seed-1": "a3000001-0000-0000-0000-000000000001",
  "seed-2": "a3000001-0000-0000-0000-000000000002",
  "seed-3": "a3000001-0000-0000-0000-000000000003",
  "seed-4": "a3000001-0000-0000-0000-000000000004",
  "seed-5": "a3000001-0000-0000-0000-000000000005",
  "seed-6": "a3000001-0000-0000-0000-000000000006",
  "seed-7": "a3000001-0000-0000-0000-000000000007",
  "seed-8": "a3000001-0000-0000-0000-000000000008",
  "seed-9": "a3000001-0000-0000-0000-000000000009",
  "seed-10": "a3000001-0000-0000-0000-000000000010",
};

export function resolveProductId(id: string, slug?: string): string {
  if (UUID_REGEX.test(id)) return id;
  if (PRODUCT_UUID_MAP[id]) return PRODUCT_UUID_MAP[id];
  if (slug && PRODUCT_UUID_MAP[slug]) return PRODUCT_UUID_MAP[slug];
  return id;
}

export interface CreateOrderParams {
  items: CartItem[];
  shippingAddress: ShippingAddress;
  deliveryMethod: "Standard" | "Express";
  paymentMethod: "UPI" | "Card" | "NetBanking" | "COD" | string;
  couponCode: string | null;
  guestEmail?: string | null;
  paymentReference?: string | null;
}

export const OrderService = {
  /**
   * Create and format a new nursery order with authoritative stock & price validation
   */
  async createOrder(params: CreateOrderParams): Promise<Order> {
    if (IS_BACKEND_CONFIGURED) {
      const payload = {
        items: params.items.map((item) => ({
          productId: resolveProductId(item.id, item.slug),
          quantity: item.quantity,
        })),
        shippingAddress: {
          name: params.shippingAddress.fullName,
          phone: params.shippingAddress.phone,
          address: params.shippingAddress.addressLine2
            ? `${params.shippingAddress.addressLine1}, ${params.shippingAddress.addressLine2}`
            : params.shippingAddress.addressLine1,
          city: params.shippingAddress.city,
          state: params.shippingAddress.state,
          pincode: params.shippingAddress.pincode,
        },
        paymentMethod: params.paymentMethod,
        couponCode: params.couponCode || null,
        guestEmail: params.guestEmail || null,
        paymentReference: params.paymentReference || null,
      };

      const backendRes = await apiFetch<any>("orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const orderNumber = backendRes.orderNumber || backendRes.orderId;
      const orderId = orderNumber.startsWith("FF-") ? orderNumber : `FF-${orderNumber}`;

      return {
        orderId,
        date: backendRes.date,
        timestamp: Date.now(),
        items: backendRes.items?.map((it: any) => ({
          id: it.id,
          slug: "",
          name: it.name,
          price: Number(it.price),
          image: it.image || "/assets/products/plants/money-plant-1.jpg",
          category: it.category || "plants",
          quantity: it.quantity,
        })) || params.items,
        subtotal: Number(backendRes.subtotal),
        shipping: Number(backendRes.shipping),
        discount: Number(backendRes.discount),
        total: Number(backendRes.total),
        shippingAddress: params.shippingAddress,
        deliveryMethod: params.deliveryMethod,
        paymentMethod: params.paymentMethod,
        status: (backendRes.orderStatus as OrderStatus) || "Confirmed",
        estimatedDelivery: backendRes.estimatedDelivery || "Within 3-5 Business Days",
        trackingSteps: backendRes.trackingSteps?.map((s: any) => ({
          label: s.label,
          time: s.time,
          completed: s.completed,
        })) || [],
      };
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

    const newOrder: Order = {
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

    if (typeof window !== "undefined") {
      const storedUser = JSON.parse(localStorage.getItem("flora_user") || "{}");
      const customerEmail = params.guestEmail || storedUser.email;
      if (customerEmail) {
        fetch("/api/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "order",
            to: customerEmail,
            name: shippingAddress.fullName,
            order: newOrder,
          }),
        }).catch((err) => console.warn("[OrderService] Could not send confirmation email:", err));
      }
    }

    return newOrder;
  },

  /**
   * Fetch single order by ID (with Spring Boot endpoint fallback)
   */
  async getById(orderId: string): Promise<Order | null> {
    if (IS_BACKEND_CONFIGURED) {
      try {
        const backendRes = await apiFetch<any>(`orders/${orderId}`);
        if (backendRes) {
          return {
            orderId: backendRes.orderNumber || backendRes.orderId,
            date: backendRes.date,
            timestamp: Date.now(),
            items: backendRes.items?.map((it: any) => ({
              id: it.id,
              slug: "",
              name: it.name,
              price: Number(it.price),
              image: it.image || "/assets/products/plants/money-plant-1.jpg",
              category: it.category || "plants",
              quantity: it.quantity,
            })) || [],
            subtotal: Number(backendRes.subtotal),
            shipping: Number(backendRes.shipping),
            discount: Number(backendRes.discount),
            total: Number(backendRes.total),
            shippingAddress: {
              fullName: backendRes.address?.name || "",
              phone: backendRes.address?.phone || "",
              addressLine1: backendRes.address?.address || "",
              city: backendRes.address?.city || "",
              state: backendRes.address?.state || "",
              pincode: backendRes.address?.pincode || "",
            },
            deliveryMethod: "Standard",
            paymentMethod: (backendRes.paymentMethod as any) || "UPI",
            status: (backendRes.orderStatus as OrderStatus) || "Confirmed",
            estimatedDelivery: backendRes.estimatedDelivery || "Within 3-5 Business Days",
            trackingSteps: backendRes.trackingSteps || [],
          };
        }
      } catch {
        return null;
      }
    }
    return null;
  },

  /**
   * Fetch authenticated customer's own order history from backend (Privacy Protected)
   */
  async getMyOrders(): Promise<Order[]> {
    if (!IS_BACKEND_CONFIGURED) return [];
    try {
      const pageRes = await apiFetch<any>("orders/my-orders?page=0&size=50");
      const list = pageRes?.content || (Array.isArray(pageRes) ? pageRes : []);
      return list.map((backendRes: any) => ({
        orderId: backendRes.orderNumber || backendRes.orderId,
        date: backendRes.date,
        timestamp: Date.now(),
        items: backendRes.items?.map((it: any) => ({
          id: it.id,
          slug: "",
          name: it.name,
          price: Number(it.price),
          image: it.image || "/assets/products/plants/money-plant-1.jpg",
          category: it.category || "plants",
          quantity: it.quantity,
        })) || [],
        subtotal: Number(backendRes.subtotal),
        shipping: Number(backendRes.shipping),
        discount: Number(backendRes.discount),
        total: Number(backendRes.total),
        shippingAddress: {
          fullName: backendRes.address?.name || "",
          phone: backendRes.address?.phone || "",
          addressLine1: backendRes.address?.address || "",
          city: backendRes.address?.city || "",
          state: backendRes.address?.state || "",
          pincode: backendRes.address?.pincode || "",
        },
        deliveryMethod: "Standard",
        paymentMethod: (backendRes.paymentMethod as any) || "UPI",
        status: (backendRes.orderStatus as OrderStatus) || "Confirmed",
        estimatedDelivery: backendRes.estimatedDelivery || "Within 3-5 Business Days",
        trackingSteps: backendRes.trackingSteps || [],
      }));
    } catch {
      return [];
    }
  },

  /**
   * Admin: Update customer order fulfillment & tracking status
   */
  async updateOrderStatus(orderIdOrNumber: string, status: string): Promise<any> {
    if (!IS_BACKEND_CONFIGURED) return null;
    return apiFetch<any>(`admin/orders/${encodeURIComponent(orderIdOrNumber)}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  /**
   * Download official Flora Fusion Tax Invoice PDF (Privacy Protected by Backend)
   */
  async downloadInvoice(orderNumber: string): Promise<void> {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("flora_token");
    const cleanNum = orderNumber.trim();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
    const url = `${apiUrl.replace(/\/+$/, "")}/orders/${encodeURIComponent(cleanNum)}/invoice`;

    const response = await fetch(url, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message || "Failed to download tax invoice. Access denied or order not found.");
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `invoice-${orderNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },
};
