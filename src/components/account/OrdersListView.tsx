"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useFloraStore } from "@/store/useFloraStore";
import { OrderService } from "@/services/order.service";

export function OrdersListView() {
  const { orders, isAuthenticated, loadOrders, addToast } = useFloraStore();
  const [mounted, setMounted] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated, loadOrders]);

  const handleDownloadInvoice = async (orderId: string) => {
    try {
      setDownloadingId(orderId);
      await OrderService.downloadInvoice(orderId);
      addToast(`Tax invoice for ${orderId} downloaded! 📄`, "success");
    } catch (err: any) {
      addToast(err?.message || "Failed to download invoice.", "error");
    } finally {
      setDownloadingId(null);
    }
  };

  if (!mounted) {
    return (
      <div style={{ padding: "80px 0", textAlign: "center", color: "var(--color-text-muted)" }}>
        Loading order history...
      </div>
    );
  }

  return (
    <div className="orders-list-page" style={{ padding: "var(--space-8) 0 var(--space-16)" }}>
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
          <span style={{ color: "var(--color-text-secondary)", fontWeight: 500 }}>
            Orders
          </span>
        </nav>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "var(--space-8)" }}>
          <div>
            <h1
              style={{
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                color: "var(--color-brand-forest)",
                marginBottom: "6px",
              }}
            >
              Your Order History
            </h1>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9375rem", margin: 0 }}>
              Track live plant shipments and view past botanical nursery orders.
            </p>
          </div>
          <span style={{ fontSize: "var(--text-caption)", color: "var(--color-text-muted)", fontWeight: 500 }}>
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </span>
        </div>

        {orders.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {orders.map((order) => (
              <div
                key={order.orderId}
                style={{
                  background: "var(--color-white)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--color-border-light)",
                  boxShadow: "var(--shadow-xs)",
                  padding: "20px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                    <strong style={{ fontSize: "1.1rem", color: "var(--color-brand-forest)" }}>
                      {order.orderId}
                    </strong>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: "var(--radius-pill)",
                        backgroundColor: "var(--color-brand-sage-light)",
                        color: "var(--color-brand-forest)",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)", marginBottom: "8px" }}>
                    Placed on {order.date} • {order.items.length} items • ₹{order.total} total
                  </div>

                  {/* Thumbnail Row */}
                  <div style={{ display: "flex", gap: "8px" }}>
                    {order.items.slice(0, 4).map((item, idx) => (
                      <img
                        key={idx}
                        src={item.image}
                        alt={item.name}
                        title={item.name}
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "var(--radius-xs)",
                          objectFit: "cover",
                          backgroundColor: "var(--color-cream-soft)",
                          border: "1px solid var(--color-border-light)",
                        }}
                      />
                    ))}
                    {order.items.length > 4 && (
                      <span
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "var(--radius-xs)",
                          backgroundColor: "var(--color-surface-soft)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: "var(--color-brand-forest)",
                        }}
                      >
                        +{order.items.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => handleDownloadInvoice(order.orderId)}
                    disabled={downloadingId === order.orderId}
                    className="btn-secondary"
                    style={{
                      padding: "9px 16px",
                      fontSize: "0.875rem",
                      cursor: downloadingId === order.orderId ? "not-allowed" : "pointer",
                      border: "1px solid var(--color-brand-forest)",
                      backgroundColor: "#FFFFFF",
                      color: "var(--color-brand-forest)",
                      fontWeight: 600,
                    }}
                    title="Download official PDF tax invoice"
                  >
                    📄 {downloadingId === order.orderId ? "Downloading..." : "Tax Invoice"}
                  </button>
                  <Link
                    href={`/account/orders/${order.orderId}`}
                    className="btn-primary"
                    style={{ padding: "10px 18px", fontSize: "0.875rem" }}
                  >
                    Track Order 🚚
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Orders State */
          <div
            style={{
              padding: "80px 20px",
              textAlign: "center",
              background: "var(--color-white)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border-light)",
            }}
          >
            <div style={{ fontSize: "3.5rem", marginBottom: "16px" }}>📦🌱</div>
            <h2
              style={{
                fontSize: "var(--text-heading-lg)",
                color: "var(--color-brand-forest)",
                marginBottom: "8px",
              }}
            >
              You haven&apos;t placed any plant orders yet
            </h2>
            <p
              style={{
                color: "var(--color-text-secondary)",
                maxWidth: "420px",
                margin: "0 auto 24px",
                lineHeight: 1.6,
              }}
            >
              Browse our healthy nursery collection to bring home your first indoor green companions.
            </p>
            <Link href="/plants" className="btn-primary" style={{ padding: "14px 28px" }}>
              Explore Plants Collection →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
