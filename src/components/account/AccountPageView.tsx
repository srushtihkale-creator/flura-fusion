"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useFloraStore } from "@/store/useFloraStore";

export function AccountPageView() {
  const { orders, wishlist, user, isAuthenticated, openAuthModal, logout, openFloraAI, loadOrders } = useFloraStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated, loadOrders]);

  if (!mounted) {
    return (
      <div style={{ padding: "80px 0", textAlign: "center", color: "var(--color-text-muted)" }}>
        Loading account details...
      </div>
    );
  }

  const latestOrder = orders.length > 0 ? orders[0] : null;

  if (!isAuthenticated || !user) {
    return (
      <div className="account-page-container" style={{ padding: "var(--space-8) 0 var(--space-16)" }}>
        <div className="container" style={{ maxWidth: "560px", textAlign: "center", padding: "60px 20px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              backgroundColor: "var(--color-brand-sage-light, #DDE7D8)",
              color: "var(--color-brand-forest, #173F2B)",
              fontSize: "1.75rem",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
            }}
          >
            👤
          </div>
          <h1
            style={{
              fontFamily: "var(--font-serif, 'Cormorant Garamond', Georgia, serif)",
              fontSize: "2rem",
              color: "var(--color-brand-forest)",
              margin: "0 0 12px",
            }}
          >
            Sign in to Your Account
          </h1>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "0.9375rem",
              lineHeight: 1.6,
              marginBottom: "24px",
            }}
          >
            Access your orders, track live nursery shipments, manage your wishlist, and enjoy personalized botanical recommendations.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => openAuthModal("signin")}
              className="btn-primary"
              style={{ padding: "12px 28px", fontSize: "0.9375rem" }}
            >
              Sign In →
            </button>
            <button
              type="button"
              onClick={() => openAuthModal("signup")}
              className="btn-secondary"
              style={{ padding: "12px 20px", fontSize: "0.9375rem" }}
            >
              Create Account
            </button>
            <Link
              href="/"
              className="btn-secondary"
              style={{ padding: "12px 20px", fontSize: "0.9375rem", textDecoration: "none" }}
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "FF";

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
              {initials}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <h1 style={{ fontSize: "1.5rem", color: "var(--color-brand-forest)", margin: 0 }}>
                  {user.name}
                </h1>
                <span
                  style={{
                    backgroundColor: user.role === "ADMIN" ? "#FFF8F2" : "var(--color-brand-sage-light)",
                    color: user.role === "ADMIN" ? "var(--color-brand-terracotta)" : "var(--color-brand-forest)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: "var(--radius-pill)",
                    border: user.role === "ADMIN" ? "1px solid var(--color-brand-terracotta)" : "none",
                  }}
                >
                  {user.role === "ADMIN" ? "👑 Admin" : "Botanical Club 🌿"}
                </span>
              </div>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", margin: 0 }}>
                {user.email}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            {user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="btn-primary"
                style={{
                  padding: "10px 18px",
                  fontSize: "0.875rem",
                  backgroundColor: "var(--color-brand-terracotta)",
                  textDecoration: "none",
                }}
              >
                Admin Dashboard 👑
              </Link>
            )}
            <Link href="/account/orders" className="btn-secondary" style={{ padding: "10px 18px", fontSize: "0.875rem" }}>
              My Orders ({orders.length})
            </Link>
            <Link href="/wishlist" className="btn-secondary" style={{ padding: "10px 18px", fontSize: "0.875rem" }}>
              Wishlist ({wishlist.length})
            </Link>
            <button
              type="button"
              onClick={logout}
              className="btn-secondary"
              style={{ padding: "10px 18px", fontSize: "0.875rem", color: "#C53030" }}
            >
              Sign Out
            </button>
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

              {latestOrder?.shippingAddress?.addressLine1 ? (
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
                      {latestOrder.shippingAddress.fullName || user.name}
                    </strong>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-brand-green)", fontWeight: 600 }}>Primary</span>
                  </div>
                  <p style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.5 }}>
                    {latestOrder.shippingAddress.addressLine1}
                    {latestOrder.shippingAddress.addressLine2 ? `, ${latestOrder.shippingAddress.addressLine2}` : ""}<br />
                    {latestOrder.shippingAddress.city}{latestOrder.shippingAddress.state ? `, ${latestOrder.shippingAddress.state}` : ""} — {latestOrder.shippingAddress.pincode}
                    {latestOrder.shippingAddress.phone && (
                      <>
                        <br />
                        <span style={{ color: "var(--color-text-muted)", fontSize: "0.75rem" }}>
                          Phone: {latestOrder.shippingAddress.phone}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    padding: "16px",
                    borderRadius: "var(--radius-md)",
                    border: "1px dashed var(--color-border-light)",
                    backgroundColor: "var(--color-cream-soft)",
                    textAlign: "center",
                    color: "var(--color-text-muted)",
                    fontSize: "0.8125rem",
                    lineHeight: 1.5,
                  }}
                >
                  No saved delivery address yet. Your address will be saved after your first botanical order.
                </div>
              )}
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
