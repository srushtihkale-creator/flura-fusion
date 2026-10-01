import React from "react";

export function TrustStrip() {
  return (
    <section className="trust-strip">
      <div className="container trust-grid">
        <div className="trust-item">
          <div className="trust-icon-box" title="Healthy Plants">
            <svg viewBox="0 0 24 24">
              <path d="M7 20h10" />
              <path d="M12 20v-8" />
              <path d="M12 12c0-4 4-7 8-7 0 4-3 8-7 8" />
              <path d="M12 12c0-3-3-5-6-5 0 3 2 6 5 6" />
            </svg>
          </div>
          <div>
            <h4 className="trust-title">Healthy Plants</h4>
            <p className="trust-desc">Direct from local nurseries</p>
          </div>
        </div>

        <div className="trust-item">
          <div className="trust-icon-box" title="Safe & Secure">
            <svg viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              <circle cx="12" cy="16" r="1" />
            </svg>
          </div>
          <div>
            <h4 className="trust-title">Safe & Secure</h4>
            <p className="trust-desc">Payments & instant confirmation</p>
          </div>
        </div>

        <div className="trust-item">
          <div className="trust-icon-box" title="Fast & Reliable">
            <svg viewBox="0 0 24 24">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <div>
            <h4 className="trust-title">Fast & Reliable</h4>
            <p className="trust-desc">Free delivery above ₹799</p>
          </div>
        </div>

        <div className="trust-item">
          <div className="trust-icon-box" title="Expert Support">
            <svg viewBox="0 0 24 24">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </div>
          <div>
            <h4 className="trust-title">Expert Support</h4>
            <p className="trust-desc">Plant care & Flora AI assistance</p>
          </div>
        </div>
      </div>
    </section>
  );
}
