import React from "react";
import { CheckCircle2, ShieldCheck, Truck, Headphones } from "lucide-react";

export function TrustStrip() {
  const trustItems = [
    {
      id: "healthy",
      title: "Healthy Plants",
      desc: "Direct from local nurseries",
      icon: <CheckCircle2 size={26} />,
      animClass: "animate-float-a",
    },
    {
      id: "secure",
      title: "Safe & Secure",
      desc: "Payments & instant confirmation",
      icon: <ShieldCheck size={26} />,
      animClass: "animate-float-b",
    },
    {
      id: "fast",
      title: "Fast & Reliable",
      desc: "Free delivery above ₹799",
      icon: <Truck size={26} />,
      animClass: "animate-float-a",
    },
    {
      id: "support",
      title: "Expert Support",
      desc: "Plant care & Flora AI assistance",
      icon: <Headphones size={26} />,
      animClass: "animate-float-b",
    },
  ];

  return (
    <section style={{ padding: "var(--space-8) 0" }}>
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "var(--space-6)",
          }}
        >
          {trustItems.map((item) => (
            <div
              key={item.id}
              className={item.animClass}
              style={{
                backgroundColor: "var(--color-surface)",
                padding: "var(--space-5) var(--space-6)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border-light)",
                display: "flex",
                gap: "var(--space-4)",
                alignItems: "center",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "var(--radius-pill)",
                  backgroundColor: "var(--color-surface-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-brand-green)",
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
              <div>
                <h4 style={{ fontSize: "var(--text-body)", fontWeight: 600, margin: 0, marginBottom: "2px" }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: "var(--text-caption)", color: "var(--color-text-muted)", margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
