"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
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


  const quickQuestionChips = [
    { label: "Low Light Plants 🌙", query: "Find a plant for low light" },
    { label: "Plants under ₹500 💰", query: "Plants under 500" },
    { label: "Help me choose 🌿", query: "Help me choose a plant for my apartment" },
    { label: "Beginner Friendly 🌱", query: "Easy plants for beginners" },
    { label: "Ceramic Pots 🏺", query: "Which pot fits a Snake Plant" },
    { label: "Kitchen Herbs 🥗", query: "Easy herb seeds" },
    { label: "Snake Plant Care 💧", query: "How to water Snake Plant" },
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <>
      {/* Floating Botanical Launcher Button */}
      <div
        id="flora-ai-launcher"
        className="flora-ai-launcher"
        title="Ask Flora AI"
        onClick={openAI}
      >
        <div className="ai-launcher-pulse" />
        <span className="ai-leaf-icon" style={{ fontSize: "1.6rem" }}>
          🌿
        </span>
      </div>

      {/* Backdrop */}
      <div
        id="flora-ai-backdrop"
        className={`drawer-backdrop ${isAIOpen ? "open" : ""}`}
        onClick={closeAI}
      />

      {/* AI Panel */}
      <aside
        id="flora-ai-panel"
        className={`flora-ai-panel ${isAIOpen ? "open" : ""}`}
        aria-label="Flora AI Customer Assistant"
      >
        {/* AI Header */}
        <div className="flora-ai-header">
          <div className="flora-ai-title-wrap">
            <div className="flora-ai-avatar">🌿</div>
            <div>
              <h4 className="flora-ai-panel-title">Flora AI</h4>
              <p className="flora-ai-panel-sub">Your Plant Guide</p>
            </div>
          </div>
          <button
            type="button"
            id="flora-ai-close"
            className="modal-close-btn"
            style={{ position: "static", background: "rgba(255,255,255,0.2)", color: "#fff" }}
            title="Close AI"
            onClick={closeAI}
          >
            ✕
          </button>
        </div>

        {/* Quick Question Chips */}
        <div className="flora-ai-chips-strip">
          {quickQuestionChips.map((chip) => (
            <button
              key={chip.query}
              type="button"
              className="flora-ai-chip"
              onClick={() => handleSend(chip.query)}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Message Stream */}
        <div id="flora-ai-messages" className="flora-ai-body">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flora-ai-message ${m.sender === "user" ? "flora-ai-user" : "flora-ai-bot"}`}
            >
              <div className={`message-bubble ${m.sender === "user" ? "user-bubble" : "bot-bubble"}`}>
                <p style={{ margin: 0 }}>{m.text}</p>
                {m.products && m.products.length > 0 && (
                  <div className="flora-ai-recommendations">
                    {m.products.map((prod) => (
                      <div key={prod.id} className="ai-product-card">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="ai-prod-img"
                          onError={(e) => {
                            if (prod.refImage) {
                              (e.currentTarget as HTMLImageElement).src = prod.refImage;
                            }
                          }}
                        />
                        <div className="ai-prod-info">
                          <span className="ai-prod-category">{prod.category.toUpperCase()}</span>
                          <h5 className="ai-prod-name">{prod.name}</h5>
                          <div className="ai-prod-meta">
                            <span className="ai-prod-price">₹{prod.price}</span>
                            <span className="ai-prod-rating">★ {prod.rating}</span>
                          </div>
                          <div className="ai-prod-actions">
                            <Link
                              href={`/product/${prod.slug}`}
                              className="ai-btn-view"
                              onClick={closeAI}
                            >
                              View Details
                            </Link>
                            <button
                              type="button"
                              className="ai-btn-add"
                              onClick={() => addToCart(prod, 1)}
                            >
                              Add 🛒
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flora-ai-message flora-ai-bot">
              <div className="message-bubble bot-bubble" style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                <span>Flora AI is thinking</span>
                <span className="animate-pulse">...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form id="flora-ai-form" className="flora-ai-input-bar" onSubmit={handleSubmit}>
          <input
            type="text"
            id="flora-ai-input"
            className="flora-ai-input"
            placeholder="Ask Flora anything about plants, pots, or seeds..."
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="flora-ai-send-btn" title="Send">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </aside>
    </>
  );
}
