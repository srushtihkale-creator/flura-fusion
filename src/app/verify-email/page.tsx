"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useFloraStore } from "@/store/useFloraStore";
import Link from "next/link";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const codeParam = searchParams.get("code") || searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";

  const { verifyEmail, resendVerification, addToast } = useFloraStore();

  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState(codeParam);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (codeParam) setCode(codeParam);
    if (emailParam) setEmail(emailParam);
  }, [codeParam, emailParam]);

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");

    if (!email || !code) {
      setErrorMessage("Please enter both email and verification code.");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyEmail(email.trim(), code.trim());
      if (res.success) {
        setVerified(true);
        addToast("Account verified successfully! Welcome to Flora Fusion.", "success");
      } else {
        setErrorMessage(res.error || "Invalid or expired verification code.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to verify account.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      setErrorMessage("Please enter your email address to request a new verification code.");
      return;
    }
    if (cooldown > 0) return;
    setErrorMessage("");
    setInfoMessage("");
    setLoading(true);
    try {
      const res = await resendVerification(email.trim());
      if (res.success) {
        setInfoMessage(res.message || "A fresh verification code has been dispatched to your email.");
        setCooldown(60);
      } else {
        setErrorMessage(res.error || "Failed to resend code.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to resend code.");
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
      {verified ? (
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
            Account Verified!
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "var(--color-text-secondary, #66786D)",
              lineHeight: 1.6,
              marginBottom: 24,
            }}
          >
            Welcome to Flora Fusion! Your account is active and you are now signed in.
          </p>
          <button
            onClick={() => router.push("/")}
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
            Start Shopping →
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
              Account Activation
            </span>
            <h1
              style={{
                fontFamily: "var(--font-cormorant, serif)",
                fontSize: 30,
                color: "var(--color-forest, #173F2B)",
                margin: 0,
              }}
            >
              Verify Your Email
            </h1>
            <p
              style={{
                fontSize: 13,
                color: "var(--color-text-secondary, #66786D)",
                marginTop: 8,
              }}
            >
              Enter the 6-digit verification code sent to your inbox.
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

          {infoMessage && (
            <div
              style={{
                padding: "10px 14px",
                background: "#DDE7D8",
                border: "1px solid #A9BDA3",
                borderRadius: 8,
                color: "#173F2B",
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              {infoMessage}
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

          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--color-forest, #173F2B)",
                }}
              >
                6-Digit Verification Code
              </label>
              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0 || loading}
                style={{
                  background: "none",
                  border: "none",
                  color: cooldown > 0 || loading ? "#888" : "var(--color-forest, #173F2B)",
                  fontSize: 12,
                  cursor: cooldown > 0 || loading ? "not-allowed" : "pointer",
                  padding: 0,
                  textDecoration: cooldown > 0 ? "none" : "underline",
                }}
              >
                {loading ? "Sending code..." : cooldown > 0 ? `Resend code (${cooldown}s)` : "Resend code"}
              </button>
            </div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
              placeholder="123456"
              maxLength={6}
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 8,
                border: "1px solid var(--color-border, #EAE5D9)",
                fontSize: 20,
                textAlign: "center",
                letterSpacing: 6,
                fontWeight: 700,
                fontFamily: "monospace",
                outline: "none",
                boxSizing: "border-box",
                color: "var(--color-forest, #173F2B)",
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
            {loading ? "Verifying..." : "Verify & Activate Account →"}
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

export default function VerifyEmailPage() {
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
      <Suspense fallback={<div style={{ textAlign: "center", padding: 40, color: "#173F2B" }}>Loading verification form...</div>}>
        <VerifyEmailForm />
      </Suspense>
    </main>
  );
}
