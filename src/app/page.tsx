import { HeroSection } from "@/components/home/HeroSection";
import { ExploreByPlantType } from "@/components/home/ExploreByPlantType";
import { TrustStrip } from "@/components/home/TrustStrip";
import { FeaturedCatalogSections } from "@/components/home/FeaturedCatalogSections";
import { CategoryBanners } from "@/components/home/CategoryBanners";
import { StoriesAndCareSection } from "@/components/home/StoriesAndCareSection";

export default function HomePage() {
  return (
    <div id="home-view" className="app-view">
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. EXPLORE BY PLANT TYPE */}
      <ExploreByPlantType />

      {/* 3. TRUST STRIP */}
      <TrustStrip />

      {/* 3. CATALOG SECTIONS (Plants, Pots, Seeds) */}
      <FeaturedCatalogSections />

      {/* 4. PROMOTIONAL CATEGORY BANNERS */}
      <CategoryBanners />

      {/* 5. BOTANICAL STORIES & PLANT CARE */}
      <StoriesAndCareSection />
    </div>
  );
}
