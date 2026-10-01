"use client";

import React, { useState } from "react";

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
      <aside className="site-subfooter" aria-label="Legal & Policies">
        <div className="container subfooter-inner">
          <div className="subfooter-copyright">
            © <span className="current-year">{new Date().getFullYear()}</span> Flora Fusion. All rights reserved.
          </div>
          <div className="subfooter-legal-links">
            <button
              type="button"
              className="subfooter-legal-link"
              onClick={() => setActivePolicy("terms")}
              style={{ background: "none", border: "none", font: "inherit", padding: 0 }}
            >
              Terms & Conditions
            </button>
            <span className="subfooter-separator">•</span>
            <button
              type="button"
              className="subfooter-legal-link"
              onClick={() => setActivePolicy("shipping")}
              style={{ background: "none", border: "none", font: "inherit", padding: 0 }}
            >
              Shipping Policy
            </button>
            <span className="subfooter-separator">•</span>
            <button
              type="button"
              className="subfooter-legal-link"
              onClick={() => setActivePolicy("privacy")}
              style={{ background: "none", border: "none", font: "inherit", padding: 0 }}
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </aside>

      {/* Policy Modal */}
      {activePolicy && (
        <div
          id="policy-modal"
          className="modal-backdrop open"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActivePolicy(null);
          }}
        >
          <div className="modal-container policy-modal-container" style={{ maxWidth: "560px" }}>
            <button
              type="button"
              id="policy-modal-close"
              className="modal-close-btn"
              title="Close"
              onClick={() => setActivePolicy(null)}
            >
              ✕
            </button>
            <h2 id="policy-modal-title" className="policy-modal-title" style={{ marginBottom: "16px" }}>
              {policyContent[activePolicy]?.title}
            </h2>
            <div id="policy-modal-body" className="policy-modal-body" style={{ lineHeight: 1.7, fontSize: "0.9375rem" }}>
              <p>{policyContent[activePolicy]?.body}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
