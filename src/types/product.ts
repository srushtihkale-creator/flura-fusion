/**
 * Flora Fusion — Product Data Architecture
 * Strict TypeScript Models as defined in frontendprompt.md Section 7
 */

export type ProductCategory = "plants" | "pots" | "seeds";

export type ProductStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

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
  id: string;               // e.g. "plant-1" or UUID
  slug: string;             // e.g. "money-plant"
  name: string;             // e.g. "Money Plant"
  sku?: string;             // e.g. "FF-PLN-001"
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
  stockQuantity?: number;
  status?: ProductStatus;
  metadata: PlantMetadata | PotMetadata | SeedMetadata | Record<string, any>;
  careGuide?: CareGuide;
  relatedProducts?: string[]; // Array of product slugs/IDs
  images360?: string[];       // Optional sequential multi-angle images for 360 viewer (>= 4 angles)
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminProductPayload {
  name: string;
  slug?: string;
  categorySlug: string;
  subCategory?: string;
  tagline?: string;
  description: string;
  sku: string;
  price: number;
  originalPrice?: number;
  badge?: string | null;
  stockQuantity: number;
  inStock?: boolean;
  status?: ProductStatus;
  primaryImage?: string;
  images?: string[];
  images360?: string[];
  metadata?: Record<string, any>;
  careGuide?: Record<string, any>;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  displayOrder: number;
  isActive: boolean;
}
