import React from "react";
import Link from "next/link";

export function CategoryBanners() {
  return (
    <section className="promo-banners-section" style={{ marginTop: "var(--space-8)" }}>
      <div className="container promo-grid">
        {/* Plants Promo Banner */}
        <Link href="/plants" className="promo-card promo-card-plants">
          <div className="promo-card-content">
            <h3 className="promo-category-name">Plants</h3>
            <p className="promo-desc">Indoor, outdoor, flowering, succulents & air-purifying companions.</p>
            <span className="promo-btn">Explore Plants →</span>
          </div>
          <img src="/assets/banners/promo_plants.png" alt="Plants" className="promo-bg-img" />
        </Link>

        {/* Pots Promo Banner */}
        <Link href="/pots" className="promo-card promo-card-pots">
          <div className="promo-card-content">
            <h3 className="promo-category-name">Pots</h3>
            <p className="promo-desc">Ceramic, terracotta, hanging, marble & self-watering containers.</p>
            <span className="promo-btn">Explore Pots →</span>
          </div>
          <img src="/assets/banners/promo_pots.png" alt="Pots" className="promo-bg-img" />
        </Link>

        {/* Seeds Promo Banner */}
        <Link href="/seeds" className="promo-card promo-card-seeds">
          <div className="promo-card-content">
            <h3 className="promo-category-name">Seeds</h3>
            <p className="promo-desc">Grow your own organic dreams and kitchen herbs from scratch.</p>
            <span className="promo-btn">Explore Seeds →</span>
          </div>
          <img src="/assets/banners/promo_seeds.png" alt="Seeds" className="promo-bg-img" />
        </Link>
      </div>
    </section>
  );
}
