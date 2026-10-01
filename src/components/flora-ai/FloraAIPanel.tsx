"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Send, Sparkles, ShoppingBag } from "lucide-react";
import { useFloraStore } from "@/store/useFloraStore";
import { ProductService } from "@/services/product.service";
import { Product } from "@/types/product";

interface Message {
  id: string;
  sender: "flora" | "user";
  text: string;
  products?: Product[];
}

export function FloraAIPanel() {
  const { isAIOpen, closeAI, openAI, addToCart } = useFloraStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      sender: "flora",
      text: "Hello, plant lover! 🌿 I am Flora AI, your botanical shopping guide. Looking for low-light indoor plants, pet-friendly greens, or easy herbs for your kitchen?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  if (!mounted) return null;

  const suggestionChips = [
    { label: "Low Light Plants 🌙", query: "low light plants" },
    { label: "Under ₹500 💰", query: "under 500" },
    { label: "Help me choose 🌿", query: "beginner plants" },
    { label: "Ceramic Pots 🏺", query: "ceramic pots" },
    { label: "Kitchen Herbs 🥗", query: "herbs" },
  ];

  async function handleSend(queryText?: string) {
    const q = (queryText || input).trim();
    if (!q) return;

    const userMsg: Message = {
      id: Math.random().toString(36),
      sender: "user",
      text: q,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput("");
    setIsThinking(true);

    // Natural botanical matchmaking
    setTimeout(async () => {
      const lower = q.toLowerCase();
      let replyText = "";
      let matchedProducts: Product[] = [];

      if (lower.includes("low light") || lower.includes("dark") || lower.includes("shade")) {
        replyText = "For rooms with minimal or indirect light, these resilient botanical champions thrive effortlessly:";
        matchedProducts = (await ProductService.getByCategory("plants", "indoor")).filter(
          (p) => p.slug === "snake-plant" || p.slug === "zz-plant" || p.slug === "peace-lily"
        );
      } else if (lower.includes("500") || lower.includes("budget") || lower.includes("cheap")) {
        replyText = "Here are our most popular high-value plants and seeds under ₹500:";
        const all = await ProductService.getAll();
        matchedProducts = all.filter((p) => p.price <= 499).slice(0, 3);
      } else if (lower.includes("herb") || lower.includes("kitchen") || lower.includes("seeds")) {
        replyText = "Growing your own fresh kitchen herbs is deeply rewarding! Try these easy organic seeds:";
        matchedProducts = (await ProductService.getByCategory("seeds", "herb")).slice(0, 3);
      } else if (lower.includes("pot") || lower.includes("ceramic")) {
        replyText = "Here are handcrafted artisan pots crafted from breathable clay and glazed ceramic:";
        matchedProducts = (await ProductService.getByCategory("pots", "ceramic")).slice(0, 3);
      } else {
        replyText = "Here are our most beloved, beginner-friendly houseplants with NASA air-purifying power:";
        const all = await ProductService.getAll();
        matchedProducts = all.filter((p) => p.badge === "Bestseller" || p.badge === "Popular").slice(0, 3);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36),
          sender: "flora",
          text: replyText,
          products: matchedProducts,
        },
      ]);
      setIsThinking(false);
    }, 600);
  }

  return (
    <>
      {/* Floating Botanical Launcher Button */}
      <div
        onClick={openAI}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: "var(--z-ai)",
          cursor: "pointer",
        }}
        title="Ask Flora AI — Your Plant Guide"
      >
        <div style={{ position: "relative" }}>
          {/* Animated pulse ring */}
          <div
            className="animate-pulse-ring"
            style={{
              position: "absolute",
              inset: "-6px",
              borderRadius: "999px",
              backgroundColor: "rgba(36, 88, 59, 0.35)",
            }}
          />
          <div
            style={{
              width: "var(--ai-button-size)",
              height: "var(--ai-button-size)",
              borderRadius: "999px",
              backgroundColor: "var(--color-brand-forest)",
              color: "var(--color-white)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "var(--shadow-floating)",
              fontSize: "1.6rem",
              transition: "transform 0.3s var(--ease-standard)",
            }}
          >
            🌿
          </div>
        </div>
      </div>

      {/* Slide-out AI Panel Backdrop */}
      {isAIOpen && (
        <div
          onClick={closeAI}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(18, 50, 34, 0.4)",
            backdropFilter: "blur(4px)",
            zIndex: "var(--z-drawer)",
            animation: "fadeIn 0.2s ease-out",
          }}
        />
      )}

      {/* Slide-out AI Panel */}
      {isAIOpen && (
        <aside
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            maxWidth: "var(--ai-panel-width)",
            backgroundColor: "var(--color-surface)",
            zIndex: "var(--z-drawer)",
            display: "flex",
            flexDirection: "column",
            boxShadow: "var(--shadow-lg)",
            animation: "slideInRight 0.3s var(--ease-standard)",
          }}
          aria-label="Flora AI Botanical Assistant"
        >
          {/* Panel Header */}
          <div
            style={{
              padding: "var(--space-4) var(--space-6)",
              backgroundColor: "var(--color-brand-forest)",
              color: "var(--color-white)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "999px",
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.25rem",
                }}
              >
                🌿
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "var(--text-body)", color: "var(--color-white)" }}>
                  Flora AI
                </h4>
                <p style={{ margin: 0, fontSize: "var(--text-caption)", color: "var(--color-brand-sage-light)" }}>
                  Your Plant Guide
                </p>
              </div>
            </div>
            <button
              onClick={closeAI}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "999px",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                color: "var(--color-white)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Close Flora AI"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Suggestion Chips */}
          <div
            style={{
              padding: "var(--space-3) var(--space-4)",
              backgroundColor: "var(--color-surface-soft)",
              borderBottom: "1px solid var(--color-border-light)",
              display: "flex",
              gap: "var(--space-2)",
              overflowX: "auto",
            }}
          >
            {suggestionChips.map((chip) => (
              <button
                key={chip.label}
                onClick={() => handleSend(chip.query)}
                className="filter-chip"
                style={{
                  fontSize: "var(--text-caption)",
                  height: "30px",
                  padding: "0 var(--space-3)",
                  flexShrink: 0,
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isUser ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "85%",
                      padding: "var(--space-3) var(--space-4)",
                      borderRadius: isUser ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                      backgroundColor: isUser ? "var(--color-brand-forest)" : "var(--ai-surface)",
                      color: isUser ? "var(--color-white)" : "var(--color-text-primary)",
                      fontSize: "var(--text-body-sm)",
                      lineHeight: "1.5",
                      border: isUser ? "none" : "1px solid var(--ai-border)",
                    }}
                  >
                    {msg.text}
                  </div>

                  {/* Embedded Interactive Product Cards */}
                  {msg.products && msg.products.length > 0 && (
                    <div style={{ marginTop: "var(--space-3)", width: "100%", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                      {msg.products.map((prod) => (
                        <div
                          key={prod.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--space-3)",
                            backgroundColor: "var(--color-white)",
                            border: "1px solid var(--color-border-light)",
                            borderRadius: "var(--radius-sm)",
                            padding: "var(--space-2)",
                            boxShadow: "var(--shadow-xs)",
                          }}
                        >
                          <div style={{ width: "48px", height: "48px", position: "relative", borderRadius: "var(--radius-xs)", overflow: "hidden", flexShrink: 0 }}>
                            <Image src={prod.image} alt={prod.name} fill style={{ objectFit: "cover" }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <Link
                              href={`/product/${prod.slug}`}
                              onClick={closeAI}
                              style={{ fontSize: "var(--text-body-sm)", fontWeight: 600, display: "block" }}
                            >
                              {prod.name}
                            </Link>
                            <span style={{ fontSize: "var(--text-caption)", color: "var(--color-brand-green)", fontWeight: 600 }}>
                              ₹{prod.price}
                            </span>
                          </div>
                          <button
                            onClick={() => addToCart(prod, 1)}
                            className="btn-primary"
                            style={{ height: "32px", padding: "0 12px", fontSize: "var(--text-caption)" }}
                          >
                            <ShoppingBag size={12} /> Add
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isThinking && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  borderRadius: "16px",
                  backgroundColor: "var(--ai-surface)",
                  fontSize: "var(--text-caption)",
                  color: "var(--color-brand-forest)",
                }}
              >
                <Sparkles size={14} /> Flora AI is thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: "var(--space-3) var(--space-4)",
              borderTop: "1px solid var(--color-border-light)",
              backgroundColor: "var(--color-white)",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
            }}
          >
            <input
              type="text"
              placeholder="Ask Flora anything about plants..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-pill)",
                padding: "8px 16px",
                fontSize: "var(--text-body-sm)",
                outline: "none",
              }}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ width: "40px", height: "40px", borderRadius: "999px", padding: 0 }}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </aside>
      )}
    </>
  );
}
