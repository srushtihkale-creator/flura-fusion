"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ArrowRight, Tag } from "lucide-react";
import { useFloraStore } from "@/store/useFloraStore";

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    getSubtotal,
    getShipping,
    getDiscount,
    getTotal,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useFloraStore();

  const [couponInput, setCouponInput] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isCartOpen) return null;

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const discount = getDiscount();
  const total = getTotal();

  const freeShippingThreshold = 799;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(18, 50, 34, 0.4)",
          backdropFilter: "blur(4px)",
          zIndex: "var(--z-drawer)",
          animation: "fadeIn 0.2s ease-out",
        }}
      />

      {/* Drawer Panel */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          maxWidth: "440px",
          backgroundColor: "var(--color-surface)",
          zIndex: "var(--z-drawer)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "var(--shadow-lg)",
          animation: "slideInRight 0.3s var(--ease-standard)",
        }}
        aria-label="Shopping Cart Drawer"
      >
        {/* Header */}
        <div
          style={{
            padding: "var(--space-4) var(--space-6)",
            borderBottom: "1px solid var(--color-border-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <span style={{ fontSize: "1.25rem" }}>🛒</span>
            <h3 style={{ fontSize: "var(--text-h4)", margin: 0 }}>Your Green Cart</h3>
          </div>
          <button
            onClick={closeCart}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "999px",
              color: "var(--color-text-secondary)",
            }}
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Tracker */}
        <div
          style={{
            padding: "var(--space-3) var(--space-6)",
            backgroundColor: "var(--color-surface-soft)",
            borderBottom: "1px solid var(--color-border-light)",
          }}
        >
          <div style={{ fontSize: "var(--text-caption)", fontWeight: 600, color: "var(--color-brand-forest)", marginBottom: "6px" }}>
            {remainingForFreeShipping > 0
              ? `Add ₹${remainingForFreeShipping} more for FREE Delivery! 🚚`
              : "🎉 Congratulations! You have unlocked FREE Delivery!"}
          </div>
          <div
            style={{
              height: "6px",
              backgroundColor: "var(--color-border)",
              borderRadius: "999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progressPercent}%`,
                backgroundColor: "var(--color-brand-green)",
                transition: "width 0.4s var(--ease-standard)",
              }}
            />
          </div>
        </div>

        {/* Items List / Empty State */}
        <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-4) var(--space-6)" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "var(--space-12) 0" }}>
              <div style={{ fontSize: "3rem", marginBottom: "var(--space-3)" }}>🌱</div>
              <h4 style={{ fontSize: "var(--text-body-lg)", marginBottom: "var(--space-2)" }}>
                Your cart is ready for something green.
              </h4>
              <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-text-muted)", marginBottom: "var(--space-6)" }}>
                Explore our healthy nursery plants, handcrafted pots, and heirloom seeds.
              </p>
              <button onClick={closeCart} className="btn-primary" style={{ padding: "0 var(--space-6)" }}>
                Explore Plants
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: "var(--space-4)",
                    paddingBottom: "var(--space-4)",
                    borderBottom: "1px solid var(--color-border-light)",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "72px",
                      height: "72px",
                      position: "relative",
                      borderRadius: "var(--radius-sm)",
                      overflow: "hidden",
                      backgroundColor: "var(--color-cream-soft)",
                      flexShrink: 0,
                    }}
                  >
                    <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: "var(--text-body-sm)", fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.name}
                    </h4>
                    <div style={{ fontSize: "var(--text-caption)", color: "var(--color-brand-green)", marginBottom: "6px" }}>
                      ₹{item.price} each
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {/* Quantity Stepper */}
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          border: "1px solid var(--color-border)",
                          borderRadius: "var(--radius-pill)",
                          overflow: "hidden",
                          height: "32px",
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          style={{
                            width: "28px",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--color-text-secondary)",
                          }}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ fontSize: "var(--text-body-sm)", fontWeight: 600, minWidth: "20px", textAlign: "center" }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          style={{
                            width: "28px",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--color-text-secondary)",
                          }}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{ color: "var(--color-text-muted)", padding: "4px" }}
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div style={{ fontSize: "var(--text-body)", fontWeight: 700, color: "var(--color-brand-forest)" }}>
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Coupon & Checkout */}
        {cart.length > 0 && (
          <div
            style={{
              padding: "var(--space-4) var(--space-6)",
              borderTop: "1px solid var(--color-border-light)",
              backgroundColor: "var(--color-cream-soft)",
            }}
          >
            {/* Coupon Box */}
            <div style={{ marginBottom: "var(--space-3)" }}>
              {coupon ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "var(--color-surface)",
                    padding: "8px 12px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px dashed var(--color-brand-green)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "var(--text-body-sm)" }}>
                    <Tag size={16} color="var(--color-brand-green)" />
                    <strong>{coupon.code}</strong> (10% OFF applied)
                  </div>
                  <button onClick={removeCoupon} style={{ color: "var(--color-error)", fontSize: "12px", fontWeight: 600 }}>
                    Remove
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    placeholder="Coupon (e.g. FLORA10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--color-border)",
                      fontSize: "var(--text-body-sm)",
                    }}
                  />
                  <button
                    onClick={() => {
                      if (applyCoupon(couponInput)) setCouponInput("");
                    }}
                    style={{
                      backgroundColor: "var(--color-brand-forest)",
                      color: "var(--color-white)",
                      padding: "0 16px",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "var(--text-body-sm)",
                      fontWeight: 600,
                    }}
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Calculations */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "var(--text-body-sm)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>Shipping</span>
                <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--color-brand-green)" }}>
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "var(--text-body-lg)",
                  fontWeight: 700,
                  color: "var(--color-brand-forest)",
                  borderTop: "1px solid var(--color-border)",
                  paddingTop: "8px",
                  marginTop: "4px",
                }}
              >
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            {/* Checkout Link */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary"
              style={{
                width: "100%",
                marginTop: "var(--space-4)",
                height: "50px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
