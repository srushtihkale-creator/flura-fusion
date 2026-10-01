import { HeroSection } from "@/components/home/HeroSection";
import { TrustStrip } from "@/components/home/TrustStrip";
import { CategoryBanners } from "@/components/home/CategoryBanners";
import { FeaturedCatalogSections } from "@/components/home/FeaturedCatalogSections";
import { StoriesAndCareSection } from "@/components/home/StoriesAndCareSection";

export default function HomePage() {
  return (
    <div style={{ backgroundColor: "var(--color-cream)" }}>
      {/* 1. Hero Section with Restrained 3D & Nursery Fresh Badge */}
      <HeroSection />

      {/* 2. Trust Strip with 4 Anti-Gravity Floating Feature Cards */}
      <TrustStrip />

      {/* 3. Promotional Category Banners (Plants, Pots, Seeds) */}
      <CategoryBanners />

      {/* 4. Filterable Featured Catalog Grids (Plants, Pots, Seeds) */}
      <div style={{ padding: "var(--space-8) 0" }}>
        <FeaturedCatalogSections />
      </div>

      {/* 5. Botanical Stories & Plant Care Guide Section */}
      <StoriesAndCareSection />
    </div>
  );
}
