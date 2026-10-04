/**
 * Flora Fusion — Product Data Architecture
 * Strict TypeScript Models as defined in frontendprompt.md Section 7
 */

export type ProductCategory = "plants" | "pots" | "seeds";

export interface PlantMetadata {
  placement: string;        // "Indoor" | "Outdoor"
  water: string;            // "Low Water" | "Medium Water"
  light: string;            // "Indirect Sun" | "Full Sun"
  difficulty: string;       // "Easy for Beginners" | "Hardy" | "Indestructible"
  airPurifying: boolean;
  petFriendly: boolean;
  size: string;
}

export interface PotMetadata {
  material: string;         // "Ceramic" | "Terracotta" | "Marble" | "Metal" | "Bamboo"
  size: string;             // "8 inch diameter"
  drainage: string;         // "Includes drainage hole + plug"
  style: string;
  colors: string[];
}

export interface SeedMetadata {
  type: string;             // "Herb Seeds" | "Vegetable Seeds" | "Flower Seeds"
  difficulty: string;
  season: string;
  germination: string;      // "5-8 Days"
  harvestTime: string;      // "4-5 Weeks"
  seedCount: string;
}

export interface CareGuide {
  watering: string;
  sunlight: string;
  repotting: string;
  proTip: string;
}

export interface Product {
  id: string;               // e.g. "plant-1"
  slug: string;             // e.g. "money-plant"
  name: string;             // e.g. "Money Plant"
  category: ProductCategory;
  subCategory: string;      // e.g. "indoor", "ceramic", "herb"
  tagline: string;
  description: string;
  price: number;            // Current selling price (INR)
  originalPrice?: number;   // Compare-at / strikethrough price
  rating: number;           // e.g. 4.8
  reviewCount: number;
  image: string;            // Primary HD photography path
  refImage?: string;        // Fallback reference crop path
  images?: string[];        // Optional gallery photography paths
  badge?: string | null;    // "Bestseller" | "Popular" | "Classic" | null
  inStock: boolean;
  metadata: PlantMetadata | PotMetadata | SeedMetadata;
  careGuide?: CareGuide;
  relatedProducts?: string[]; // Array of product slugs/IDs
  images360?: string[];       // Optional sequential multi-angle images for 360 viewer (>= 4 angles)
}
