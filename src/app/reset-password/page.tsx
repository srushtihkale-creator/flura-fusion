"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useFloraStore } from "@/store/useFloraStore";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tokenParam = searchParams.get("token") || searchParams.get("code") || "";
  const emailParam = searchParams.get("email") || "";

  const { resetPassword, openAuthModal, addToast } = useFloraStore();

  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState(tokenParam);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (tokenParam) setCode(tokenParam);
    if (emailParam) setEmail(emailParam);
  }, [tokenParam, emailParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !code || !newPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(email.trim(), code.trim(), newPassword);
      if (res.success) {
        setSuccess(true);
        addToast("Password reset successfully! Please sign in with your new password.", "success");
      } else {
        setErrorMessage(res.error || "Failed to reset password. The code may be expired or invalid.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 440,
        width: "100%",
        margin: "60px auto",
        padding: "36px 28px",
        background: "var(--color-bg-card, #FFFFFF)",
        borderRadius: 16,
        border: "1px solid var(--color-border, #EAE5D9)",
        boxShadow: "0 8px 30px rgba(23,63,43,0.06)",
      }}
    >
      {success ? (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌿</div>
          <h2
            style={{
              fontFamily: "var(--font-cormorant, serif)",
              fontSize: 28,
              color: "var(--color-forest, #173F2B)",
              margin: "0 0 12px 0",
            }}
          >
            Password Updated!
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "var(--color-text-secondary, #66786D)",
              lineHeight: 1.6,
              marginBottom: 24,
            }}
          >
            Your password has been securely reset. You can now log into your Flora Fusion account.
          </p>
          <button
            onClick={() => {
              router.push("/");
              openAuthModal("signin");
            }}
            style={{
              width: "100%",
              padding: "14px 20px",
              background: "var(--color-forest, #173F2B)",
              color: "#FFFFFF",
              borderRadius: 999,
              border: "none",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Sign In to Flora Fusion →
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <span
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                color: "var(--color-forest, #173F2B)",
                fontWeight: 600,
                display: "block",
                marginBottom: 6,
              }}
            >
              Account Security
            </span>
            <h1
              style={{
                fontFamily: "var(--font-cormorant, serif)",
                fontSize: 30,
                color: "var(--color-forest, #173F2B)",
                margin: 0,
              }}
            >
              Reset Your Password
            </h1>
            <p
              style={{
                fontSize: 13,
                color: "var(--color-text-secondary, #66786D)",
                marginTop: 8,
              }}
            >
              Enter your email and new password to secure your account.
            </p>
          </div>

          {errorMessage && (
            <div
              style={{
                padding: "10px 14px",
                background: "#FDE8E8",
                border: "1px solid #F8B4B4",
                borderRadius: 8,
                color: "#9B1C1C",
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              {errorMessage}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--color-forest, #173F2B)",
                marginBottom: 6,
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="srushti.h.kale2004@gmail.com"
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 8,
                border: "1px solid var(--color-border, #EAE5D9)",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--color-forest, #173F2B)",
                marginBottom: 6,
              }}
            >
              Reset Code / Token
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="6-digit reset code"
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 8,
                border: "1px solid var(--color-border, #EAE5D9)",
                fontSize: 16,
                letterSpacing: 2,
                fontFamily: "monospace",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--color-forest, #173F2B)",
                marginBottom: 6,
              }}
            >
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required
              minLength={6}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 8,
                border: "1px solid var(--color-border, #EAE5D9)",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--color-forest, #173F2B)",
                marginBottom: 6,
              }}
            >
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              required
              minLength={6}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 8,
                border: "1px solid var(--color-border, #EAE5D9)",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px 20px",
              background: "var(--color-forest, #173F2B)",
              color: "#FFFFFF",
              borderRadius: 999,
              border: "none",
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Updating Password..." : "Update Password →"}
          </button>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Link
              href="/"
              style={{
                fontSize: 13,
                color: "var(--color-forest, #173F2B)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              ← Return to Nursery Store
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main
      style={{
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
        background: "var(--color-cream, #F7F4EC)",
      }}
    >
      <Suspense fallback={<div style={{ textAlign: "center", padding: 40, color: "#173F2B" }}>Loading reset form...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
