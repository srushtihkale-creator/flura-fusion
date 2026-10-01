"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, ShoppingBag, User } from "lucide-react";
import { useFloraStore } from "@/store/useFloraStore";
import { ProductService } from "@/services/product.service";
import { Product } from "@/types/product";

export function SiteHeader() {
  const pathname = usePathname();
  const { cart, wishlist, openCart, openWishlist } = useFloraStore();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle live search
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

  // Click outside listener for search dropdown
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

  const navLinks = [
    { label: "Plants", href: "/plants" },
    { label: "Pots", href: "/pots" },
    { label: "Seeds", href: "/seeds" },
    { label: "About", href: "/about" },
    { label: "Plant Care", href: "/plant-care" },
  ];

  return (
    <header
      style={{
        backgroundColor: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border-light)",
        position: "sticky",
        top: 0,
        zIndex: "var(--z-header)",
        boxShadow: "var(--shadow-xs)",
      }}
    >
      <div
        className="container"
        style={{
          height: "var(--header-height-desktop)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-6)",
        }}
      >
        {/* Exact Brand Logo Asset */}
        <Link href="/" style={{ display: "flex", alignItems: "center" }} title="Flora Fusion Home">
          <Image
            src="/assets/logo.png"
            alt="Flora Fusion"
            width={150}
            height={40}
            priority
            style={{
              objectFit: "contain",
              height: "auto",
              width: "var(--logo-width-desktop)",
            }}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hide-mobile"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-8)",
          }}
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: "var(--text-body-sm)",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "var(--color-brand-forest)" : "var(--color-text-secondary)",
                  borderBottom: isActive ? "2px solid var(--color-brand-forest)" : "2px solid transparent",
                  paddingBottom: "4px",
                  transition: "all var(--duration-fast) var(--ease-standard)",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Live Search Bar */}
        <div
          ref={searchRef}
          className="hide-mobile"
          style={{
            position: "relative",
            flex: "1",
            maxWidth: "340px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "var(--color-cream-soft)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-pill)",
              padding: "0 var(--space-4)",
              height: "40px",
              gap: "var(--space-2)",
            }}
          >
            <Search size={18} color="var(--color-brand-green)" />
            <input
              type="text"
              placeholder="Search plants, pots or seeds..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim() && setIsSearchOpen(true)}
              style={{
                border: "none",
                background: "transparent",
                width: "100%",
                fontSize: "var(--text-body-sm)",
                outline: "none",
              }}
            />
          </div>

          {/* Search Dropdown */}
          {isSearchOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                right: 0,
                backgroundColor: "var(--color-white)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-lg)",
                border: "1px solid var(--color-border-light)",
                padding: "var(--space-3)",
                zIndex: "var(--z-dropdown)",
              }}
            >
              {searchResults.length > 0 ? (
                <div>
                  <div
                    style={{
                      fontSize: "var(--text-caption)",
                      fontWeight: 600,
                      color: "var(--color-text-muted)",
                      textTransform: "uppercase",
                      marginBottom: "var(--space-2)",
                      paddingLeft: "var(--space-2)",
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
                        gap: "var(--space-3)",
                        padding: "var(--space-2)",
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
                <div style={{ padding: "var(--space-4)", textAlign: "center", color: "var(--color-text-muted)", fontSize: "var(--text-body-sm)" }}>
                  No plants found for that search.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Header Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          {/* Order Tracking / Account */}
          <Link
            href="/account"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "44px",
              height: "44px",
              borderRadius: "var(--radius-pill)",
              color: "var(--color-text-primary)",
              transition: "background var(--duration-fast)",
            }}
            title="Track Orders & Account"
          >
            <User size={20} />
          </Link>

          {/* Wishlist Button */}
          <button
            onClick={openWishlist}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "44px",
              height: "44px",
              borderRadius: "var(--radius-pill)",
              color: "var(--color-text-primary)",
            }}
            title="Saved Wishlist"
            aria-label="Open Wishlist"
          >
            <Heart size={20} />
            {totalWishlistCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                  backgroundColor: "var(--color-category-pots)",
                  color: "var(--color-white)",
                  fontSize: "11px",
                  fontWeight: 700,
                  width: "18px",
                  height: "18px",
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

          {/* Shopping Cart Button */}
          <button
            onClick={openCart}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "44px",
              height: "44px",
              borderRadius: "var(--radius-pill)",
              color: "var(--color-text-primary)",
            }}
            title="Shopping Cart"
            aria-label="Open Cart"
          >
            <ShoppingBag size={20} />
            {totalCartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                  backgroundColor: "var(--color-brand-forest)",
                  color: "var(--color-white)",
                  fontSize: "11px",
                  fontWeight: 700,
                  width: "18px",
                  height: "18px",
                  borderRadius: "999px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
