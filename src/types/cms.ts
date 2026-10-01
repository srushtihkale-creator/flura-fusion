/**
 * Flora Fusion — CMS Ready Content Interfaces
 * Strict TypeScript Models as defined in frontendprompt.md Section 6 & 27
 */

export interface CtaLink {
  label: string;
  href: string;
}

export interface HeroContent {
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  description?: string;
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
  image: string;
  fallbackImage?: string;
  imageAlt: string;
  floatingBadge?: {
    icon: string;
    title: string;
    subtitle: string;
  };
}

export interface TrustFeature {
  id: string;
  title: string;
  description: string;
  iconName: "leaf" | "shield-check" | "truck" | "headphones";
}

export interface PromoCategoryBanner {
  id: string;
  category: "plants" | "pots" | "seeds";
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  image: string;
  accentColor: string;
}

export interface PlantCareArticle {
  id: string;
  slug: string;
  title: string;
  category: "watering" | "light" | "repotting" | "troubleshooting";
  excerpt: string;
  readTime: string;
  author: string;
  date: string;
  image: string;
  contentMarkdown: string;
}
