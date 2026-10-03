"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FloraAIService, FloraAIMessage } from "@/services/floraAI.service";
import { useFloraStore } from "@/store/useFloraStore";
import { VisualizeMySpaceModal } from "./VisualizeMySpaceModal";

export function FloraAIPageView() {
  const { addToCart } = useFloraStore();
  const [isVisualizeModalOpen, setIsVisualizeModalOpen] = useState(false);
  const [messages, setMessages] = useState<FloraAIMessage[]>([
    {
      id: "welcome",
      sender: "flora",
      text: "Namaste! I'm Flora, your personal botanical guide. Tell me about your room lighting, space size, or watering habits, and I'll match you with healthy nursery companions!",
      timestamp: "Just now",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chips = FloraAIService.getStarterChips();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || inputText).trim();
    if (!textToSend || isThinking) return;

    const userMsg: FloraAIMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsThinking(true);

    try {
      const response = await FloraAIService.generateResponse(textToSend);
      const floraMsg: FloraAIMessage = {
        id: `flora-${Date.now()}`,
        sender: "flora",
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        recommendations: response.recommendations,
      };
      setMessages((prev) => [...prev, floraMsg]);
    } catch {
      const errorMsg: FloraAIMessage = {
        id: `flora-err-${Date.now()}`,
        sender: "flora",
        text: "Something went wrong while retrieving botanical guidance. Please try again.",
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flora-ai-page-container" style={{ padding: "var(--space-8) 0 var(--space-16)" }}>
      <div className="container" style={{ maxWidth: "880px" }}>
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
          <span style={{ color: "var(--color-text-secondary)", fontWeight: 500 }}>
            Flora AI
          </span>
        </nav>

        {/* Page Header */}
        <div style={{ textAlign: "center", marginBottom: "var(--space-6)" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "var(--color-brand-sage-light)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.75rem",
              marginBottom: "8px",
            }}
          >
            🌿
          </div>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              color: "var(--color-brand-forest)",
              margin: "0 0 6px",
            }}
          >
            Flora AI — Your Plant Guide
          </h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9375rem", margin: 0 }}>
            Ask anything about lighting, watering frequency, room matching, or diagnosing leaves.
          </p>
        </div>

        {/* Suggestion Chips */}
        <div
          className="home-filter-chips"
          style={{
            justifyContent: "center",
            marginBottom: "var(--space-6)",
            gap: "8px",
          }}
        >
          <button
            type="button"
            className="home-filter-chip"
            onClick={() => setIsVisualizeModalOpen(true)}
            style={{
              backgroundColor: "var(--color-brand-sage-light)",
              color: "var(--color-brand-forest)",
              borderColor: "var(--color-brand-forest)",
              fontWeight: 600,
            }}
          >
            📷 Visualize My Space
          </button>
          {chips.map((chip) => (
            <button
              key={chip}
              type="button"
              className="home-filter-chip"
              onClick={() => handleSend(chip)}
              disabled={isThinking}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Chat Window Card */}
        <div
          style={{
            background: "var(--color-white)",
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--color-border-light)",
            boxShadow: "var(--shadow-sm)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            height: "640px",
          }}
        >
          {/* Messages Stream */}
          <div
            style={{
              flex: 1,
              padding: "24px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              backgroundColor: "var(--color-cream-soft)",
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: msg.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    backgroundColor: msg.sender === "user" ? "var(--color-brand-forest)" : "#FFFFFF",
                    color: msg.sender === "user" ? "#FFFFFF" : "var(--color-text-primary)",
                    padding: "16px 20px",
                    borderRadius: "var(--radius-lg)",
                    border: msg.sender === "user" ? "none" : "1px solid var(--color-border-light)",
                    fontSize: "0.9375rem",
                    lineHeight: 1.6,
                    boxShadow: "var(--shadow-xs)",
                  }}
                >
                  {msg.text}

                  {/* Recommendation Cards */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div
                      style={{
                        marginTop: "16px",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "12px",
                      }}
                    >
                      {msg.recommendations.map((rec) => (
                        <div
                          key={rec.id}
                          style={{
                            background: "var(--color-cream-soft)",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--color-border-light)",
                            padding: "12px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <img
                            src={rec.image}
                            alt={rec.name}
                            style={{
                              width: "100%",
                              aspectRatio: "1 / 1",
                              objectFit: "cover",
                              borderRadius: "var(--radius-sm)",
                              marginBottom: "8px",
                            }}
                          />
                          <div>
                            <strong
                              style={{
                                fontSize: "0.875rem",
                                color: "var(--color-brand-forest)",
                                display: "block",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {rec.name}
                            </strong>
                            <div style={{ fontSize: "0.8125rem", color: "var(--color-brand-deep)", fontWeight: 700, margin: "2px 0 8px" }}>
                              ₹{rec.price}
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <Link
                              href={`/product/${rec.slug}`}
                              className="btn-secondary"
                              style={{ flex: 1, padding: "6px 8px", fontSize: "0.75rem", textAlign: "center" }}
                            >
                              View
                            </Link>
                            <button
                              type="button"
                              className="btn-primary"
                              onClick={() => addToCart(rec, 1)}
                              style={{ flex: 1, padding: "6px 8px", fontSize: "0.75rem" }}
                            >
                              Add 🛒
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span
                  style={{
                    fontSize: "0.6875rem",
                    color: "var(--color-text-muted)",
                    marginTop: "4px",
                    padding: "0 4px",
                  }}
                >
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isThinking && (
              <div
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: "#FFFFFF",
                  padding: "12px 18px",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--color-border-light)",
                  fontSize: "0.875rem",
                  color: "var(--color-brand-green)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>Flora AI is thinking</span>
                <span className="typing-dots">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: "16px 20px",
              backgroundColor: "var(--color-white)",
              borderTop: "1px solid var(--color-border-light)",
              display: "flex",
              gap: "12px",
            }}
          >
            <input
              type="text"
              placeholder="Ask Flora (e.g. 'Best plants for low light apartment' or 'How often to water Snake plant?')..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isThinking}
              style={{
                flex: 1,
                padding: "12px 18px",
                borderRadius: "var(--radius-pill)",
                border: "1px solid var(--color-border)",
                fontSize: "0.9375rem",
                outline: "none",
                backgroundColor: "var(--color-cream-soft)",
              }}
            />
            <button
              type="submit"
              className="btn-primary"
              disabled={isThinking || !inputText.trim()}
              style={{ padding: "12px 24px", fontSize: "0.875rem" }}
            >
              Send 🌿
            </button>
          </form>
        </div>
      </div>

      {/* Visualize My Space Modal */}
      <VisualizeMySpaceModal
        isOpen={isVisualizeModalOpen}
        onClose={() => setIsVisualizeModalOpen(false)}
      />
    </div>
  );
}
