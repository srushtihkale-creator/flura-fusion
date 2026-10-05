"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Order } from "@/types/cart";
import { useFloraStore } from "@/store/useFloraStore";
import { OrderService } from "@/services/order.service";

interface OrderDetailViewProps {
  orderId: string;
}

export function OrderDetailView({ orderId }: OrderDetailViewProps) {
  const { orders, addOrder, addToast } = useFloraStore();
  const [mounted, setMounted] = useState(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);
  const [fetchedOrder, setFetchedOrder] = useState<Order | null>(null);

  useEffect(() => {
    setMounted(true);
    // Fetch directly from backend if not already in store
    const existing = orders.find((o) => o.orderId === orderId);
    if (!existing) {
      OrderService.getById(orderId).then((ord) => {
        if (ord) {
          setFetchedOrder(ord);
          addOrder(ord);
        }
      });
    }
  }, [orderId, orders, addOrder]);

  if (!mounted) {
    return (
      <div style={{ padding: "80px 0", textAlign: "center", color: "var(--color-text-muted)" }}>
        Loading tracking details...
      </div>
    );
  }

  const order = orders.find((o) => o.orderId === orderId) || fetchedOrder;

  const handleDownloadInvoice = async () => {
    if (!order) return;
    try {
      setDownloadingInvoice(true);
      await OrderService.downloadInvoice(order.orderId);
      addToast("Tax invoice downloaded successfully! 📄", "success");
    } catch (err: any) {
      addToast(err?.message || "Failed to download invoice.", "error");
    } finally {
      setDownloadingInvoice(false);
    }
  };

  if (!order) {
    return (
      <div className="container" style={{ padding: "80px 20px", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🔍</div>
        <h2 style={{ color: "var(--color-brand-forest)", marginBottom: "8px" }}>
          Order {orderId} Not Found
        </h2>
        <p style={{ color: "var(--color-text-secondary)", marginBottom: "24px" }}>
          We could not locate this order in your local session history.
        </p>
        <Link href="/account/orders" className="btn-primary">
          View All Orders →
        </Link>
      </div>
    );
  }

  return (
    <div className="order-detail-container" style={{ padding: "var(--space-8) 0 var(--space-16)" }}>
      <div className="container">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          style={{
            fontSize: "var(--text-caption)",
            color: "var(--color-text-muted)",
            marginBottom: "var(--space-6)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Link href="/" style={{ color: "var(--color-brand-forest)", textDecoration: "none" }}>
            Home
          </Link>
          <span>/</span>
          <Link href="/account" style={{ color: "var(--color-brand-forest)", textDecoration: "none" }}>
            Account
          </Link>
          <span>/</span>
          <Link href="/account/orders" style={{ color: "var(--color-brand-forest)", textDecoration: "none" }}>
            Orders
          </Link>
          <span>/</span>
          <span style={{ color: "var(--color-text-secondary)", fontWeight: 500 }}>
            {order.orderId}
          </span>
        </nav>

        {/* Order Header Card */}
        <div
          style={{
            background: "var(--color-white)",
            padding: "24px",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border-light)",
            boxShadow: "var(--shadow-sm)",
            marginBottom: "var(--space-8)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--color-brand-green)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Order Placed Successfully
            </span>
            <h1
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                color: "var(--color-brand-forest)",
                margin: "4px 0",
              }}
            >
              Order {order.orderId}
            </h1>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", margin: 0 }}>
              Placed on {order.date} • Estimated Delivery: <strong style={{ color: "var(--color-brand-green)" }}>{order.estimatedDelivery}</strong>
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <span
              style={{
                padding: "6px 14px",
                borderRadius: "var(--radius-pill)",
                backgroundColor: "var(--color-brand-sage-light)",
                color: "var(--color-brand-forest)",
                fontWeight: 600,
                fontSize: "0.8125rem",
              }}
            >
              Status: {order.status}
            </span>
            <span
              style={{
                padding: "6px 14px",
                borderRadius: "var(--radius-pill)",
                backgroundColor: "var(--color-surface-soft)",
                color: "var(--color-brand-forest)",
                fontWeight: 600,
                fontSize: "0.8125rem",
              }}
            >
              {order.deliveryMethod} Delivery
            </span>
            <button
              type="button"
              onClick={handleDownloadInvoice}
              disabled={downloadingInvoice}
              className="btn-secondary"
              style={{
                padding: "6px 14px",
                borderRadius: "var(--radius-pill)",
                fontSize: "0.8125rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                cursor: downloadingInvoice ? "not-allowed" : "pointer",
                border: "1px solid var(--color-brand-forest)",
                backgroundColor: "#FFFFFF",
                color: "var(--color-brand-forest)",
                fontWeight: 600,
              }}
              title="Download official PDF tax invoice"
            >
              <span>📄</span>
              <span>{downloadingInvoice ? "Generating PDF..." : "Tax Invoice (PDF)"}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Grid: Tracking & Details */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "var(--space-8)",
            alignItems: "start",
          }}
        >
          {/* Left Column: 6-Stage Timeline */}
          <div
            style={{
              background: "var(--color-white)",
              padding: "24px",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border-light)",
              boxShadow: "var(--shadow-xs)",
            }}
          >
            <h3 style={{ fontSize: "1.25rem", color: "var(--color-brand-forest)", marginBottom: "20px" }}>
              🚚 Nursery Transit Progress
            </h3>

            <div className="order-tracking-timeline">
              {order.trackingSteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`timeline-point ${step.completed ? "completed" : ""} ${
                    idx === 1 ? "active" : ""
                  }`}
                >
                  <div className="timeline-dot">{step.completed ? "✓" : idx + 1}</div>
                  <div className="timeline-title">{step.label}</div>
                  <div className="timeline-time">{step.time}</div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: "24px",
                padding: "16px",
                background: "var(--color-surface-soft)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border-light)",
              }}
            >
              <h4 style={{ fontSize: "0.875rem", color: "var(--color-brand-forest)", marginBottom: "4px" }}>
                🌿 Plant Transit Guarantee
              </h4>
              <p style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.5 }}>
                Your order is protected by our zero-damage plant guarantee. If any plant arrives damaged or unhealthy, we will issue a free instant nursery replacement.
              </p>
            </div>
          </div>

          {/* Right Column: Order Items & Delivery Summary */}
          <div>
            {/* Items Card */}
            <div
              style={{
                background: "var(--color-white)",
                padding: "24px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-border-light)",
                boxShadow: "var(--shadow-xs)",
                marginBottom: "var(--space-6)",
              }}
            >
              <h3 style={{ fontSize: "1.15rem", color: "var(--color-brand-forest)", marginBottom: "16px" }}>
                Items Ordered ({order.items.length})
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      paddingBottom: "12px",
                      borderBottom: "1px solid var(--color-border-light)",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "var(--radius-xs)",
                        objectFit: "cover",
                        backgroundColor: "var(--color-cream-soft)",
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link
                        href={`/product/${item.slug || item.id}`}
                        style={{
                          fontWeight: 600,
                          fontSize: "0.9375rem",
                          color: "var(--color-brand-forest)",
                          textDecoration: "none",
                          display: "block",
                        }}
                      >
                        {item.name}
                      </Link>
                      <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                        Qty: {item.quantity} × ₹{item.price}
                      </div>
                    </div>
                    <strong>₹{item.price * item.quantity}</strong>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div style={{ fontSize: "0.875rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ color: "var(--color-text-secondary)" }}>Subtotal</span>
                  <span>₹{order.subtotal}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ color: "var(--color-text-secondary)" }}>Shipping</span>
                  <span>{order.shipping === 0 ? "FREE" : `₹${order.shipping}`}</span>
                </div>
                {order.discount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", color: "var(--color-brand-green)" }}>
                    <span>Promotional Discount</span>
                    <span>-₹{order.discount}</span>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: "10px",
                    borderTop: "1px solid var(--color-border-light)",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "var(--color-brand-forest)",
                  }}
                >
                  <span>Total Paid</span>
                  <span>₹{order.total}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address & Payment Card */}
            <div
              style={{
                background: "var(--color-white)",
                padding: "20px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-border-light)",
                boxShadow: "var(--shadow-xs)",
              }}
            >
              <h4 style={{ fontSize: "0.9375rem", color: "var(--color-brand-forest)", marginBottom: "8px" }}>
                📍 Shipping Details
              </h4>
              <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", margin: "0 0 12px", lineHeight: 1.5 }}>
                <strong>{order.shippingAddress.fullName}</strong> ({order.shippingAddress.phone})<br />
                {order.shippingAddress.addressLine1}, {order.shippingAddress.city} - {order.shippingAddress.pincode}
              </p>

              <h4 style={{ fontSize: "0.9375rem", color: "var(--color-brand-forest)", marginBottom: "4px" }}>
                💳 Payment Method
              </h4>
              <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", margin: 0 }}>
                {order.paymentMethod} • Instant Confirmation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
