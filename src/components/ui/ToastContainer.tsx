"use client";

import React from "react";
import { useFloraStore } from "@/store/useFloraStore";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useFloraStore();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "84px",
        right: "24px",
        zIndex: "var(--z-toast)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        pointerEvents: "none",
        maxWidth: "360px",
        width: "calc(100vw - 48px)",
      }}
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: "auto",
              backgroundColor: "var(--color-brand-deep)",
              color: "var(--color-white)",
              padding: "12px 16px",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-lg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              fontSize: "var(--text-body-sm)",
              animation: "fadeIn 0.25s var(--ease-standard)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {isSuccess && <CheckCircle2 size={18} color="var(--color-brand-sage)" />}
              {isError && <AlertCircle size={18} color="#FF8A80" />}
              {!isSuccess && !isError && <Info size={18} color="var(--color-sand)" />}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "28px",
                minWidth: "28px",
                padding: "2px",
              }}
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
