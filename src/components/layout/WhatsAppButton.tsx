"use client";

import React, { useState } from "react";

const PREFILLED_MESSAGE = "Hi Flora Fusion, I need help with a product/order.";

export function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false);

  const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const whatsappNumber = rawNumber.replace(/[^0-9a-zA-Z]/g, "").trim();

  const chatUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(PREFILLED_MESSAGE)}`
    : `https://wa.me/?text=${encodeURIComponent(PREFILLED_MESSAGE)}`;

  return (
    <div
      className="floating-whatsapp-container"
      style={{
        position: "fixed",
        bottom: "28px",
        left: "28px",
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <a
        href={chatUrl}
        target="_blank"
        rel="noopener noreferrer"
        id="whatsapp-chat-button"
        aria-label="Chat with Flora Fusion on WhatsApp"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          backgroundColor: "#25D366",
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 14px rgba(37, 211, 102, 0.4)",
          textDecoration: "none",
          transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease",
          transform: isHovered ? "scale(1.08)" : "scale(1)",
        }}
        title="Chat with Botanical Nursery Team on WhatsApp"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 20.16C10.56 20.16 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16ZM16.56 14.39C16.31 14.26 15.09 13.66 14.86 13.58C14.63 13.5 14.47 13.46 14.3 13.71C14.14 13.96 13.66 14.52 13.51 14.69C13.37 14.85 13.22 14.87 12.97 14.75C12.72 14.62 11.92 14.36 10.97 13.51C10.23 12.85 9.73 12.04 9.58 11.79C9.44 11.54 9.57 11.41 9.69 11.28C9.8 11.17 9.94 10.99 10.06 10.84C10.19 10.7 10.23 10.59 10.31 10.43C10.39 10.26 10.35 10.12 10.29 10C10.23 9.88 9.74 8.67 9.53 8.18C9.33 7.7 9.13 7.76 8.97 7.75C8.83 7.74 8.66 7.74 8.5 7.74C8.33 7.74 8.06 7.8 7.84 8.05C7.61 8.29 6.98 8.88 6.98 10.08C6.98 11.28 7.86 12.44 7.98 12.6C8.11 12.76 9.69 15.2 12.13 16.25C12.71 16.5 13.16 16.65 13.51 16.76C14.09 16.95 14.62 16.92 15.04 16.86C15.51 16.79 16.48 16.27 16.69 15.69C16.89 15.11 16.89 14.62 16.83 14.52C16.77 14.41 16.61 14.35 16.36 14.23L16.56 14.39Z" />
        </svg>
      </a>

      {isHovered && (
        <span
          style={{
            backgroundColor: "rgba(23, 63, 43, 0.95)",
            color: "#FFFFFF",
            fontSize: "0.8125rem",
            fontWeight: 500,
            padding: "6px 12px",
            borderRadius: "var(--radius-pill, 999px)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            animation: "ff-fade-in 0.2s ease",
          }}
        >
          Chat with us on WhatsApp 🌿
        </span>
      )}
    </div>
  );
}
