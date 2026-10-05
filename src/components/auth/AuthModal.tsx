"use client";

import React, { useState } from "react";
import { useFloraStore } from "@/store/useFloraStore";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authMode, setAuthMode, login, register } = useFloraStore();
  
  // Sign In form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Sign Up form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || "Authentication failed. Please check your credentials.");
    } else {
      setEmail("");
      setPassword("");
      setErrorMessage("");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setErrorMessage("Please enter your name, email, and password.");
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const result = await register(regName, regEmail, regPassword, regPhone);
    setLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || "Account creation failed. Please check your details.");
    } else {
      setRegName("");
      setRegEmail("");
      setRegPhone("");
      setRegPassword("");
      setErrorMessage("");
    }
  };

  const fillQuick = (testEmail: string) => {
    setEmail(testEmail);
    setPassword("Password@123");
    setErrorMessage("");
  };

  const switchTab = (mode: "signin" | "signup") => {
    setAuthMode(mode);
    setErrorMessage("");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(18, 50, 34, 0.65)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          backgroundColor: "#FFFFFF",
          borderRadius: "var(--radius-lg, 16px)",
          border: "1px solid var(--color-border-light, #E2E8F0)",
          boxShadow: "0 20px 40px rgba(18, 50, 34, 0.2)",
          padding: "32px",
          position: "relative",
          animation: "fadeIn 0.25s ease-out",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            color: "var(--color-text-muted, #718096)",
            cursor: "pointer",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Close dialog"
        >
          ×
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "var(--color-brand-sage-light, #DDE7D8)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              marginBottom: "10px",
            }}
          >
            🌿
          </div>
          <h2
            id="auth-modal-title"
            style={{
              fontFamily: "var(--font-serif, 'Cormorant Garamond', Georgia, serif)",
              fontSize: "1.75rem",
              color: "var(--color-brand-forest, #173F2B)",
              margin: "0 0 6px",
              fontWeight: 600,
            }}
          >
            {authMode === "signin" ? "Sign In to Flora Fusion" : "Create Your Account"}
          </h2>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--color-text-secondary, #4A5568)",
              margin: 0,
            }}
          >
            {authMode === "signin"
              ? "Access your garden, track nursery shipments & manage wishlist"
              : "Join Flora Fusion for fresh plants, express delivery & botanical care"}
          </p>
        </div>

        {/* Tab Toggle: Sign In vs Create Account */}
        <div
          style={{
            display: "flex",
            backgroundColor: "var(--color-cream-soft, #F7F5F0)",
            padding: "4px",
            borderRadius: "var(--radius-pill, 999px)",
            marginBottom: "20px",
          }}
        >
          <button
            type="button"
            onClick={() => switchTab("signin")}
            style={{
              flex: 1,
              padding: "9px 16px",
              fontSize: "0.875rem",
              fontWeight: 600,
              borderRadius: "var(--radius-pill, 999px)",
              border: "none",
              backgroundColor: authMode === "signin" ? "#FFFFFF" : "transparent",
              color: authMode === "signin" ? "var(--color-brand-forest, #173F2B)" : "var(--color-text-muted, #718096)",
              boxShadow: authMode === "signin" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchTab("signup")}
            style={{
              flex: 1,
              padding: "9px 16px",
              fontSize: "0.875rem",
              fontWeight: 600,
              borderRadius: "var(--radius-pill, 999px)",
              border: "none",
              backgroundColor: authMode === "signup" ? "#FFFFFF" : "transparent",
              color: authMode === "signup" ? "var(--color-brand-forest, #173F2B)" : "var(--color-text-muted, #718096)",
              boxShadow: authMode === "signup" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            Create Account
          </button>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div
            style={{
              backgroundColor: "#FFF5F5",
              color: "#C53030",
              border: "1px solid #FEB2B2",
              padding: "10px 14px",
              borderRadius: "var(--radius-md, 8px)",
              fontSize: "0.8125rem",
              marginBottom: "16px",
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* SIGN IN FORM (Existing user) */}
        {authMode === "signin" ? (
          <div>
            {/* Quick Fill Credentials Chips */}
            <div style={{ marginBottom: "18px" }}>
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--color-text-muted, #718096)",
                  marginBottom: "8px",
                }}
              >
                Quick Test Accounts:
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => fillQuick("srushti@florafusion.com")}
                  style={{
                    fontSize: "0.75rem",
                    padding: "6px 10px",
                    borderRadius: "var(--radius-pill, 999px)",
                    border: "1px solid var(--color-brand-sage, #A9BDA3)",
                    backgroundColor: "var(--color-cream-soft, #FBF9F4)",
                    color: "var(--color-brand-forest, #173F2B)",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  🌱 Customer (Srushti)
                </button>
                <button
                  type="button"
                  onClick={() => fillQuick("admin@florafusion.com")}
                  style={{
                    fontSize: "0.75rem",
                    padding: "6px 10px",
                    borderRadius: "var(--radius-pill, 999px)",
                    border: "1px solid var(--color-brand-terracotta, #B9825B)",
                    backgroundColor: "#FFF8F2",
                    color: "var(--color-brand-terracotta, #B9825B)",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  👑 Admin (admin@florafusion.com)
                </button>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label
                  htmlFor="auth-email"
                  style={{
                    display: "block",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--color-brand-forest, #173F2B)",
                    marginBottom: "6px",
                  }}
                >
                  Email Address
                </label>
                <input
                  id="auth-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@florafusion.com"
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: "var(--radius-md, 8px)",
                    border: "1px solid var(--color-border, #CBD5E1)",
                    fontSize: "0.9375rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="auth-password"
                  style={{
                    display: "block",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--color-brand-forest, #173F2B)",
                    marginBottom: "6px",
                  }}
                >
                  Password
                </label>
                <input
                  id="auth-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: "var(--radius-md, 8px)",
                    border: "1px solid var(--color-border, #CBD5E1)",
                    fontSize: "0.9375rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "13px",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  borderRadius: "var(--radius-pill, 999px)",
                  cursor: loading ? "wait" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginBottom: "16px",
                }}
              >
                {loading ? "Signing in..." : "Sign In to Flora Fusion →"}
              </button>

              <div style={{ textAlign: "center", fontSize: "0.8125rem", color: "var(--color-text-secondary, #4A5568)" }}>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchTab("signup")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--color-brand-forest, #173F2B)",
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: 0,
                  }}
                >
                  Create Account →
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* CREATE ACCOUNT FORM (New user) */
          <div>
            <form onSubmit={handleRegisterSubmit}>
              <div style={{ marginBottom: "14px" }}>
                <label
                  htmlFor="reg-name"
                  style={{
                    display: "block",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--color-brand-forest, #173F2B)",
                    marginBottom: "6px",
                  }}
                >
                  Full Name
                </label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Srushti Kale"
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: "var(--radius-md, 8px)",
                    border: "1px solid var(--color-border, #CBD5E1)",
                    fontSize: "0.9375rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label
                  htmlFor="reg-email"
                  style={{
                    display: "block",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--color-brand-forest, #173F2B)",
                    marginBottom: "6px",
                  }}
                >
                  Email Address
                </label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@example.com"
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: "var(--radius-md, 8px)",
                    border: "1px solid var(--color-border, #CBD5E1)",
                    fontSize: "0.9375rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label
                  htmlFor="reg-phone"
                  style={{
                    display: "block",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--color-brand-forest, #173F2B)",
                    marginBottom: "6px",
                  }}
                >
                  Phone Number (Optional)
                </label>
                <input
                  id="reg-phone"
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: "var(--radius-md, 8px)",
                    border: "1px solid var(--color-border, #CBD5E1)",
                    fontSize: "0.9375rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="reg-password"
                  style={{
                    display: "block",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--color-brand-forest, #173F2B)",
                    marginBottom: "6px",
                  }}
                >
                  Password (min 6 characters)
                </label>
                <input
                  id="reg-password"
                  type="password"
                  required
                  minLength={6}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: "var(--radius-md, 8px)",
                    border: "1px solid var(--color-border, #CBD5E1)",
                    fontSize: "0.9375rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "13px",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  borderRadius: "var(--radius-pill, 999px)",
                  cursor: loading ? "wait" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginBottom: "16px",
                }}
              >
                {loading ? "Creating Account..." : "Create Account & Sign In →"}
              </button>

              <div style={{ textAlign: "center", fontSize: "0.8125rem", color: "var(--color-text-secondary, #4A5568)" }}>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchTab("signin")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--color-brand-forest, #173F2B)",
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: 0,
                  }}
                >
                  Sign In →
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
