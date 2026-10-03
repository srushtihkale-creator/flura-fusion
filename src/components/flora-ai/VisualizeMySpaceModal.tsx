"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useFloraStore } from "@/store/useFloraStore";
import {
  SpaceVisualizationService,
  SpaceVisualizationResult,
} from "@/services/spaceVisualization.service";

interface VisualizeMySpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VisualizeMySpaceModal({ isOpen, onClose }: VisualizeMySpaceModalProps) {
  const { addToCart } = useFloraStore();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [result, setResult] = useState<SpaceVisualizationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const suggestedPrompts = SpaceVisualizationService.getSuggestedPrompts();

  // Handle ESC key to dismiss
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Handle image file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please upload a valid image file (JPG, PNG, or WebP).");
      return;
    }

    setErrorMessage(null);
    const objectUrl = URL.createObjectURL(file);
    setImagePreviewUrl(objectUrl);
    setResult(null);
  };

  // Drag and drop support
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please upload a valid image file (JPG, PNG, or WebP).");
      return;
    }

    setErrorMessage(null);
    const objectUrl = URL.createObjectURL(file);
    setImagePreviewUrl(objectUrl);
    setResult(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Trigger simulated visualization
  const handleVisualize = async () => {
    if (!imagePreviewUrl) {
      setErrorMessage("Please upload a photo of your space first.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setProcessingStep(1);

    const stepTimer = setTimeout(() => {
      setProcessingStep(2);
    }, 500);

    try {
      const res = await SpaceVisualizationService.generateVisualization({
        imageUrl: imagePreviewUrl,
        prompt: prompt.trim() || "Show suitable plants and matching pots for this space",
      });
      setResult(res);
    } catch {
      setErrorMessage("Something went wrong while generating recommendations. Please try again.");
    } finally {
      clearTimeout(stepTimer);
      setIsProcessing(false);
      setProcessingStep(0);
    }
  };

  // Reset to upload another space
  const handleReset = () => {
    setImagePreviewUrl(null);
    setResult(null);
    setPrompt("");
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!isOpen) return null;

  return (
    <div
      className="visualize-space-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Flora AI Visualize My Space"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1300,
        backgroundColor: "rgba(18, 50, 34, 0.8)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-4)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="visualize-space-modal"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "760px",
          maxHeight: "92vh",
          backgroundColor: "#fff",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-floating)",
          overflowY: "auto",
          border: "1px solid var(--color-border-light)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "var(--space-4) var(--space-6)",
            borderBottom: "1px solid var(--color-border-light)",
            backgroundColor: "var(--color-cream-soft)",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "var(--color-brand-forest)",
                color: "#fff",
                fontSize: "16px",
              }}
            >
              🌿
            </span>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.25rem",
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-brand-forest)",
                  fontWeight: 600,
                }}
              >
                Visualize My Space
              </h3>
              <p
                style={{
                  margin: "1px 0 0",
                  fontSize: "var(--text-caption)",
                  color: "var(--color-text-muted)",
                }}
              >
                Flora AI Botanical Room Consultation
              </p>
            </div>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            title="Close modal"
            style={{
              position: "static",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "1px solid var(--color-border-light)",
              background: "#fff",
              color: "var(--color-brand-forest)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: "var(--space-6)" }}>
          {errorMessage && (
            <div
              style={{
                marginBottom: "var(--space-4)",
                padding: "10px 14px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "#FDF2F2",
                border: "1px solid #F8B4B4",
                color: "#9B1C1C",
                fontSize: "var(--text-caption)",
              }}
            >
              {errorMessage}
            </div>
          )}

          {!result ? (
            /* Upload & Prompt Step */
            <div>
              <p
                style={{
                  margin: "0 0 var(--space-4)",
                  fontSize: "var(--text-body-sm)",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.5,
                }}
              >
                Upload a photo of your balcony, desk, living room, or bedroom corner. Flora AI will recommend matching plants and pots from our nursery catalog.
              </p>

              {/* Upload Dropzone */}
              {!imagePreviewUrl ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: "2px dashed var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    padding: "var(--space-8) var(--space-4)",
                    textAlign: "center",
                    backgroundColor: "var(--color-cream-soft)",
                    cursor: "pointer",
                    transition: "all var(--duration-fast)",
                    marginBottom: "var(--space-5)",
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📸</div>
                  <h4
                    style={{
                      margin: "0 0 4px",
                      color: "var(--color-brand-forest)",
                      fontSize: "var(--text-body)",
                      fontWeight: 600,
                    }}
                  >
                    Click to upload or drag & drop your space photo
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "var(--text-caption)",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    PNG, JPG, or WebP from your room, balcony, terrace, or desk
                  </p>
                </div>
              ) : (
                /* Uploaded Image Preview */
                <div
                  style={{
                    position: "relative",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    border: "1px solid var(--color-border-light)",
                    marginBottom: "var(--space-5)",
                    maxHeight: "260px",
                    backgroundColor: "var(--color-cream-soft)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={imagePreviewUrl}
                    alt="Your uploaded space"
                    style={{
                      width: "100%",
                      height: "260px",
                      objectFit: "contain",
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleReset}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      padding: "6px 12px",
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "var(--radius-pill)",
                      fontSize: "11px",
                      cursor: "pointer",
                    }}
                  >
                    Change Photo
                  </button>
                </div>
              )}

              {/* Space Preferences & Prompt */}
              <div style={{ marginBottom: "var(--space-5)" }}>
                <label
                  htmlFor="space-prompt-input"
                  style={{
                    display: "block",
                    fontSize: "var(--text-caption)",
                    fontWeight: 600,
                    color: "var(--color-brand-forest)",
                    marginBottom: "6px",
                  }}
                >
                  What do you envision for this space?
                </label>
                <input
                  id="space-prompt-input"
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Show me plants for this balcony with matching pots..."
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--color-border)",
                    fontSize: "var(--text-body-sm)",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />

                {/* Quick Suggestion Chips */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                    marginTop: "8px",
                  }}
                >
                  {suggestedPrompts.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPrompt(p)}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "var(--radius-pill)",
                        border: "1px solid var(--color-border-light)",
                        backgroundColor: prompt === p ? "var(--color-brand-forest)" : "var(--color-cream)",
                        color: prompt === p ? "#fff" : "var(--color-brand-forest)",
                        fontSize: "11px",
                        cursor: "pointer",
                        transition: "all var(--duration-fast)",
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleVisualize}
                disabled={isProcessing || !imagePreviewUrl}
                style={{
                  width: "100%",
                  padding: "12px 20px",
                  borderRadius: "var(--radius-pill)",
                  backgroundColor: !imagePreviewUrl || isProcessing ? "var(--color-border)" : "var(--color-brand-forest)",
                  color: "#fff",
                  fontSize: "var(--text-body-sm)",
                  fontWeight: 600,
                  border: "none",
                  cursor: !imagePreviewUrl || isProcessing ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin" style={{ display: "inline-block" }}>
                      ⏳
                    </span>
                    {processingStep === 1
                      ? "Analyzing space & lighting..."
                      : "Matching nursery plants & pots..."}
                  </>
                ) : (
                  <>
                    <span>✨</span> Visualize Space & Recommend
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Results Step */
            <div>
              {/* Preview Banner */}
              <div
                style={{
                  position: "relative",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  border: "1px solid var(--color-border-light)",
                  marginBottom: "var(--space-5)",
                  maxHeight: "260px",
                  backgroundColor: "var(--color-cream-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={result.userImageUrl}
                  alt="Your analyzed space"
                  style={{
                    width: "100%",
                    height: "260px",
                    objectFit: "contain",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    backgroundColor: "rgba(23, 63, 43, 0.9)",
                    color: "#fff",
                    padding: "4px 12px",
                    borderRadius: "var(--radius-pill)",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                  }}
                >
                  🌿 Botanical Space Consultation
                </div>
              </div>

              {/* AI Guidance Note */}
              <div
                style={{
                  backgroundColor: "var(--color-cream-soft)",
                  border: "1px solid var(--color-border-light)",
                  borderRadius: "var(--radius-md)",
                  padding: "var(--space-4)",
                  marginBottom: "var(--space-6)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "var(--text-caption)",
                    fontWeight: 600,
                    color: "var(--color-brand-forest)",
                    marginBottom: "4px",
                  }}
                >
                  <span>🌱</span> Flora AI Recommendation Summary
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "var(--text-body-sm)",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.5,
                  }}
                >
                  {result.notes}
                </p>
              </div>

              {/* Recommended Catalog Products Section */}
              <h4
                style={{
                  margin: "0 0 var(--space-4)",
                  fontSize: "1.1rem",
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-brand-forest)",
                  fontWeight: 600,
                }}
              >
                Recommended Catalog Items for Your Space
              </h4>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "var(--space-4)",
                  marginBottom: "var(--space-6)",
                }}
              >
                {result.recommendedProducts.map((prod) => (
                  <div
                    key={prod.id}
                    style={{
                      border: "1px solid var(--color-border-light)",
                      borderRadius: "var(--radius-md)",
                      overflow: "hidden",
                      backgroundColor: "#fff",
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: "var(--shadow-xs)",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "1 / 1",
                        backgroundColor: "var(--color-cream-soft)",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          if (prod.refImage) {
                            (e.currentTarget as HTMLImageElement).src = prod.refImage;
                          }
                        }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          top: "8px",
                          left: "8px",
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          color: "var(--color-brand-forest)",
                          fontSize: "10px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          padding: "2px 8px",
                          borderRadius: "var(--radius-pill)",
                        }}
                      >
                        {prod.category}
                      </span>
                    </div>

                    <div style={{ padding: "var(--space-3)", flex: 1, display: "flex", flexDirection: "column" }}>
                      <h5
                        style={{
                          margin: "0 0 4px",
                          fontSize: "var(--text-body-sm)",
                          color: "var(--color-brand-forest)",
                          fontWeight: 600,
                        }}
                      >
                        {prod.name}
                      </h5>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "var(--space-3)",
                          fontSize: "var(--text-caption)",
                        }}
                      >
                        <span style={{ fontWeight: 700, color: "var(--color-brand-deep)" }}>
                          ₹{prod.price}
                        </span>
                        <span style={{ color: "var(--color-text-muted)" }}>★ {prod.rating}</span>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "6px",
                          marginTop: "auto",
                        }}
                      >
                        <Link
                          href={`/product/${prod.slug}`}
                          onClick={onClose}
                          style={{
                            flex: 1,
                            padding: "6px 8px",
                            borderRadius: "var(--radius-sm)",
                            border: "1px solid var(--color-border)",
                            backgroundColor: "var(--color-cream)",
                            color: "var(--color-brand-forest)",
                            fontSize: "11px",
                            fontWeight: 600,
                            textAlign: "center",
                            textDecoration: "none",
                          }}
                        >
                          View Product
                        </Link>
                        <button
                          type="button"
                          onClick={() => addToCart(prod, 1)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "var(--radius-sm)",
                            border: "none",
                            backgroundColor: "var(--color-brand-forest)",
                            color: "#fff",
                            fontSize: "11px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Add 🛒
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Actions */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    borderRadius: "var(--radius-pill)",
                    border: "1px solid var(--color-border)",
                    backgroundColor: "#fff",
                    color: "var(--color-text-secondary)",
                    fontSize: "var(--text-caption)",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  ← Try Another Space
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    borderRadius: "var(--radius-pill)",
                    border: "none",
                    backgroundColor: "var(--color-brand-forest)",
                    color: "#fff",
                    fontSize: "var(--text-caption)",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
