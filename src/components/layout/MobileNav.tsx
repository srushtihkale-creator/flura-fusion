"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFloraStore } from "@/store/useFloraStore";

export function MobileNav() {
  const pathname = usePathname();
  const { wishlist, openWishlist, openAI } = useFloraStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalWishlistCount = mounted ? wishlist.length : 0;

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      <div className="mobile-nav-items">
        <Link
          href="/"
          className={`mobile-nav-btn ${pathname === "/" ? "active" : ""}`}
          title="Home"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Home</span>
        </Link>

        <Link
          href="/plants"
          className={`mobile-nav-btn ${
            pathname.startsWith("/plants") || pathname.startsWith("/pots") || pathname.startsWith("/seeds")
              ? "active"
              : ""
          }`}
          title="Catalog"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <span>Catalog</span>
        </Link>

        <button
          type="button"
          className="mobile-nav-btn"
          onClick={openAI}
          style={{ color: "var(--color-brand-forest)" }}
          title="Ask Flora AI"
        >
          <div
            style={{
              background: "var(--color-brand-sage-light)",
              width: "32px",
              height: "32px",
              borderRadius: "999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
            }}
          >
            🌿
          </div>
          <span>Flora AI</span>
        </button>

        <button
          type="button"
          className="mobile-nav-btn open-wishlist-btn"
          onClick={openWishlist}
          title="Wishlist"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>Wishlist</span>
          {totalWishlistCount > 0 && (
            <span className="mobile-badge wishlist-badge">{totalWishlistCount}</span>
          )}
        </button>

        <Link
          href="/account"
          className={`mobile-nav-btn ${pathname === "/account" ? "active" : ""}`}
          title="Account & Orders"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>Account</span>
        </Link>
      </div>
    </nav>
  );
}
