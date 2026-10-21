"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CampaignService } from "@/services/campaign.service";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error" | "idle">("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No valid unsubscribe token provided. If you clicked a link from an email, please ensure the complete link was opened.");
      return;
    }

    let isMounted = true;
    setStatus("loading");

    CampaignService.unsubscribe(token)
      .then((res) => {
        if (!isMounted) return;
        if (res.success) {
          setStatus("success");
          setMessage("You have been successfully unsubscribed from Flora Fusion promotional emails. You will no longer receive seasonal offers or marketing announcements.");
        } else {
          setStatus("error");
          setMessage(res.message || "Invalid or expired unsubscribe link.");
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setStatus("error");
        setMessage(err?.message || "Unable to process unsubscribe request. Please try again or contact support.");
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <div
      style={{
        maxWidth: "540px",
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: "var(--radius-lg, 16px)",
        padding: "40px 32px",
        boxShadow: "var(--shadow-md, 0 10px 25px rgba(23, 63, 43, 0.08))",
        border: "1px solid var(--color-border-light, #E2E8F0)",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "3rem", marginBottom: "16px" }}>
        {status === "loading" ? "⏳" : status === "success" ? "🌱" : "🌿"}
      </div>

      <h1
        style={{
          fontFamily: "var(--font-serif, 'Cormorant Garamond', Georgia, serif)",
          fontSize: "2rem",
          color: "var(--color-brand-forest, #173F2B)",
          marginBottom: "12px",
        }}
      >
        {status === "loading"
          ? "Processing Unsubscribe..."
          : status === "success"
          ? "Unsubscribed Successfully"
          : "Unsubscribe Preference"}
      </h1>

      <p
        style={{
          color: "var(--color-text-secondary, #4A5568)",
          fontSize: "0.9375rem",
          lineHeight: 1.6,
          marginBottom: "28px",
        }}
      >
        {status === "loading" ? "Updating your email preferences..." : message}
      </p>

      {status === "success" && (
        <div
          style={{
            backgroundColor: "var(--color-cream-soft, #FBF9F4)",
            border: "1px solid var(--color-border-light, #E2E8F0)",
            borderRadius: "var(--radius-md, 8px)",
            padding: "16px",
            fontSize: "0.8125rem",
            color: "var(--color-text-muted, #718096)",
            marginBottom: "28px",
            textAlign: "left",
          }}
        >
          ℹ️ <strong>Note:</strong> You will still receive essential transactional emails (order confirmations, delivery updates, and password resets) for any purchases you make.
        </div>
      )}

      <div>
        <Link
          href="/"
          className="btn-primary"
          style={{
            padding: "12px 28px",
            fontSize: "0.9375rem",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Return to Flora Fusion 🌿
        </Link>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div
      style={{
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 16px",
        backgroundColor: "var(--color-cream, #F7F4EC)",
      }}
    >
      <Suspense fallback={<div style={{ textAlign: "center", color: "var(--color-text-muted)" }}>Loading preferences...</div>}>
        <UnsubscribeContent />
      </Suspense>
    </div>
  );
}
