"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFloraStore } from "@/store/useFloraStore";
import { CartService } from "@/services/cart.service";

export function CartPageView() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, coupon, applyCoupon, removeCoupon } = useFloraStore();
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ padding: "80px 0", textAlign: "center", color: "var(--color-text-muted)" }}>
        Loading garden cart...
      </div>
    );
  }

  const totals = CartService.calculateTotals(cart, coupon ? coupon.code : null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    if (!couponInput.trim()) return;

    const success = applyCoupon(couponInput);
    if (success) {
      setCouponInput("");
    } else {
      setCouponError("Invalid coupon code. Try FLORA10 or NATURE20.");
    }
  };

  const amountNeededForFreeShipping = Math.max(0, CartService.FREE_SHIPPING_THRESHOLD - totals.subtotal);

  return (
    <div className="cart-page-container" style={{ padding: "var(--space-8) 0 var(--space-16)" }}>
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
            Shopping Cart
          </span>
        </nav>

        <h1
          style={{
            fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
            color: "var(--color-brand-forest)",
            marginBottom: "var(--space-6)",
          }}
        >
          Your Green Sanctuary Cart
        </h1>

        {cart.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "var(--space-8)",
              alignItems: "start",
            }}
          >
            {/* Left Column: Items & Shipping bar */}
            <div>
              {/* Free Delivery Bar */}
              <div
                className="free-shipping-bar"
                style={{
                  marginBottom: "var(--space-6)",
                  backgroundColor: "var(--color-white)",
                  border: "1px solid var(--color-border-light)",
                  borderRadius: "var(--radius-md)",
                  padding: "16px",
                  boxShadow: "var(--shadow-xs)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.875rem" }}>
                  <span>
                    {amountNeededForFreeShipping === 0 ? (
                      <strong style={{ color: "var(--color-brand-green)" }}>🎉 You unlocked Free Nursery Delivery!</strong>
                    ) : (
                      <>
                        Add <strong style={{ color: "var(--color-brand-forest)" }}>₹{amountNeededForFreeShipping}</strong> more for <strong>Free Delivery</strong>!
                      </>
                    )}
                  </span>
                  <span style={{ color: "var(--color-text-muted)", fontSize: "0.75rem" }}>
                    Threshold: ₹{CartService.FREE_SHIPPING_THRESHOLD}
                  </span>
                </div>
                <div className="progress-track" style={{ height: "8px" }}>
                  <div
                    className="progress-fill"
                    style={{ width: `${totals.freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items Card List */}
              <div
                style={{
                  background: "var(--color-white)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--color-border-light)",
                  boxShadow: "var(--shadow-xs)",
                  overflow: "hidden",
                }}
              >
                {cart.map((item, idx) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "20px",
                      borderBottom: idx < cart.length - 1 ? "1px solid var(--color-border-light)" : "none",
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Item Thumbnail */}
                    <Link
                      href={`/product/${item.slug || item.id}`}
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "var(--radius-sm)",
                        overflow: "hidden",
                        backgroundColor: "var(--color-cream-soft)",
                        flexShrink: 0,
                        border: "1px solid var(--color-border-light)",
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </Link>

                    {/* Item Details */}
                    <div style={{ flex: "1 1 200px" }}>
                      <Link
                        href={`/product/${item.slug || item.id}`}
                        style={{
                          fontSize: "1rem",
                          fontWeight: 600,
                          color: "var(--color-brand-forest)",
                          textDecoration: "none",
                          display: "block",
                          marginBottom: "4px",
                        }}
                      >
                        {item.name}
                      </Link>
                      <div style={{ fontSize: "0.75rem", color: "var(--color-brand-green)", textTransform: "capitalize", marginBottom: "8px" }}>
                        {item.category}
                      </div>
                      <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--color-brand-deep)" }}>
                        ₹{item.price}
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--radius-pill)",
                        backgroundColor: "var(--color-cream-soft)",
                        overflow: "hidden",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{
                          padding: "6px 12px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--color-brand-forest)",
                        }}
                      >
                        −
                      </button>
                      <span style={{ minWidth: "24px", textAlign: "center", fontSize: "0.875rem", fontWeight: 600 }}>
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{
                          padding: "6px 12px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--color-brand-forest)",
                        }}
                      >
                        +
                      </button>
                    </div>

                    {/* Line Total */}
                    <div style={{ minWidth: "80px", textAlign: "right", fontWeight: 700, color: "var(--color-brand-forest)" }}>
                      ₹{item.price * item.quantity}
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--color-text-muted)",
                        cursor: "pointer",
                        padding: "8px",
                        borderRadius: "50%",
                        fontSize: "1.1rem",
                      }}
                      title="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Order Summary & Checkout */}
            <div
              style={{
                background: "var(--color-white)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-border-light)",
                boxShadow: "var(--shadow-xs)",
                padding: "24px",
                position: "sticky",
                top: "100px",
              }}
            >
              <h3 style={{ fontSize: "1.25rem", color: "var(--color-brand-forest)", marginBottom: "20px" }}>
                Order Summary
              </h3>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    placeholder="Coupon (e.g. FLORA10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "10px 14px",
                      borderRadius: "var(--radius-pill)",
                      border: "1px solid var(--color-border-light)",
                      fontSize: "0.875rem",
                      outline: "none",
                      backgroundColor: "var(--color-cream-soft)",
                    }}
                  />
                  <button type="submit" className="coupon-btn">
                    Apply
                  </button>
                </div>
                {couponError && (
                  <div style={{ color: "#D9534F", fontSize: "0.75rem", marginTop: "6px" }}>
                    {couponError}
                  </div>
                )}
                {coupon && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "8px",
                      padding: "6px 12px",
                      backgroundColor: "var(--color-brand-sage-light)",
                      borderRadius: "var(--radius-pill)",
                      fontSize: "0.75rem",
                      color: "var(--color-brand-forest)",
                      fontWeight: 600,
                    }}
                  >
                    <span>Coupon &apos;{coupon.code}&apos; Active ({coupon.discountPercentage}% OFF)</span>
                    <button
                      type="button"
                      onClick={() => removeCoupon()}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-brand-forest)" }}
                      title="Remove coupon"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </form>

              {/* Summary Lines */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "0.9375rem" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>Subtotal</span>
                <strong>₹{totals.subtotal}</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "0.9375rem" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>Nursery Shipping</span>
                <span>{totals.shipping === 0 ? <strong style={{ color: "var(--color-brand-green)" }}>FREE</strong> : `₹${totals.shipping}`}</span>
              </div>

              {totals.discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "0.9375rem", color: "var(--color-brand-green)" }}>
                  <span>Promotional Discount</span>
                  <strong>-₹{totals.discount}</strong>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  paddingTop: "16px",
                  borderTop: "1px solid var(--color-border-light)",
                  marginBottom: "24px",
                }}
              >
                <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-brand-forest)" }}>
                  Estimated Total
                </span>
                <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-brand-deep)" }}>
                  ₹{totals.total}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                className="btn-primary"
                onClick={() => router.push("/checkout")}
                style={{ width: "100%", padding: "14px", fontSize: "1rem" }}
              >
                Proceed to Checkout →
              </button>

              <div style={{ marginTop: "16px", textAlign: "center", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                🔒 256-Bit SSL Encrypted & Safe Doorstep Transit
              </div>
            </div>
          </div>
        ) : (
          /* Approved Empty State per Section 25 */
          <div
            style={{
              padding: "80px 20px",
              textAlign: "center",
              background: "var(--color-white)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border-light)",
            }}
          >
            <div style={{ fontSize: "3.5rem", marginBottom: "16px" }}>🪴</div>
            <h2
              style={{
                fontSize: "var(--text-heading-lg)",
                color: "var(--color-brand-forest)",
                marginBottom: "8px",
              }}
            >
              Your cart is ready for something green.
            </h2>
            <p
              style={{
                color: "var(--color-text-secondary)",
                maxWidth: "420px",
                margin: "0 auto 24px",
                lineHeight: 1.6,
              }}
            >
              Discover fresh, nursery-grown indoor plants, handcrafted pots, and heirloom seeds waiting for your space.
            </p>
            <Link href="/plants" className="btn-primary" style={{ padding: "14px 28px" }}>
              Explore Catalog →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
