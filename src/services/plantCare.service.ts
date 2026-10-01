/**
 * Flora Fusion — Plant Care Service Layer
 * Domain boundary per frontendprompt.md Section 27
 * Current: Reads from CMS-ready local articles dataset
 * Future: Headless CMS (Strapi / Sanity / WordPress REST API)
 */

import { PlantCareArticle } from "@/types/cms";
import { PLANT_CARE_ARTICLES } from "@/data/plantCareArticles";

export const PlantCareService = {
  /**
   * Fetch all plant care articles with optional category filter
   */
  async getAll(category: string = "all"): Promise<PlantCareArticle[]> {
    if (category === "all") {
      return PLANT_CARE_ARTICLES;
    }
    return PLANT_CARE_ARTICLES.filter((a) => a.category === category);
  },

  /**
   * Fetch single article by slug
   */
  async getBySlug(slug: string): Promise<PlantCareArticle | null> {
    return PLANT_CARE_ARTICLES.find((a) => a.slug === slug) || null;
  },
};
