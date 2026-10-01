"use client";

import React from "react";
import Link from "next/link";
import { PlantCareArticle } from "@/types/cms";
import { useFloraStore } from "@/store/useFloraStore";

interface PlantCareDetailViewProps {
  article: PlantCareArticle;
  relatedArticles: PlantCareArticle[];
}

export function PlantCareDetailView({ article, relatedArticles }: PlantCareDetailViewProps) {
  const { openFloraAI } = useFloraStore();

  return (
    <div className="plant-care-detail-page" style={{ padding: "var(--space-8) 0 var(--space-16)" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          style={{
            fontSize: "var(--text-caption)",
            color: "var(--color-text-muted)",
            marginBottom: "var(--space-6)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Link href="/" style={{ color: "var(--color-brand-forest)", textDecoration: "none" }}>
            Home
          </Link>
          <span>/</span>
          <Link href="/plant-care" style={{ color: "var(--color-brand-forest)", textDecoration: "none" }}>
            Plant Care
          </Link>
          <span>/</span>
          <span style={{ color: "var(--color-text-secondary)", fontWeight: 500 }}>
            {article.title}
          </span>
        </nav>

        {/* Article Header */}
        <div style={{ marginBottom: "var(--space-8)" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
            <span
              style={{
                backgroundColor: "var(--color-brand-sage-light)",
                color: "var(--color-brand-forest)",
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                padding: "3px 10px",
                borderRadius: "var(--radius-pill)",
              }}
            >
              {article.category}
            </span>
            <span style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
              {article.readTime} • Published {article.date}
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              color: "var(--color-brand-forest)",
              lineHeight: 1.2,
              marginBottom: "16px",
            }}
          >
            {article.title}
          </h1>

          <p style={{ fontSize: "1.125rem", color: "var(--color-text-secondary)", fontStyle: "italic", lineHeight: 1.6 }}>
            {article.excerpt}
          </p>
        </div>

        {/* Featured Image */}
        <div
          style={{
            width: "100%",
            height: "360px",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            marginBottom: "var(--space-8)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <img
            src={article.image}
            alt={article.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Article Body */}
        <div
          style={{
            background: "var(--color-white)",
            padding: "var(--space-8)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border-light)",
            lineHeight: 1.8,
            fontSize: "1rem",
            color: "var(--color-text-primary)",
            marginBottom: "var(--space-12)",
          }}
        >
          {article.contentMarkdown.split("\n\n").map((block, idx) => {
            if (block.startsWith("### ")) {
              return (
                <h3
                  key={idx}
                  style={{
                    fontSize: "1.3rem",
                    color: "var(--color-brand-forest)",
                    marginTop: idx === 0 ? "0" : "24px",
                    marginBottom: "8px",
                  }}
                >
                  {block.replace("### ", "")}
                </h3>
              );
            }
            if (block.startsWith("1. ") || block.startsWith("- ")) {
              const lines = block.split("\n");
              return (
                <ul key={idx} style={{ paddingLeft: "24px", margin: "12px 0" }}>
                  {lines.map((l, lIdx) => (
                    <li key={lIdx} style={{ marginBottom: "6px" }}>
                      {l.replace(/^[-1234567890.]\s*/, "")}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={idx} style={{ margin: "0 0 16px" }}>
                {block}
              </p>
            );
          })}
        </div>

        {/* Flora AI Floating Assistance Prompt */}
        <div
          style={{
            background: "var(--color-surface-soft)",
            border: "1px solid var(--color-brand-sage)",
            padding: "24px",
            borderRadius: "var(--radius-md)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "var(--space-12)",
          }}
        >
          <div>
            <strong style={{ display: "block", color: "var(--color-brand-forest)", marginBottom: "4px" }}>
              Got questions about this guide?
            </strong>
            <span style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
              Ask Flora AI to tailor these recommendations to your home light conditions.
            </span>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={openFloraAI}
            style={{ padding: "10px 20px", fontSize: "0.875rem" }}
          >
            Ask Flora AI 🍃
          </button>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div>
            <h3 style={{ fontSize: "1.25rem", color: "var(--color-brand-forest)", marginBottom: "16px" }}>
              Related Botanical Guides
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/plant-care/${rel.slug}`}
                  style={{
                    background: "var(--color-white)",
                    padding: "16px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-border-light)",
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                  }}
                >
                  <span style={{ fontSize: "0.6875rem", color: "var(--color-brand-green)", fontWeight: 600, textTransform: "uppercase" }}>
                    {rel.category}
                  </span>
                  <div style={{ fontWeight: 600, color: "var(--color-brand-forest)", marginTop: "4px", fontSize: "0.9375rem" }}>
                    {rel.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
