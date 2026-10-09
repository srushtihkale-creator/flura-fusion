"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFloraStore } from "@/store/useFloraStore";

/**
 * Google OAuth 2.0 / OpenID Connect Callback Handler
 * Receives the redirected token or error from accounts.google.com,
 * notifies the parent popup opener (or logs in directly if full-page redirect),
 * and restores the customer session.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const processCallback = async () => {
      try {
        if (typeof window === "undefined") return;

        // Parse token and errors from URL hash fragment (#id_token=... or #error=...) or query string (?error=...)
        const hash = window.location.hash.startsWith("#") ? window.location.hash.substring(1) : window.location.hash;
        const hashParams = new URLSearchParams(hash);
        const searchParams = new URLSearchParams(window.location.search);

        const error = hashParams.get("error") || searchParams.get("error");
        const errorDescription = hashParams.get("error_description") || searchParams.get("error_description");

        if (error) {
          const formattedError =
            error === "access_denied"
              ? "Sign-in cancelled. Please select a Google account to continue."
              : errorDescription || `Google authentication error: ${error}`;

          if (window.opener && !window.opener.closed) {
            window.opener.postMessage({ type: "GOOGLE_AUTH_ERROR", error: formattedError }, window.location.origin);
            window.close();
            return;
          }

          setStatus("error");
          setErrorMessage(formattedError);
          return;
        }

        // Extract ID token (JWT)
        const idToken =
          hashParams.get("id_token") ||
          searchParams.get("id_token") ||
          hashParams.get("credential") ||
          searchParams.get("credential");

        if (!idToken) {
          const errorMsg = "No Google ID token was received from the authentication provider.";
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage({ type: "GOOGLE_AUTH_ERROR", error: errorMsg }, window.location.origin);
            window.close();
            return;
          }

          setStatus("error");
          setErrorMessage(errorMsg);
          return;
        }

        // 1. Popup mode: Post message to parent Flora Fusion window and close popup
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage({ type: "GOOGLE_AUTH_SUCCESS", idToken }, window.location.origin);
          setStatus("success");
          setTimeout(() => {
            try {
              window.close();
            } catch {}
          }, 350);
          return;
        }

        // 2. Full-page redirect mode: Authenticate directly in current window
        const store = useFloraStore.getState();
        const result = await store.loginWithGoogle(idToken);

        if (result.success) {
          setStatus("success");
          router.replace("/account");
        } else {
          setStatus("error");
          setErrorMessage(result.error || "Google authentication failed. Please try again.");
        }
      } catch (err: any) {
        const errorMsg = err?.message || "An unexpected error occurred during Google authentication.";
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage({ type: "GOOGLE_AUTH_ERROR", error: errorMsg }, window.location.origin);
          window.close();
          return;
        }
        setStatus("error");
        setErrorMessage(errorMsg);
      }
    };

    processCallback();
  }, [router]);

  return (
    <div
      style={{
        minHeight: "75vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
        textAlign: "center",
        backgroundColor: "var(--color-cream, #F7F4EC)",
        color: "var(--color-brand-forest, #173F2B)",
        fontFamily: "var(--font-sans, Inter, sans-serif)",
      }}
    >
      {status === "processing" && (
        <div style={{ maxWidth: "420px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              margin: "0 auto 20px",
              border: "3px solid var(--color-brand-sage-light, #DDE7D8)",
              borderTopColor: "var(--color-brand-forest, #173F2B)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <h2 style={{ fontFamily: "var(--font-serif, Cormorant Garamond, serif)", fontSize: "1.75rem", marginBottom: "8px" }}>
            Connecting with Google... 🌿
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted, #718096)" }}>
            Please wait while we securely verify your Google account.
          </p>
        </div>
      )}

      {status === "success" && (
        <div style={{ maxWidth: "420px" }}>
          <span style={{ fontSize: "2.5rem", marginBottom: "16px", display: "block" }}>🌿</span>
          <h2 style={{ fontFamily: "var(--font-serif, Cormorant Garamond, serif)", fontSize: "1.75rem", marginBottom: "8px" }}>
            Signed In Successfully!
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted, #718096)" }}>
            Redirecting to your Flora Fusion account...
          </p>
        </div>
      )}

      {status === "error" && (
        <div
          style={{
            maxWidth: "460px",
            backgroundColor: "#FFFFFF",
            padding: "36px 28px",
            borderRadius: "var(--radius-card, 16px)",
            boxShadow: "0 8px 30px rgba(23,63,43,0.08)",
            border: "1px solid var(--color-border-light, #E2E8F0)",
          }}
        >
          <span style={{ fontSize: "2.5rem", marginBottom: "12px", display: "block" }}>⚠️</span>
          <h2
            style={{
              fontFamily: "var(--font-serif, Cormorant Garamond, serif)",
              fontSize: "1.75rem",
              marginBottom: "12px",
              color: "#C53030",
            }}
          >
            Google Sign-In Notice
          </h2>
          <p style={{ fontSize: "0.875rem", color: "#4A5568", marginBottom: "24px", lineHeight: 1.6 }}>
            {errorMessage}
          </p>
          <button
            onClick={() => router.push("/")}
            style={{
              padding: "11px 26px",
              backgroundColor: "var(--color-brand-forest, #173F2B)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "var(--radius-pill, 999px)",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "opacity 0.2s ease",
            }}
          >
            Return to Flora Fusion →
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
