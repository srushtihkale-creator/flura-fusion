"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useFloraStore } from "@/store/useFloraStore";
import { apiFetch, IS_BACKEND_CONFIGURED } from "@/lib/api";
import { CouponResponse, CouponService, AdminOfferPayload } from "@/services/coupon.service";
import { Product, AdminProductPayload, AdminCategory } from "@/types/product";
import { ProductService } from "@/services/product.service";
import { OrderService } from "@/services/order.service";
import { AdminProductModal } from "./AdminProductModal";

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
}

interface AdminOrder {
  orderId: string;
  orderNumber: string;
  date: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  customerName?: string;
  address?: {
    name?: string;
    city?: string;
  };
  items?: Array<{ name: string; quantity: number }>;
}

export function AdminDashboardView() {
  const { user, isAuthenticated, openAuthModal, logout, addToast } = useFloraStore();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "offers" | "orders" | "categories">("products");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [offers, setOffers] = useState<CouponResponse[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProductsCount, setTotalProductsCount] = useState<number>(0);
  const [productSearch, setProductSearch] = useState<string>("");
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>("all");
  const [productStatusFilter, setProductStatusFilter] = useState<string>("all");
  const [productSort, setProductSort] = useState<string>("createdAt");
  const [productPage, setProductPage] = useState<number>(0);
  const [productsLoading, setProductsLoading] = useState<boolean>(false);

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // Inline Quick Edit state
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [quickStockVal, setQuickStockVal] = useState<number>(0);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [quickPriceVal, setQuickPriceVal] = useState<number>(0);

  // New offer modal state
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);
  const [newOffer, setNewOffer] = useState<AdminOfferPayload>({
    code: "",
    title: "",
    bannerText: "",
    discountType: "PERCENTAGE",
    discountValue: 10,
    minCartValue: 1499,
    maxDiscount: 500,
    bundleQty: 4,
    bundlePrice: 1199,
    applicableCategory: "all",
    targetLink: "/plants",
    autoApply: true,
    isActive: true,
    displayOrder: 1,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdmin = mounted && isAuthenticated && user?.role === "ADMIN";

  const loadProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const res = await ProductService.getAllAdmin({
        category: productCategoryFilter,
        status: productStatusFilter,
        search: productSearch,
        sort: productSort,
        page: productPage,
        size: 50,
      });
      setProducts(res.products);
      setTotalProductsCount(res.totalElements);
    } catch (err: any) {
      console.error("Failed to load admin products:", err);
      addToast(err?.message || "Failed to load product catalog", "error");
    } finally {
      setProductsLoading(false);
    }
  }, [productCategoryFilter, productStatusFilter, productSearch, productSort, productPage, addToast]);

  const loadAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (IS_BACKEND_CONFIGURED) {
        const statsRes = await apiFetch<DashboardStats>("admin/dashboard/stats");
        setStats(statsRes);

        const ordersRes = await apiFetch<{ content: AdminOrder[] } | AdminOrder[]>("admin/orders?size=10");
        const orderList = Array.isArray(ordersRes) ? ordersRes : ordersRes?.content || [];
        setOrders(orderList);

        const offersRes = await CouponService.getAllOffersAdmin();
        setOffers(offersRes);

        const catRes = await ProductService.getCategoriesAdmin();
        setCategories(catRes);
      } else {
        setStats({
          totalProducts: 31,
          totalOrders: 0,
          totalCustomers: 2,
          totalRevenue: 0,
        });
        const fallbackOffers = await CouponService.getActiveCoupons();
        setOffers(fallbackOffers);
        const fallbackCats = await ProductService.getCategoriesAdmin();
        setCategories(fallbackCats);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load administrative data from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    loadAdminData();
    loadProducts();
  }, [isAdmin, loadProducts]);

  // Product CRUD Handlers
  const handleOpenCreateModal = () => {
    setProductToEdit(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (prod: Product) => {
    setProductToEdit(prod);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (payload: AdminProductPayload, productId?: string) => {
    try {
      if (productId) {
        const updated = await ProductService.updateProduct(productId, payload);
        setProducts((prev) => prev.map((p) => (p.id === productId ? updated : p)));
        addToast(`Product "${updated.name}" (${updated.sku}) updated successfully!`, "success");
      } else {
        const created = await ProductService.createProduct(payload);
        setProducts((prev) => [created, ...prev]);
        setTotalProductsCount((prev) => prev + 1);
        addToast(`Product "${created.name}" created and published!`, "success");
      }
      loadProducts();
      // Refresh stats counters
      if (IS_BACKEND_CONFIGURED) {
        apiFetch<DashboardStats>("admin/dashboard/stats").then(setStats).catch(() => {});
      }
    } catch (err: any) {
      throw err;
    }
  };

  const handleDeleteProduct = async (prod: Product) => {
    if (!window.confirm(`Are you sure you want to safely archive product "${prod.name}" (${prod.sku || prod.slug})? It will be removed from customer storefront while preserving historical order data.`)) {
      return;
    }
    try {
      await ProductService.archiveProduct(prod.id);
      setProducts((prev) =>
        prev.map((p) => (p.id === prod.id ? { ...p, status: "ARCHIVED", inStock: false } : p))
      );
      addToast(`Product "${prod.name}" archived safely.`, "success");
    } catch (err: any) {
      addToast(err?.message || "Failed to archive product", "error");
    }
  };

  const handleStatusChange = async (prod: Product, newStatus: "ACTIVE" | "INACTIVE" | "ARCHIVED") => {
    try {
      const updated = await ProductService.updateProductStatus(prod.id, newStatus);
      setProducts((prev) => prev.map((p) => (p.id === prod.id ? updated : p)));
      addToast(`Status for "${prod.name}" set to ${newStatus}`, "success");
    } catch (err: any) {
      addToast(err?.message || "Failed to update product status", "error");
    }
  };

  const handleSaveQuickStock = async (prod: Product) => {
    try {
      const updated = await ProductService.updateStock(prod.id, quickStockVal);
      setProducts((prev) => prev.map((p) => (p.id === prod.id ? updated : p)));
      setEditingStockId(null);
      addToast(`Stock for "${prod.name}" updated to ${updated.stockQuantity} units`, "success");
    } catch (err: any) {
      addToast(err?.message || "Failed to update stock", "error");
    }
  };

  const handleSaveQuickPrice = async (prod: Product) => {
    try {
      const updated = await ProductService.updatePrice(prod.id, quickPriceVal, prod.originalPrice);
      setProducts((prev) => prev.map((p) => (p.id === prod.id ? updated : p)));
      setEditingPriceId(null);
      addToast(`Price for "${prod.name}" updated to ₹${updated.price}`, "success");
    } catch (err: any) {
      addToast(err?.message || "Failed to update price", "error");
    }
  };

  // Category Handlers
  const handleToggleCategory = async (cat: AdminCategory) => {
    try {
      const updated = await ProductService.toggleCategoryStatus(cat.id, !cat.isActive);
      setCategories((prev) => prev.map((c) => (c.id === cat.id ? updated : c)));
      addToast(`Category "${cat.name}" is now ${updated.isActive ? "ACTIVE" : "INACTIVE"}`, "success");
    } catch (err: any) {
      addToast(err?.message || "Failed to toggle category", "error");
    }
  };

  // Order Fulfillment Status Handler
  const handleOrderStatusChange = async (order: AdminOrder, newStatus: string) => {
    try {
      const orderIdentifier = order.orderId || order.orderNumber;
      await OrderService.updateOrderStatus(orderIdentifier, newStatus);
      setOrders((prev) =>
        prev.map((o) =>
          (o.orderId === order.orderId || o.orderNumber === order.orderNumber)
            ? { ...o, orderStatus: newStatus }
            : o
        )
      );
      addToast(`Order ${order.orderNumber} status updated to "${newStatus}"`, "success");
    } catch (err: any) {
      addToast(err?.message || "Failed to update order status", "error");
    }
  };

  // Offer Handlers
  const handleToggleOffer = async (id: string, currentStatus: boolean) => {
    try {
      const updated = await CouponService.toggleOfferAdmin(id, !currentStatus);
      setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, isActive: updated.isActive } : o)));
      addToast(`Offer ${updated.code} is now ${updated.isActive ? "ACTIVE" : "INACTIVE"}`, "success");
    } catch (err: any) {
      addToast(err?.message || "Failed to toggle offer status", "error");
    }
  };

  const handleDeleteOffer = async (id: string, code: string) => {
    if (!window.confirm(`Are you sure you want to delete offer "${code}"?`)) return;
    try {
      await CouponService.deleteOfferAdmin(id);
      setOffers((prev) => prev.filter((o) => o.id !== id));
      addToast(`Offer ${code} deleted successfully`, "success");
    } catch (err: any) {
      addToast(err?.message || "Failed to delete offer", "error");
    }
  };

  const handleCreateOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOffer.code.trim()) {
      addToast("Please provide an offer code", "warning");
      return;
    }
    setIsSubmittingOffer(true);
    try {
      const created = await CouponService.createOfferAdmin({
        ...newOffer,
        code: newOffer.code.trim().toUpperCase(),
      });
      setOffers((prev) => [created, ...prev]);
      setIsOfferModalOpen(false);
      addToast(`Created offer ${created.code} successfully! Marquee updated.`, "success");
      setNewOffer({
        code: "",
        title: "",
        bannerText: "",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minCartValue: 1499,
        maxDiscount: 500,
        bundleQty: 4,
        bundlePrice: 1199,
        applicableCategory: "all",
        targetLink: "/plants",
        autoApply: true,
        isActive: true,
        displayOrder: offers.length + 1,
      });
    } catch (err: any) {
      addToast(err?.message || "Failed to create offer", "error");
    } finally {
      setIsSubmittingOffer(false);
    }
  };

  if (!mounted) {
    return (
      <div style={{ padding: "80px 0", textAlign: "center", color: "var(--color-text-muted)" }}>
        Loading Flora Fusion Administration...
      </div>
    );
  }

  // RBAC Access Control Guard
  if (!isAdmin) {
    return (
      <div style={{ padding: "80px 16px", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            maxWidth: "480px",
            width: "100%",
            textAlign: "center",
            background: "#FFFFFF",
            padding: "40px 32px",
            borderRadius: "var(--radius-lg, 16px)",
            border: "1px solid var(--color-border-light, #E2E8F0)",
            boxShadow: "var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1))",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🔒</div>
          <h1
            style={{
              fontFamily: "var(--font-serif, 'Cormorant Garamond', Georgia, serif)",
              fontSize: "1.75rem",
              color: "var(--color-brand-forest, #173F2B)",
              marginBottom: "12px",
            }}
          >
            Administrator Privileges Required
          </h1>
          <p
            style={{
              color: "var(--color-text-secondary, #4A5568)",
              fontSize: "0.9375rem",
              lineHeight: 1.6,
              marginBottom: "24px",
            }}
          >
            {isAuthenticated
              ? `You are currently signed in as a customer (${user?.name}). This dashboard requires administrator privileges (ROLE_ADMIN).`
              : "Please sign in with your verified administrator credentials to access management controls."}
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => openAuthModal("signin")}
              className="btn-primary"
              style={{ padding: "11px 24px", fontSize: "0.875rem" }}
            >
              Sign In as Admin
            </button>
            <Link
              href="/"
              className="btn-secondary"
              style={{ padding: "11px 20px", fontSize: "0.875rem", textDecoration: "none" }}
            >
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page" style={{ padding: "var(--space-8, 32px) 0 var(--space-16, 64px)" }}>
      <div className="container">
        {/* Header Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "var(--space-8, 32px)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "var(--text-caption, 0.75rem)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--color-brand-terracotta, #B9825B)",
                marginBottom: "4px",
              }}
            >
              Flora Fusion Control Plane
            </div>
            <h1
              style={{
                fontFamily: "var(--font-serif, 'Cormorant Garamond', Georgia, serif)",
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                color: "var(--color-brand-forest, #173F2B)",
                margin: 0,
              }}
            >
              Admin Dashboard & CMS
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                backgroundColor: "var(--color-brand-sage-light, #DDE7D8)",
                color: "var(--color-brand-forest, #173F2B)",
                padding: "6px 14px",
                borderRadius: "var(--radius-pill, 999px)",
                fontSize: "0.8125rem",
                fontWeight: 600,
              }}
            >
              👑 {user?.name} (Admin)
            </span>
            <Link
              href="/"
              className="btn-secondary"
              style={{ padding: "8px 16px", fontSize: "0.8125rem", textDecoration: "none" }}
            >
              View Live Store 🌿
            </Link>
            <button
              type="button"
              onClick={logout}
              className="btn-secondary"
              style={{ padding: "8px 16px", fontSize: "0.8125rem", color: "#C53030" }}
            >
              Sign Out
            </button>
          </div>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#FFF5F5",
              color: "#C53030",
              border: "1px solid #FEB2B2",
              padding: "14px 18px",
              borderRadius: "var(--radius-md, 8px)",
              marginBottom: "24px",
              fontSize: "0.875rem",
            }}
          >
            {error}
          </div>
        )}

        {/* 4 Metric KPI Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "36px",
          }}
        >
          {/* Total Products */}
          <div
            style={{
              background: "#FFFFFF",
              padding: "24px",
              borderRadius: "var(--radius-lg, 16px)",
              border: "1px solid var(--color-border-light, #E2E8F0)",
              boxShadow: "var(--shadow-xs, 0 1px 3px rgba(0,0,0,0.05))",
            }}
          >
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted, #718096)", marginBottom: "8px" }}>
              Active Catalog Products
            </div>
            <div
              style={{
                fontSize: "2.25rem",
                fontWeight: 700,
                color: "var(--color-brand-forest, #173F2B)",
                lineHeight: 1,
              }}
            >
              {loading ? "..." : stats?.totalProducts ?? 31}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--color-brand-green, #24583B)", marginTop: "8px" }}>
              Plants • Pots • Seeds in PostgreSQL
            </div>
          </div>

          {/* Total Orders */}
          <div
            style={{
              background: "#FFFFFF",
              padding: "24px",
              borderRadius: "var(--radius-lg, 16px)",
              border: "1px solid var(--color-border-light, #E2E8F0)",
              boxShadow: "var(--shadow-xs, 0 1px 3px rgba(0,0,0,0.05))",
            }}
          >
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted, #718096)", marginBottom: "8px" }}>
              Total Customer Orders
            </div>
            <div
              style={{
                fontSize: "2.25rem",
                fontWeight: 700,
                color: "var(--color-brand-forest, #173F2B)",
                lineHeight: 1,
              }}
            >
              {loading ? "..." : stats?.totalOrders ?? 0}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--color-brand-green, #24583B)", marginTop: "8px" }}>
              Recorded in PostgreSQL
            </div>
          </div>

          {/* Total Customers */}
          <div
            style={{
              background: "#FFFFFF",
              padding: "24px",
              borderRadius: "var(--radius-lg, 16px)",
              border: "1px solid var(--color-border-light, #E2E8F0)",
              boxShadow: "var(--shadow-xs, 0 1px 3px rgba(0,0,0,0.05))",
            }}
          >
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted, #718096)", marginBottom: "8px" }}>
              Registered Customers
            </div>
            <div
              style={{
                fontSize: "2.25rem",
                fontWeight: 700,
                color: "var(--color-brand-forest, #173F2B)",
                lineHeight: 1,
              }}
            >
              {loading ? "..." : stats?.totalCustomers ?? 2}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--color-brand-green, #24583B)", marginTop: "8px" }}>
              Active user accounts
            </div>
          </div>

          {/* Total Revenue */}
          <div
            style={{
              background: "#FFFFFF",
              padding: "24px",
              borderRadius: "var(--radius-lg, 16px)",
              border: "1px solid var(--color-border-light, #E2E8F0)",
              boxShadow: "var(--shadow-xs, 0 1px 3px rgba(0,0,0,0.05))",
            }}
          >
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted, #718096)", marginBottom: "8px" }}>
              Completed Revenue
            </div>
            <div
              style={{
                fontSize: "2.25rem",
                fontWeight: 700,
                color: "var(--color-brand-terracotta, #B9825B)",
                lineHeight: 1,
              }}
            >
              ₹{loading ? "..." : (stats?.totalRevenue ?? 0).toLocaleString("en-IN")}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--color-brand-green, #24583B)", marginTop: "8px" }}>
              Authoritative calculations
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            style={{
              padding: "10px 20px",
              borderRadius: "var(--radius-pill, 999px)",
              fontWeight: 600,
              fontSize: "0.875rem",
              border: "none",
              cursor: "pointer",
              backgroundColor: activeTab === "products" ? "var(--color-brand-forest, #173F2B)" : "#FFFFFF",
              color: activeTab === "products" ? "#FFFFFF" : "var(--color-brand-forest, #173F2B)",
              boxShadow: "var(--shadow-xs, 0 1px 3px rgba(0,0,0,0.05))",
              transition: "all var(--duration-fast)",
            }}
          >
            🌿 Product Catalog ({totalProductsCount || products.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("offers")}
            style={{
              padding: "10px 20px",
              borderRadius: "var(--radius-pill, 999px)",
              fontWeight: 600,
              fontSize: "0.875rem",
              border: "none",
              cursor: "pointer",
              backgroundColor: activeTab === "offers" ? "var(--color-brand-forest, #173F2B)" : "#FFFFFF",
              color: activeTab === "offers" ? "#FFFFFF" : "var(--color-brand-forest, #173F2B)",
              boxShadow: "var(--shadow-xs, 0 1px 3px rgba(0,0,0,0.05))",
              transition: "all var(--duration-fast)",
            }}
          >
            🏷️ Promotional Offers & Marquee ({offers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            style={{
              padding: "10px 20px",
              borderRadius: "var(--radius-pill, 999px)",
              fontWeight: 600,
              fontSize: "0.875rem",
              border: "none",
              cursor: "pointer",
              backgroundColor: activeTab === "orders" ? "var(--color-brand-forest, #173F2B)" : "#FFFFFF",
              color: activeTab === "orders" ? "#FFFFFF" : "var(--color-brand-forest, #173F2B)",
              boxShadow: "var(--shadow-xs, 0 1px 3px rgba(0,0,0,0.05))",
              transition: "all var(--duration-fast)",
            }}
          >
            📦 Fulfillment Orders ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("categories")}
            style={{
              padding: "10px 20px",
              borderRadius: "var(--radius-pill, 999px)",
              fontWeight: 600,
              fontSize: "0.875rem",
              border: "none",
              cursor: "pointer",
              backgroundColor: activeTab === "categories" ? "var(--color-brand-forest, #173F2B)" : "#FFFFFF",
              color: activeTab === "categories" ? "#FFFFFF" : "var(--color-brand-forest, #173F2B)",
              boxShadow: "var(--shadow-xs, 0 1px 3px rgba(0,0,0,0.05))",
              transition: "all var(--duration-fast)",
            }}
          >
            📁 Categories ({categories.length})
          </button>
        </div>

        {/* TAB 1: PRODUCT CATALOG MANAGEMENT */}
        {activeTab === "products" && (
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "var(--radius-lg, 16px)",
              border: "1px solid var(--color-border-light, #E2E8F0)",
              boxShadow: "var(--shadow-xs, 0 1px 3px rgba(0,0,0,0.05))",
              padding: "24px",
            }}
          >
            {/* Header & Controls */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
                marginBottom: "20px",
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
                  Botanical Catalog & Inventory Management
                </h2>
                <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted, #718096)", margin: "4px 0 0" }}>
                  Manage complete product lifecycles, real-time stock levels, pricing, photo galleries, and 360° turntable frames.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="btn-primary"
                style={{ padding: "10px 22px", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "6px" }}
              >
                <span>+</span> Add New Product
              </button>
            </div>

            {/* Filter Bar */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                alignItems: "center",
                marginBottom: "20px",
                background: "#FAF8F5",
                padding: "14px 18px",
                borderRadius: "var(--radius-md, 8px)",
                border: "1px solid var(--color-border-light, #E2E8F0)",
              }}
            >
              <div style={{ flex: "1 1 200px" }}>
                <input
                  type="text"
                  placeholder="🔍 Search by name or SKU..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid var(--color-border-light, #CBD5E0)",
                    borderRadius: "var(--radius-sm, 6px)",
                    fontSize: "0.875rem",
                    backgroundColor: "#FFFFFF",
                  }}
                />
              </div>

              <div>
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    border: "1px solid var(--color-border-light, #CBD5E0)",
                    borderRadius: "var(--radius-sm, 6px)",
                    fontSize: "0.875rem",
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  <option value="all">All Categories</option>
                  <option value="plants">Live Plants</option>
                  <option value="pots">Pots & Planters</option>
                  <option value="seeds">Heirloom Seeds</option>
                </select>
              </div>

              <div>
                <select
                  value={productStatusFilter}
                  onChange={(e) => setProductStatusFilter(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    border: "1px solid var(--color-border-light, #CBD5E0)",
                    borderRadius: "var(--radius-sm, 6px)",
                    fontSize: "0.875rem",
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  <option value="all">All Statuses</option>
                  <option value="ACTIVE">🟢 Active Only</option>
                  <option value="INACTIVE">🟠 Inactive Only</option>
                  <option value="ARCHIVED">⚪ Archived Only</option>
                </select>
              </div>

              <div>
                <select
                  value={productSort}
                  onChange={(e) => setProductSort(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    border: "1px solid var(--color-border-light, #CBD5E0)",
                    borderRadius: "var(--radius-sm, 6px)",
                    fontSize: "0.875rem",
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  <option value="createdAt">Newest First</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                  <option value="stock-asc">Stock (Low to High)</option>
                </select>
              </div>
            </div>

            {/* Products Table */}
            {productsLoading ? (
              <div style={{ padding: "60px", textAlign: "center", color: "var(--color-text-muted)" }}>
                Loading product catalog from PostgreSQL...
              </div>
            ) : products.length > 0 ? (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--color-border-light, #E2E8F0)", textAlign: "left", backgroundColor: "#FAF8F5" }}>
                      <th style={{ padding: "12px 14px", color: "var(--color-text-muted, #718096)", fontWeight: 600 }}>Product</th>
                      <th style={{ padding: "12px 14px", color: "var(--color-text-muted, #718096)", fontWeight: 600 }}>SKU</th>
                      <th style={{ padding: "12px 14px", color: "var(--color-text-muted, #718096)", fontWeight: 600 }}>Category</th>
                      <th style={{ padding: "12px 14px", color: "var(--color-text-muted, #718096)", fontWeight: 600 }}>Price</th>
                      <th style={{ padding: "12px 14px", color: "var(--color-text-muted, #718096)", fontWeight: 600 }}>Stock</th>
                      <th style={{ padding: "12px 14px", color: "var(--color-text-muted, #718096)", fontWeight: 600 }}>Features</th>
                      <th style={{ padding: "12px 14px", color: "var(--color-text-muted, #718096)", fontWeight: 600 }}>Status</th>
                      <th style={{ padding: "12px 14px", color: "var(--color-text-muted, #718096)", fontWeight: 600, textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((prod) => {
                      const isArchived = prod.status === "ARCHIVED";
                      const isInactive = prod.status === "INACTIVE";
                      const isLowStock = (prod.stockQuantity ?? (prod.inStock ? 50 : 0)) <= 10;
                      const isOutOfStock = !prod.inStock || (prod.stockQuantity ?? 0) === 0;

                      return (
                        <tr
                          key={prod.id || prod.slug}
                          style={{
                            borderBottom: "1px solid #F1F5F9",
                            opacity: isArchived ? 0.6 : 1,
                            transition: "background-color 0.15s",
                          }}
                        >
                          {/* Product info with thumbnail */}
                          <td style={{ padding: "12px 14px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <div
                                style={{
                                  width: "44px",
                                  height: "44px",
                                  borderRadius: "6px",
                                  overflow: "hidden",
                                  backgroundColor: "#F1F5F9",
                                  position: "relative",
                                  flexShrink: 0,
                                  border: "1px solid #E2E8F0",
                                }}
                              >
                                <img
                                  src={prod.image || "/assets/products/plants/money-plant-1.jpg"}
                                  alt={prod.name}
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/assets/products/plants/money-plant-1.jpg";
                                  }}
                                />
                              </div>
                              <div>
                                <div style={{ fontWeight: 700, color: "var(--color-brand-forest, #173F2B)" }}>
                                  <Link href={`/product/${prod.slug}`} target="_blank" style={{ color: "inherit", textDecoration: "none" }} title="View product in store">
                                    {prod.name} ↗
                                  </Link>
                                </div>
                                <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted, #718096)" }}>
                                  /{prod.slug}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* SKU */}
                          <td style={{ padding: "12px 14px" }}>
                            <code style={{ fontSize: "0.8125rem", padding: "2px 6px", background: "#F1F5F9", borderRadius: "4px" }}>
                              {prod.sku || "—"}
                            </code>
                          </td>

                          {/* Category */}
                          <td style={{ padding: "12px 14px", textTransform: "capitalize" }}>
                            <span
                              style={{
                                padding: "3px 8px",
                                borderRadius: "var(--radius-pill, 999px)",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                backgroundColor: prod.category === "plants" ? "#EBF8EE" : prod.category === "pots" ? "#FDF2E9" : "#F3E8FF",
                                color: prod.category === "plants" ? "#276749" : prod.category === "pots" ? "#9C4221" : "#6B21A8",
                              }}
                            >
                              {prod.category}
                            </span>
                            {prod.subCategory && (
                              <div style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)", marginTop: "2px" }}>
                                {prod.subCategory}
                              </div>
                            )}
                          </td>

                          {/* Price */}
                          <td style={{ padding: "12px 14px" }}>
                            {editingPriceId === prod.id ? (
                              <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                                <span>₹</span>
                                <input
                                  type="number"
                                  value={quickPriceVal}
                                  onChange={(e) => setQuickPriceVal(parseFloat(e.target.value) || 0)}
                                  style={{ width: "70px", padding: "2px 6px", fontSize: "0.8125rem" }}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSaveQuickPrice(prod)}
                                  style={{ padding: "2px 6px", fontSize: "0.75rem", background: "var(--color-brand-forest)", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                                >
                                  ✓
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingPriceId(null)}
                                  style={{ padding: "2px 6px", fontSize: "0.75rem", background: "none", border: "none", cursor: "pointer" }}
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <div
                                onClick={() => {
                                  setEditingPriceId(prod.id);
                                  setQuickPriceVal(prod.price);
                                }}
                                style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
                                title="Click to quick-edit price"
                              >
                                <strong style={{ color: "var(--color-brand-deep, #123222)" }}>₹{prod.price}</strong>
                                {prod.originalPrice && prod.originalPrice > prod.price && (
                                  <span style={{ fontSize: "0.75rem", textDecoration: "line-through", color: "#A0AEC0" }}>
                                    ₹{prod.originalPrice}
                                  </span>
                                )}
                                <span style={{ fontSize: "0.6875rem", color: "#718096" }}>✏️</span>
                              </div>
                            )}
                          </td>

                          {/* Stock */}
                          <td style={{ padding: "12px 14px" }}>
                            {editingStockId === prod.id ? (
                              <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                                <input
                                  type="number"
                                  min="0"
                                  value={quickStockVal}
                                  onChange={(e) => setQuickStockVal(parseInt(e.target.value) || 0)}
                                  style={{ width: "60px", padding: "2px 6px", fontSize: "0.8125rem" }}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSaveQuickStock(prod)}
                                  style={{ padding: "2px 6px", fontSize: "0.75rem", background: "var(--color-brand-forest)", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                                >
                                  ✓
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingStockId(null)}
                                  style={{ padding: "2px 6px", fontSize: "0.75rem", background: "none", border: "none", cursor: "pointer" }}
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <div
                                onClick={() => {
                                  setEditingStockId(prod.id);
                                  setQuickStockVal(prod.stockQuantity ?? (prod.inStock ? 50 : 0));
                                }}
                                style={{
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "6px",
                                }}
                                title="Click to quick-edit stock units"
                              >
                                <span
                                  style={{
                                    fontWeight: 700,
                                    color: isOutOfStock ? "#E53E3E" : isLowStock ? "#DD6B20" : "#276749",
                                  }}
                                >
                                  {isOutOfStock ? "Out of Stock" : `${prod.stockQuantity ?? 50} units`}
                                </span>
                                <span style={{ fontSize: "0.6875rem", color: "#718096" }}>✏️</span>
                              </div>
                            )}
                          </td>

                          {/* Features (Badges, 360) */}
                          <td style={{ padding: "12px 14px" }}>
                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                              {prod.images360 && prod.images360.length > 0 && (
                                <span
                                  style={{
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                    fontSize: "0.6875rem",
                                    fontWeight: 700,
                                    backgroundColor: "var(--color-brand-sage-light, #DDE7D8)",
                                    color: "var(--color-brand-forest, #173F2B)",
                                  }}
                                  title={`${prod.images360.length} sequential 360° frames`}
                                >
                                  🔄 360° ({prod.images360.length})
                                </span>
                              )}
                              {prod.badge && (
                                <span
                                  style={{
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                    fontSize: "0.6875rem",
                                    fontWeight: 600,
                                    backgroundColor: "#FEFCBF",
                                    color: "#744210",
                                  }}
                                >
                                  ★ {prod.badge}
                                </span>
                              )}
                              {prod.images && prod.images.length > 1 && (
                                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                                  📷 {prod.images.length} photos
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Status Dropdown */}
                          <td style={{ padding: "12px 14px" }}>
                            <select
                              value={prod.status || (prod.inStock ? "ACTIVE" : "INACTIVE")}
                              onChange={(e) => handleStatusChange(prod, e.target.value as any)}
                              style={{
                                padding: "4px 8px",
                                borderRadius: "var(--radius-pill, 999px)",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                border: "none",
                                cursor: "pointer",
                                backgroundColor: isArchived ? "#EDF2F7" : isInactive ? "#FFFAF0" : "#EBF8EE",
                                color: isArchived ? "#718096" : isInactive ? "#DD6B20" : "#276749",
                              }}
                            >
                              <option value="ACTIVE">● ACTIVE</option>
                              <option value="INACTIVE">○ INACTIVE</option>
                              <option value="ARCHIVED">✕ ARCHIVED</option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td style={{ padding: "12px 14px", textAlign: "right" }}>
                            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(prod)}
                                style={{
                                  padding: "5px 12px",
                                  borderRadius: "6px",
                                  border: "1px solid var(--color-border-light, #CBD5E0)",
                                  background: "#FFFFFF",
                                  color: "var(--color-brand-forest, #173F2B)",
                                  cursor: "pointer",
                                  fontSize: "0.8125rem",
                                  fontWeight: 600,
                                }}
                              >
                                Edit ✏️
                              </button>
                              {!isArchived && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProduct(prod)}
                                  style={{
                                    padding: "5px 10px",
                                    borderRadius: "6px",
                                    border: "1px solid #FEB2B2",
                                    background: "#FFF5F5",
                                    color: "#E53E3E",
                                    cursor: "pointer",
                                    fontSize: "0.8125rem",
                                    fontWeight: 600,
                                  }}
                                  title="Safely archive product"
                                >
                                  Archive
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: "60px", textAlign: "center", color: "var(--color-text-muted)" }}>
                No products match the selected filters.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROMOTIONAL OFFERS & MARQUEE CONTROLS */}
        {activeTab === "offers" && (
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "var(--radius-lg, 16px)",
              border: "1px solid var(--color-border-light, #E2E8F0)",
              boxShadow: "var(--shadow-xs, 0 1px 3px rgba(0,0,0,0.05))",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
                marginBottom: "20px",
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
                  Homepage Marquee & Product Offers Control
                </h2>
                <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted, #718096)", margin: "4px 0 0" }}>
                  Active offers automatically stream in the top marquee and display subtle tags on eligible product cards.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOfferModalOpen(true)}
                className="btn-primary"
                style={{ padding: "10px 20px", fontSize: "0.875rem" }}
              >
                + Create New Offer
              </button>
            </div>

            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--color-text-muted)" }}>
                Loading offers from PostgreSQL database...
              </div>
            ) : offers.length > 0 ? (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--color-border-light, #E2E8F0)", textAlign: "left" }}>
                      <th style={{ padding: "12px 14px", color: "var(--color-text-muted, #718096)", fontWeight: 600 }}>Code</th>
                      <th style={{ padding: "12px 14px", color: "var(--color-text-muted, #718096)", fontWeight: 600 }}>Marquee Banner Text</th>
                      <th style={{ padding: "12px 14px", color: "var(--color-text-muted, #718096)", fontWeight: 600 }}>Type & Value</th>
                      <th style={{ padding: "12px 14px", color: "var(--color-text-muted, #718096)", fontWeight: 600 }}>Min Order</th>
                      <th style={{ padding: "12px 14px", color: "var(--color-text-muted, #718096)", fontWeight: 600 }}>Category</th>
                      <th style={{ padding: "12px 14px", color: "var(--color-text-muted, #718096)", fontWeight: 600 }}>Auto-Apply</th>
                      <th style={{ padding: "12px 14px", color: "var(--color-text-muted, #718096)", fontWeight: 600 }}>Status</th>
                      <th style={{ padding: "12px 14px", color: "var(--color-text-muted, #718096)", fontWeight: 600, textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offers.map((offer) => (
                      <tr key={offer.id || offer.code} style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "12px 14px", fontWeight: 700, color: "var(--color-brand-forest, #173F2B)" }}>
                          <code>{offer.code}</code>
                        </td>
                        <td style={{ padding: "12px 14px", color: "var(--color-text-primary, #2D3748)", fontWeight: 500 }}>
                          {offer.bannerText || offer.title}
                        </td>
                        <td style={{ padding: "12px 14px", color: "var(--color-brand-deep, #123222)" }}>
                          {offer.discountType === "BUNDLE"
                            ? `Buy ${offer.bundleQty || 4} for ₹${offer.bundlePrice || 1199}`
                            : offer.discountType === "PERCENTAGE"
                            ? `${offer.discountValue}% OFF`
                            : offer.discountType === "FREE_SHIPPING"
                            ? "Free Shipping"
                            : `Flat ₹${offer.discountValue} OFF`}
                        </td>
                        <td style={{ padding: "12px 14px", color: "var(--color-text-secondary, #4A5568)" }}>
                          {offer.minCartValue > 0 ? `₹${offer.minCartValue}` : "No Min"}
                        </td>
                        <td style={{ padding: "12px 14px", textTransform: "capitalize", color: "var(--color-brand-green, #24583B)" }}>
                          {offer.applicableCategory || "all"}
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          {offer.autoApply ? (
                            <span
                              style={{
                                padding: "3px 8px",
                                borderRadius: "var(--radius-pill, 999px)",
                                fontSize: "0.6875rem",
                                fontWeight: 700,
                                backgroundColor: "var(--color-brand-sage-light, #DDE7D8)",
                                color: "var(--color-brand-forest, #173F2B)",
                              }}
                            >
                              ⚡ YES
                            </span>
                          ) : (
                            <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Coupon Code</span>
                          )}
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <button
                            type="button"
                            onClick={() => handleToggleOffer(offer.id, offer.isActive)}
                            style={{
                              padding: "4px 12px",
                              borderRadius: "var(--radius-pill, 999px)",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              border: "none",
                              cursor: "pointer",
                              backgroundColor: offer.isActive ? "#EBF8EE" : "#FFF5F5",
                              color: offer.isActive ? "#276749" : "#C53030",
                              transition: "all var(--duration-fast)",
                            }}
                            title="Click to toggle live active status"
                          >
                            {offer.isActive ? "● Active in Marquee" : "○ Inactive"}
                          </button>
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "right" }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteOffer(offer.id, offer.code)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#E53E3E",
                              cursor: "pointer",
                              fontSize: "0.8125rem",
                              fontWeight: 600,
                              padding: "4px 8px",
                            }}
                            title="Delete offer from PostgreSQL database"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--color-text-muted, #718096)" }}>
                No promotional offers configured yet.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ORDERS FULFILLMENT */}
        {activeTab === "orders" && (
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "var(--radius-lg, 16px)",
              border: "1px solid var(--color-border-light, #E2E8F0)",
              boxShadow: "var(--shadow-xs, 0 1px 3px rgba(0,0,0,0.05))",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-serif, 'Cormorant Garamond', Georgia, serif)",
                  fontSize: "1.5rem",
                  color: "var(--color-brand-forest, #173F2B)",
                  margin: 0,
                }}
              >
                Recent Fulfillment Orders
              </h2>
              <span style={{ fontSize: "0.8125rem", color: "var(--color-text-muted, #718096)" }}>
                Backend RBAC Authoritative ({orders.length} orders)
              </span>
            </div>

            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--color-text-muted)" }}>
                Loading orders from database...
              </div>
            ) : orders.length > 0 ? (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--color-border-light, #E2E8F0)", textAlign: "left" }}>
                      <th style={{ padding: "12px 14px", color: "var(--color-text-muted, #718096)", fontWeight: 600 }}>Order #</th>
                      <th style={{ padding: "12px 14px", color: "var(--color-text-muted, #718096)", fontWeight: 600 }}>Recipient</th>
                      <th style={{ padding: "12px 14px", color: "var(--color-text-muted, #718096)", fontWeight: 600 }}>Items</th>
                      <th style={{ padding: "12px 14px", color: "var(--color-text-muted, #718096)", fontWeight: 600 }}>Total</th>
                      <th style={{ padding: "12px 14px", color: "var(--color-text-muted, #718096)", fontWeight: 600 }}>Status</th>
                      <th style={{ padding: "12px 14px", color: "var(--color-text-muted, #718096)", fontWeight: 600 }}>Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.orderId || o.orderNumber} style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--color-brand-forest, #173F2B)" }}>
                          {o.orderNumber}
                        </td>
                        <td style={{ padding: "12px 14px", color: "var(--color-text-secondary, #4A5568)" }}>
                          {o.address?.name || o.customerName || "Customer"}
                        </td>
                        <td style={{ padding: "12px 14px", color: "var(--color-text-secondary, #4A5568)" }}>
                          {o.items && o.items.length > 0 ? o.items.map((i) => `${i.name} (×${i.quantity})`).join(", ") : "Items"}
                        </td>
                        <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--color-brand-deep, #123222)" }}>
                          ₹{o.total}
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <select
                            value={o.orderStatus || "Placed"}
                            onChange={(e) => handleOrderStatusChange(o, e.target.value)}
                            aria-label={`Update fulfillment status for order ${o.orderNumber}`}
                            style={{
                              padding: "4px 10px",
                              borderRadius: "var(--radius-pill, 999px)",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              border: "none",
                              cursor: "pointer",
                              backgroundColor:
                                o.orderStatus === "Cancelled"
                                  ? "#FDE8E8"
                                  : o.orderStatus === "Delivered"
                                  ? "#EBF8EE"
                                  : "var(--color-brand-sage-light, #DDE7D8)",
                              color:
                                o.orderStatus === "Cancelled"
                                  ? "#C81E1E"
                                  : o.orderStatus === "Delivered"
                                  ? "#276749"
                                  : "var(--color-brand-forest, #173F2B)",
                            }}
                          >
                            <option value="Placed">● Placed</option>
                            <option value="Confirmed">● Confirmed</option>
                            <option value="Packed">● Packed</option>
                            <option value="Dispatched">● Dispatched / Shipped</option>
                            <option value="Out for Delivery">● Out for Delivery</option>
                            <option value="Delivered">● Delivered</option>
                            <option value="Cancelled">✕ Cancelled</option>
                          </select>
                        </td>
                        <td style={{ padding: "12px 14px", color: "var(--color-brand-green, #24583B)", fontSize: "0.8125rem" }}>
                          {o.paymentMethod || "UPI"} • {o.paymentStatus || "COMPLETED"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--color-text-muted, #718096)" }}>
                No customer orders recorded yet.
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CATEGORIES MANAGEMENT */}
        {activeTab === "categories" && (
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "var(--radius-lg, 16px)",
              border: "1px solid var(--color-border-light, #E2E8F0)",
              boxShadow: "var(--shadow-xs, 0 1px 3px rgba(0,0,0,0.05))",
              padding: "24px",
            }}
          >
            <div style={{ marginBottom: "20px" }}>
              <h2
                style={{
                  fontFamily: "var(--font-serif, 'Cormorant Garamond', Georgia, serif)",
                  fontSize: "1.5rem",
                  color: "var(--color-brand-forest, #173F2B)",
                  margin: 0,
                }}
              >
                Storefront Categories Overview
              </h2>
              <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted, #718096)", margin: "4px 0 0" }}>
                Primary product taxonomy governing navigation links, discounts, and category listings.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  style={{
                    padding: "20px",
                    borderRadius: "var(--radius-md, 8px)",
                    border: "1px solid var(--color-border-light, #E2E8F0)",
                    background: "#FAF8F5",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <h3 style={{ margin: 0, color: "var(--color-brand-forest, #173F2B)", fontSize: "1.125rem" }}>
                        {cat.name}
                      </h3>
                      <span
                        style={{
                          padding: "3px 8px",
                          borderRadius: "999px",
                          fontSize: "0.6875rem",
                          fontWeight: 700,
                          backgroundColor: cat.isActive ? "#EBF8EE" : "#FFF5F5",
                          color: cat.isActive ? "#276749" : "#C53030",
                        }}
                      >
                        {cat.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", marginBottom: "12px" }}>
                      Slug: <code>/{cat.slug}</code> • Display Order: #{cat.displayOrder}
                    </div>
                    <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.5 }}>
                      {cat.description || "Primary botanical collection in Flora Fusion."}
                    </p>
                  </div>

                  <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Link
                      href={`/${cat.slug}`}
                      target="_blank"
                      style={{ fontSize: "0.8125rem", color: "var(--color-brand-forest)", fontWeight: 600, textDecoration: "none" }}
                    >
                      View Category Page ↗
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleToggleCategory(cat)}
                      style={{
                        padding: "5px 12px",
                        borderRadius: "var(--radius-pill, 999px)",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        border: "1px solid #CBD5E0",
                        background: "#FFFFFF",
                        cursor: "pointer",
                      }}
                    >
                      {cat.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMPREHENSIVE PRODUCT CRUD MODAL */}
        <AdminProductModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          onSave={handleSaveProduct}
          productToEdit={productToEdit}
        />

        {/* MODAL: CREATE NEW PROMOTIONAL OFFER */}
        {isOfferModalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(4px)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
            }}
            onClick={() => setIsOfferModalOpen(false)}
          >
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "var(--radius-lg, 16px)",
                padding: "32px",
                maxWidth: "600px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "var(--shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.1))",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-serif, 'Cormorant Garamond', Georgia, serif)",
                    fontSize: "1.75rem",
                    color: "var(--color-brand-forest, #173F2B)",
                    margin: 0,
                  }}
                >
                  Create Promotional Offer
                </h3>
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#A0AEC0" }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateOfferSubmit} style={{ display: "grid", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "6px" }}>
                      Offer Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. GET10OFF"
                      value={newOffer.code}
                      onChange={(e) => setNewOffer({ ...newOffer, code: e.target.value.toUpperCase() })}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid var(--color-border-light, #CBD5E0)",
                        borderRadius: "var(--radius-sm, 6px)",
                        fontSize: "0.875rem",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "6px" }}>
                      Discount Type *
                    </label>
                    <select
                      value={newOffer.discountType}
                      onChange={(e) => setNewOffer({ ...newOffer, discountType: e.target.value as any })}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid var(--color-border-light, #CBD5E0)",
                        borderRadius: "var(--radius-sm, 6px)",
                        fontSize: "0.875rem",
                      }}
                    >
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="BUNDLE">Bundle Deal (e.g. Buy 4 for ₹1,199)</option>
                      <option value="FREE_SHIPPING">Free Shipping</option>
                      <option value="FIXED_AMOUNT">Fixed Amount (₹)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "6px" }}>
                    Marquee Scrolling Banner Text *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 🎉 GET 10% OFF ON ORDERS ABOVE ₹1,499"
                    value={newOffer.bannerText}
                    onChange={(e) => setNewOffer({ ...newOffer, bannerText: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid var(--color-border-light, #CBD5E0)",
                      borderRadius: "var(--radius-sm, 6px)",
                      fontSize: "0.875rem",
                    }}
                  />
                  <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                    This exact text scrolls continuously in the top marquee strip.
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "6px" }}>
                      Short Offer Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 10% OFF"
                      value={newOffer.title}
                      onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid var(--color-border-light, #CBD5E0)",
                        borderRadius: "var(--radius-sm, 6px)",
                        fontSize: "0.875rem",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "6px" }}>
                      Applicable Category
                    </label>
                    <select
                      value={newOffer.applicableCategory}
                      onChange={(e) => setNewOffer({ ...newOffer, applicableCategory: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid var(--color-border-light, #CBD5E0)",
                        borderRadius: "var(--radius-sm, 6px)",
                        fontSize: "0.875rem",
                      }}
                    >
                      <option value="all">All Products (Plants, Pots & Seeds)</option>
                      <option value="plants">Live Plants Only</option>
                      <option value="pots">Pots & Planters Only</option>
                      <option value="seeds">Seeds Only</option>
                    </select>
                  </div>
                </div>

                {newOffer.discountType === "BUNDLE" ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "6px" }}>
                        Required Bundle Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newOffer.bundleQty || 4}
                        onChange={(e) => setNewOffer({ ...newOffer, bundleQty: parseInt(e.target.value) || 4 })}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          border: "1px solid var(--color-border-light, #CBD5E0)",
                          borderRadius: "var(--radius-sm, 6px)",
                          fontSize: "0.875rem",
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "6px" }}>
                        Bundle Special Price (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newOffer.bundlePrice || 1199}
                        onChange={(e) =>
                          setNewOffer({
                            ...newOffer,
                            bundlePrice: parseFloat(e.target.value) || 1199,
                            discountValue: parseFloat(e.target.value) || 1199,
                          })
                        }
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          border: "1px solid var(--color-border-light, #CBD5E0)",
                          borderRadius: "var(--radius-sm, 6px)",
                          fontSize: "0.875rem",
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "6px" }}>
                        Discount Value ({newOffer.discountType === "PERCENTAGE" ? "%" : "₹"}) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newOffer.discountValue}
                        onChange={(e) => setNewOffer({ ...newOffer, discountValue: parseFloat(e.target.value) || 0 })}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          border: "1px solid var(--color-border-light, #CBD5E0)",
                          borderRadius: "var(--radius-sm, 6px)",
                          fontSize: "0.875rem",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "6px" }}>
                        Minimum Cart Value (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newOffer.minCartValue || 0}
                        onChange={(e) => setNewOffer({ ...newOffer, minCartValue: parseFloat(e.target.value) || 0 })}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          border: "1px solid var(--color-border-light, #CBD5E0)",
                          borderRadius: "var(--radius-sm, 6px)",
                          fontSize: "0.875rem",
                        }}
                      />
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", gap: "24px", alignItems: "center", marginTop: "8px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.875rem", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={newOffer.autoApply}
                      onChange={(e) => setNewOffer({ ...newOffer, autoApply: e.target.checked })}
                    />
                    <strong>Auto-apply discount to eligible cart</strong>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.875rem", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={newOffer.isActive}
                      onChange={(e) => setNewOffer({ ...newOffer, isActive: e.target.checked })}
                    />
                    <strong>Active immediately</strong>
                  </label>
                </div>

                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "16px" }}>
                  <button
                    type="button"
                    onClick={() => setIsOfferModalOpen(false)}
                    className="btn-secondary"
                    style={{ padding: "10px 20px", fontSize: "0.875rem" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingOffer}
                    className="btn-primary"
                    style={{ padding: "10px 24px", fontSize: "0.875rem" }}
                  >
                    {isSubmittingOffer ? "Saving to Database..." : "Save Offer to PostgreSQL"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
