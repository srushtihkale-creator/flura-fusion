"use client";

import React, { useState, useEffect } from "react";
import { CampaignCreatePayload, EmailCampaign } from "@/types/campaign";
import { CouponResponse } from "@/services/coupon.service";

interface AdminCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: CampaignCreatePayload, campaignId?: string) => Promise<void>;
  campaignToEdit?: EmailCampaign | null;
  coupons: CouponResponse[];
}

export function AdminCampaignModal({
  isOpen,
  onClose,
  onSave,
  campaignToEdit,
  coupons,
}: AdminCampaignModalProps) {
  const [form, setForm] = useState<CampaignCreatePayload>({
    title: "",
    subject: "",
    promotionalMessage: "",
    couponCode: "",
    targetCategory: "all",
    testMode: true,
    testRecipient: "srushti.h.kale2004@gmail.com",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (campaignToEdit) {
      setForm({
        title: campaignToEdit.title,
        subject: campaignToEdit.subject,
        promotionalMessage: campaignToEdit.promotionalMessage,
        couponCode: campaignToEdit.couponCode || "",
        targetCategory: campaignToEdit.targetCategory || "all",
        testMode: campaignToEdit.testMode,
        testRecipient: campaignToEdit.testRecipient || "srushti.h.kale2004@gmail.com",
      });
    } else {
      setForm({
        title: "",
        subject: "",
        promotionalMessage: "",
        couponCode: coupons.length > 0 ? coupons[0].code : "",
        targetCategory: "all",
        testMode: true,
        testRecipient: "srushti.h.kale2004@gmail.com",
      });
    }
    setError(null);
  }, [campaignToEdit, coupons, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Please provide a campaign title.");
      return;
    }
    if (!form.subject.trim()) {
      setError("Please provide an email subject line.");
      return;
    }
    if (!form.promotionalMessage.trim()) {
      setError("Please write the promotional email body message.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSave(form, campaignToEdit?.id);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to save campaign");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(18, 50, 34, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1050,
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
          maxWidth: "640px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "var(--shadow-lg, 0 20px 40px rgba(0,0,0,0.15))",
          border: "1px solid var(--color-border-light, #E2E8F0)",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--color-border-light, #E2E8F0)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "var(--font-serif, 'Cormorant Garamond', Georgia, serif)",
                fontSize: "1.5rem",
                color: "var(--color-brand-forest, #173F2B)",
                margin: 0,
              }}
            >
              {campaignToEdit ? "Edit Promotional Campaign" : "Create New Promotional Campaign"}
            </h2>
            <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted, #718096)", margin: "4px 0 0" }}>
              Configure promotional message, linked discount voucher, and eligible audience.
            </p>
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
          {error && (
            <div
              style={{
                backgroundColor: "#FFF5F5",
                color: "#C53030",
                border: "1px solid #FEB2B2",
                padding: "12px",
                borderRadius: "var(--radius-md, 8px)",
                marginBottom: "20px",
                fontSize: "0.875rem",
              }}
            >
              {error}
            </div>
          )}

          {/* Internal Title */}
          <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-brand-forest)", marginBottom: "6px" }}>
              Campaign Internal Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Monsoon Indoor Plant Special"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "var(--radius-md, 8px)",
                border: "1px solid var(--color-border-light, #CBD5E0)",
                fontSize: "0.875rem",
                outline: "none",
              }}
            />
          </div>

          {/* Email Subject */}
          <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-brand-forest)", marginBottom: "6px" }}>
              Email Subject Line (Sent to Customers) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Bring Lush Greenery Indoors with 10% OFF 🌿"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "var(--radius-md, 8px)",
                border: "1px solid var(--color-border-light, #CBD5E0)",
                fontSize: "0.875rem",
                outline: "none",
              }}
            />
          </div>

          {/* Target Category & Linked Coupon Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "18px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-brand-forest)", marginBottom: "6px" }}>
                Target Category
              </label>
              <select
                value={form.targetCategory}
                onChange={(e) => setForm({ ...form, targetCategory: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-md, 8px)",
                  border: "1px solid var(--color-border-light, #CBD5E0)",
                  fontSize: "0.875rem",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <option value="all">All Categories (/plants)</option>
                <option value="plants">Plants Only (/plants)</option>
                <option value="pots">Pots Only (/pots)</option>
                <option value="seeds">Seeds Only (/seeds)</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-brand-forest)", marginBottom: "6px" }}>
                Linked Discount Coupon (Optional)
              </label>
              <select
                value={form.couponCode || ""}
                onChange={(e) => setForm({ ...form, couponCode: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-md, 8px)",
                  border: "1px solid var(--color-border-light, #CBD5E0)",
                  fontSize: "0.875rem",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <option value="">None (General Botanical Announcement)</option>
                {coupons.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.title || c.bannerText || `${c.discountValue}% OFF`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Promotional Message */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-brand-forest)", marginBottom: "6px" }}>
              Promotional Message Body *
            </label>
            <textarea
              required
              rows={5}
              placeholder="Transform your living room and balcony with our vibrant hand-picked indoor collection. Use your exclusive coupon at checkout to enjoy this seasonal offer before stocks run out!"
              value={form.promotionalMessage}
              onChange={(e) => setForm({ ...form, promotionalMessage: e.target.value })}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "var(--radius-md, 8px)",
                border: "1px solid var(--color-border-light, #CBD5E0)",
                fontSize: "0.875rem",
                fontFamily: "inherit",
                lineHeight: 1.6,
                outline: "none",
              }}
            />
          </div>

          {/* Test Mode Guard */}
          <div
            style={{
              backgroundColor: "var(--color-cream-soft, #FBF9F4)",
              border: "1px solid var(--color-border-light, #E2E8F0)",
              borderRadius: "var(--radius-md, 8px)",
              padding: "16px",
              marginBottom: "24px",
            }}
          >
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem", color: "var(--color-brand-forest)" }}>
              <input
                type="checkbox"
                checked={form.testMode}
                onChange={(e) => setForm({ ...form, testMode: e.target.checked })}
                style={{ width: "16px", height: "16px", accentColor: "var(--color-brand-forest)" }}
              />
              🛡️ Safe Test Mode (Restricts sending strictly to test recipient)
            </label>

            {form.testMode && (
              <div style={{ marginTop: "12px", paddingLeft: "26px" }}>
                <label style={{ display: "block", fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>
                  Designated Test Email Address:
                </label>
                <input
                  type="email"
                  value={form.testRecipient || ""}
                  onChange={(e) => setForm({ ...form, testRecipient: e.target.value })}
                  placeholder="srushti.h.kale2004@gmail.com"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #CBD5E0",
                    fontSize: "0.8125rem",
                  }}
                />
              </div>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", borderTop: "1px solid var(--color-border-light, #E2E8F0)", paddingTop: "16px" }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ padding: "10px 20px", fontSize: "0.875rem" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
              style={{ padding: "10px 24px", fontSize: "0.875rem" }}
            >
              {saving ? "Saving Campaign..." : campaignToEdit ? "Update Campaign" : "Save as Draft"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
