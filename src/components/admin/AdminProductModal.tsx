"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Product, ProductCategory, ProductStatus, AdminProductPayload } from "@/types/product";

interface AdminProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: AdminProductPayload, productId?: string) => Promise<void>;
  productToEdit?: Product | null;
}

export function AdminProductModal({ isOpen, onClose, onSave, productToEdit }: AdminProductModalProps) {
  const [activeTab, setActiveTab] = useState<"details" | "pricing" | "images" | "turntable360" | "specs">("details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<ProductCategory>("plants");
  const [subCategory, setSubCategory] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState<number>(399);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(499);
  const [badge, setBadge] = useState<string>("");
  const [stockQuantity, setStockQuantity] = useState<number>(50);
  const [inStock, setInStock] = useState<boolean>(true);
  const [status, setStatus] = useState<ProductStatus>("ACTIVE");

  // Media State
  const [primaryImage, setPrimaryImage] = useState<string>("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState<string>("");
  const [images360, setImages360] = useState<string[]>([]);
  const [new360Url, setNew360Url] = useState<string>("");
  const [bulk360Text, setBulk360Text] = useState<string>("");
  const [showBulk360, setShowBulk360] = useState<boolean>(false);
  const [active360FrameIndex, setActive360FrameIndex] = useState<number>(0);

  // Specs & Care Guide State
  const [metaPlacement, setMetaPlacement] = useState("Indoor");
  const [metaWater, setMetaWater] = useState("Low Water");
  const [metaLight, setMetaLight] = useState("Indirect Sun");
  const [metaDifficulty, setMetaDifficulty] = useState("Easy for Beginners");
  const [metaAirPurifying, setMetaAirPurifying] = useState(true);
  const [metaPetFriendly, setMetaPetFriendly] = useState(false);
  const [metaSize, setMetaSize] = useState("Medium (8-12 inches)");

  const [potMaterial, setPotMaterial] = useState("Ceramic");
  const [potSize, setPotSize] = useState("8 inch diameter");
  const [potDrainage, setPotDrainage] = useState("Includes drainage hole + plug");
  const [potStyle, setPotStyle] = useState("Modern Minimalist");
  const [potColors, setPotColors] = useState("Terracotta, Sage Green, Ivory White");

  const [seedType, setSeedType] = useState("Herb Seeds");
  const [seedGermination, setSeedGermination] = useState("5-8 Days");
  const [seedHarvestTime, setSeedHarvestTime] = useState("4-5 Weeks");
  const [seedSeason, setSeedSeason] = useState("Year-round");
  const [seedDifficulty, setSeedDifficulty] = useState("Easy");
  const [seedCount, setSeedCount] = useState("50+ Seeds");

  const [careWatering, setCareWatering] = useState("Water thoroughly when top 2 inches of soil feel dry.");
  const [careSunlight, setCareSunlight] = useState("Prefers bright, indirect light; avoid harsh midday sun.");
  const [careRepotting, setCareRepotting] = useState("Repot once every 18-24 months into a slightly larger planter.");
  const [careProTip, setCareProTip] = useState("Wipe leaves with a damp cloth once a month to boost photosynthesis.");

  // Populate form on edit
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || "");
      setSlug(productToEdit.slug || "");
      setCategory(productToEdit.category || "plants");
      setSubCategory(productToEdit.subCategory || "");
      setTagline(productToEdit.tagline || "");
      setDescription(productToEdit.description || "");
      setSku(productToEdit.sku || `FF-${productToEdit.category.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`);
      setPrice(productToEdit.price || 0);
      setOriginalPrice(productToEdit.originalPrice || productToEdit.price || 0);
      setBadge(productToEdit.badge || "");
      setStockQuantity(productToEdit.stockQuantity ?? (productToEdit.inStock ? 50 : 0));
      setInStock(productToEdit.inStock ?? true);
      setStatus(productToEdit.status || "ACTIVE");

      setPrimaryImage(productToEdit.image || "");
      setGalleryImages(productToEdit.images && productToEdit.images.length > 0 ? productToEdit.images : (productToEdit.image ? [productToEdit.image] : []));
      setImages360(productToEdit.images360 || []);

      const meta = (productToEdit.metadata || {}) as any;
      if (productToEdit.category === "plants") {
        setMetaPlacement(meta.placement || "Indoor");
        setMetaWater(meta.water || "Low Water");
        setMetaLight(meta.light || "Indirect Sun");
        setMetaDifficulty(meta.difficulty || "Easy for Beginners");
        setMetaAirPurifying(meta.airPurifying ?? true);
        setMetaPetFriendly(meta.petFriendly ?? false);
        setMetaSize(meta.size || "Medium (8-12 inches)");
      } else if (productToEdit.category === "pots") {
        setPotMaterial(meta.material || "Ceramic");
        setPotSize(meta.size || "8 inch diameter");
        setPotDrainage(meta.drainage || "Includes drainage hole + plug");
        setPotStyle(meta.style || "Modern Minimalist");
        setPotColors(Array.isArray(meta.colors) ? meta.colors.join(", ") : meta.colors || "Terracotta, Sage");
      } else if (productToEdit.category === "seeds") {
        setSeedType(meta.type || "Herb Seeds");
        setSeedGermination(meta.germination || "5-8 Days");
        setSeedHarvestTime(meta.harvestTime || "4-5 Weeks");
        setSeedSeason(meta.season || "Year-round");
        setSeedDifficulty(meta.difficulty || "Easy");
        setSeedCount(meta.seedCount || "50+ Seeds");
      }

      if (productToEdit.careGuide) {
        setCareWatering(productToEdit.careGuide.watering || "");
        setCareSunlight(productToEdit.careGuide.sunlight || "");
        setCareRepotting(productToEdit.careGuide.repotting || "");
        setCareProTip(productToEdit.careGuide.proTip || "");
      }
    } else {
      // Defaults for new product
      setName("");
      setSlug("");
      setCategory("plants");
      setSubCategory("indoor");
      setTagline("");
      setDescription("");
      setSku(`FF-PLN-${Math.floor(100 + Math.random() * 900)}`);
      setPrice(399);
      setOriginalPrice(499);
      setBadge("");
      setStockQuantity(50);
      setInStock(true);
      setStatus("ACTIVE");
      setPrimaryImage("/assets/products/plants/money-plant-1.jpg");
      setGalleryImages(["/assets/products/plants/money-plant-1.jpg", "/assets/products/plants/money-plant-2.jpg"]);
      setImages360(["/assets/products/plants/money-plant-1.jpg", "/assets/products/plants/money-plant-2.jpg", "/assets/products/plants/money-plant-3.jpg", "/assets/products/plants/money-plant-4.jpg"]);
      setFormError(null);
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  // Auto-slugify when name changes if user hasn't typed custom slug
  const handleNameChange = (val: string) => {
    setName(val);
    if (!productToEdit) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/[\s-]+/g, "-")
      );
    }
  };

  // Image manipulation helpers
  const handleAddGalleryImage = () => {
    if (!newGalleryUrl.trim()) return;
    setGalleryImages((prev) => [...prev, newGalleryUrl.trim()]);
    if (!primaryImage) setPrimaryImage(newGalleryUrl.trim());
    setNewGalleryUrl("");
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetPrimary = (url: string) => {
    setPrimaryImage(url);
  };

  const handleMoveGalleryImage = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= galleryImages.length) return;
    const updated = [...galleryImages];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setGalleryImages(updated);
  };

  // 360 frames manipulation helpers
  const handleAdd360Frame = () => {
    if (!new360Url.trim()) return;
    setImages360((prev) => [...prev, new360Url.trim()]);
    setNew360Url("");
  };

  const handleRemove360Frame = (index: number) => {
    setImages360((prev) => prev.filter((_, i) => i !== index));
    if (active360FrameIndex >= images360.length - 1) {
      setActive360FrameIndex(Math.max(0, images360.length - 2));
    }
  };

  const handleMove360Frame = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= images360.length) return;
    const updated = [...images360];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setImages360(updated);
  };

  const handleBulk360Import = () => {
    if (!bulk360Text.trim()) return;
    const urls = bulk360Text
      .split(/[\n,]/)
      .map((u) => u.trim())
      .filter((u) => u.length > 0);
    if (urls.length > 0) {
      setImages360(urls);
      setShowBulk360(false);
      setBulk360Text("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError("Product name is required.");
      setActiveTab("details");
      return;
    }
    if (!sku.trim()) {
      setFormError("SKU is required.");
      setActiveTab("details");
      return;
    }
    if (!description.trim()) {
      setFormError("Product description is required.");
      setActiveTab("details");
      return;
    }
    if (price < 0) {
      setFormError("Price cannot be negative.");
      setActiveTab("pricing");
      return;
    }
    if (originalPrice !== undefined && originalPrice < price) {
      setFormError("Original MRP price cannot be lower than the selling price.");
      setActiveTab("pricing");
      return;
    }

    // Build category metadata
    let metadata: Record<string, any> = {};
    if (category === "plants") {
      metadata = {
        placement: metaPlacement,
        water: metaWater,
        light: metaLight,
        difficulty: metaDifficulty,
        airPurifying: metaAirPurifying,
        petFriendly: metaPetFriendly,
        size: metaSize,
      };
    } else if (category === "pots") {
      metadata = {
        material: potMaterial,
        size: potSize,
        drainage: potDrainage,
        style: potStyle,
        colors: potColors.split(",").map((c) => c.trim()).filter(Boolean),
      };
    } else if (category === "seeds") {
      metadata = {
        type: seedType,
        germination: seedGermination,
        harvestTime: seedHarvestTime,
        season: seedSeason,
        difficulty: seedDifficulty,
        seedCount: seedCount,
      };
    }

    const careGuide: Record<string, any> = {
      watering: careWatering,
      sunlight: careSunlight,
      repotting: careRepotting,
      proTip: careProTip,
    };

    const payload: AdminProductPayload = {
      name: name.trim(),
      slug: slug.trim() || undefined,
      categorySlug: category,
      subCategory: subCategory.trim() || undefined,
      tagline: tagline.trim() || undefined,
      description: description.trim(),
      sku: sku.trim().toUpperCase(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      badge: badge.trim() || null,
      stockQuantity: Number(stockQuantity),
      inStock: inStock && Number(stockQuantity) > 0,
      status,
      primaryImage: primaryImage.trim() || (galleryImages[0] || "/assets/products/plants/money-plant-1.jpg"),
      images: galleryImages.filter(Boolean),
      images360: images360.filter(Boolean),
      metadata,
      careGuide,
    };

    setIsSubmitting(true);
    try {
      await onSave(payload, productToEdit?.id);
      onClose();
    } catch (err: any) {
      setFormError(err?.message || "Failed to save product to database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(18, 50, 34, 0.6)",
        backdropFilter: "blur(6px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "var(--radius-lg, 16px)",
          maxWidth: "840px",
          width: "100%",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 28px",
            borderBottom: "1px solid var(--color-border-light, #E2E8F0)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#FAF8F5",
          }}
        >
          <div>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-brand-terracotta, #B9825B)" }}>
              {productToEdit ? "Product Management Editor" : "New Catalog Entry"}
            </div>
            <h2
              style={{
                fontFamily: "var(--font-serif, 'Cormorant Garamond', Georgia, serif)",
                fontSize: "1.75rem",
                color: "var(--color-brand-forest, #173F2B)",
                margin: "2px 0 0",
              }}
            >
              {productToEdit ? `Edit: ${productToEdit.name}` : "Create New Product"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#718096",
              padding: "4px 8px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            padding: "10px 24px 0",
            borderBottom: "1px solid var(--color-border-light, #E2E8F0)",
            backgroundColor: "#FFFFFF",
            overflowX: "auto",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            style={{
              padding: "8px 16px",
              border: "none",
              borderBottom: activeTab === "details" ? "2px solid var(--color-brand-forest, #173F2B)" : "2px solid transparent",
              background: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              color: activeTab === "details" ? "var(--color-brand-forest, #173F2B)" : "var(--color-text-muted, #718096)",
              cursor: "pointer",
            }}
          >
            📝 Basic Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pricing")}
            style={{
              padding: "8px 16px",
              border: "none",
              borderBottom: activeTab === "pricing" ? "2px solid var(--color-brand-forest, #173F2B)" : "2px solid transparent",
              background: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              color: activeTab === "pricing" ? "var(--color-brand-forest, #173F2B)" : "var(--color-text-muted, #718096)",
              cursor: "pointer",
            }}
          >
            💰 Pricing & Inventory
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("images")}
            style={{
              padding: "8px 16px",
              border: "none",
              borderBottom: activeTab === "images" ? "2px solid var(--color-brand-forest, #173F2B)" : "2px solid transparent",
              background: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              color: activeTab === "images" ? "var(--color-brand-forest, #173F2B)" : "var(--color-text-muted, #718096)",
              cursor: "pointer",
            }}
          >
            🖼️ Photos & Gallery ({galleryImages.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("turntable360")}
            style={{
              padding: "8px 16px",
              border: "none",
              borderBottom: activeTab === "turntable360" ? "2px solid var(--color-brand-forest, #173F2B)" : "2px solid transparent",
              background: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              color: activeTab === "turntable360" ? "var(--color-brand-forest, #173F2B)" : "var(--color-text-muted, #718096)",
              cursor: "pointer",
            }}
          >
            🔄 360° Turntable ({images360.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("specs")}
            style={{
              padding: "8px 16px",
              border: "none",
              borderBottom: activeTab === "specs" ? "2px solid var(--color-brand-forest, #173F2B)" : "2px solid transparent",
              background: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              color: activeTab === "specs" ? "var(--color-brand-forest, #173F2B)" : "var(--color-text-muted, #718096)",
              cursor: "pointer",
            }}
          >
            🌿 Specs & Care Guide
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
          <div style={{ padding: "24px 28px", overflowY: "auto", flex: 1 }}>
            {formError && (
              <div
                style={{
                  backgroundColor: "#FFF5F5",
                  color: "#C53030",
                  border: "1px solid #FEB2B2",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm, 6px)",
                  marginBottom: "16px",
                  fontSize: "0.875rem",
                }}
              >
                ⚠️ {formError}
              </div>
            )}

            {/* TAB 1: BASIC DETAILS */}
            {activeTab === "details" && (
              <div style={{ display: "grid", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "4px" }}>
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fiddle Leaf Fig"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
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
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "4px" }}>
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ProductCategory)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid var(--color-border-light, #CBD5E0)",
                        borderRadius: "var(--radius-sm, 6px)",
                        fontSize: "0.875rem",
                      }}
                    >
                      <option value="plants">Live Plants (plants)</option>
                      <option value="pots">Pots & Planters (pots)</option>
                      <option value="seeds">Premium Seeds (seeds)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "4px" }}>
                      SKU Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. FF-PLN-012"
                      value={sku}
                      onChange={(e) => setSku(e.target.value.toUpperCase())}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid var(--color-border-light, #CBD5E0)",
                        borderRadius: "var(--radius-sm, 6px)",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "4px" }}>
                      URL Slug
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. fiddle-leaf-fig"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[\s]+/g, "-"))}
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
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "4px" }}>
                      Sub-Category / Filter Tag
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. indoor, ceramic, herb"
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
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
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "4px" }}>
                      Product Badge
                    </label>
                    <select
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid var(--color-border-light, #CBD5E0)",
                        borderRadius: "var(--radius-sm, 6px)",
                        fontSize: "0.875rem",
                      }}
                    >
                      <option value="">(No Badge)</option>
                      <option value="Bestseller">⭐ Bestseller</option>
                      <option value="Popular">🔥 Popular</option>
                      <option value="Classic">🌿 Classic</option>
                      <option value="Rare">✨ Rare Exotic</option>
                      <option value="New">🌱 New Arrival</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "4px" }}>
                    Tagline / One-Line Hook
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dramatic statement foliage for modern living rooms"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
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
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "4px" }}>
                    Complete Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Detailed botanical description, origins, aesthetic properties and features..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid var(--color-border-light, #CBD5E0)",
                      borderRadius: "var(--radius-sm, 6px)",
                      fontSize: "0.875rem",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
              </div>
            )}

            {/* TAB 2: PRICING & INVENTORY */}
            {activeTab === "pricing" && (
              <div style={{ display: "grid", gap: "20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div
                    style={{
                      background: "#F8FAF8",
                      padding: "16px",
                      borderRadius: "var(--radius-md, 8px)",
                      border: "1px solid var(--color-brand-sage-light, #DDE7D8)",
                    }}
                  >
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "6px", color: "var(--color-brand-forest, #173F2B)" }}>
                      Selling Base Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="1"
                      value={price}
                      onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: "1px solid var(--color-brand-forest, #173F2B)",
                        borderRadius: "var(--radius-sm, 6px)",
                        fontSize: "1.125rem",
                        fontWeight: 700,
                      }}
                    />
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "4px", display: "block" }}>
                      The active selling price charged in INR to customers at checkout.
                    </span>
                  </div>

                  <div
                    style={{
                      background: "#F8FAF8",
                      padding: "16px",
                      borderRadius: "var(--radius-md, 8px)",
                      border: "1px solid var(--color-border-light, #E2E8F0)",
                    }}
                  >
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "6px", color: "var(--color-text-secondary, #4A5568)" }}>
                      Original / MRP Price (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="e.g. 599"
                      value={originalPrice ?? ""}
                      onChange={(e) => setOriginalPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: "1px solid var(--color-border-light, #CBD5E0)",
                        borderRadius: "var(--radius-sm, 6px)",
                        fontSize: "1.125rem",
                        fontWeight: 600,
                      }}
                    />
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "4px", display: "block" }}>
                      Strikethrough comparison MRP to display customer discount savings.
                    </span>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "4px" }}>
                      Stock Quantity (Units) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={stockQuantity}
                      onChange={(e) => {
                        const qty = parseInt(e.target.value) || 0;
                        setStockQuantity(qty);
                        if (qty === 0) setInStock(false);
                      }}
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
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "4px" }}>
                      Catalog Status *
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as ProductStatus)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid var(--color-border-light, #CBD5E0)",
                        borderRadius: "var(--radius-sm, 6px)",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      }}
                    >
                      <option value="ACTIVE">🟢 ACTIVE (Visible in Store)</option>
                      <option value="INACTIVE">🟠 INACTIVE (Hidden from Store)</option>
                      <option value="ARCHIVED">⚪ ARCHIVED (Soft Deleted)</option>
                    </select>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", paddingTop: "20px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.875rem", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={inStock}
                        onChange={(e) => setInStock(e.target.checked)}
                        style={{ width: "18px", height: "18px" }}
                      />
                      <strong>Mark as In-Stock</strong>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PHOTOS & GALLERY */}
            {activeTab === "images" && (
              <div style={{ display: "grid", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "6px" }}>
                    Primary Cover Photo URL *
                  </label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="text"
                      required
                      placeholder="e.g. /assets/products/plants/money-plant-1.jpg or CDN link"
                      value={primaryImage}
                      onChange={(e) => setPrimaryImage(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        border: "1px solid var(--color-border-light, #CBD5E0)",
                        borderRadius: "var(--radius-sm, 6px)",
                        fontSize: "0.875rem",
                      }}
                    />
                  </div>
                </div>

                {/* Add new gallery image */}
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "6px" }}>
                    Add Gallery Photography URL
                  </label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="text"
                      placeholder="Enter image asset path or Supabase / HTTPS image URL..."
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        border: "1px solid var(--color-border-light, #CBD5E0)",
                        borderRadius: "var(--radius-sm, 6px)",
                        fontSize: "0.875rem",
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddGalleryImage}
                      className="btn-primary"
                      style={{ padding: "8px 18px", fontSize: "0.8125rem", whiteSpace: "nowrap" }}
                    >
                      + Add Photo
                    </button>
                  </div>
                </div>

                {/* Gallery List */}
                <div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: "8px" }}>
                    Current Gallery Photos ({galleryImages.length}):
                  </div>

                  {galleryImages.length === 0 ? (
                    <div style={{ padding: "20px", textAlign: "center", background: "#FAF8F5", borderRadius: "8px", color: "var(--color-text-muted)" }}>
                      No gallery photos added yet. Add URLs above.
                    </div>
                  ) : (
                    <div style={{ display: "grid", gap: "8px" }}>
                      {galleryImages.map((url, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "8px 12px",
                            background: url === primaryImage ? "#F0F7F2" : "#FFFFFF",
                            border: url === primaryImage ? "1px solid #A7D7B5" : "1px solid #E2E8F0",
                            borderRadius: "var(--radius-md, 8px)",
                          }}
                        >
                          <div
                            style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "6px",
                              overflow: "hidden",
                              backgroundColor: "#EDF2F7",
                              position: "relative",
                              flexShrink: 0,
                            }}
                          >
                            <img
                              src={url}
                              alt={`Gallery ${idx + 1}`}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/assets/products/plants/money-plant-1.jpg";
                              }}
                            />
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "0.8125rem", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {url}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: url === primaryImage ? "#276749" : "#718096", fontWeight: url === primaryImage ? 700 : 400 }}>
                              {url === primaryImage ? "★ Primary Cover Photo" : `Gallery Photo #${idx + 1}`}
                            </div>
                          </div>

                          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                            {url !== primaryImage && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimary(url)}
                                style={{
                                  padding: "4px 8px",
                                  fontSize: "0.75rem",
                                  borderRadius: "4px",
                                  border: "1px solid #CBD5E0",
                                  background: "#FFFFFF",
                                  cursor: "pointer",
                                }}
                              >
                                Set Primary
                              </button>
                            )}
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveGalleryImage(idx, "up")}
                              style={{ padding: "4px 8px", fontSize: "0.75rem", cursor: idx === 0 ? "not-allowed" : "pointer" }}
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              disabled={idx === galleryImages.length - 1}
                              onClick={() => handleMoveGalleryImage(idx, "down")}
                              style={{ padding: "4px 8px", fontSize: "0.75rem", cursor: idx === galleryImages.length - 1 ? "not-allowed" : "pointer" }}
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(idx)}
                              style={{ padding: "4px 8px", fontSize: "0.75rem", color: "#E53E3E", border: "none", background: "none", cursor: "pointer", fontWeight: 700 }}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: 360° TURNTABLE SEQUENCES */}
            {activeTab === "turntable360" && (
              <div style={{ display: "grid", gap: "20px" }}>
                <div
                  style={{
                    backgroundColor: "#F0F7F2",
                    padding: "16px",
                    borderRadius: "var(--radius-md, 8px)",
                    border: "1px solid #C6E2D0",
                  }}
                >
                  <div style={{ fontWeight: 600, color: "var(--color-brand-forest, #173F2B)", fontSize: "0.9375rem" }}>
                    🔄 360° Multi-Angle Studio Turntable Configuration
                  </div>
                  <p style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary, #4A5568)", margin: "4px 0 0" }}>
                    Customers can drag or scrub through sequential multi-angle photos (at least 4 frames recommended) on the product page.
                  </p>
                </div>

                {/* 360 Live Scrubber Preview */}
                {images360.length > 0 && (
                  <div
                    style={{
                      background: "#FFFFFF",
                      padding: "16px",
                      borderRadius: "var(--radius-md, 8px)",
                      border: "1px solid var(--color-border-light, #E2E8F0)",
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <div
                      style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        backgroundColor: "#F7FAFC",
                        position: "relative",
                        flexShrink: 0,
                        border: "1px solid #CBD5E0",
                      }}
                    >
                      <img
                        src={images360[active360FrameIndex] || images360[0]}
                        alt="360 preview frame"
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/assets/products/plants/money-plant-1.jpg";
                        }}
                      />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "4px" }}>
                        <span>Interactive 360° Scrubber Preview</span>
                        <span style={{ color: "var(--color-brand-green)" }}>
                          Frame {active360FrameIndex + 1} of {images360.length}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={Math.max(0, images360.length - 1)}
                        value={active360FrameIndex}
                        onChange={(e) => setActive360FrameIndex(parseInt(e.target.value))}
                        style={{ width: "100%", cursor: "ew-resize" }}
                      />
                      <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
                        Drag slider to test 360 rotation smoothness in real-time.
                      </div>
                    </div>
                  </div>
                )}

                {/* Add Single Frame */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <label style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
                      Add 360° Sequential Angle Frame
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowBulk360(!showBulk360)}
                      style={{ background: "none", border: "none", color: "var(--color-brand-forest)", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}
                    >
                      {showBulk360 ? "Hide Bulk Importer" : "⚡ Bulk Paste Frame URLs"}
                    </button>
                  </div>

                  {showBulk360 ? (
                    <div style={{ background: "#FAF8F5", padding: "12px", borderRadius: "8px", marginBottom: "12px", border: "1px dashed var(--color-brand-terracotta)" }}>
                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, marginBottom: "4px" }}>
                        Paste sequential frame URLs (one per line or comma-separated):
                      </label>
                      <textarea
                        rows={4}
                        placeholder="/assets/products/plants/money-plant-1.jpg&#10;/assets/products/plants/money-plant-2.jpg&#10;/assets/products/plants/money-plant-3.jpg&#10;/assets/products/plants/money-plant-4.jpg"
                        value={bulk360Text}
                        onChange={(e) => setBulk360Text(e.target.value)}
                        style={{ width: "100%", padding: "8px", fontSize: "0.8125rem", fontFamily: "monospace" }}
                      />
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "8px" }}>
                        <button
                          type="button"
                          onClick={() => setShowBulk360(false)}
                          style={{ padding: "6px 12px", fontSize: "0.75rem" }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleBulk360Import}
                          className="btn-primary"
                          style={{ padding: "6px 14px", fontSize: "0.75rem" }}
                        >
                          Import Frame Sequence
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <input
                        type="text"
                        placeholder="e.g. /assets/products/plants/snake-plant-1.jpg"
                        value={new360Url}
                        onChange={(e) => setNew360Url(e.target.value)}
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          border: "1px solid var(--color-border-light, #CBD5E0)",
                          borderRadius: "var(--radius-sm, 6px)",
                          fontSize: "0.875rem",
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAdd360Frame}
                        className="btn-primary"
                        style={{ padding: "8px 18px", fontSize: "0.8125rem" }}
                      >
                        + Add Frame
                      </button>
                    </div>
                  )}
                </div>

                {/* 360 Frame List */}
                <div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: "8px" }}>
                    Configured 360° Frames ({images360.length}):
                  </div>

                  {images360.length === 0 ? (
                    <div style={{ padding: "20px", textAlign: "center", background: "#FAF8F5", borderRadius: "8px", color: "var(--color-text-muted)" }}>
                      No 360° angle frames configured yet. (Optional feature for Plants and Pots).
                    </div>
                  ) : (
                    <div style={{ display: "grid", gap: "8px" }}>
                      {images360.map((url, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "8px 12px",
                            background: active360FrameIndex === idx ? "#F0F7F2" : "#FFFFFF",
                            border: active360FrameIndex === idx ? "1px solid #276749" : "1px solid #E2E8F0",
                            borderRadius: "var(--radius-md, 8px)",
                          }}
                        >
                          <span
                            style={{
                              backgroundColor: "var(--color-brand-sage-light, #DDE7D8)",
                              color: "var(--color-brand-forest, #173F2B)",
                              fontWeight: 700,
                              fontSize: "0.75rem",
                              padding: "2px 8px",
                              borderRadius: "999px",
                            }}
                          >
                            Frame {idx + 1}
                          </span>

                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "4px",
                              overflow: "hidden",
                              backgroundColor: "#EDF2F7",
                              position: "relative",
                              flexShrink: 0,
                            }}
                          >
                            <img
                              src={url}
                              alt={`360 Frame ${idx + 1}`}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/assets/products/plants/money-plant-1.jpg";
                              }}
                            />
                          </div>

                          <div style={{ flex: 1, minWidth: 0, fontSize: "0.8125rem", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {url}
                          </div>

                          <div style={{ display: "flex", gap: "6px" }}>
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMove360Frame(idx, "up")}
                              style={{ padding: "4px 8px", fontSize: "0.75rem", cursor: idx === 0 ? "not-allowed" : "pointer" }}
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              disabled={idx === images360.length - 1}
                              onClick={() => handleMove360Frame(idx, "down")}
                              style={{ padding: "4px 8px", fontSize: "0.75rem", cursor: idx === images360.length - 1 ? "not-allowed" : "pointer" }}
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemove360Frame(idx)}
                              style={{ padding: "4px 8px", fontSize: "0.75rem", color: "#E53E3E", border: "none", background: "none", cursor: "pointer", fontWeight: 700 }}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: SPECS & CARE GUIDE */}
            {activeTab === "specs" && (
              <div style={{ display: "grid", gap: "20px" }}>
                {/* Category specific metadata */}
                {category === "plants" && (
                  <div>
                    <h4 style={{ margin: "0 0 12px", color: "var(--color-brand-forest, #173F2B)", fontSize: "1rem" }}>
                      🌿 Botanical Specifications (Live Plants)
                    </h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "4px" }}>
                          Placement
                        </label>
                        <select
                          value={metaPlacement}
                          onChange={(e) => setMetaPlacement(e.target.value)}
                          style={{ width: "100%", padding: "8px", border: "1px solid #CBD5E0", borderRadius: "6px", fontSize: "0.875rem" }}
                        >
                          <option value="Indoor">Indoor</option>
                          <option value="Outdoor">Outdoor</option>
                          <option value="Indoor / Outdoor">Indoor / Outdoor</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "4px" }}>
                          Watering Requirement
                        </label>
                        <input
                          type="text"
                          value={metaWater}
                          onChange={(e) => setMetaWater(e.target.value)}
                          placeholder="e.g. Low Water (once a week)"
                          style={{ width: "100%", padding: "8px", border: "1px solid #CBD5E0", borderRadius: "6px", fontSize: "0.875rem" }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "4px" }}>
                          Sunlight Requirement
                        </label>
                        <input
                          type="text"
                          value={metaLight}
                          onChange={(e) => setMetaLight(e.target.value)}
                          placeholder="e.g. Indirect Sun / Medium"
                          style={{ width: "100%", padding: "8px", border: "1px solid #CBD5E0", borderRadius: "6px", fontSize: "0.875rem" }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "4px" }}>
                          Care Difficulty
                        </label>
                        <input
                          type="text"
                          value={metaDifficulty}
                          onChange={(e) => setMetaDifficulty(e.target.value)}
                          placeholder="e.g. Easy for Beginners"
                          style={{ width: "100%", padding: "8px", border: "1px solid #CBD5E0", borderRadius: "6px", fontSize: "0.875rem" }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "4px" }}>
                          Plant Size
                        </label>
                        <input
                          type="text"
                          value={metaSize}
                          onChange={(e) => setMetaSize(e.target.value)}
                          placeholder="e.g. Medium (8-12 inches)"
                          style={{ width: "100%", padding: "8px", border: "1px solid #CBD5E0", borderRadius: "6px", fontSize: "0.875rem" }}
                        />
                      </div>

                      <div style={{ display: "flex", gap: "16px", alignItems: "center", paddingTop: "20px" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8125rem", cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={metaAirPurifying}
                            onChange={(e) => setMetaAirPurifying(e.target.checked)}
                          />
                          Air Purifying
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8125rem", cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={metaPetFriendly}
                            onChange={(e) => setMetaPetFriendly(e.target.checked)}
                          />
                          Pet Friendly
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {category === "pots" && (
                  <div>
                    <h4 style={{ margin: "0 0 12px", color: "var(--color-brand-forest, #173F2B)", fontSize: "1rem" }}>
                      🏺 Planter & Pot Specifications
                    </h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "4px" }}>Material</label>
                        <input
                          type="text"
                          value={potMaterial}
                          onChange={(e) => setPotMaterial(e.target.value)}
                          placeholder="e.g. High-Fired Ceramic"
                          style={{ width: "100%", padding: "8px", border: "1px solid #CBD5E0", borderRadius: "6px", fontSize: "0.875rem" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "4px" }}>Dimensions / Size</label>
                        <input
                          type="text"
                          value={potSize}
                          onChange={(e) => setPotSize(e.target.value)}
                          placeholder="e.g. 8 inch diameter x 7.5 inch height"
                          style={{ width: "100%", padding: "8px", border: "1px solid #CBD5E0", borderRadius: "6px", fontSize: "0.875rem" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "4px" }}>Drainage System</label>
                        <input
                          type="text"
                          value={potDrainage}
                          onChange={(e) => setPotDrainage(e.target.value)}
                          placeholder="e.g. Includes drainage hole + silicone plug"
                          style={{ width: "100%", padding: "8px", border: "1px solid #CBD5E0", borderRadius: "6px", fontSize: "0.875rem" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "4px" }}>Available Color Finishes</label>
                        <input
                          type="text"
                          value={potColors}
                          onChange={(e) => setPotColors(e.target.value)}
                          placeholder="e.g. Terracotta, Matte Charcoal, Ivory"
                          style={{ width: "100%", padding: "8px", border: "1px solid #CBD5E0", borderRadius: "6px", fontSize: "0.875rem" }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {category === "seeds" && (
                  <div>
                    <h4 style={{ margin: "0 0 12px", color: "var(--color-brand-forest, #173F2B)", fontSize: "1rem" }}>
                      🌱 Heirloom Seed Specifications
                    </h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "4px" }}>Seed Category Type</label>
                        <input
                          type="text"
                          value={seedType}
                          onChange={(e) => setSeedType(e.target.value)}
                          placeholder="e.g. Culinary Herb Seeds"
                          style={{ width: "100%", padding: "8px", border: "1px solid #CBD5E0", borderRadius: "6px", fontSize: "0.875rem" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "4px" }}>Germination Period</label>
                        <input
                          type="text"
                          value={seedGermination}
                          onChange={(e) => setSeedGermination(e.target.value)}
                          placeholder="e.g. 5-8 Days"
                          style={{ width: "100%", padding: "8px", border: "1px solid #CBD5E0", borderRadius: "6px", fontSize: "0.875rem" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "4px" }}>Harvest / Bloom Time</label>
                        <input
                          type="text"
                          value={seedHarvestTime}
                          onChange={(e) => setSeedHarvestTime(e.target.value)}
                          placeholder="e.g. 4-5 Weeks"
                          style={{ width: "100%", padding: "8px", border: "1px solid #CBD5E0", borderRadius: "6px", fontSize: "0.875rem" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "4px" }}>Sowing Season</label>
                        <input
                          type="text"
                          value={seedSeason}
                          onChange={(e) => setSeedSeason(e.target.value)}
                          placeholder="e.g. Year-round / Spring"
                          style={{ width: "100%", padding: "8px", border: "1px solid #CBD5E0", borderRadius: "6px", fontSize: "0.875rem" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "4px" }}>Pack Seed Count</label>
                        <input
                          type="text"
                          value={seedCount}
                          onChange={(e) => setSeedCount(e.target.value)}
                          placeholder="e.g. 50+ Seeds"
                          style={{ width: "100%", padding: "8px", border: "1px solid #CBD5E0", borderRadius: "6px", fontSize: "0.875rem" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "4px" }}>Sowing Difficulty</label>
                        <input
                          type="text"
                          value={seedDifficulty}
                          onChange={(e) => setSeedDifficulty(e.target.value)}
                          placeholder="e.g. Easy for Beginners"
                          style={{ width: "100%", padding: "8px", border: "1px solid #CBD5E0", borderRadius: "6px", fontSize: "0.875rem" }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Botanical Care Guide */}
                <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "16px" }}>
                  <h4 style={{ margin: "0 0 12px", color: "var(--color-brand-forest, #173F2B)", fontSize: "1rem" }}>
                    📖 Botanical Care Guide & Nursery Instructions
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "4px" }}>💧 Watering Guide</label>
                      <input
                        type="text"
                        value={careWatering}
                        onChange={(e) => setCareWatering(e.target.value)}
                        placeholder="e.g. Water thoroughly only when top 2 inches of soil feel dry."
                        style={{ width: "100%", padding: "8px", border: "1px solid #CBD5E0", borderRadius: "6px", fontSize: "0.875rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "4px" }}>☀️ Sunlight Guide</label>
                      <input
                        type="text"
                        value={careSunlight}
                        onChange={(e) => setCareSunlight(e.target.value)}
                        placeholder="e.g. Prefers bright indirect light; avoid harsh midday sun."
                        style={{ width: "100%", padding: "8px", border: "1px solid #CBD5E0", borderRadius: "6px", fontSize: "0.875rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "4px" }}>🌱 Repotting / Soil Advice</label>
                      <input
                        type="text"
                        value={careRepotting}
                        onChange={(e) => setCareRepotting(e.target.value)}
                        placeholder="e.g. Repot every 18-24 months into well-draining potting mix."
                        style={{ width: "100%", padding: "8px", border: "1px solid #CBD5E0", borderRadius: "6px", fontSize: "0.875rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "4px" }}>✨ Nursery Master Pro Tip</label>
                      <input
                        type="text"
                        value={careProTip}
                        onChange={(e) => setCareProTip(e.target.value)}
                        placeholder="e.g. Wipe leaves gently with damp cotton cloth once a month."
                        style={{ width: "100%", padding: "8px", border: "1px solid #CBD5E0", borderRadius: "6px", fontSize: "0.875rem" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div
            style={{
              padding: "16px 28px",
              borderTop: "1px solid var(--color-border-light, #E2E8F0)",
              backgroundColor: "#FAF8F5",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ padding: "9px 20px", fontSize: "0.875rem" }}
            >
              Cancel
            </button>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{ padding: "9px 24px", fontSize: "0.875rem" }}
              >
                {isSubmitting ? "Saving to PostgreSQL..." : productToEdit ? "Update Product" : "Create Product"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
