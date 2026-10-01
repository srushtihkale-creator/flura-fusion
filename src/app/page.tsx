import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Truck, Headphones } from "lucide-react";

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--color-cream)" }}>
      {/* Foundation Validation Header */}
      <header
        style={{
          borderBottom: "1px solid var(--color-border-light)",
          backgroundColor: "var(--color-surface)",
          height: "var(--header-height-desktop)",
          display: "flex",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: "var(--z-header)",
        }}
      >
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Exact Brand Logo Asset */}
          <Link href="/" style={{ display: "flex", alignItems: "center" }}>
            <Image
              src="/assets/logo.png"
              alt="Flora Fusion"
              width={150}
              height={40}
              style={{ objectFit: "contain", height: "auto", width: "var(--logo-width-desktop)" }}
              priority
            />
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-6)" }}>
            <span
              className="badge badge-sage"
              style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-1)" }}
            >
              <Sparkles size={14} /> Phase 1 Foundation Verified
            </span>
          </div>
        </div>
      </header>

      {/* Hero Foundation Section */}
      <section className="section">
        <div className="container" style={{ maxWidth: "var(--container-max)" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "var(--space-12)",
              alignItems: "center",
            }}
          >
            {/* Left Column: Typography & Tokens */}
            <div>
              <div className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>
                <span>🍃</span> GREEN SPACES. HAPPIER PLACES.
              </div>
              <h1 className="display-lg" style={{ marginBottom: "var(--space-4)" }}>
                Bring Nature <span style={{ color: "var(--color-brand-green)" }}>Home</span>
              </h1>
              <p style={{ fontSize: "var(--text-body-lg)", marginBottom: "var(--space-6)", maxWidth: "540px" }}>
                Discover a wide range of healthy plants, beautiful pots and quality seeds — all in one place.
              </p>

              <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap", marginBottom: "var(--space-8)" }}>
                <button className="btn-primary">
                  Explore Catalog <ArrowRight size={18} />
                </button>
                <button className="btn-secondary">
                  Flora AI Guide
                </button>
              </div>

              {/* Token & System Validation Chips */}
              <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                <span className="filter-chip active">Next.js 14 App Router</span>
                <span className="filter-chip">TypeScript</span>
                <span className="filter-chip">GSAP 3.12</span>
                <span className="filter-chip">Lenis Smooth Scroll</span>
                <span className="filter-chip">Design Tokens</span>
              </div>
            </div>

            {/* Right Column: Hero Visual & Anti-Gravity Floating Validation */}
            <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  borderRadius: "var(--radius-xl)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-lg)",
                  position: "relative",
                  maxWidth: "520px",
                  width: "100%",
                  aspectRatio: "4 / 3",
                  backgroundColor: "var(--color-cream-soft)",
                }}
              >
                <Image
                  src="/assets/hero/hero_lush.jpg"
                  alt="Flora Fusion Nursery Room"
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />

                {/* Floating Levitation Badge */}
                <div
                  className="animate-float-badge"
                  style={{
                    position: "absolute",
                    bottom: "var(--space-6)",
                    left: "var(--space-6)",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--space-3) var(--space-4)",
                    boxShadow: "var(--shadow-md)",
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "var(--radius-pill)",
                      backgroundColor: "var(--color-brand-sage-light)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.25rem",
                    }}
                  >
                    🌿
                  </div>
                  <div>
                    <h4 style={{ fontSize: "var(--text-body)", fontWeight: 600, margin: 0 }}>
                      100% Nursery Fresh
                    </h4>
                    <p style={{ fontSize: "var(--text-caption)", color: "var(--color-text-muted)", margin: 0 }}>
                      Transit-safe bio packaging
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Feature Cards Floating Motion Test */}
      <section style={{ paddingBottom: "var(--space-16)" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "var(--space-6)",
            }}
          >
            <div
              className="animate-float-a"
              style={{
                backgroundColor: "var(--color-surface)",
                padding: "var(--space-6)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border-light)",
                display: "flex",
                gap: "var(--space-4)",
                alignItems: "flex-start",
              }}
            >
              <div style={{ color: "var(--color-brand-green)" }}>
                <CheckCircle2 size={28} />
              </div>
              <div>
                <h4 style={{ fontSize: "var(--text-body)", fontWeight: 600, marginBottom: "var(--space-1)" }}>
                  Healthy Plants
                </h4>
                <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-text-muted)", margin: 0 }}>
                  Direct from local nurseries
                </p>
              </div>
            </div>

            <div
              className="animate-float-b"
              style={{
                backgroundColor: "var(--color-surface)",
                padding: "var(--space-6)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border-light)",
                display: "flex",
                gap: "var(--space-4)",
                alignItems: "flex-start",
              }}
            >
              <div style={{ color: "var(--color-brand-green)" }}>
                <ShieldCheck size={28} />
              </div>
              <div>
                <h4 style={{ fontSize: "var(--text-body)", fontWeight: 600, marginBottom: "var(--space-1)" }}>
                  Safe & Secure
                </h4>
                <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-text-muted)", margin: 0 }}>
                  Payments & instant confirmation
                </p>
              </div>
            </div>

            <div
              className="animate-float-a"
              style={{
                backgroundColor: "var(--color-surface)",
                padding: "var(--space-6)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border-light)",
                display: "flex",
                gap: "var(--space-4)",
                alignItems: "flex-start",
              }}
            >
              <div style={{ color: "var(--color-brand-green)" }}>
                <Truck size={28} />
              </div>
              <div>
                <h4 style={{ fontSize: "var(--text-body)", fontWeight: 600, marginBottom: "var(--space-1)" }}>
                  Fast & Reliable
                </h4>
                <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-text-muted)", margin: 0 }}>
                  Free delivery above ₹799
                </p>
              </div>
            </div>

            <div
              className="animate-float-b"
              style={{
                backgroundColor: "var(--color-surface)",
                padding: "var(--space-6)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border-light)",
                display: "flex",
                gap: "var(--space-4)",
                alignItems: "flex-start",
              }}
            >
              <div style={{ color: "var(--color-brand-green)" }}>
                <Headphones size={28} />
              </div>
              <div>
                <h4 style={{ fontSize: "var(--text-body)", fontWeight: 600, marginBottom: "var(--space-1)" }}>
                  Expert Support
                </h4>
                <p style={{ fontSize: "var(--text-body-sm)", color: "var(--color-text-muted)", margin: 0 }}>
                  Plant care & Flora AI assistance
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
