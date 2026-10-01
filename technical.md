# Flora Fusion — Technical Architecture & Engineering Documentation

> **System:** Flora Fusion E-Commerce Frontend Prototype  
> **Brand Line:** *Nature Meets Your Space*  
> **Technology Stack:** HTML5 · Vanilla CSS (Tokenized) · Vanilla JavaScript (ES6+) · GSAP 3.12 · Lenis Smooth Scroll

---

## 1. Architectural Overview

Flora Fusion is engineered as a high-performance, single-page application (SPA) built purely with standard web technologies. It avoids bulky framework dependencies while delivering an editorial, app-like experience for an Indian plant nursery lifestyle brand.

```mermaid
graph TD
    User([Customer / Visitor]) --> Router{Hash Router #/plants, #/pots, #/seeds}
    Router --> Views[App Views: Home, Catalog, About, Plant Care]
    Views --> Components[Product Grid, Modals, Drawers]
    
    subgraph Data & State Layer
        Catalog[(FLORA_CATALOG Data)] --> Components
        Store[(FloraStore State Engine)] <--> LocalStorage[Browser LocalStorage]
        Store --> CartDrawer[Cart Drawer & Checkout]
        Store --> WishlistModal[Wishlist Modal]
    end

    subgraph Customer AI Layer
        AI[Flora AI Engine] <--> Catalog
        AI --> ChatUI[Flora AI Sliding Panel]
        ChatUI -. Embeds .-> MiniCards[Interactive Product Cards]
    end

    subgraph Motion Engine
        Lenis[Lenis Smooth Scroll] <--> GSAP[GSAP 3.12 + ScrollTrigger]
        GSAP --> HeroMotion[Hero Entrance Timeline]
        GSAP --> ZeroGrav[Zero-Gravity Levitation Loops]
    end
```

### Key Architectural Tenets
1. **Zero Framework Overhead:** Pure HTML5, modern tokenized CSS, and modular Vanilla JS for instantaneous load times and zero compilation latency.
2. **State Continuity via SPA:** Hash routing (`#/plants`, `#/product/:slug`, `#/checkout`) ensures that switching between categories, reading plant care guides, or opening products does not trigger a page reload, preserving ongoing Flora AI conversations and active cart items.
3. **Local Storage Synchronization:** Cart contents, active coupons, saved wishlist items, and placed orders are automatically serialized to `localStorage`.
4. **Strict Customer-Facing AI:** Flora AI acts exclusively as a botanical shopping guide, retrieving verified product records and formatting interactive mini product cards directly inside the conversation stream.

---

## 2. Directory & File Organization

```text
d:/flora fusion/
├── DOCS/
│   ├── Flora_Fusion_prompt.md               # Original build specification prompt
│   ├── Flora_Fusion_design_tokens (1).md    # Design token source of truth
│   ├── flora fusion.png                     # Visual layout reference
│   ├── flura fusion catlog.png              # Complete catalog reference
│   └── ChatGPT Image Sep 30, 2026, 03_07_48 PM.png # Latest Home Page visual reference
├── assets/
│   ├── logo.png                             # Exact provided Flora Fusion brand logo
│   ├── hero/
│   │   ├── hero_lush.jpg                    # High-res arched window room hero photo
│   │   └── hero_banner.png                  # Clean hero visual asset
│   ├── banners/
│   │   ├── promo_plants.png                 # Reference category banner for plants
│   │   ├── promo_pots.png                   # Reference category banner for pots
│   │   └── promo_seeds.png                  # Reference category banner for seeds
│   └── products/
│       ├── plants/                          # 11 studio photos + reference crops (Monstera, Snake, Lily, Palm, ZZ)
│       ├── pots/                            # 10 studio photos + reference crops (Ribbed, Minimal White)
│       └── seeds/                           # 10 studio photos + reference crops (Basil Seeds)
├── styles/
│   ├── tokens.css                           # Design tokens (:root variables)
│   ├── base.css                             # Reset, typography, Lenis styles
│   ├── components.css                       # Header, cards, modals, drawers, footer
│   ├── responsive.css                       # Mobile bottom nav, 2-column grid, sheets
│   └── animations.css                       # GSAP utility classes & keyframes
├── js/
│   ├── data.js                              # Catalog dataset (31 items with full specs)
│   ├── store.js                             # Cart, Wishlist, Coupon, Order & Toast state
│   ├── ai.js                                # Flora AI botanical assistant logic
│   ├── animations.js                        # GSAP timelines, Lenis sync & levitation
│   └── app.js                               # Router, UI rendering, event delegation
├── progress.md                              # Milestone and delivery tracker
├── technical.md                             # Architecture & technical documentation
└── index.html                               # Semantic single-page application entry
```

---

## 3. Design System & Token Mapping

All visual properties adhere strictly to [Flora_Fusion_design_tokens (1).md](file:///d:/flora%20fusion/DOCS/Flora_Fusion_design_tokens%20%281%29.md):

### 3.1 Color Palette Tokens
| Token Variable | Hex Value | Semantic Role |
| :--- | :--- | :--- |
| `--color-brand-forest` | `#173F2B` | Primary buttons, brand logo, strong headings, active chips |
| `--color-brand-green` | `#24583B` | Secondary buttons, link hovers, active borders, leaves |
| `--color-brand-deep` | `#123222` | Price typography, high-contrast footer, toasts |
| `--color-brand-sage` | `#A9BDA3` | Secondary backgrounds, filter chips, decorative foliage |
| `--color-brand-sage-light` | `#DDE7D8` | Soft highlights, badge backgrounds, tag chips |
| `--color-cream` | `#F7F4EC` | Master page background |
| `--color-cream-soft` | `#FBF9F4` | Card image backgrounds, modal drawer body |
| `--color-beige` | `#EEE8DA` | Warm promotional card backgrounds |
| `--color-sand` | `#DCC8A8` | Accent borders and terracotta highlights |
| `--color-white` | `#FFFFFF` | Product cards, modals, search inputs |
| `--color-category-plants` | `#315F3F` | Plants promo card accent |
| `--color-category-pots` | `#B9825B` | Pots promo card terracotta accent |
| `--color-category-seeds` | `#718B55` | Seeds promo card sprout accent |

### 3.2 Typography Tokens
* **Display / Headings:** `"Cormorant Garamond", Georgia, serif`
  * Hero Title: `clamp(2.75rem, 5vw, 4.5rem)`
  * Section Title (`h2`): `clamp(1.4rem, 2vw, 2rem)`
  * Editorial weight: `400` (regular), `500` (medium), `600` (semi-bold)
* **Interface / Body Text:** `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
  * Body regular: `1rem` (16px), line-height: `1.6`
  * Small body / Card descriptions: `0.8125rem` (13px)
  * Metadata / Badges / Labels: `0.6875rem` (11px) – `0.75rem` (12px)

### 3.3 Elevation & Shadows
* `--shadow-xs`: `0 1px 3px rgba(23, 63, 43, 0.05)`
* `--shadow-sm`: `0 4px 12px rgba(23, 63, 43, 0.07)` (Product cards default)
* `--shadow-md`: `0 10px 28px rgba(23, 63, 43, 0.10)` (Card hover & floating badges)
* `--shadow-lg`: `0 18px 45px rgba(23, 63, 43, 0.13)` (Modals & cart drawer)
* `--shadow-floating`: `0 20px 40px -10px rgba(23, 63, 43, 0.18)` (AI floating button)

---

## 4. Data Layer & Schemas

### 4.1 Product Schema (`js/data.js`)
```typescript
interface Product {
  id: string;               // e.g. "plant-1"
  category: "plants" | "pots" | "seeds";
  subCategory: string;      // e.g. "indoor", "ceramic", "herb"
  name: string;             // e.g. "Money Plant"
  slug: string;             // e.g. "money-plant"
  tagline: string;          // e.g. "Brings good luck & positivity"
  description: string;      // Full editorial description
  price: number;            // Current selling price (INR)
  originalPrice?: number;   // Strikethrough price if discounted
  rating: number;           // e.g. 4.8
  reviewCount: number;      // e.g. 124
  image: string;            // Path to HD 800x800 image
  refImage: string;         // Path to reference crop
  badge?: string | null;    // "Bestseller" | "Trending" | "Classic" | null
  inStock: boolean;
  metadata: PlantMetadata | PotMetadata | SeedMetadata;
  careGuide?: {
    watering: string;
    sunlight: string;
    repotting: string;
    proTip: string;
  };
}

interface PlantMetadata {
  placement: string;        // "Indoor" | "Outdoor"
  water: string;            // "Low Water" | "Medium Water"
  light: string;            // "Indirect Sun" | "Full Sun"
  difficulty: string;       // "Easy for Beginners" | "Hardy"
  airPurifying: boolean;
  petFriendly: boolean;
  size: string;
}

interface PotMetadata {
  material: string;         // "High-fired Ceramic" | "Terracotta"
  size: string;             // "8 inch diameter"
  drainage: string;         // "Includes drainage hole + plug"
  style: string;
  colors: string[];
}

interface SeedMetadata {
  type: string;             // "Herb Seeds" | "Vegetable Seeds"
  difficulty: string;
  season: string;
  germination: string;      // "5-8 Days"
  harvestTime: string;      // "4-5 Weeks"
  seedCount: string;
}
```

### 4.2 Cart & Order State Schema (`js/store.js`)
```typescript
interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  options: Record<string, any>;
}

interface Order {
  orderId: string;          // Format: "FF-XXXXXX"
  date: string;
  timestamp: number;
  items: CartItem[];
  subtotal: number;
  shipping: number;         // 0 if subtotal >= 799 else 79
  discount: number;         // Calculated from active coupon
  total: number;
  address: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  paymentMethod: "UPI" | "Card" | "NetBanking" | "COD";
  status: "Placed" | "Confirmed" | "Packed" | "Shipped" | "Delivered";
  estimatedDelivery: string;
  trackingSteps: Array<{ label: string; time: string; completed: boolean }>;
}
```

---

## 5. Component Breakdown & Interaction Flows

### 5.1 Single-Page Router (`js/app.js`)
* Listens to the `hashchange` event on the `window` object.
* Supports routes:
  * `#/` ➔ Activates `#home-view` (Hero, Trust strip, Category Promos, Featured Grids).
  * `#/plants` ➔ Activates `#catalog-view` with Plants category, title, and filter chips.
  * `#/pots` ➔ Activates `#catalog-view` with Pots category and filter chips.
  * `#/seeds` ➔ Activates `#catalog-view` with Seeds category and filter chips.
  * `#/about` ➔ Activates `#about-view` (Brand story and sustainability).
  * `#/plant-care` ➔ Activates `#care-view` (Watering and lighting guide).
  * `#/checkout` ➔ Opens the Checkout Stepper modal.
  * `#/tracking` ➔ Opens the Live Order Tracking modal.

### 5.2 Flora AI Assistant (`js/ai.js`)
* **Floating Launcher:** Styled with a pulsing concentric ring (`@keyframes pulse-ring`) and slow-wobbling leaf SVG.
* **Knowledge Retrieval:** Matches customer queries against botanical intent keywords (low light, under 500, beginner, watering, pots, herbs).
* **Interactive Chat Cards:** Generates dynamic HTML product cards inside the conversation bubble. Customers can click *"View"* to open the product modal or *"Add to Cart"* to immediately update their cart.
* **Typing Simulation:** Emits a 3-dot bouncing pulse indicator before responding to feel responsive and natural.

### 5.3 Cart Drawer & Checkout Stepper
* **Cart Calculations:**
  $$\text{Subtotal} = \sum (\text{item.price} \times \text{item.quantity})$$
  $$\text{Shipping} = \begin{cases} 0 & \text{if Subtotal} \ge 799 \\ 79 & \text{if Subtotal} < 799 \end{cases}$$
  $$\text{Discount} = \text{Coupon Rate} \times \text{Subtotal}$$
  $$\text{Total} = \text{Subtotal} + \text{Shipping} - \text{Discount}$$
* **Free Delivery Progress Bar:** Visual SVG track filled dynamically by $\min(100, \frac{\text{Subtotal}}{799} \times 100)\%$.
* **Coupon Engine:** Validates codes like `FLORA10` (10% off) or `NATURE20` (20% off for orders > ₹1000).
* **Checkout Stepper:** 3-step sequence (Address ➔ Delivery speed ➔ Payment). Upon submission, saves order to `localStorage`, flushes cart, and triggers the confirmation modal with live tracking.

---

## 6. Motion & Smooth Scrolling Engine (`js/animations.js`)

### 6.1 Lenis Smooth Inertia Scroll
* Configured with an exponential decay curve: `easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))`.
* Ticker hook: `gsap.ticker.add((time) => lenis.raf(time * 1000))` ensures ScrollTrigger calculations match the interpolated scroll position without layout jitter.

### 6.2 Zero-Gravity Levitation
* Hero floating leaves and nursery badge apply subtle, asynchronous sinusoidal tweens:
  ```javascript
  gsap.to(leafElement, {
    y: -12,
    x: 6,
    rotation: 4,
    duration: 3.6,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
  });
  ```

### 6.3 Accessibility (`prefers-reduced-motion`)
* Checks `window.matchMedia('(prefers-reduced-motion: reduce)').matches`.
* Automatically disables Lenis interpolation, cancels infinite GSAP loops, and uses instantaneous CSS opacity transitions when active.

---

## 7. Performance & Quality Benchmarks

1. **Asset Optimization:** All 31 product images are locally served at `800×800px` WebP/JPEG format with lazy loading (`loading="lazy"`).
2. **Event Delegation:** Clicks on product grids and card buttons are handled through central event delegation in `js/app.js` to minimize listener overhead.
3. **No Layout Shift (CLS):** Every product card image container maintains a fixed `aspect-ratio: 1 / 1` with a soft cream skeleton placeholder to prevent cumulative layout shifts during asset rendering.

---

## 8. Footer Rotating Botanical Badges System (`index.html`, `js/animations.js`)

### 8.1 Visual & Structural Specifications
* **Placement:** Full-width strip placed directly beneath the sub-footer legal links row (`.subfooter-badges-strip`).
* **Geometry:** Edge-to-edge row of overlapping circular badges (`width: 116px; height: 116px; margin: 0 -12px;` on desktop; `84px` on mobile with `overflow-x: hidden`).
* **Aesthetic Palette:** Alternating tri-color sequence adhering to design tokens:
  1. Forest Green (`#173F2B`) with soft sage emblem and cream typography.
  2. Warm Cream (`#FBF9F4`) with deep green emblem and botanical border ring.
  3. Soft Blush Terracotta (`#F1E1D4`) with organic sprig motif and warm earthy typography.
* **Typographic Perimeter:** Vector-wrapped text paths utilizing brand mottos (*"NATURE LOOKS GOOD ON YOU"*, *"PLANTS FOR A GREENER TOMORROW"*, *"GROW GOOD VIBES"*, *"NATURE IN EVERY HOME"*).

### 8.2 GSAP Rotation Mechanics & Tactile Interactivity
* **Individual Rotation Tweens:** Each circle badge rotates independently around its own `transform-origin: center center`.
  ```javascript
  gsap.to(badge, {
    rotation: direction * 360,
    duration: gsap.utils.random(22, 38),
    ease: "none",
    repeat: -1
  });
  ```
* **Click/Tap Tactile Acceleration:** Clicking or tapping any individual badge triggers an immediate `360°` spin tween (`duration: 0.85s`, `ease: "power2.out"`). Upon completion, the badge smoothly resumes its background rotation loop.
* **Reduced Motion Compliance:** If `prefers-reduced-motion: reduce` is active, rotation tweens are disabled, rendering the badges statically with subtle hover elevations.

---

## 9. Home Page Reference Image Pipeline (`DOCS/ChatGPT Image Sep 30, 2026, 03_07_48 PM.png`)

To maintain fidelity with the reference mockup without introducing visual noise, a non-destructive image extraction and inpainting pipeline was executed:

1. **Hero Main Image (`assets/hero/hero_lush.jpg` & `hero_banner.png`):**
   - Source bounds: `x: 528..1205, y: 45..442` (677×397px).
   - Cleaned the foreign webpage UI "Scroll Down" vertical pill by linear horizontal color interpolation of the warm beige wall gradient.
   - Preserves the sunlit arched window, pedestal planters, and the circular "Nature Looks Good On You" badge.
2. **Category Promotional Banners (`assets/banners/promo_*.png`):**
   - Extracted exact 172×98px crops for Plants (soft sage), Pots (warm beige), and Seeds (cream kraft packets with organic soil).
   - Inpainted outer container rounded border corners using local background sampling (`#DFE8DC`, `#F3ECE2`, `#F6F3EB`).
3. **Featured / Best Seller Product Crops (`assets/products/plants/`):**
   - Extracted 168×120px studio crops for Monstera Deliciosa, Snake Plant, Peace Lily, Areca Palm, and ZZ Plant.
   - Inpainted foreign UI wishlist heart badges and outer card border curves using the solid cream studio background (`#F8F7F0`).
   - Saved simultaneously as production `.jpg` and fallback `-ref.png` assets.
4. **Architectural Guardrails Maintained:**
   - Zero modifications to HTML layout hierarchy, components, or section structure.
   - Zero changes to `design_tokens.md` or CSS custom properties.
   - Zero changes to product catalog pricing, ratings, or state logic in `js/data.js` and `js/store.js`.
   - Exact brand logo asset (`assets/logo.png`) retained across all viewports.

---

## 10. Feature Card Anti-Gravity Floating Animation & Hero Restoration

### 10.1 Feature Cards Floating Motion (`styles/animations.css`, `styles/components.css`)
* **Target Elements:** The four trust feature cards (`.trust-item`): Healthy Plants, Safe & Secure, Fast & Reliable, Expert Support.
* **Pure CSS Keyframe Mechanics:**
  - Alternating keyframe sequences (`antiGravityFloatA` clockwise tilt, `antiGravityFloatB` counter-clockwise tilt).
  - Smooth vertical float: `translateY(0px)` to `translateY(-12px)`.
  - Subtle zero-gravity rotation: `-1deg` to `1deg`.
  - Infinite loops with smooth cubic-bezier / ease-in-out easing over `3.6s` – `4.0s`.
  - Staggered timing offsets (`0s`, `0.8s`, `1.6s`, `2.4s`) across `:nth-child(1..4)` ensuring organic out-of-sync levitation.
  - Dynamic height-simulating box-shadow: softens and expands as card rises (`0 4px 12px rgba(23,63,43,0.05)` ➔ `0 18px 28px rgba(23,63,43,0.11)`).
* **Hover Interaction:**
  - Smooth handoff (`transition: transform 0.4s, box-shadow 0.4s`).
  - Elevated lift (`translateY(-16px)`), subtle scale (`scale(1.03)`), deeper botanical shadow (`0 20px 36px rgba(23,63,43,0.16)`), and float pausing (`animation-play-state: paused`).
* **Accessibility:** Full `@media (prefers-reduced-motion: reduce)` override disables all transforms and animations.

### 10.2 Original Opening Hero Section Restoration (`index.html`, `styles/components.css`, `assets/hero/`)
* **Hero Editorial Copy:** Restored authentic opening copy matching the original specification:
  - Eyebrow: `🍃 GREEN SPACES. HAPPIER PLACES.`
  - Title: `Bring Nature Home`
  - Supporting description: *"Discover a wide range of healthy plants, beautiful pots and quality seeds — all in one place."*
  - CTA Button: `Shop Now →` linking to `#/plants`.
* **Original Plant Photography:** Restored authentic high-definition plant composition (`assets/hero/hero_lush.jpg`, `assets/hero/hero_banner.png`) showcasing snake plant, pothos, and textured planters on a wooden table.
* **Desktop Cleanliness:** Configured `.mobile-search-row { display: none; }` on desktop viewports (active only at `@media (max-width: 768px)`), ensuring the Hero section sits immediately at the top of the Home Page under the header.
* **Component Integrity:** Preserved all existing sections (Plants, Pots, Seeds, Promo Banners, Customer Flora AI, Footer, Rotating Badges, Modals) with zero regressions.

---

## 11. Next.js 14 App Router Migration & 100% Prototype UI/UX Realignment

### 11.1 Framework & Stack Specification
- **Framework:** Next.js 14.2.x (App Router, React Server Components + Client Boundary islands).
- **Language:** TypeScript 5.x with strict type checking enabled (`strict: true`, zero `any` leaks).
- **State Management:** Zustand with `persist` middleware (`src/store/useFloraStore.ts`) synchronizing Cart, Wishlist, Coupons, and Order history across sessions.
- **Motion Engine:** GSAP 3.12 (with ScrollTrigger) & `@studio-freight/lenis` smooth inertia scrolling wrapped in SSR-safe `useSmoothScroll` hook.
- **Repository Remote:** `https://github.com/srushtihkale-creator/flura-fusion.git` (`origin/main`).

### 11.2 Style Architecture & 100% Prototype Parity
The Next.js application imports the exact CSS hierarchy from the verified prototype:
1. `src/styles/tokens.css`: All CSS custom properties, color tokens, typography scales, z-indices, easings, plus layout variables (`--header-bg`, `--footer-bg`, `--footer-border`, `--footer-padding-desktop`, `--drawer-width`, `--bottom-nav-bg`).
2. `src/styles/base.css`: Global HTML/body reset, Cormorant Garamond / Inter font assignments, and `.container` wrapper rules.
3. `src/styles/components.css`: 2,098 lines of meticulously styled components including `.site-header`, `.hero-section`, `.trust-strip`, `.product-grid`, `.product-card`, `.promo-banners-section`, `.cart-drawer`, `.drawer-backdrop`, `.flora-ai-panel`, `.site-footer`, and `.site-subfooter`.
4. `src/styles/responsive.css`: Breakpoint rules for mobile bottom nav, 2-column mobile catalog grids, responsive drawers, and search rows.
5. `src/styles/animations.css`: Keyframes for levitation (`antiGravityFloatA`, `antiGravityFloatB`), typing dots, and pulses.

### 11.3 Component Realignment Mapping
| Component | Prototype DOM Hierarchy & Classes | Features & Micro-Interactions |
| :--- | :--- | :--- |
| `SiteHeader.tsx` | `.site-header > .container > .brand-logo, .nav-links, .header-search, .header-actions` | Search dropdown, reactive badge counters, logo asset |
| `HeroSection.tsx` | `.hero-section > .container.hero-grid > .hero-text-content, .hero-visual-wrapper` | Floating SVG leaves, main hero card, nursery badge |
| `TrustStrip.tsx` | `.trust-strip > .container.trust-grid > .trust-item` | 4 cards, minimal SVG line icons, out-of-sync levitation |
| `FeaturedCatalogSections.tsx` | `section.container > .home-section-header, .home-filter-chips, .product-grid` | Category badges, filter chips, all 31 items SSR rendered |
| `CategoryBanners.tsx` | `.promo-banners-section > .container.promo-grid > .promo-card` | Plants, Pots, Seeds promo cards with background images |
| `ProductCard.tsx` | `.product-card > .product-img-wrapper, .product-name, .product-meta-row, .card-quick-add` | Wishlist heart toggle, botanical tags, hover lift |
| `CartDrawer.tsx` | `.drawer-backdrop, .cart-drawer > .drawer-header, .drawer-body, .drawer-footer` | Free delivery progress bar, coupon form, total summary |
| `WishlistModal.tsx` | `.modal-backdrop, .modal-container > .product-grid` | Modal backdrop blur, empty state, saved item grid |
| `FloraAIPanel.tsx` | `.flora-ai-launcher, .drawer-backdrop, .flora-ai-panel` | Pulsing leaf trigger, suggestion chips, interactive cards |
| `SiteFooter.tsx` | `.site-footer > .container > .footer-grid` | Brand description, collection links, newsletter subscription |
| `SubFooter.tsx` | `.site-subfooter > .container.subfooter-inner` | Legal links, dynamic copyright, accessible policy modals |
| `RotatingBadgeStrip.tsx` | `.overlapping-badges-strip > .overlapping-badges-track > .overlapping-badge-item` | Overlapping badges, alternating GSAP spin loops, click-spin |
| `MobileNav.tsx` | `.mobile-bottom-nav > .mobile-nav-items > .mobile-nav-btn` | Sticky bottom navigation bar with active route highlight |

### 11.4 SSR Hydration & Verification Engine
- Direct SSR hydration without blank-screen flicker; all 31 products and drawer/modal DOM nodes exist in the server-rendered HTML payload.
- Validated via direct HTTP request: `http://localhost:3000` returns HTTP 200 with 93,869 bytes of clean HTML confirming all 17 prototype classes present.
- Production bundle verification (`npm run build`) generates static prerendered routes with zero build or lint warnings.

---

## 12. Complete Routing, Domain Services & Production Delivery (Phases 4–15)

### 12.1 End-to-End Application Routes
| Route | Page Component | Rendering Strategy | Key Capabilities |
| :--- | :--- | :--- | :--- |
| `/` | `src/app/page.tsx` | Static (`SSG`) | Hero, trust strip, featured categories, promo banners, stories |
| `/plants` | `src/app/plants/page.tsx` | Static (`SSG`) | 11 Plants, category hero banner, filters, sort, quick search |
| `/pots` | `src/app/pots/page.tsx` | Static (`SSG`) | 10 Pots, material filters (ceramic, terracotta, etc.), sort |
| `/seeds` | `src/app/seeds/page.tsx` | Static (`SSG`) | 10 Seeds, type filters (herb, vegetable, flower), germination info |
| `/product/[slug]` | `src/app/product/[slug]/page.tsx` | Statically Generated (`31 paths`) | HD gallery, botanical specs, care guide, Add to Cart, Buy Now |
| `/search` | `src/app/search/page.tsx` | Dynamic / Client Suspense | Real-time debounced query, category tabs, suggestions, empty state |
| `/cart` | `src/app/cart/page.tsx` | Static (`SSG`) | Free shipping progress (₹799), coupon engine, summary, checkout CTA |
| `/wishlist` | `src/app/wishlist/page.tsx` | Static (`SSG`) | Saved wishlist items, Section 25 empty state, 1-click cart move |
| `/checkout` | `src/app/checkout/page.tsx` | Static (`SSG`) | 3-step checkout stepper (Address, Delivery Speed, Payment) |
| `/account` | `src/app/account/page.tsx` | Static (`SSG`) | Customer profile, stats, recent order, saved addresses |
| `/account/orders` | `src/app/account/orders/page.tsx` | Static (`SSG`) | Orders list with status badges, order dates, and tracking links |
| `/account/orders/[id]` | `src/app/account/orders/[id]/page.tsx` | Server-Rendered on demand | 6-stage live visual tracking timeline, order invoice details |
| `/plant-care` | `src/app/plant-care/page.tsx` | Static (`SSG`) | Knowledge hub, topic filter chips, arborist guidance |
| `/plant-care/[slug]` | `src/app/plant-care/[slug]/page.tsx` | Statically Generated (`5 paths`) | Full article markdown reader, care illustrations, Flora AI trigger |
| `/about` | `src/app/about/page.tsx` | Static (`SSG`) | Botanical nursery story, sustainability values, philosophy |
| `/flora-ai` | `src/app/flora-ai/page.tsx` | Static (`SSG`) | Full-page customer assistant, suggestion chips, interactive cards |

### 12.2 Domain Service Layer Architecture (`src/services/`)
Adhering to `frontendprompt.md` Section 5 & 26:
- **`ProductService.ts`**: Pure abstraction for catalog retrieval, subcategory filtering, sorting (`price-low`, `price-high`, `rating`, `featured`), slug lookups, and related-product cross-selling.
- **`SearchService.ts`**: Text matching across names, descriptions, and botanical metadata; category filtering; and popular query suggestions.
- **`CartService.ts`**: Calculation engine managing subtotal, ₹799 free shipping threshold, ₹79 standard fee, and coupon validation (`FLORA10`, `NATURE20`).
- **`WishlistService.ts`**: Resolves stored product IDs to typed `Product` domain records.
- **`OrderService.ts`**: Realistic order generator with `FF-XXXXXX` IDs, timestamps, delivery date projections, and 6 tracking milestones.
- **`PlantCareService.ts`**: CMS-ready content provider for editorial plant guides.
- **`FloraAIService.ts`**: Botanical knowledge retrieval matching customer intents (low light, under 500, beginner, clean air, pots, herbs) to verified product recommendations.

### 12.3 Quality, Lint & Build Verification
1. **Automated Test Suite (`scripts/verify-services.ts`):** 14 unit and integration tests passing with 0 failures (`npm test`).
2. **Type Safety (`npx tsc --noEmit`):** Complete TypeScript strict mode compliance with 0 errors.
3. **ESLint (`npm run lint`):** Clean pass with 0 errors and 0 warnings.
4. **Production Build (`npm run build`):** 52 static and dynamic routes pre-rendered successfully.

---

## 13. High-Resolution Catalog Studio Photography & Hero Asset Pipeline

### 13.1 Catalog Image Quality Transformation (31/31 Products at 1:1 HD)
To eliminate blurriness and ensure crisp, professional presentation on desktop (high-DPI / Retina) and mobile screens:
* **Audited 31 Catalog Items:** 22 items were already crisp 800×800 photography; 9 items with tiny crops (168×120 / 172×98) or invalid placeholders were completely upgraded to studio-grade 1024×1024 square botanical photography:
  * **Marigold Seeds (`marigold-seeds.jpg`):** Specifically replaced placeholder with a clean, professional, high-resolution botanical photograph of vibrant golden-orange marigold blooms with an artisan craft seed packet.
  * **Basil Seeds (`basil-seeds.jpg`):** Upgraded from 166×98 (5.3 KB) to 1024×1024 (772 KB) sharp botanical studio photography.
  * **Snake Plant (`snake-plant.jpg`):** Upgraded from 168×120 (4.9 KB) to 1024×1024 (521 KB) crisp architectural foliage photography.
  * **Monstera Deliciosa (`monstera-deliciosa.jpg`):** Upgraded from 168×120 (7.7 KB) to 1024×1024 (706 KB) split-leaf studio photography.
  * **Peace Lily (`peace-lily.jpg`):** Upgraded from 168×120 (6.3 KB) to 1024×1024 (599 KB) blooming white spathe photography.
  * **Areca Palm (`areca-palm.jpg`):** Upgraded from 168×120 (6.1 KB) to 1024×1024 (738 KB) golden cane palm photography.
  * **ZZ Plant (`zz-plant.jpg`):** Upgraded from 168×120 (5.4 KB) to 1024×1024 (691 KB) glossy waxy foliage photography.
  * **Ribbed Ceramic Pot (`ribbed-ceramic-pot.jpg`):** Upgraded from 172×98 (3.6 KB) to 1024×1024 (534 KB) textured ceramic photography.
  * **Minimal White Pot (`minimal-white-pot.jpg`):** Upgraded from 172×98 (3.6 KB) to 1024×1024 (584 KB) matte porcelain photography.
* **Dual Asset Synchronization:** All image files are synchronized simultaneously to `assets/products/` (prototype) and `public/assets/products/` (Next.js production runtime).
* **Geometric & CSS Harmony:**
  * Every image possesses a native 1:1 square aspect ratio matching `.product-img-wrapper` (`aspect-ratio: 1 / 1;`).
  * `.product-card-img` applies `width: 100%; height: 100%; object-fit: cover;` ensuring seamless responsiveness without distortion, letterboxing, or blur.

### 13.2 Hero Asset Alignment & Webpack Dev-Cache Resilience
* **Hero Image Asset:** Set to `/assets/hero/hero_plants.png` in [`src/components/home/HeroSection.tsx`](file:///d:/flora%20fusion/src/components/home/HeroSection.tsx) and [`index.html`](file:///d:/flora%20fusion/index.html).
* **Cache Collision Diagnosis:** Documented that running `next dev` directly on an existing production `.next` build folder can cause Next.js's internal `PackFileCacheStrategy` to fail, serving 404 for `layout.css`. Flushing `.next` and taking a clean build resolves chunk mapping instantly and permanently.

### 13.3 Non-Destructive Integrity Protocol
* **Strict Visual Immutability:** Product card dimensions, spacing, typography tokens, pricing, ratings, badges, add-to-cart buttons, header, footer, animations, and responsive breakpoints were kept 100% untouched.
* **Git Status:** Committed to `main` (`b2134a2`) and verified against remote repository.

