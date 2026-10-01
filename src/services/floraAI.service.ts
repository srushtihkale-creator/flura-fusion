/**
 * Flora Fusion — Flora AI Customer Service Layer
 * Domain boundary per frontendprompt.md Section 23 & 26
 * Current: Client botanical knowledge retrieval engine
 * Future: Spring Boot AI agent / Gemini Interactions API endpoint
 */

import { Product } from "@/types/product";
import { getAllProducts } from "@/data/catalog";

export interface FloraAIMessage {
  id: string;
  sender: "flora" | "user";
  text: string;
  timestamp: string;
  recommendations?: Product[];
}

export const FloraAIService = {
  /**
   * Process customer intent and generate botanical guidance with matched products
   */
  async generateResponse(query: string): Promise<{ text: string; recommendations: Product[] }> {
    const q = query.toLowerCase();
    const all = getAllProducts();

    // Natural processing delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Intent 1: Low Light / Dim Rooms
    if (q.includes("low light") || q.includes("dim") || q.includes("dark") || q.includes("bedroom")) {
      const recs = all.filter((p) => p.slug === "snake-plant" || p.slug === "zz-plant" || p.slug === "peace-lily");
      return {
        text: "For bedrooms or rooms with soft, indirect lighting, hardy species that tolerate lower illumination are ideal. The Snake Plant and ZZ Plant produce oxygen and require watering only once every 2–3 weeks!",
        recommendations: recs,
      };
    }

    // Intent 2: Under 500 / Budget
    if (q.includes("500") || q.includes("budget") || q.includes("cheap") || q.includes("affordable")) {
      const recs = all.filter((p) => p.price <= 500).slice(0, 3);
      return {
        text: "Here are some of our most beloved nursery plants and artisan pots under ₹500 that deliver maximum green joy without stretching your budget:",
        recommendations: recs,
      };
    }

    // Intent 3: Beginner / Easy / Low Maintenance
    if (q.includes("beginner") || q.includes("easy") || q.includes("first time") || q.includes("new to plants")) {
      const recs = all.filter((p) => p.slug === "money-plant" || p.slug === "snake-plant" || p.slug === "jade-plant");
      return {
        text: "Welcome to plant parenting! I recommend virtually indestructible choices like the Money Plant, Snake Plant, or Jade Plant. They are forgiving of occasional missed waterings and adapt gracefully to Indian apartments.",
        recommendations: recs,
      };
    }

    // Intent 4: Air Purifier / NASA / Clean Air
    if (q.includes("air") || q.includes("purif") || q.includes("toxin") || q.includes("breathe")) {
      const recs = all.filter((p) => {
        const meta = p.metadata as any;
        return meta?.airPurifying === true;
      }).slice(0, 3);
      return {
        text: "These champion air-purifying plants are scientifically proven to filter airborne toxins like benzene and formaldehyde while enriching your living spaces with oxygen:",
        recommendations: recs,
      };
    }

    // Intent 5: Pots & Planters
    if (q.includes("pot") || q.includes("planter") || q.includes("ceramic") || q.includes("terracotta")) {
      const recs = all.filter((p) => p.category === "pots").slice(0, 3);
      return {
        text: "Our pots are handcrafted with drainage holes to keep root balls healthy. For tropical foliage, our fluted ceramic and breathable terracotta pots provide optimal root aeration:",
        recommendations: recs,
      };
    }

    // Intent 6: Herbs & Seeds
    if (q.includes("herb") || q.includes("seed") || q.includes("grow") || q.includes("kitchen") || q.includes("basil")) {
      const recs = all.filter((p) => p.category === "seeds").slice(0, 3);
      return {
        text: "Growing fresh culinary herbs on your kitchen window sill is wonderfully rewarding! Our heirloom non-GMO seeds germinate in 5–8 days with simple misting:",
        recommendations: recs,
      };
    }

    // Intent 7: Help Me Choose / General Guide
    const recs = all.filter((p) => p.badge === "Bestseller").slice(0, 3);
    return {
      text: "I would love to help you find the right plant! Do you have bright sunny windows or shaded corners? In the meantime, here are our current nursery bestsellers that delight homes across India:",
      recommendations: recs,
    };
  },

  /**
   * Get default starter suggestion chips
   */
  getStarterChips(): string[] {
    return [
      "Low Light Plants",
      "Under ₹500",
      "Beginner Friendly",
      "NASA Air Purifiers",
      "Ceramic Pots",
      "Kitchen Herbs",
      "Help me choose",
    ];
  },
};
