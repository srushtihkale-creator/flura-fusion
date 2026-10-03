/**
 * Flora Fusion — Space Visualization Service
 * Domain service for the "Visualize My Space" AI feature.
 * 
 * Current: Client mock preview & catalog matching engine.
 * Future: Direct integration with an image-generation API endpoint (e.g., Imagen / Gemini Vision).
 * 
 * Strict Constraint: Uses ONLY real Flora Fusion catalog items from catalog.ts.
 * Never invents products, prices, stock, discounts, or policies.
 */

import { Product } from "@/types/product";
import { getAllProducts } from "@/data/catalog";

export interface SpaceVisualizationRequest {
  imageFile?: File;
  imageUrl: string; // Object URL or base64 data URL of user's uploaded room/balcony photo
  prompt: string;
}

export interface SpaceVisualizationResult {
  id: string;
  userImageUrl: string;
  notes: string;
  recommendedProducts: Product[];
  timestamp: string;
}

export const SpaceVisualizationService = {
  /**
   * Matches user prompt & space intent to actual Flora Fusion catalog products.
   * Prepares mock visualizer state ready for future API replacement.
   */
  async generateVisualization(
    request: SpaceVisualizationRequest
  ): Promise<SpaceVisualizationResult> {
    const q = (request.prompt || "").toLowerCase();
    const all = getAllProducts();
    const plants = all.filter((p) => p.category === "plants");
    const pots = all.filter((p) => p.category === "pots");

    // Simulate realistic AI vision & spatial analysis latency (1.0s)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let matchedPlants: Product[] = [];
    let matchedPots: Product[] = [];
    let notes = "";

    // 1. Balcony / Terrace / Outdoor Sunlight Intent
    if (
      q.includes("balcony") ||
      q.includes("terrace") ||
      q.includes("outdoor") ||
      q.includes("sun") ||
      q.includes("patio")
    ) {
      matchedPlants = plants
        .filter(
          (p) =>
            p.slug === "areca-palm" ||
            p.slug === "ficus-elastica" ||
            p.slug === "lavender"
        )
        .slice(0, 2);
      matchedPots = pots
        .filter((p) => p.slug === "terracotta-pot" || p.slug === "hanging-planter")
        .slice(0, 1);
      notes =
        "For your balcony/terrace layout, we paired hardy, sun-tolerant plants with breathable terracotta and hanging planters to maximize fresh airflow and vertical dimension.";
    }
    // 2. Minimalist / Clean / Scandinavian Aesthetic Intent
    else if (
      q.includes("minimal") ||
      q.includes("clean") ||
      q.includes("modern") ||
      q.includes("white") ||
      q.includes("simple")
    ) {
      matchedPlants = plants
        .filter((p) => p.slug === "snake-plant" || p.slug === "zz-plant")
        .slice(0, 2);
      matchedPots = pots
        .filter((p) => p.slug === "minimal-white-pot" || p.slug === "ribbed-ceramic-pot")
        .slice(0, 1);
      notes =
        "To achieve a serene, uncluttered aesthetic, we selected architectural plants with sculptural silhouettes paired with our matte white and fluted ceramic planters.";
    }
    // 3. Desk / Work Surface / Compact Nook Intent
    else if (
      q.includes("desk") ||
      q.includes("table") ||
      q.includes("small") ||
      q.includes("office") ||
      q.includes("shelf")
    ) {
      matchedPlants = plants
        .filter(
          (p) =>
            p.slug === "money-plant" ||
            p.slug === "jade-plant" ||
            p.slug === "peace-lily"
        )
        .slice(0, 2);
      matchedPots = pots
        .filter((p) => p.slug === "ceramic-ripple-pot" || p.slug === "marble-pot")
        .slice(0, 1);
      notes =
        "For work surfaces and compact tabletops, these compact air-purifying companions introduce uplifting green vitality without crowding your workflow.";
    }
    // 4. Low Light / Bedroom / Dim Room Intent
    else if (
      q.includes("low light") ||
      q.includes("bedroom") ||
      q.includes("dim") ||
      q.includes("dark") ||
      q.includes("shade")
    ) {
      matchedPlants = plants
        .filter((p) => p.slug === "peace-lily" || p.slug === "snake-plant")
        .slice(0, 2);
      matchedPots = pots
        .filter((p) => p.slug === "ceramic-ripple-pot" || p.slug === "minimal-white-pot")
        .slice(0, 1);
      notes =
        "For rooms with soft ambient illumination, these shade-resilient species continuously purify indoor air and tolerate low-maintenance watering schedules.";
    }
    // 5. General / Default Harmonious Selection
    else {
      matchedPlants = plants
        .filter((p) => p.slug === "monstera-deliciosa" || p.slug === "money-plant")
        .slice(0, 2);
      matchedPots = pots
        .filter((p) => p.slug === "ribbed-ceramic-pot" || p.slug === "terracotta-pot")
        .slice(0, 1);
      notes =
        "Based on your space, we've styled our signature nursery favorites with handcrafted artisan pots to create balanced botanical focal points.";
    }

    // Combine strictly verified catalog items
    const recommendedProducts = [...matchedPlants, ...matchedPots];

    return {
      id: `vis-${Date.now()}`,
      userImageUrl: request.imageUrl,
      notes,
      recommendedProducts,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  },

  /**
   * Quick starter prompt suggestions for Visualize My Space
   */
  getSuggestedPrompts(): string[] {
    return [
      "Show me plants for this balcony",
      "I want a minimal look",
      "Show plants with suitable pots",
      "Low maintenance desk greens",
    ];
  },
};
