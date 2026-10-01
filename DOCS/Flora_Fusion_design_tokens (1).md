# Flora Fusion — Design Tokens

> Source of truth for the Flora Fusion visual system.
>
> These tokens are derived from the Flora Fusion design specification and the supplied visual references. Use them consistently across desktop, tablet and mobile.
>
> Product categories: **Plants · Pots · Seeds**
>
> Animation: **GSAP**
>
> Smooth scrolling: **Lenis**

---

# 1. Design Token Principles

Flora Fusion should feel:

- Natural
- Premium
- Calm
- Modern
- Botanical
- Warm
- Minimal
- Trustworthy

Avoid:

- Neon colors
- Dark futuristic UI
- Excessive gradients
- Excessive glassmorphism
- Generic SaaS styling
- Excessive rounded UI
- Excessive animation
- Random photography styles

The design system should preserve the supplied Flora Fusion references while making the implementation responsive and production-oriented.

---

# 2. Color Tokens

## 2.1 Brand Colors

```css
:root {
  --color-brand-forest: #173F2B;
  --color-brand-green: #24583B;
  --color-brand-deep: #123222;
  --color-brand-sage: #A9BDA3;
  --color-brand-sage-light: #DDE7D8;
}
```

### Usage

`--color-brand-forest`
- Primary buttons
- Main logo
- Important headings
- Active states
- AI accent

`--color-brand-green`
- Secondary buttons
- Links
- Hover states
- Interactive botanical accents

`--color-brand-deep`
- Strong text
- Navigation emphasis
- Footer headings

`--color-brand-sage`
- Secondary backgrounds
- Filter chips
- Decorative areas

`--color-brand-sage-light`
- Soft sections
- Product metadata backgrounds
- Supporting UI

---

# 3. Neutral Colors

```css
:root {
  --color-cream: #F7F4EC;
  --color-cream-soft: #FBF9F4;
  --color-beige: #EEE8DA;
  --color-sand: #DCC8A8;
  --color-white: #FFFFFF;

  --color-text-primary: #173F2B;
  --color-text-secondary: #53635A;
  --color-text-muted: #7A847D;

  --color-border: #DDDCD3;
  --color-border-light: #EAE8DF;

  --color-surface: #FFFFFF;
  --color-surface-soft: #F5F3EA;
}
```

### Background hierarchy

```text
Page background
→ --color-cream

Secondary section
→ --color-cream-soft

Card
→ --color-white

Soft UI surface
→ --color-surface-soft

Warm promotional surface
→ --color-beige
```

---

# 4. Category Accent Colors

Category colors should remain subtle.

## Plants

```css
--color-category-plants: #315F3F;
--color-category-plants-soft: #E5EEE3;
```

## Pots

```css
--color-category-pots: #B9825B;
--color-category-pots-soft: #F1E1D4;
```

## Seeds

```css
--color-category-seeds: #718B55;
--color-category-seeds-soft: #E5EBD8;
```

These are accents, not full-page backgrounds.

---

# 5. Semantic Colors

```css
:root {
  --color-success: #3D754B;
  --color-success-soft: #E6F0E6;

  --color-warning: #B07A2A;
  --color-warning-soft: #F7EEDB;

  --color-error: #A34A42;
  --color-error-soft: #F5E5E2;

  --color-info: #52758A;
  --color-info-soft: #E6EEF2;
}
```

Use semantic colors sparingly.

Do not let status colors overpower the botanical visual identity.

---

# 6. Typography Tokens

The visual reference uses an editorial serif style for major headings and a clean sans-serif for interface content.

## 6.1 Font Roles

```css
:root {
  --font-display: "Cormorant Garamond", Georgia, serif;
  --font-body: "Inter", "Helvetica Neue", Arial, sans-serif;
}
```

If the selected project font differs, preserve the same role:

```text
Display = premium editorial serif
Body/UI = clean modern sans-serif
```

---

# 7. Typography Scale

## Display

```css
--text-display-xl: 4.5rem;
--text-display-lg: 3.75rem;
--text-display-md: 3rem;
```

Use for:

- Main hero
- Major landing headings

## Heading

```css
--text-h1: 2.75rem;
--text-h2: 2.25rem;
--text-h3: 1.75rem;
--text-h4: 1.375rem;
```

## Body

```css
--text-body-lg: 1.125rem;
--text-body: 1rem;
--text-body-sm: 0.875rem;
```

## UI

```css
--text-label: 0.75rem;
--text-caption: 0.6875rem;
```

---

# 8. Responsive Typography

Desktop:

```css
--text-hero: clamp(3rem, 5vw, 4.5rem);
--text-section: clamp(2rem, 3.5vw, 3rem);
```

Mobile:

```css
--text-hero-mobile: clamp(2.25rem, 10vw, 3.25rem);
--text-section-mobile: clamp(1.75rem, 8vw, 2.25rem);
```

Do not allow headings to overflow narrow screens.

---

# 9. Font Weights

```css
--weight-regular: 400;
--weight-medium: 500;
--weight-semibold: 600;
--weight-bold: 700;
```

Recommended:

- Body: 400
- Navigation: 500
- Product name: 500–600
- Price: 600
- Buttons: 600
- Main heading: 500

Avoid excessive bold text.

---

# 10. Letter Spacing

```css
--tracking-tight: -0.025em;
--tracking-normal: 0;
--tracking-wide: 0.04em;
--tracking-label: 0.08em;
```

Use wide tracking for:

- Uppercase labels
- Small category labels
- Eyebrow text

---

# 11. Line Height

```css
--leading-none: 1;
--leading-tight: 1.15;
--leading-heading: 1.2;
--leading-body: 1.6;
--leading-relaxed: 1.75;
```

Display headings should remain compact.

Body copy should remain comfortable to read.

---

# 12. Spacing Scale

Use a consistent 4px-based spacing system.

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
  --space-32: 8rem;     /* 128px */
}
```

---

# 13. Layout Container

```css
:root {
  --container-max: 1440px;
  --container-wide: 1600px;
  --container-reading: 720px;

  --page-padding-desktop: 32px;
  --page-padding-tablet: 24px;
  --page-padding-mobile: 16px;
}
```

The site should maintain generous horizontal whitespace.

---

# 14. Grid Tokens

## Desktop

```css
--grid-columns-desktop: 4;
--grid-gap-desktop: 16px;
```

## Large catalog

For wide screens where the reference supports a dense product catalog:

```css
--grid-columns-wide: 5;
--grid-gap-wide: 14px;
```

## Tablet

```css
--grid-columns-tablet: 3;
--grid-gap-tablet: 14px;
```

## Mobile

```css
--grid-columns-mobile: 2;
--grid-gap-mobile: 10px;
```

The mobile product card must remain readable.

---

# 15. Section Spacing

```css
--section-space-xl: 96px;
--section-space-lg: 80px;
--section-space-md: 64px;
--section-space-sm: 48px;
```

Mobile:

```css
--section-space-mobile-lg: 56px;
--section-space-mobile-md: 44px;
--section-space-mobile-sm: 32px;
```

---

# 16. Border Radius

Flora Fusion uses soft but controlled rounding.

```css
:root {
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-pill: 999px;
}
```

Recommended:

- Product cards: `--radius-md`
- Category banners: `--radius-lg`
- Buttons: `--radius-pill` or `--radius-sm`
- Filter chips: `--radius-pill`
- Modals: `--radius-xl`

Do not round every element excessively.

---

# 17. Border Tokens

```css
:root {
  --border-width: 1px;
  --border-color: #DDDCD3;
  --border-color-light: #EAE8DF;
  --border-color-active: #24583B;
}
```

Product cards should use subtle borders instead of heavy shadows.

---

# 18. Shadow Tokens

Keep shadows soft and natural.

```css
:root {
  --shadow-xs: 0 1px 3px rgba(23, 63, 43, 0.05);
  --shadow-sm: 0 4px 12px rgba(23, 63, 43, 0.07);
  --shadow-md: 0 10px 28px rgba(23, 63, 43, 0.10);
  --shadow-lg: 0 18px 45px rgba(23, 63, 43, 0.13);
}
```

Use:

- Cards: `shadow-xs` or `shadow-sm`
- Hover cards: `shadow-md`
- Floating panels: `shadow-lg`

Avoid strong black shadows.

---

# 19. Product Card Tokens

```css
:root {
  --product-card-radius: 12px;
  --product-card-padding: 10px;
  --product-card-image-radius: 8px;
  --product-card-border: var(--border-color-light);
  --product-card-bg: var(--color-white);
}
```

Product card hierarchy:

```text
Image
↓
Product name
↓
Description / metadata
↓
Rating
↓
Price
↓
Secondary metadata / CTA
```

---

# 20. Product Image Tokens

```css
:root {
  --product-image-ratio: 1 / 1;
  --product-gallery-ratio: 4 / 5;
  --hero-image-ratio: 16 / 7;
  --category-banner-ratio: 3 / 1;
}
```

Use:

```css
object-fit: cover;
```

or:

```css
object-fit: contain;
```

depending on the photography composition.

Product images should not be stretched.

---

# 21. Button Tokens

## Primary Button

```css
--button-primary-bg: var(--color-brand-forest);
--button-primary-text: #FFFFFF;
--button-primary-hover: var(--color-brand-green);
```

## Secondary Button

```css
--button-secondary-bg: transparent;
--button-secondary-text: var(--color-brand-forest);
--button-secondary-border: var(--color-brand-forest);
```

## Button dimensions

```css
--button-height-sm: 36px;
--button-height-md: 44px;
--button-height-lg: 52px;
```

```css
--button-padding-x-sm: 14px;
--button-padding-x-md: 20px;
--button-padding-x-lg: 28px;
```

---

# 22. Button Motion

Hover:

- Small translateY
- Slight shadow
- Background transition

Recommended:

```css
transform: translateY(-1px);
```

Do not use large movement.

---

# 23. Input Tokens

```css
:root {
  --input-height: 46px;
  --input-height-mobile: 44px;

  --input-bg: var(--color-white);
  --input-border: var(--border-color);
  --input-border-focus: var(--color-brand-green);

  --input-radius: var(--radius-sm);
  --input-padding-x: 14px;
}
```

Search input may use a pill shape:

```css
--search-radius: var(--radius-pill);
```

---

# 24. Search Tokens

```css
--search-height-desktop: 42px;
--search-height-mobile: 44px;
--search-max-width: 420px;
--search-radius: 999px;
```

Placeholder:

> Search for plants, pots or seeds...

Search should visually remain part of the brand rather than looking like a generic search component.

---

# 25. Filter Chip Tokens

```css
:root {
  --chip-height: 34px;
  --chip-padding-x: 14px;
  --chip-radius: 999px;

  --chip-bg: var(--color-white);
  --chip-border: var(--border-color);
  --chip-text: var(--color-text-secondary);

  --chip-active-bg: var(--color-brand-forest);
  --chip-active-text: #FFFFFF;
}
```

Categories:

Plants:

```text
All · Indoor · Outdoor · Flowering · Air Purifying · Succulents
```

Pots:

```text
All · Ceramic · Terracotta · Hanging · Decorative · Self-Watering
```

Seeds:

```text
All · Flower · Vegetable · Herb · Fruit
```

---

# 26. Icon Tokens

Use a consistent minimal line-icon style.

```css
--icon-xs: 14px;
--icon-sm: 16px;
--icon-md: 20px;
--icon-lg: 24px;
--icon-xl: 32px;
```

Recommended stroke:

```css
--icon-stroke: 1.5px;
```

Avoid mixing filled and outlined icon styles without a reason.

---

# 27. Wishlist Icon

Default:

- Botanical dark-green outline
- Small circular touch target

Hover:

- Scale 1.05
- Color transition

Active:

- Filled/strong green state

Keep animation subtle.

---

# 28. Rating Tokens

```css
--rating-star: #D89427;
--rating-text: var(--color-text-secondary);
```

Star size:

```css
--rating-icon-size: 12px;
```

Rating layout:

```text
★ 4.8 (124)
```

Do not make ratings visually stronger than product name or price.

---

# 29. Price Tokens

```css
--price-color: var(--color-brand-deep);
--price-size: 1.05rem;
--price-weight: 600;
```

Original price:

```css
--price-old-color: var(--color-text-muted);
--price-old-decoration: line-through;
```

---

# 30. Badge Tokens

Example:

```text
Bestseller
New
Low Stock
```

```css
--badge-height: 24px;
--badge-radius: 999px;
--badge-padding-x: 9px;
--badge-font-size: 0.6875rem;
--badge-weight: 600;
```

Bestseller:

```css
--badge-bestseller-bg: var(--color-brand-green);
--badge-bestseller-text: #FFFFFF;
```

---

# 31. Category Banner Tokens

```css
--category-banner-radius: var(--radius-lg);
--category-banner-padding: 32px;
```

Plants banner:

- Forest green dominant

Pots banner:

- Warm beige / terracotta direction

Seeds banner:

- Soft sage direction

Use photography to carry most of the visual weight.

---

# 32. Hero Tokens

```css
--hero-min-height-desktop: 560px;
--hero-min-height-tablet: 480px;
--hero-min-height-mobile: 560px;

--hero-radius: var(--radius-lg);
--hero-padding-desktop: 64px;
--hero-padding-mobile: 28px;
```

Hero should not feel like a full-screen tech landing page.

It should feel like a premium editorial commerce hero.

---

# 33. Header Tokens

```css
--header-height-desktop: 72px;
--header-height-mobile: 64px;
--header-bg: rgba(251, 249, 244, 0.92);
--header-border: var(--border-color-light);
```

If backdrop blur is used, keep it subtle.

Do not turn the entire header into a heavy glassmorphism effect.

---

# 34. Footer Tokens

```css
--footer-bg: var(--color-cream-soft);
--footer-border: var(--border-color-light);
--footer-padding-desktop: 48px;
--footer-padding-mobile: 32px;
```

Footer should feel calm and editorial.

---

# 35. AI / Flora AI Tokens

Flora AI is customer-facing only.

Do not create Admin AI UI.

## AI colors

```css
:root {
  --ai-primary: var(--color-brand-forest);
  --ai-surface: #EEF4EA;
  --ai-user-surface: #F4F0E6;
  --ai-border: #D7E1D3;
}
```

## AI bubble

```css
--ai-button-size: 56px;
--ai-button-size-mobile: 52px;
--ai-radius: 999px;
```

## AI panel

```css
--ai-panel-width: 420px;
--ai-panel-radius: 20px;
```

Mobile:

```css
--ai-panel-width: 100%;
```

AI UI should feel like Flora Fusion, not like a generic chatbot.

---

# 36. AI Entry Points

Use these labels:

```text
Flora AI
Find Your Perfect Plant
Ask Flora
```

Do not use technical labels such as:

```text
AI Engine
AI Model
LLM
RAG
```

in the customer-facing interface.

---

# 37. Navigation Tokens

Desktop:

```css
--nav-gap: 24px;
--nav-font-size: 0.875rem;
--nav-weight: 500;
```

Mobile:

Use compact navigation with:

```text
Home
Search
Flora AI
Wishlist
Cart
```

---

# 38. Bottom Navigation Tokens

```css
--bottom-nav-height: 68px;
--bottom-nav-bg: rgba(255, 255, 255, 0.96);
--bottom-nav-border: var(--border-color-light);
```

Use only on mobile.

---

# 39. Modal / Drawer Tokens

```css
--modal-radius: var(--radius-xl);
--modal-padding: 24px;
--modal-shadow: var(--shadow-lg);

--drawer-width: 440px;
```

Mobile:

```css
--drawer-width: 100%;
```

Use smooth GSAP transitions.

---

# 40. Z-Index Tokens

```css
:root {
  --z-base: 0;
  --z-header: 100;
  --z-dropdown: 200;
  --z-sticky: 300;
  --z-drawer: 500;
  --z-modal: 600;
  --z-ai: 700;
  --z-toast: 800;
}
```

Avoid arbitrary z-index values throughout the application.

---

# 41. Motion Tokens

## Base easing

```css
--ease-standard: cubic-bezier(0.22, 1, 0.36, 1);
--ease-soft: cubic-bezier(0.16, 1, 0.3, 1);
```

Use GSAP easing equivalents where appropriate.

---

# 42. Animation Durations

```css
--duration-instant: 120ms;
--duration-fast: 200ms;
--duration-normal: 350ms;
--duration-slow: 600ms;
--duration-reveal: 800ms;
--duration-hero: 1100ms;
```

Guideline:

```text
Micro interaction → 150–250ms
Card hover → 250–400ms
Panel → 350–500ms
Section reveal → 500–800ms
Hero → 700–1200ms
Ambient motion → 3–8s
```

---

# 43. GSAP Motion Tokens

GSAP is the primary animation engine.

Use:

```js
gsap.to()
gsap.from()
gsap.fromTo()
gsap.timeline()
gsap.context()
```

for component-level animations.

Prefer transform and opacity.

Avoid unnecessary layout animation.

---

# 44. Hero GSAP Tokens

Recommended sequence:

```text
Header
↓
Hero image
↓
Eyebrow
↓
Heading
↓
Description
↓
CTA
↓
Decorative botanical objects
```

Recommended stagger:

```js
stagger: 0.08
```

Keep the entire hero entrance elegant and restrained.

---

# 45. Scroll Reveal Tokens

Default reveal:

```text
opacity: 0 → 1
y: 24px → 0
```

Recommended duration:

```text
0.6–0.8 seconds
```

Use staggered product cards.

Do not animate every child individually if it harms performance.

---

# 46. Floating Botanical Tokens

Ambient floating objects can use:

```text
translateY
rotate
rotateX
rotateY
```

Recommended duration:

```text
3–8 seconds
```

Use different delays so objects do not move identically.

Example concept:

```text
Leaf A → slow vertical float
Leaf B → subtle rotation
Pot decoration → tiny depth movement
```

No aggressive spinning.

---

# 47. 3D Transform Tokens

```css
--perspective-standard: 1200px;
--perspective-deep: 1600px;

--rotate-subtle: 2deg;
--rotate-medium: 5deg;
```

Keep 3D movement subtle.

Use CSS 3D transforms + GSAP.

Do not add a heavy WebGL/3D engine unless explicitly required.

---

# 48. Lenis Tokens

Lenis is the smooth scrolling system.

Target behavior:

```text
Smooth
Natural
Premium
Lightweight
```

Recommended conceptual configuration:

```js
{
  duration: 1.1,
  smoothWheel: true
}
```

The exact configuration may be tuned during implementation.

Integrate Lenis with GSAP's ticker where appropriate.

Do not create scroll-jacking.

---

# 49. Reduced Motion Tokens

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

When enabled:

```text
Disable parallax
Disable continuous floating
Reduce transforms
Reduce stagger
Reduce long transitions
Preserve usability
```

Simple opacity transitions are acceptable.

---

# 50. Responsive Breakpoints

Use practical layout breakpoints:

```css
--breakpoint-mobile: 480px;
--breakpoint-tablet: 768px;
--breakpoint-laptop: 1024px;
--breakpoint-desktop: 1280px;
--breakpoint-wide: 1440px;
```

Do not design around dozens of breakpoints.

---

# 51. Mobile Spacing Tokens

```css
--mobile-page-padding: 16px;
--mobile-card-gap: 10px;
--mobile-section-gap: 32px;
--mobile-header-gap: 12px;
```

Mobile should feel spacious without wasting vertical space.

---

# 52. Tablet Spacing Tokens

```css
--tablet-page-padding: 24px;
--tablet-card-gap: 14px;
--tablet-section-gap: 48px;
```

---

# 53. Desktop Spacing Tokens

```css
--desktop-page-padding: 32px;
--desktop-card-gap: 16px;
--desktop-section-gap: 80px;
```

---

# 54. Image Treatment

All product imagery should have:

- Consistent lighting
- Warm neutral background
- Soft natural shadows
- Similar framing
- Similar scale
- Clean composition

Plants:

```text
Premium nursery photography
```

Pots:

```text
Minimal product photography
```

Seeds:

```text
Clean packet-focused photography
```

Do not mix unrelated visual styles.

---

# 55. Surface Hierarchy

Use this hierarchy:

```text
Page
→ Cream

Section
→ Cream Soft

Card
→ White

Interactive surface
→ White / Sage

Active surface
→ Forest Green

Promotional surface
→ Beige / Category Accent
```

---

# 56. Accessibility Tokens

Focus:

```css
--focus-color: var(--color-brand-green);
--focus-width: 2px;
--focus-offset: 3px;
```

Ensure:

- Keyboard focus is visible
- Buttons have adequate touch targets
- Text contrast is sufficient
- Images have alt text
- Motion respects reduced-motion preferences

---

# 57. Touch Target Tokens

Minimum recommended interactive target:

```css
--touch-target-min: 44px;
```

Important for:

- Wishlist
- Cart
- Search
- Mobile navigation
- Filter chips
- Quantity controls

---

# 58. Loading Tokens

Skeleton surfaces:

```css
--skeleton-base: #E9E7DE;
--skeleton-highlight: #F4F2EA;
```

Loading animation should be subtle.

Do not use flashy loaders.

---

# 59. Toast Tokens

```css
--toast-bg: var(--color-brand-deep);
--toast-text: #FFFFFF;
--toast-radius: var(--radius-md);
--toast-padding: 12px 16px;
```

Use for:

- Added to cart
- Added to wishlist
- Removed from cart
- Order confirmation

---

# 60. Product Metadata Tokens

Plant metadata:

```text
Indoor
Outdoor
Low Water
Medium Water
High Light
Low Light
```

Pot metadata:

```text
Ceramic
Terracotta
Plastic
Metal
Bamboo
Marble
```

Seed metadata:

```text
Flower
Vegetable
Herb
Fruit
Easy
Medium
```

Use small icons + muted text.

---

# 61. Category-Specific Typography

Category title:

```css
font-family: var(--font-display);
font-weight: 500;
```

Category supporting text:

```css
font-family: var(--font-body);
color: var(--color-text-secondary);
```

---

# 62. Logo Tokens

Logo should use:

```text
Flora Fusion
```

with botanical leaf mark.

Desktop logo:

```css
--logo-width-desktop: 150px;
```

Mobile:

```css
--logo-width-mobile: 120px;
```

Do not distort the logo.

---

# 63. Iconography Direction

Icon style:

- Minimal
- Botanical
- Thin line
- Rounded stroke ends
- Consistent visual weight

Use icons for:

- Search
- Account
- Wishlist
- Cart
- Plant care
- Delivery
- Payment
- AI
- Category
- Filter
- Sort

---

# 64. Commerce UI Hierarchy

Visual priority:

```text
Product image
↓
Product name
↓
Price
↓
Rating
↓
Primary action
↓
Secondary metadata
```

The price must remain easy to scan.

---

# 65. Homepage Hierarchy

Visual priority:

```text
Hero
↓
Primary CTA
↓
Trust strip
↓
Categories
↓
Featured products
↓
AI assistant
↓
Plant care / educational content
↓
Footer
```

Keep the homepage focused.

---

# 66. AI Recommendation Cards

When Flora AI recommends a product, use the same product-card tokens.

Do not create a separate unrelated card design.

Recommended card content:

```text
Product image
Product name
Why it matches
Price
View Product
```

Example:

> Great for low-light rooms and beginner plant owners.

This explanation should be based on actual product information.

---

# 67. Empty States

Tone should remain friendly and botanical.

Examples:

Wishlist:

> Your green wishlist is waiting.

Cart:

> Your cart is ready for something green.

Search:

> We couldn't find that plant yet.

Avoid technical error messages in normal customer UI.

---

# 68. Error State

Customer-facing errors should be:

- Clear
- Short
- Actionable
- Calm

Example:

> Something went wrong. Please try again.

CTA:

> Try Again

---

# 69. Success State

Examples:

```text
Added to your green space
Order placed successfully
Saved to wishlist
```

Keep success messaging concise.

---

# 70. Token Naming Convention

Use semantic naming.

Good:

```css
--color-brand-forest
--color-surface-soft
--text-body
--space-6
--radius-md
--shadow-sm
--duration-normal
```

Avoid:

```css
--green1
--boxThing
--randomPadding
--newGreenFinal2
```

---

# 71. CSS Architecture

Recommended structure:

```text
styles/
├── tokens.css
├── reset.css
├── typography.css
├── layout.css
├── components.css
├── products.css
├── responsive.css
└── animations.css
```

All global design values should originate from the token layer.

---

# 72. Token Usage Rule

Do not hardcode repeated visual values.

Instead of:

```css
color: #173F2B;
```

prefer:

```css
color: var(--color-brand-forest);
```

Instead of:

```css
border-radius: 12px;
```

prefer:

```css
border-radius: var(--radius-md);
```

Instead of:

```css
transition: 350ms;
```

prefer:

```css
transition-duration: var(--duration-normal);
```

---

# 73. Design Token Summary

## Core

```text
Brand:
Forest Green

Background:
Warm Cream

Secondary:
Sage + Beige

Typography:
Editorial Serif + Modern Sans

Corners:
Soft, controlled

Shadows:
Very subtle

Photography:
Warm neutral botanical product photography

Animation:
GSAP

Scrolling:
Lenis

3D:
Subtle CSS 3D + GSAP

Product categories:
Plants · Pots · Seeds

Customer AI:
Flora AI
```

---

# 74. Final Visual Rule

The design tokens must support the supplied Flora Fusion references.

The final UI should consistently communicate:

> **Nature Meets Your Space**

The design should feel like a premium real-world nursery e-commerce brand.

It should never feel like:

- A generic template
- A CRUD application
- A SaaS dashboard
- A futuristic AI experiment
- A gaming website
- An over-animated portfolio

The token system exists to make every Flora Fusion screen visually consistent across:

```text
Desktop
Tablet
Mobile
Catalog
Product Details
Cart
Checkout
Wishlist
Flora AI
Plant Care
Order Tracking
```

**Flora Fusion = Botanical + Premium + Calm + Commerce + Helpful AI.**
