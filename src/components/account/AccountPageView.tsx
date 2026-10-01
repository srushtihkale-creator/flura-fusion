"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useFloraStore } from "@/store/useFloraStore";

export function AccountPageView() {
  const { orders, wishlist, openFloraAI } = useFloraStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ padding: "80px 0", textAlign: "center", color: "var(--color-text-muted)" }}>
        Loading account details...
      </div>
    );
  }

  const latestOrder = orders.length > 0 ? orders[0] : null;

  return (
    <div className="account-page-container" style={{ padding: "var(--space-8) 0 var(--space-16)" }}>
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
          <span style={{ color: "var(--color-text-secondary)", fontWeight: 500 }}>
            My Account
          </span>
        </nav>

        {/* Profile Header */}
        <div
          style={{
            background: "var(--color-white)",
            padding: "var(--space-8)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border-light)",
            boxShadow: "var(--shadow-sm)",
            marginBottom: "var(--space-8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                backgroundColor: "var(--color-brand-forest)",
                color: "#FFFFFF",
                fontSize: "1.75rem",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              PS
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <h1 style={{ fontSize: "1.5rem", color: "var(--color-brand-forest)", margin: 0 }}>
                  Priya Sharma
                </h1>
                <span
                  style={{
                    backgroundColor: "var(--color-brand-sage-light)",
                    color: "var(--color-brand-forest)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: "var(--radius-pill)",
                  }}
                >
                  Botanical Club 🌿
                </span>
              </div>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", margin: 0 }}>
                priya.sharma@example.com • +91 98765 43210
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <Link href="/account/orders" className="btn-secondary" style={{ padding: "10px 18px", fontSize: "0.875rem" }}>
              My Orders ({orders.length})
            </Link>
            <Link href="/wishlist" className="btn-secondary" style={{ padding: "10px 18px", fontSize: "0.875rem" }}>
              Wishlist ({wishlist.length})
            </Link>
          </div>
        </div>

        {/* 2-Column Grid: Recent Order & Addresses */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "var(--space-8)",
            alignItems: "start",
          }}
        >
          {/* Left Column: Recent Orders Overview */}
          <div
            style={{
              background: "var(--color-white)",
              padding: "24px",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border-light)",
              boxShadow: "var(--shadow-xs)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "1.15rem", color: "var(--color-brand-forest)", margin: 0 }}>
                Recent Order
              </h3>
              <Link href="/account/orders" style={{ fontSize: "0.8125rem", color: "var(--color-brand-green)", fontWeight: 600 }}>
                View all ({orders.length}) →
              </Link>
            </div>

            {latestOrder ? (
              <div
                style={{
                  border: "1px solid var(--color-border-light)",
                  borderRadius: "var(--radius-md)",
                  padding: "16px",
                  background: "var(--color-cream-soft)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <strong style={{ color: "var(--color-brand-forest)" }}>{latestOrder.orderId}</strong>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-brand-green)", fontWeight: 600 }}>
                    {latestOrder.status}
                  </span>
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)", marginBottom: "12px" }}>
                  Placed on {latestOrder.date} • ₹{latestOrder.total} • Est: {latestOrder.estimatedDelivery}
                </div>
                <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
                  {latestOrder.items.slice(0, 3).map((item, idx) => (
                    <img
                      key={idx}
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "var(--radius-xs)",
                        objectFit: "cover",
                        backgroundColor: "#fff",
                      }}
                    />
                  ))}
                </div>
                <Link
                  href={`/account/orders/${latestOrder.orderId}`}
                  className="btn-primary"
                  style={{ width: "100%", padding: "10px", fontSize: "0.8125rem", textAlign: "center" }}
                >
                  Track Live Shipment 🚚
                </Link>
              </div>
            ) : (
              <div style={{ padding: "30px 10px", textAlign: "center", color: "var(--color-text-muted)" }}>
                No past orders found. Explore our nursery catalog to start your urban garden!
                <div style={{ marginTop: "12px" }}>
                  <Link href="/plants" className="btn-primary" style={{ padding: "8px 18px", fontSize: "0.8125rem" }}>
                    Shop Plants →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Saved Delivery Addresses & Botanical Assistant */}
          <div>
            {/* Address Card */}
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
                Saved Delivery Addresses
              </h3>

              <div
                style={{
                  padding: "16px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-brand-sage)",
                  backgroundColor: "var(--color-surface-soft)",
                  marginBottom: "12px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <strong style={{ fontSize: "0.875rem", color: "var(--color-brand-forest)" }}>
                    Primary Residence (Default)
                  </strong>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-brand-green)", fontWeight: 600 }}>Home</span>
                </div>
                <p style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.5 }}>
                  Flat 402, Green Meadows, Koregaon Park<br />
                  Pune, Maharashtra — 411001
                </p>
              </div>
            </div>

            {/* Flora AI Assistance Card */}
            <div
              style={{
                background: "linear-gradient(135deg, #E8EFE5 0%, var(--color-cream-soft) 100%)",
                padding: "24px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-brand-sage)",
              }}
            >
              <h4 style={{ fontSize: "1rem", color: "var(--color-brand-forest)", marginBottom: "6px" }}>
                🌿 Botanical Concierge Support
              </h4>
              <p style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)", margin: "0 0 16px", lineHeight: 1.5 }}>
                Have questions about leaf drooping, watering frequency, or sunlight for your ordered plants? Flora AI is available 24/7.
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={openFloraAI}
                style={{ padding: "10px 20px", fontSize: "0.8125rem" }}
              >
                Talk with Flora AI 🍃
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
