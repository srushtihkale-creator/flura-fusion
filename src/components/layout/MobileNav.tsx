"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Heart, User } from "lucide-react";
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
    <nav
      className="hide-desktop"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "var(--bottom-nav-height)",
        backgroundColor: "var(--color-surface)",
        borderTop: "1px solid var(--color-border-light)",
        zIndex: "var(--z-bottom-nav)",
        boxShadow: "0 -4px 16px rgba(23, 63, 43, 0.06)",
      }}
      aria-label="Mobile Navigation"
    >
      <div
        style={{
          display: "flex",
          height: "100%",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        {/* Home */}
        <Link
          href="/"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2px",
            color: pathname === "/" ? "var(--color-brand-forest)" : "var(--color-text-muted)",
            fontSize: "11px",
            fontWeight: pathname === "/" ? 600 : 500,
            width: "56px",
            height: "100%",
          }}
        >
          <Home size={20} />
          <span>Home</span>
        </Link>

        {/* Catalog */}
        <Link
          href="/plants"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2px",
            color: pathname.startsWith("/plants") || pathname.startsWith("/pots") || pathname.startsWith("/seeds")
              ? "var(--color-brand-forest)"
              : "var(--color-text-muted)",
            fontSize: "11px",
            fontWeight: 500,
            width: "56px",
            height: "100%",
          }}
        >
          <Grid size={20} />
          <span>Catalog</span>
        </Link>

        {/* Flora AI Floating Center Button */}
        <button
          onClick={openAI}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2px",
            color: "var(--color-brand-forest)",
            fontSize: "11px",
            fontWeight: 600,
            width: "56px",
            height: "100%",
          }}
          aria-label="Open Flora AI"
        >
          <div
            style={{
              backgroundColor: "var(--color-brand-sage-light)",
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

        {/* Wishlist */}
        <button
          onClick={openWishlist}
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2px",
            color: "var(--color-text-muted)",
            fontSize: "11px",
            fontWeight: 500,
            width: "56px",
            height: "100%",
          }}
          aria-label="Open Wishlist"
        >
          <Heart size={20} />
          <span>Wishlist</span>
          {totalWishlistCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "8px",
                right: "12px",
                backgroundColor: "var(--color-category-pots)",
                color: "var(--color-white)",
                fontSize: "10px",
                fontWeight: 700,
                width: "16px",
                height: "16px",
                borderRadius: "999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {totalWishlistCount}
            </span>
          )}
        </button>

        {/* Account */}
        <Link
          href="/account"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2px",
            color: pathname === "/account" ? "var(--color-brand-forest)" : "var(--color-text-muted)",
            fontSize: "11px",
            fontWeight: pathname === "/account" ? 600 : 500,
            width: "56px",
            height: "100%",
          }}
        >
          <User size={20} />
          <span>Account</span>
        </Link>
      </div>
    </nav>
  );
}
