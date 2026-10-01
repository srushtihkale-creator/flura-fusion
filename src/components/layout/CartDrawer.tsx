"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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


  const subtotal = getSubtotal();
  const shipping = getShipping();
  const discount = getDiscount();
  const total = getTotal();

  const freeShippingThreshold = 799;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  let shippingText = "Add items for Free Delivery!";
  if (cart.length === 0) {
    shippingText = "Add items for Free Delivery!";
  } else if (subtotal >= freeShippingThreshold) {
    shippingText = "🎉 Congratulations! You have unlocked Free Delivery!";
  } else {
    shippingText = `Add ₹${remainingForFreeShipping} more to unlock Free Delivery!`;
  }

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim().toUpperCase());
      setCouponInput("");
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        id="cart-drawer-backdrop"
        className={`drawer-backdrop ${isCartOpen ? "open" : ""}`}
        onClick={closeCart}
      />

      {/* Cart Drawer */}
      <aside
        id="cart-drawer"
        className={`cart-drawer ${isCartOpen ? "open" : ""}`}
        aria-label="Shopping Cart"
      >
        <div className="drawer-header">
          <h3 className="drawer-title">
            <span>🛒</span> Your Green Cart
          </h3>
          <button
            id="cart-drawer-close"
            className="modal-close-btn"
            style={{ position: "static" }}
            title="Close Cart"
            onClick={closeCart}
          >
            ✕
          </button>
        </div>

        <div className="drawer-body">
          {/* Free Shipping Tracker */}
          <div className="free-shipping-bar">
            <div id="cart-progress-text" className="shipping-bar-text">
              {shippingText}
            </div>
            <div className="progress-track">
              <div
                id="cart-progress-fill"
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items Container */}
          <div id="cart-items-container">
            {cart.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--color-text-secondary)" }}>
                <span style={{ fontSize: "3rem", display: "block", marginBottom: "12px" }}>🌿</span>
                <p style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: "6px" }}>Your cart is empty</p>
                <p style={{ fontSize: "0.85rem" }}>Explore our botanical collection to bring nature home.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="cart-item-row" data-id={item.id}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-img"
                  />
                  <div className="cart-item-info">
                    <h5 className="cart-item-name">{item.name}</h5>
                    <div className="cart-item-price">₹{item.price}</div>
                    <div className="cart-item-actions">
                      <div className="qty-counter">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          −
                        </button>
                        <span className="qty-val">{item.quantity}</span>
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="cart-item-remove"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="drawer-footer">
          {/* Coupon Form */}
          <form id="cart-coupon-form" className="cart-coupon-form" onSubmit={handleCouponSubmit}>
            <input
              type="text"
              id="cart-coupon-input"
              className="coupon-input"
              placeholder="Coupon Code (e.g. FLORA10)"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
            />
            <button type="submit" className="coupon-btn">
              Apply
            </button>
          </form>

          {coupon && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--color-brand-green)", marginBottom: "8px" }}>
              <span>Coupon <strong>{coupon.code}</strong> applied ({coupon.discountPercentage}% off)</span>
              <button
                type="button"
                onClick={removeCoupon}
                style={{ color: "var(--color-error)", textDecoration: "underline", fontSize: "0.75rem", cursor: "pointer" }}
              >
                Remove
              </button>
            </div>
          )}

          {/* Totals Summary */}
          <div className="cart-summary-line">
            <span>Subtotal</span>
            <span id="cart-subtotal">₹{subtotal}</span>
          </div>
          <div className="cart-summary-line">
            <span>Shipping</span>
            <span id="cart-shipping">{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
          </div>
          {discount > 0 && (
            <div id="cart-discount-row" className="cart-summary-line" style={{ color: "var(--color-brand-green)" }}>
              <span>Discount ({coupon?.code})</span>
              <span id="cart-discount">-₹{discount}</span>
            </div>
          )}
          <div className="cart-summary-total">
            <span>Total</span>
            <span id="cart-total">₹{total}</span>
          </div>

          {/* Checkout CTA */}
          <Link
            href="/checkout"
            className="btn-primary"
            style={{ width: "100%", marginTop: "14px", padding: "14px", textAlign: "center", display: "block" }}
            onClick={closeCart}
          >
            Proceed to Checkout →
          </Link>
        </div>
      </aside>
    </>
  );
}
