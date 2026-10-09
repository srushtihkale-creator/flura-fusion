"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useFloraStore } from "@/store/useFloraStore";

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authMode,
    setAuthMode,
    login,
    loginWithGoogle,
    register,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
  } = useFloraStore();

  // Sign In form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Sign Up form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Verification state
  const [verifyCode, setVerifyCode] = useState("");
  const [targetEmail, setTargetEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // Forgot / Reset password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPasswordState, setNewPasswordState] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const [isGoogleGsiRendered, setIsGoogleGsiRendered] = useState(false);
  const signinGsiContainerRef = useRef<HTMLDivElement>(null);
  const signupGsiContainerRef = useRef<HTMLDivElement>(null);

  const handleGoogleSuccess = useCallback(async (credential: string) => {
    setLoading(true);
    setErrorMessage("");
    setInfoMessage("");
    const result = await loginWithGoogle(credential);
    setLoading(false);
    if (!result.success) {
      setErrorMessage(result.error || "Google authentication failed. Please try again.");
    }
  }, [loginWithGoogle]);

  // Listen for Google OAuth callback message from popup window
  useEffect(() => {
    const handleAuthMessage = async (event: MessageEvent) => {
      if (typeof window === "undefined") return;
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "GOOGLE_AUTH_SUCCESS" && event.data?.idToken) {
        await handleGoogleSuccess(event.data.idToken);
      } else if (event.data?.type === "GOOGLE_AUTH_ERROR") {
        setErrorMessage(event.data?.error || "Google authentication failed. Please try again.");
        setLoading(false);
      }
    };

    window.addEventListener("message", handleAuthMessage);
    return () => window.removeEventListener("message", handleAuthMessage);
  }, [handleGoogleSuccess]);

  useEffect(() => {
    if (!isAuthModalOpen) return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || clientId.includes("your_google_client_id_here") || clientId.includes("your-client-id-here")) {
      return;
    }

    const initGsi = () => {
      const google = (window as any).google;
      if (!google?.accounts?.id) return;

      try {
        google.accounts.id.initialize({
          client_id: clientId,
          callback: (res: any) => {
            if (res?.credential) {
              handleGoogleSuccess(res.credential);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        const container = authMode === "signup" ? signupGsiContainerRef.current : signinGsiContainerRef.current;
        if (container) {
          container.innerHTML = "";
          google.accounts.id.renderButton(container, {
            theme: "outline",
            size: "large",
            width: 360,
            text: "continue_with",
            shape: "pill",
          });
          setIsGoogleGsiRendered(true);
        }
      } catch (err) {
        console.warn("[AuthModal] GSI initialization error:", err);
      }
    };

    if ((window as any).google?.accounts?.id) {
      initGsi();
    } else {
      let script = document.getElementById("google-gsi-client") as HTMLScriptElement;
      if (!script) {
        script = document.createElement("script");
        script.id = "google-gsi-client";
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      }
      script.addEventListener("load", initGsi);
      return () => script.removeEventListener("load", initGsi);
    }
  }, [isAuthModalOpen, authMode, handleGoogleSuccess]);

  const handleGoogleSignInClick = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || clientId.includes("your_google_client_id_here") || clientId.includes("your-client-id-here")) {
      setErrorMessage(
        "Google Client ID is not configured yet. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your environment (.env.local) and configure Authorized redirect URIs in Google Cloud Console."
      );
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setInfoMessage("");

    // Generate secure random nonce for OpenID Connect
    const nonce = Math.random().toString(36).substring(2) + Date.now().toString(36);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("flora_oauth_nonce", nonce);
    }

    const redirectUri = `${window.location.origin}/auth/callback`;
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "id_token");
    authUrl.searchParams.set("scope", "openid email profile");
    authUrl.searchParams.set("nonce", nonce);
    authUrl.searchParams.set("prompt", "select_account");

    // Open Google's real account-selection screen in an official popup
    const width = 500;
    const height = 640;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      authUrl.toString(),
      "google_oauth_popup",
      `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
    );

    if (!popup || popup.closed || typeof popup.closed === "undefined") {
      // Fallback to full page redirect if popup was blocked
      window.location.href = authUrl.toString();
    } else {
      popup.focus();
      const checkPopupClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopupClosed);
          setLoading(false);
        }
      }, 1000);
    }
  };

  const renderGoogleAuthButton = (containerRef: React.RefObject<HTMLDivElement>) => (
    <>
      <div style={{ display: "flex", alignItems: "center", margin: "14px 0", gap: "10px" }}>
        <div style={{ flex: 1, height: "1px", backgroundColor: "var(--color-border-light, #E2E8F0)" }} />
        <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted, #718096)", textTransform: "uppercase", letterSpacing: "0.05em" }}>or</span>
        <div style={{ flex: 1, height: "1px", backgroundColor: "var(--color-border-light, #E2E8F0)" }} />
      </div>

      <div style={{ marginBottom: "16px", minHeight: "44px", display: "flex", justifyContent: "center" }}>
        <div ref={containerRef} style={{ width: "100%", display: isGoogleGsiRendered ? "flex" : "none", justifyContent: "center" }} />
        {!isGoogleGsiRendered && (
          <button
            type="button"
            onClick={handleGoogleSignInClick}
            disabled={loading}
            style={{
              width: "100%",
              padding: "11px 16px",
              fontSize: "0.875rem",
              fontWeight: 600,
              borderRadius: "var(--radius-pill, 999px)",
              border: "1px solid var(--color-border, #CBD5E1)",
              backgroundColor: "#FFFFFF",
              color: "#1F2937",
              cursor: loading ? "wait" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              transition: "all 0.2s ease",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12c0 1.97.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            Continue with Google
          </button>
        )}
      </div>
    </>
  );

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (authMode === "verify" && !targetEmail) {
      const fallback = (email || regEmail).trim();
      if (fallback) {
        setTargetEmail(fallback);
      } else if (typeof window !== "undefined") {
        try {
          const stored = JSON.parse(localStorage.getItem("flora_user") || "{}");
          if (stored.email) setTargetEmail(stored.email);
        } catch {}
      }
    }
  }, [authMode, targetEmail, email, regEmail]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setInfoMessage("");

    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      const err = result.error || "Authentication failed. Please check your credentials.";
      setErrorMessage(err);
      if (err.toLowerCase().includes("not verified")) {
        setTargetEmail(email);
        setAuthMode("verify");
      }
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
    setInfoMessage("");

    const result = await register(regName, regEmail, regPassword, regPhone);
    setLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || "Account creation failed. Please check your details.");
    } else if (result.requiresVerification) {
      setTargetEmail(result.email || regEmail);
      setAuthMode("verify");
      setCooldown(60);
      setInfoMessage(`We sent a 6-digit verification code to ${result.email || regEmail}.`);
      setRegPassword("");
    } else {
      setRegName("");
      setRegEmail("");
      setRegPhone("");
      setRegPassword("");
      setErrorMessage("");
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveEmail = (targetEmail || email || regEmail).trim();
    if (!effectiveEmail) {
      setErrorMessage("Please enter your email address.");
      return;
    }
    if (!verifyCode.trim()) {
      setErrorMessage("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setInfoMessage("");

    const result = await verifyEmail(effectiveEmail, verifyCode.trim());
    setLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || "Verification failed. Please check the code.");
    } else {
      setVerifyCode("");
      setErrorMessage("");
      setInfoMessage("");
    }
  };

  const handleResendCode = async () => {
    const effectiveEmail = (targetEmail || email || regEmail).trim();
    if (!effectiveEmail) {
      setErrorMessage("Please enter your email address to receive a verification code.");
      return;
    }
    if (cooldown > 0) return;

    setLoading(true);
    setErrorMessage("");
    setInfoMessage("");
    try {
      const result = await resendVerification(effectiveEmail);
      if (result.success) {
        setCooldown(60);
        setInfoMessage(result.message || `A new verification code has been dispatched to ${effectiveEmail}.`);
      } else {
        setErrorMessage(result.error || "Failed to resend code.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setInfoMessage("");

    const result = await forgotPassword(forgotEmail.trim());
    setLoading(false);

    if (result.success) {
      setAuthMode("reset");
      setInfoMessage(result.message || "If an account exists, a reset code has been sent to your email.");
    } else {
      setErrorMessage(result.error || "Failed to process request.");
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetCode.trim() || !newPasswordState) {
      setErrorMessage("Please enter the reset code and your new password.");
      return;
    }

    if (newPasswordState.length < 6) {
      setErrorMessage("New password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setInfoMessage("");

    const result = await resetPassword(forgotEmail.trim(), resetCode.trim(), newPasswordState);
    setLoading(false);

    if (result.success) {
      setAuthMode("signin");
      setEmail(forgotEmail);
      setPassword("");
      setResetCode("");
      setNewPasswordState("");
      setInfoMessage("Password successfully reset! Please sign in with your new password.");
    } else {
      setErrorMessage(result.error || "Password reset failed.");
    }
  };

  const fillQuick = (testEmail: string) => {
    setEmail(testEmail);
    setPassword("Password@123");
    setErrorMessage("");
    setInfoMessage("");
  };

  const switchTab = (mode: "signin" | "signup" | "verify" | "forgot" | "reset") => {
    setAuthMode(mode);
    setErrorMessage("");
    setInfoMessage("");
  };

  const getModalTitle = () => {
    switch (authMode) {
      case "signin":
        return "Sign In to Flora Fusion";
      case "signup":
        return "Create Your Account";
      case "verify":
        return "Verify Your Email 🌿";
      case "forgot":
        return "Forgot Password 🔐";
      case "reset":
        return "Set New Password 🔑";
      default:
        return "Flora Fusion Authentication";
    }
  };

  const getModalSubtitle = () => {
    switch (authMode) {
      case "signin":
        return "Access your garden, track nursery shipments & manage wishlist";
      case "signup":
        return "Join Flora Fusion for fresh plants, express delivery & botanical care";
      case "verify":
        return `Enter the 6-digit verification code sent to ${targetEmail || "your email"}`;
      case "forgot":
        return "Enter your email address to receive a secure password reset code";
      case "reset":
        return "Enter the 6-digit code received in your email and choose a new password";
      default:
        return "";
    }
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
            {getModalTitle()}
          </h2>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--color-text-secondary, #4A5568)",
              margin: 0,
            }}
          >
            {getModalSubtitle()}
          </p>
        </div>

        {/* Tab Toggle: Sign In vs Create Account */}
        {(authMode === "signin" || authMode === "signup") && (
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
        )}

        {/* Info Notification Message */}
        {infoMessage && (
          <div
            style={{
              backgroundColor: "var(--color-brand-sage-light, #DDE7D8)",
              color: "var(--color-brand-forest, #173F2B)",
              border: "1px solid var(--color-brand-sage, #A9BDA3)",
              padding: "10px 14px",
              borderRadius: "var(--radius-md, 8px)",
              fontSize: "0.8125rem",
              marginBottom: "16px",
            }}
          >
            {infoMessage}
          </div>
        )}

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

        {/* 1. SIGN IN FORM */}
        {authMode === "signin" && (
          <div>
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

              <div style={{ marginBottom: "12px" }}>
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

              {/* Forgot Password Link */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "18px" }}>
                <button
                  type="button"
                  onClick={() => switchTab("forgot")}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "0.8125rem",
                    color: "var(--color-brand-forest, #173F2B)",
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: 0,
                    textDecoration: "underline",
                  }}
                >
                  Forgot password?
                </button>
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

              {renderGoogleAuthButton(signinGsiContainerRef)}

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
        )}

        {/* 2. CREATE ACCOUNT FORM */}
        {authMode === "signup" && (
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
                {loading ? "Sending verification..." : "Create Account →"}
              </button>

              {renderGoogleAuthButton(signupGsiContainerRef)}

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

        {/* 3. EMAIL VERIFICATION FORM */}
        {authMode === "verify" && (
          <div>
            <form onSubmit={handleVerifySubmit}>
              <div style={{ marginBottom: "14px" }}>
                <label
                  htmlFor="verify-target-email"
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
                  id="verify-target-email"
                  type="email"
                  required
                  value={targetEmail}
                  onChange={(e) => setTargetEmail(e.target.value)}
                  placeholder="srushti.h.kale2004@gmail.com"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
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
                  htmlFor="verify-code"
                  style={{
                    display: "block",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--color-brand-forest, #173F2B)",
                    marginBottom: "8px",
                    textAlign: "center",
                  }}
                >
                  6-Digit Verification Code
                </label>
                <input
                  id="verify-code"
                  type="text"
                  required
                  maxLength={6}
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "var(--radius-md, 8px)",
                    border: "2px solid var(--color-brand-forest, #173F2B)",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    letterSpacing: "8px",
                    textAlign: "center",
                    outline: "none",
                    boxSizing: "border-box",
                    backgroundColor: "var(--color-cream-soft, #FBF9F4)",
                    color: "var(--color-brand-forest, #173F2B)",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading || verifyCode.length < 6}
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "13px",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  borderRadius: "var(--radius-pill, 999px)",
                  cursor: loading || verifyCode.length < 6 ? "not-allowed" : "pointer",
                  opacity: verifyCode.length < 6 ? 0.7 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginBottom: "16px",
                }}
              >
                {loading ? "Verifying..." : "Verify & Activate Account →"}
              </button>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8125rem" }}>
                <button
                  type="button"
                  disabled={cooldown > 0 || loading}
                  onClick={handleResendCode}
                  style={{
                    background: "none",
                    border: "none",
                    color: cooldown > 0 ? "var(--color-text-muted, #718096)" : "var(--color-brand-forest, #173F2B)",
                    fontWeight: 600,
                    cursor: cooldown > 0 || loading ? "default" : "pointer",
                    padding: 0,
                    textDecoration: cooldown > 0 ? "none" : "underline",
                  }}
                >
                  {loading ? "Sending code..." : cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend Code 🔄"}
                </button>

                <button
                  type="button"
                  onClick={() => switchTab("signin")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--color-text-muted, #718096)",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 4. FORGOT PASSWORD FORM */}
        {authMode === "forgot" && (
          <div>
            <form onSubmit={handleForgotSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="forgot-email"
                  style={{
                    display: "block",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--color-brand-forest, #173F2B)",
                    marginBottom: "6px",
                  }}
                >
                  Account Email Address
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
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
                {loading ? "Sending..." : "Send Reset Code →"}
              </button>

              <div style={{ textAlign: "center", fontSize: "0.8125rem" }}>
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
                  ← Back to Sign In
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 5. RESET PASSWORD FORM */}
        {authMode === "reset" && (
          <div>
            <form onSubmit={handleResetSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label
                  htmlFor="reset-code"
                  style={{
                    display: "block",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--color-brand-forest, #173F2B)",
                    marginBottom: "6px",
                    textAlign: "center",
                  }}
                >
                  6-Digit Reset Code
                </label>
                <input
                  id="reset-code"
                  type="text"
                  required
                  maxLength={6}
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "var(--radius-md, 8px)",
                    border: "1px solid var(--color-border, #CBD5E1)",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    letterSpacing: "6px",
                    textAlign: "center",
                    outline: "none",
                    boxSizing: "border-box",
                    backgroundColor: "var(--color-cream-soft, #FBF9F4)",
                    color: "var(--color-brand-forest, #173F2B)",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="new-password"
                  style={{
                    display: "block",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--color-brand-forest, #173F2B)",
                    marginBottom: "6px",
                  }}
                >
                  New Password (min 6 characters)
                </label>
                <input
                  id="new-password"
                  type="password"
                  required
                  minLength={6}
                  value={newPasswordState}
                  onChange={(e) => setNewPasswordState(e.target.value)}
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
                disabled={loading || resetCode.length < 6}
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "13px",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  borderRadius: "var(--radius-pill, 999px)",
                  cursor: loading || resetCode.length < 6 ? "not-allowed" : "pointer",
                  opacity: resetCode.length < 6 ? 0.7 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginBottom: "16px",
                }}
              >
                {loading ? "Resetting..." : "Reset Password & Sign In →"}
              </button>

              <div style={{ textAlign: "center", fontSize: "0.8125rem" }}>
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
                  ← Back to Sign In
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
