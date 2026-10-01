"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

export function SubFooter() {
  const [activePolicy, setActivePolicy] = useState<string | null>(null);

  const policyContent: Record<string, { title: string; body: string }> = {
    terms: {
      title: "Terms & Conditions",
      body: "Welcome to Flora Fusion. By browsing our website and ordering healthy plants, pots, and seeds, you agree to our standard terms of service. All plant specimens are inspected for robust health prior to transit dispatch.",
    },
    shipping: {
      title: "Shipping Policy",
      body: "We provide transit-safe biodegradable packaging with root protection. Orders above ₹799 qualify for Free Standard Delivery across India. Standard transit takes 3-5 business days. Express Climate Delivery arrives in 24-48 hours.",
    },
    privacy: {
      title: "Privacy Policy",
      body: "Your privacy is sacred to Flora Fusion. We never sell or distribute your personal contact information. Your shipping address and phone number are used strictly for delivering your nursery orders and transit updates.",
    },
  };

  return (
    <>
      <aside
        style={{
          backgroundColor: "var(--color-brand-deep)",
          color: "rgba(255, 255, 255, 0.75)",
          padding: "var(--space-4) 0",
          fontSize: "var(--text-caption)",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        }}
        aria-label="Legal & Policies"
      >
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "var(--space-3)",
          }}
        >
          <div>
            © {new Date().getFullYear()} Flora Fusion. All rights reserved.
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <button
              onClick={() => setActivePolicy("terms")}
              style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "var(--text-caption)", padding: 0 }}
            >
              Terms & Conditions
            </button>
            <span>•</span>
            <button
              onClick={() => setActivePolicy("shipping")}
              style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "var(--text-caption)", padding: 0 }}
            >
              Shipping Policy
            </button>
            <span>•</span>
            <button
              onClick={() => setActivePolicy("privacy")}
              style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "var(--text-caption)", padding: 0 }}
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </aside>

      {/* Policy Modal */}
      {activePolicy && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: "var(--z-modal)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--space-4)",
          }}
          onClick={() => setActivePolicy(null)}
        >
          <div
            style={{
              backgroundColor: "var(--color-surface)",
              borderRadius: "var(--radius-md)",
              padding: "var(--space-6)",
              maxWidth: "500px",
              width: "100%",
              boxShadow: "var(--shadow-lg)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-3)" }}>
              <h3 style={{ margin: 0, fontSize: "var(--text-h4)" }}>{policyContent[activePolicy].title}</h3>
              <button onClick={() => setActivePolicy(null)} style={{ padding: "4px" }}>
                <X size={18} />
              </button>
            </div>
            <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
              {policyContent[activePolicy].body}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
