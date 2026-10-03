"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface Product360ViewerProps {
  productName: string;
  images: string[];
  isOpen: boolean;
  onClose: () => void;
}

export function Product360Viewer({
  productName,
  images,
  isOpen,
  onClose,
}: Product360ViewerProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [frameAtDragStart, setFrameAtDragStart] = useState(0);
  const [scale, setScale] = useState(1);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  const totalFrames = images.length;

  // Preload all angle frames in background
  useEffect(() => {
    if (!isOpen || totalFrames === 0) return;

    let loadedCount = 0;
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount >= totalFrames) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount >= totalFrames) {
          setImagesLoaded(true);
        }
      };
    });
  }, [isOpen, images, totalFrames]);

  // Handle ESC key to close viewer
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        setCurrentFrame((prev) => (prev - 1 + totalFrames) % totalFrames);
        setHasInteracted(true);
      } else if (e.key === "ArrowRight") {
        setCurrentFrame((prev) => (prev + 1) % totalFrames);
        setHasInteracted(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, totalFrames]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (totalFrames <= 1) return;
    setIsDragging(true);
    setDragStartX(e.clientX);
    setFrameAtDragStart(currentFrame);
    setHasInteracted(true);
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || totalFrames <= 1) return;
      const deltaX = e.clientX - dragStartX;
      const sensitivity = 16; // pixels per frame transition
      const frameDelta = Math.floor(deltaX / sensitivity);
      const newFrame = (frameAtDragStart - frameDelta + totalFrames * 100) % totalFrames;
      setCurrentFrame(newFrame);
    },
    [isDragging, dragStartX, frameAtDragStart, totalFrames]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (totalFrames <= 1 || e.touches.length !== 1) return;
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
    setFrameAtDragStart(currentFrame);
    setHasInteracted(true);
  };

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || totalFrames <= 1 || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - dragStartX;
      const sensitivity = 14;
      const frameDelta = Math.floor(deltaX / sensitivity);
      const newFrame = (frameAtDragStart - frameDelta + totalFrames * 100) % totalFrames;
      setCurrentFrame(newFrame);
    },
    [isDragging, dragStartX, frameAtDragStart, totalFrames]
  );

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Scroll wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setScale((prev) => Math.min(2.5, +(prev + 0.2).toFixed(1)));
    } else {
      setScale((prev) => Math.max(1, +(prev - 0.2).toFixed(1)));
    }
  };

  const handleResetZoom = () => {
    setScale(1);
  };

  if (!isOpen) return null;

  return (
    <div
      className="product-360-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`360 view for ${productName}`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1200,
        backgroundColor: "rgba(18, 50, 34, 0.78)",
        backdropFilter: "blur(8px)",
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
        className="product-360-modal"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "680px",
          backgroundColor: "var(--color-cream-soft)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-floating)",
          overflow: "hidden",
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
            background: "#fff",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: "var(--color-brand-sage-light)",
                  color: "var(--color-brand-forest)",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                360°
              </span>
              <h3
                style={{
                  margin: 0,
                  fontSize: "var(--text-h3)",
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-brand-forest)",
                  fontWeight: 600,
                }}
              >
                {productName}
              </h3>
            </div>
            <p
              style={{
                margin: "2px 0 0",
                fontSize: "var(--text-caption)",
                color: "var(--color-text-muted)",
              }}
            >
              Interactive Product Angle View
            </p>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            title="Close 360 viewer"
            style={{
              position: "static",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "1px solid var(--color-border-light)",
              background: "var(--color-cream)",
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

        {/* Viewer Canvas Area */}
        <div
          ref={viewerRef}
          className="product-360-canvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1 / 1",
            maxHeight: "520px",
            backgroundColor: "var(--color-cream-soft)",
            cursor: isDragging ? "grabbing" : "grab",
            userSelect: "none",
            touchAction: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {images[currentFrame] ? (
            <img
              src={images[currentFrame]}
              alt={`${productName} angle ${currentFrame + 1}`}
              draggable={false}
              style={{
                width: "82%",
                height: "82%",
                objectFit: "contain",
                transform: `scale(${scale})`,
                transition: isDragging ? "none" : "transform 0.15s ease-out",
                pointerEvents: "none",
              }}
            />
          ) : (
            <div style={{ color: "var(--color-text-muted)", fontSize: "var(--text-body-sm)" }}>
              Loading interactive view...
            </div>
          )}

          {/* Drag to Rotate Hint Badge */}
          {!hasInteracted && (
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "rgba(23, 63, 43, 0.88)",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "var(--radius-pill)",
                fontSize: "var(--text-caption)",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "var(--shadow-md)",
                pointerEvents: "none",
                animation: "pulseGlow 2.5s infinite",
              }}
            >
              <span>🔄</span> Drag or swipe left/right to rotate
            </div>
          )}

          {/* Current Frame Indicator */}
          <div
            style={{
              position: "absolute",
              top: "14px",
              left: "14px",
              background: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(4px)",
              padding: "4px 10px",
              borderRadius: "var(--radius-pill)",
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--color-brand-forest)",
              border: "1px solid var(--color-border-light)",
            }}
          >
            Angle {currentFrame + 1} / {totalFrames}
          </div>
        </div>

        {/* Modal Controls Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "var(--space-3) var(--space-6)",
            borderTop: "1px solid var(--color-border-light)",
            background: "#fff",
            fontSize: "var(--text-caption)",
          }}
        >
          {/* Zoom controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "var(--color-text-muted)" }}>Zoom:</span>
            <button
              type="button"
              onClick={() => setScale((prev) => Math.max(1, +(prev - 0.2).toFixed(1)))}
              disabled={scale <= 1}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border-light)",
                background: "var(--color-cream)",
                cursor: scale <= 1 ? "not-allowed" : "pointer",
                opacity: scale <= 1 ? 0.5 : 1,
              }}
            >
              −
            </button>
            <span style={{ minWidth: "36px", textAlign: "center", fontWeight: 600 }}>
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setScale((prev) => Math.min(2.5, +(prev + 0.2).toFixed(1)))}
              disabled={scale >= 2.5}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border-light)",
                background: "var(--color-cream)",
                cursor: scale >= 2.5 ? "not-allowed" : "pointer",
                opacity: scale >= 2.5 ? 0.5 : 1,
              }}
            >
              +
            </button>
            {scale > 1 && (
              <button
                type="button"
                onClick={handleResetZoom}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--color-brand-forest)",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: "11px",
                  marginLeft: "4px",
                }}
              >
                Reset
              </button>
            )}
          </div>

          {/* Quick tips */}
          <div style={{ color: "var(--color-text-muted)", display: "flex", gap: "12px" }}>
            <span>← → Arrow keys</span>
            <span>Scroll wheel to zoom</span>
          </div>
        </div>
      </div>
    </div>
  );
}
