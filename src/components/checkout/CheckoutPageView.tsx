"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFloraStore } from "@/store/useFloraStore";
import { OrderService } from "@/services/order.service";
import { ShippingAddress } from "@/types/cart";
import { CartService } from "@/services/cart.service";

export function CheckoutPageView() {
  const router = useRouter();
  const { cart, coupon, clearCart, addOrder, addToast, user } = useFloraStore();
  const [mounted, setMounted] = useState(false);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [deliveryMethod, setDeliveryMethod] = useState<"Standard" | "Express">("Standard");
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "Card" | "NetBanking" | "COD">("UPI");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});

  useEffect(() => {
    setMounted(true);
    if (user?.name) {
      setAddress((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name,
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [user]);

  if (!mounted) {
    return (
      <div style={{ padding: "80px 0", textAlign: "center", color: "var(--color-text-muted)" }}>
        Initializing checkout...
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: "80px 20px", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🪴</div>
        <h2 style={{ color: "var(--color-brand-forest)", marginBottom: "8px" }}>
          Your cart is currently empty
        </h2>
        <p style={{ color: "var(--color-text-secondary)", marginBottom: "24px" }}>
          Please add plants, pots or seeds to your basket before proceeding to checkout.
        </p>
        <Link href="/plants" className="btn-primary">
          Explore Plants →
        </Link>
      </div>
    );
  }

  const totals = CartService.calculateTotals(cart, coupon?.code || null);
  const deliveryFee = deliveryMethod === "Express" ? 99 : totals.shipping;
  const finalTotal = totals.subtotal + deliveryFee - totals.discount;

  const validateStep1 = () => {
    const errs: Partial<Record<keyof ShippingAddress, string>> = {};
    if (!address.fullName.trim()) errs.fullName = "Full name is required";
    if (!address.phone.trim() || address.phone.length < 10) errs.phone = "Valid 10-digit phone required";
    if (!address.addressLine1.trim()) errs.addressLine1 = "Street address is required";
    if (!address.city.trim()) errs.city = "City is required";
    if (!address.pincode.trim() || address.pincode.length < 6) errs.pincode = "Valid 6-digit PIN code required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!validateStep1()) return;
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      handlePlaceOrder();
    }
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      if ((window as any).Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);

    // If Cash on Delivery, place directly without online popup
    if (paymentMethod === "COD") {
      try {
        const newOrder = await OrderService.createOrder({
          items: cart,
          shippingAddress: address,
          deliveryMethod,
          paymentMethod: "COD",
          couponCode: coupon?.code || null,
        });

        addOrder(newOrder);
        clearCart();
        addToast(`Order ${newOrder.orderId} placed successfully! 🎉`, "success");
        router.push(`/account/orders/${newOrder.orderId}`);
      } catch (err: any) {
        addToast(err?.message || "Failed to place order. Please try again.", "error");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Online Payment via Razorpay Gateway (UPI, Cards, NetBanking)
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
      }

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TkGZqDthTkR6pj";
      const totalAmountPaise = Math.round(totals.total * 100);

      const options = {
        key: razorpayKey,
        amount: totalAmountPaise,
        currency: "INR",
        name: "Flora Fusion",
        description: "Plants, Pots & Greenery Order",
        image: "/assets/logo.png",
        prefill: {
          name: address.fullName,
          contact: address.phone,
          email: user?.email || "customer@florafusion.com",
        },
        theme: {
          color: "#173F2B",
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
            addToast("Payment was cancelled. You can retry whenever you are ready.", "info");
          },
        },
        handler: async (response: any) => {
          try {
            const paymentId = response.razorpay_payment_id;
            const newOrder = await OrderService.createOrder({
              items: cart,
              shippingAddress: address,
              deliveryMethod,
              paymentMethod: `Razorpay (${paymentMethod})`,
              paymentReference: paymentId,
              couponCode: coupon?.code || null,
            });

            addOrder(newOrder);
            clearCart();
            addToast(`Payment verified! Order ${newOrder.orderId} placed successfully. 🎉`, "success");
            router.push(`/account/orders/${newOrder.orderId}`);
          } catch (err: any) {
            addToast(err?.message || "Payment captured but order creation failed. Please contact support.", "error");
          } finally {
            setIsSubmitting(false);
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        setIsSubmitting(false);
        addToast(response.error?.description || "Payment failed. Please try another card or UPI app.", "error");
      });
      rzp.open();
    } catch (err: any) {
      addToast(err?.message || "Failed to initialize payment gateway.", "error");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page-container" style={{ padding: "var(--space-8) 0 var(--space-16)" }}>
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
          <Link href="/cart" style={{ color: "var(--color-brand-forest)", textDecoration: "none" }}>
            Cart
          </Link>
          <span>/</span>
          <span style={{ color: "var(--color-text-secondary)", fontWeight: 500 }}>
            Secure Checkout
          </span>
        </nav>

        <h1
          style={{
            fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
            color: "var(--color-brand-forest)",
            marginBottom: "var(--space-6)",
          }}
        >
          Nursery Checkout
        </h1>

        {/* Stepper Header */}
        <div
          className="stepper-header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: "600px",
            marginBottom: "var(--space-8)",
            padding: "16px 24px",
            backgroundColor: "var(--color-white)",
            borderRadius: "var(--radius-pill)",
            border: "1px solid var(--color-border-light)",
            boxShadow: "var(--shadow-xs)",
          }}
        >
          <div
            className={`stepper-step ${step >= 1 ? "active" : ""}`}
            style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
            onClick={() => setStep(1)}
          >
            <div className="stepper-circle">1</div>
            <span style={{ fontWeight: step === 1 ? 700 : 500, fontSize: "0.875rem" }}>Shipping</span>
          </div>

          <div style={{ flex: 1, height: "2px", background: step >= 2 ? "var(--color-brand-forest)" : "var(--color-border)", margin: "0 12px" }} />

          <div
            className={`stepper-step ${step >= 2 ? "active" : ""}`}
            style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
            onClick={() => {
              if (validateStep1()) setStep(2);
            }}
          >
            <div className="stepper-circle">2</div>
            <span style={{ fontWeight: step === 2 ? 700 : 500, fontSize: "0.875rem" }}>Delivery</span>
          </div>

          <div style={{ flex: 1, height: "2px", background: step === 3 ? "var(--color-brand-forest)" : "var(--color-border)", margin: "0 12px" }} />

          <div
            className={`stepper-step ${step === 3 ? "active" : ""}`}
            style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
            onClick={() => {
              if (validateStep1()) setStep(3);
            }}
          >
            <div className="stepper-circle">3</div>
            <span style={{ fontWeight: step === 3 ? 700 : 500, fontSize: "0.875rem" }}>Payment</span>
          </div>
        </div>

        {/* 2-Column Grid: Form & Summary */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "var(--space-8)",
            alignItems: "start",
          }}
        >
          {/* Left Column: Active Step */}
          <div
            style={{
              background: "var(--color-white)",
              padding: "var(--space-8)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border-light)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            {/* Step 1: Address */}
            {step === 1 && (
              <div>
                <h3 style={{ fontSize: "1.25rem", color: "var(--color-brand-forest)", marginBottom: "16px" }}>
                  1. Delivery Address
                </h3>
                <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label className="form-label" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", outline: "none" }}
                    />
                    {errors.fullName && <span style={{ color: "#D9534F", fontSize: "0.75rem" }}>{errors.fullName}</span>}
                  </div>

                  <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label className="form-label" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Phone Number *</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", outline: "none" }}
                    />
                    {errors.phone && <span style={{ color: "#D9534F", fontSize: "0.75rem" }}>{errors.phone}</span>}
                  </div>

                  <div className="form-group" style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label className="form-label" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Street Address *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={address.addressLine1}
                      onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                      style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", outline: "none" }}
                    />
                    {errors.addressLine1 && <span style={{ color: "#D9534F", fontSize: "0.75rem" }}>{errors.addressLine1}</span>}
                  </div>

                  <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label className="form-label" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>City *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", outline: "none" }}
                    />
                    {errors.city && <span style={{ color: "#D9534F", fontSize: "0.75rem" }}>{errors.city}</span>}
                  </div>

                  <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label className="form-label" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>PIN Code *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", outline: "none" }}
                    />
                    {errors.pincode && <span style={{ color: "#D9534F", fontSize: "0.75rem" }}>{errors.pincode}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Delivery Speed */}
            {step === 2 && (
              <div>
                <h3 style={{ fontSize: "1.25rem", color: "var(--color-brand-forest)", marginBottom: "16px" }}>
                  2. Select Delivery Speed
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "18px",
                      borderRadius: "var(--radius-md)",
                      border:
                        deliveryMethod === "Standard"
                          ? "2px solid var(--color-brand-forest)"
                          : "1px solid var(--color-border)",
                      backgroundColor:
                        deliveryMethod === "Standard" ? "var(--color-surface-soft)" : "transparent",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === "Standard"}
                      onChange={() => setDeliveryMethod("Standard")}
                    />
                    <div style={{ flex: 1 }}>
                      <strong style={{ display: "block", color: "var(--color-brand-forest)", fontSize: "0.9375rem" }}>
                        Standard Eco Delivery (3-5 Business Days)
                      </strong>
                      <span style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
                        Direct transit with breathable nursery bio-boxes
                      </span>
                    </div>
                    <strong>{totals.shipping === 0 ? "FREE" : `₹${totals.shipping}`}</strong>
                  </label>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "18px",
                      borderRadius: "var(--radius-md)",
                      border:
                        deliveryMethod === "Express"
                          ? "2px solid var(--color-brand-forest)"
                          : "1px solid var(--color-border)",
                      backgroundColor:
                        deliveryMethod === "Express" ? "var(--color-surface-soft)" : "transparent",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === "Express"}
                      onChange={() => setDeliveryMethod("Express")}
                    />
                    <div style={{ flex: 1 }}>
                      <strong style={{ display: "block", color: "var(--color-brand-forest)", fontSize: "0.9375rem" }}>
                        Express Nursery Priority (24-48 Hours) ⚡
                      </strong>
                      <span style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
                        Dedicated climate-controlled vehicle delivery
                      </span>
                    </div>
                    <strong>₹99</strong>
                  </label>
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            {step === 3 && (
              <div>
                <h3 style={{ fontSize: "1.25rem", color: "var(--color-brand-forest)", marginBottom: "16px" }}>
                  3. Select Payment Method
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "14px",
                    marginBottom: "24px",
                  }}
                >
                  <label
                    style={{
                      padding: "16px",
                      borderRadius: "var(--radius-md)",
                      border: paymentMethod === "UPI" ? "2px solid var(--color-brand-forest)" : "1px solid var(--color-border)",
                      backgroundColor: paymentMethod === "UPI" ? "var(--color-surface-soft)" : "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "UPI"}
                      onChange={() => setPaymentMethod("UPI")}
                    />
                    <strong style={{ display: "block", marginTop: "8px", color: "var(--color-brand-forest)" }}>
                      UPI / Instant QR
                    </strong>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
                      Google Pay, PhonePe, Paytm
                    </span>
                  </label>

                  <label
                    style={{
                      padding: "16px",
                      borderRadius: "var(--radius-md)",
                      border: paymentMethod === "Card" ? "2px solid var(--color-brand-forest)" : "1px solid var(--color-border)",
                      backgroundColor: paymentMethod === "Card" ? "var(--color-surface-soft)" : "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "Card"}
                      onChange={() => setPaymentMethod("Card")}
                    />
                    <strong style={{ display: "block", marginTop: "8px", color: "var(--color-brand-forest)" }}>
                      Credit / Debit Card
                    </strong>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
                      Visa, Mastercard, RuPay
                    </span>
                  </label>

                  <label
                    style={{
                      padding: "16px",
                      borderRadius: "var(--radius-md)",
                      border: paymentMethod === "NetBanking" ? "2px solid var(--color-brand-forest)" : "1px solid var(--color-border)",
                      backgroundColor: paymentMethod === "NetBanking" ? "var(--color-surface-soft)" : "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "NetBanking"}
                      onChange={() => setPaymentMethod("NetBanking")}
                    />
                    <strong style={{ display: "block", marginTop: "8px", color: "var(--color-brand-forest)" }}>
                      Net Banking
                    </strong>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
                      All Major Indian Banks
                    </span>
                  </label>

                  <label
                    style={{
                      padding: "16px",
                      borderRadius: "var(--radius-md)",
                      border: paymentMethod === "COD" ? "2px solid var(--color-brand-forest)" : "1px solid var(--color-border)",
                      backgroundColor: paymentMethod === "COD" ? "var(--color-surface-soft)" : "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                    />
                    <strong style={{ display: "block", marginTop: "8px", color: "var(--color-brand-forest)" }}>
                      Cash on Delivery
                    </strong>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
                      Pay at doorstep via cash or UPI
                    </span>
                  </label>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 14px",
                    backgroundColor: "var(--color-surface-soft)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.8125rem",
                    color: "var(--color-brand-forest)",
                    fontWeight: 500,
                  }}
                >
                  <span>🔒</span>
                  <span>100% Encrypted &amp; Secure Payments powered by <strong>Razorpay</strong> (UPI, Cards, NetBanking)</span>
                </div>
              </div>
            )}

            {/* Stepper Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "24px",
                paddingTop: "20px",
                borderTop: "1px solid var(--color-border-light)",
              }}
            >
              {step > 1 ? (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setStep((step - 1) as any)}
                  disabled={isSubmitting}
                >
                  ← Back
                </button>
              ) : (
                <Link href="/cart" className="btn-secondary">
                  ← Back to Cart
                </Link>
              )}

              <button
                type="button"
                className="btn-primary"
                onClick={handleNext}
                disabled={isSubmitting}
                style={{ minWidth: "160px" }}
              >
                {isSubmitting
                  ? "Securing Order..."
                  : step === 3
                  ? paymentMethod === "COD"
                    ? `Place Order (COD - ₹${finalTotal}) 🌿`
                    : `Pay with Razorpay (₹${finalTotal}) 🔒`
                  : "Continue →"}
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div
            style={{
              background: "var(--color-white)",
              padding: "24px",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border-light)",
              boxShadow: "var(--shadow-xs)",
              position: "sticky",
              top: "100px",
            }}
          >
            <h3 style={{ fontSize: "1.15rem", color: "var(--color-brand-forest)", marginBottom: "16px" }}>
              Order Review ({cart.length} items)
            </h3>

            <div style={{ maxHeight: "240px", overflowY: "auto", marginBottom: "16px", paddingRight: "4px" }}>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "12px",
                    fontSize: "0.875rem",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "var(--radius-xs)",
                      objectFit: "cover",
                      backgroundColor: "var(--color-cream-soft)",
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.name}
                    </div>
                    <div style={{ color: "var(--color-text-muted)", fontSize: "0.75rem" }}>
                      Qty: {item.quantity} × ₹{item.price}
                    </div>
                  </div>
                  <strong>₹{item.price * item.quantity}</strong>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid var(--color-border-light)", paddingTop: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.875rem" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>Subtotal</span>
                <span>₹{totals.subtotal}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.875rem" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>
                  Delivery ({deliveryMethod})
                </span>
                <span>{deliveryFee === 0 ? <strong style={{ color: "var(--color-brand-green)" }}>FREE</strong> : `₹${deliveryFee}`}</span>
              </div>
              {totals.discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.875rem", color: "var(--color-brand-green)" }}>
                  <span>Coupon Discount</span>
                  <span>-₹{totals.discount}</span>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: "12px",
                  borderTop: "1px solid var(--color-border-light)",
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  color: "var(--color-brand-forest)",
                }}
              >
                <span>Total Amount</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            <div style={{ marginTop: "16px", padding: "10px", background: "var(--color-surface-soft)", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", color: "var(--color-text-secondary)", textAlign: "center" }}>
              🌱 Protected by Flora Nursery Safe Transit Guarantee
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
