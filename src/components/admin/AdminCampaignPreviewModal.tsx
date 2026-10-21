"use client";

import React, { useState } from "react";
import { CampaignPreview } from "@/types/campaign";

interface AdminCampaignPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  preview: CampaignPreview | null;
  loading: boolean;
  onApprove: (campaignId: string) => Promise<void>;
  onTrigger: (campaignId: string, testMode: boolean, testRecipient?: string) => Promise<void>;
}

export function AdminCampaignPreviewModal({
  isOpen,
  onClose,
  preview,
  loading,
  onApprove,
  onTrigger,
}: AdminCampaignPreviewModalProps) {
  const [actionLoading, setActionLoading] = useState(false);
  const [testEmailInput, setTestEmailInput] = useState("srushti.h.kale2004@gmail.com");

  if (!isOpen) return null;

  const handleApprove = async () => {
    if (!preview) return;
    setActionLoading(true);
    try {
      await onApprove(preview.campaignId);
    } finally {
      setActionLoading(false);
    }
  };

  const handleTriggerTest = async () => {
    if (!preview) return;
    setActionLoading(true);
    try {
      await onTrigger(preview.campaignId, true, testEmailInput);
      onClose();
    } finally {
      setActionLoading(false);
    }
  };

  const handleTriggerLive = async () => {
    if (!preview) return;
    if (!window.confirm(`⚠️ CONFIRM LIVE DISPATCH:\n\nAre you sure you want to dispatch this promotional campaign to ${preview.eligibleRecipientCount} verified, opted-in Flora Fusion customer(s)?\n\nThis will trigger the n8n Cloud workflow and send real emails via Gmail SMTP.`)) {
      return;
    }
    setActionLoading(true);
    try {
      await onTrigger(preview.campaignId, false);
      onClose();
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(18, 50, 34, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1060,
        padding: "16px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "var(--radius-lg, 16px)",
          maxWidth: "760px",
          width: "100%",
          height: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "var(--shadow-lg, 0 20px 40px rgba(0,0,0,0.2))",
          border: "1px solid var(--color-border-light, #E2E8F0)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid var(--color-border-light, #E2E8F0)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#FAF8F5",
          }}
        >
          <div>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, color: "var(--color-brand-terracotta, #B9825B)" }}>
              Campaign Email Preview & Approval
            </div>
            <h2
              style={{
                fontFamily: "var(--font-serif, 'Cormorant Garamond', Georgia, serif)",
                fontSize: "1.375rem",
                color: "var(--color-brand-forest, #173F2B)",
                margin: "2px 0 0",
              }}
            >
              {preview?.title || "Campaign Preview"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "var(--color-text-muted, #718096)",
            }}
          >
            ✕
          </button>
        </div>

        {/* Campaign Metadata Strip */}
        {preview && (
          <div
            style={{
              padding: "12px 24px",
              backgroundColor: "#FFFFFF",
              borderBottom: "1px solid #E2E8F0",
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              fontSize: "0.8125rem",
              color: "var(--color-text-secondary, #4A5568)",
            }}
          >
            <div>
              <strong>Subject:</strong> <code>{preview.subject}</code>
            </div>
            {preview.couponCode && (
              <div>
                <strong>Coupon:</strong> <span style={{ color: "var(--color-brand-forest)", fontWeight: 700 }}>{preview.couponCode}</span> ({preview.discountSummary})
              </div>
            )}
            <div>
              <strong>Audience:</strong> {preview.eligibleRecipientCount} opted-in subscriber(s)
            </div>
            <div>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: "999px",
                  fontWeight: 700,
                  fontSize: "0.6875rem",
                  backgroundColor: preview.status === "APPROVED" ? "#EBF8EE" : "#F7FAFC",
                  color: preview.status === "APPROVED" ? "#276749" : "#4A5568",
                }}
              >
                {preview.status}
              </span>
            </div>
          </div>
        )}

        {/* Email Live Preview (Iframe) */}
        <div style={{ flex: 1, backgroundColor: "#F7F4EC", position: "relative", overflow: "hidden" }}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--color-text-muted)" }}>
              Rendering botanical email preview...
            </div>
          ) : preview?.renderedHtml ? (
            <iframe
              srcDoc={preview.renderedHtml}
              title="Promotional Email Preview"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                display: "block",
              }}
              sandbox="allow-same-origin"
            />
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--color-text-muted)" }}>
              No preview available.
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--color-border-light, #E2E8F0)",
            backgroundColor: "#FFFFFF",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          {/* Test Dispatch Helper */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontWeight: 600 }}>Authorized Test:</span>
            <input
              type="email"
              value={testEmailInput}
              readOnly
              title="Test mode is strictly locked by backend security to the authorized administrator inbox"
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: "1px solid #CBD5E0",
                fontSize: "0.75rem",
                width: "210px",
                backgroundColor: "#F7FAFC",
                color: "#2D3748",
                cursor: "default",
              }}
            />
            <button
              type="button"
              disabled={actionLoading}
              onClick={handleTriggerTest}
              className="btn-secondary"
              style={{ padding: "7px 14px", fontSize: "0.75rem", whiteSpace: "nowrap" }}
              title="Triggers n8n to send exclusively to test recipient"
            >
              🚀 Send Test Email
            </button>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {preview?.status === "DRAFT" && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleApprove}
                className="btn-primary"
                style={{ padding: "8px 18px", fontSize: "0.8125rem", backgroundColor: "var(--color-brand-green, #24583B)" }}
              >
                ✓ Approve Campaign
              </button>
            )}

            {preview?.status === "APPROVED" && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleTriggerLive}
                className="btn-primary"
                style={{ padding: "8px 18px", fontSize: "0.8125rem" }}
              >
                🚀 Dispatch to Customers ({preview.eligibleRecipientCount})
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ padding: "8px 16px", fontSize: "0.8125rem" }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
