"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFloraStore } from "@/store/useFloraStore";
import { ProductService } from "@/services/product.service";
import { Product } from "@/types/product";

export function SiteHeader() {
  const pathname = usePathname();
  const {
    cart,
    wishlist,
    openCart,
    openWishlist,
    user,
    isAuthenticated,
    openAuthModal,
    logout,
    initAuth,
  } = useFloraStore();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }
    const timer = setTimeout(async () => {
      const results = await ProductService.search(searchQuery);
      setSearchResults(results.slice(0, 5));
      setIsSearchOpen(true);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalCartCount = mounted ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;
  const totalWishlistCount = mounted ? wishlist.length : 0;

  const isAdmin = mounted && isAuthenticated && user?.role === "ADMIN";

  const navLinks = [
    { label: "Plants", href: "/plants" },
    { label: "Pots", href: "/pots" },
    { label: "Seeds", href: "/seeds" },
    { label: "About", href: "/about" },
    { label: "Plant Care", href: "/plant-care" },
    ...(isAdmin ? [{ label: "Admin", href: "/admin", isAdminBadge: true }] : []),
  ];

  return (
    <header className="site-header" id="site-header">
      <div className="container">
        {/* Brand Logo (Exact Provided Asset) */}
        <Link href="/" className="brand-logo" title="Flora Fusion Home">
          <img src="/assets/logo.png" alt="Flora Fusion" className="brand-logo-img" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-links" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href === "/admin" && pathname.startsWith("/admin"));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive ? "active" : ""}`}
                style={
                  (link as any).isAdminBadge
                    ? {
                        color: "var(--color-brand-terracotta, #B9825B)",
                        fontWeight: 700,
                        backgroundColor: "#FFF8F2",
                        padding: "4px 10px",
                        borderRadius: "var(--radius-pill, 999px)",
                        border: "1px solid var(--color-brand-terracotta, #B9825B)",
                      }
                    : undefined
                }
              >
                {(link as any).isAdminBadge ? "👑 Admin" : link.label}
              </Link>
            );
          })}
        </nav>

        {/* Live Search Bar */}
        <div ref={searchRef} className="header-search">
          <div className="search-input-wrapper">
            <svg
              className="search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              id="header-search-input"
              className="search-input"
              placeholder="Search for plants, pots or seeds..."
              autoComplete="off"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim() && setIsSearchOpen(true)}
            />
          </div>

          {/* Search Dropdown */}
          {isSearchOpen && (
            <div id="search-dropdown" className="search-dropdown" style={{ display: "block" }}>
              {searchResults.length > 0 ? (
                <div>
                  <div
                    style={{
                      fontSize: "var(--text-caption)",
                      fontWeight: 600,
                      color: "var(--color-text-muted)",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                      paddingLeft: "8px",
                    }}
                  >
                    Catalog Matches
                  </div>
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      href={`/product/${item.slug}`}
                      onClick={() => setIsSearchOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "8px",
                        borderRadius: "var(--radius-sm)",
                        transition: "background var(--duration-fast)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-cream-soft)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          position: "relative",
                          borderRadius: "var(--radius-xs)",
                          overflow: "hidden",
                          flexShrink: 0,
                        }}
                      >
                        <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "var(--text-body-sm)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: "var(--text-caption)", color: "var(--color-brand-green)" }}>
                          ₹{item.price} • {item.category}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div style={{ padding: "16px", textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
                  No plants found for that search.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Header Actions */}
        <div className="header-actions" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* User Sign In / Account state */}
          {mounted && isAuthenticated && user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Link
                href="/account"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--color-brand-forest)",
                  textDecoration: "none",
                  padding: "4px 8px",
                  borderRadius: "var(--radius-sm)",
                }}
                title="Manage Account & Orders"
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: "var(--color-brand-sage-light)",
                    color: "var(--color-brand-forest)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                  }}
                >
                  👤
                </div>
                <span>{user.name}</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--color-text-muted)",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  padding: "4px 6px",
                  textDecoration: "underline",
                }}
                title="Sign Out"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal("signin")}
              style={{
                background: "var(--color-cream-soft, #FBF9F4)",
                border: "1px solid var(--color-brand-forest, #173F2B)",
                color: "var(--color-brand-forest, #173F2B)",
                fontSize: "0.8125rem",
                fontWeight: 600,
                padding: "6px 14px",
                borderRadius: "var(--radius-pill, 999px)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                transition: "background var(--duration-fast)",
              }}
            >
              <span>Sign In</span>
            </button>
          )}

          {/* Wishlist */}
          <button onClick={openWishlist} className="header-action-btn open-wishlist-btn" title="Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            {totalWishlistCount > 0 && (
              <span className="action-badge wishlist-badge">{totalWishlistCount}</span>
            )}
          </button>

          {/* Cart */}
          <button onClick={openCart} className="header-action-btn open-cart-btn" title="Shopping Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {totalCartCount > 0 && (
              <span className="action-badge cart-badge">{totalCartCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
