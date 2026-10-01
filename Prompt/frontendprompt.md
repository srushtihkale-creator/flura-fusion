
# Flora Fusion — frontendprompt.md

## Purpose

Build Flora Fusion as a premium, production-oriented botanical e-commerce frontend. The frontend is built phase-by-phase and validated locally after every phase before production deployment.

Product categories:
- Plants
- Pots
- Seeds

Future architecture:
Next.js + React + TypeScript → typed services/API client → Spring Boot REST API → PostgreSQL, with CMS/CRM integration and customer-facing Flora AI.

The current frontend may use local typed mock data, but mock data must never be tightly coupled to reusable UI. Future CMS/API/CRM integration must be possible without a major presentation-layer rewrite.

---

# 1. SOURCE OF TRUTH — MANDATORY

Before coding, inspect the repository and all existing project documentation.

Priority:

1. **Flora Fusion Design Tokens** — visual source of truth
2. **Existing HTML prototype** — visual/UX baseline and approved assets
3. **motion.md** — motion and animation rules
4. **ecommerce.md** — engineering, architecture, commerce and production rules
5. Existing `technical.md`, `progress.md`, `progress technical.md`, `DOCS/`, README and related project documentation

Do not invent a competing design system.

Do not randomly redesign the approved prototype.

Do not overwrite or contradict existing project decisions without first inspecting them.

---

# 2. BRAND DIRECTION

Flora Fusion must feel:

- Natural
- Premium
- Calm
- Modern
- Botanical
- Warm
- Minimal
- Trustworthy

Core visual idea:

> **Nature Meets Your Space**

Avoid:

- Generic templates
- CRUD-app appearance
- SaaS-dashboard styling
- Generic AI styling
- Futuristic/cyber aesthetics
- Neon colors
- Excessive gradients
- Excessive glassmorphism
- Excessive rounded UI
- Heavy 3D
- Excessive animation
- Random photography styles
- Generic Bootstrap/MUI appearance

---

# 3. EXACT BRAND ASSETS

Use the exact Flora Fusion logo asset already present in the project.

Do NOT:
- Recreate it
- Redraw it
- Approximate it
- Replace it
- Generate another logo
- Distort it
- Recolor it unnecessarily

Inspect and reuse approved assets from `assets/`.

Images are assets, not design tokens.

Preserve approved:
- Plant images
- Pot images
- Seed images
- Hero images
- Decorative images
- Footer images
- Circular footer badge images

Do not randomly replace approved assets.

---

# 4. TECHNOLOGY STACK

## Frontend
- Next.js
- React
- TypeScript

## Styling
- CSS Modules / structured CSS
- Flora Fusion design tokens
- Do NOT introduce Tailwind as the primary styling system
- Do NOT introduce MUI/shadcn as the primary UI system

## Animation
- GSAP
- GSAP ScrollTrigger
- Lenis

## Icons
- Lucide React or the existing project icon system

## Forms / validation
- React Hook Form
- Zod where appropriate

## Client state
Prefer:
- React state for local UI state
- Zustand only where shared client state genuinely requires it

Do not introduce Redux without a real requirement.

## Testing
Prepare for:
- Vitest
- React Testing Library
- Playwright

Reuse existing configuration if already present.

---

# 5. MOST IMPORTANT — FUTURE CMS/API/CRM READINESS

Current frontend phases may use local mock content.

However:

**Never hardcode business/content data directly inside reusable UI components.**

Bad:

```tsx
<ProductCard
  name="Snake Plant"
  price="₹499"
  image="/plant.jpg"
/>
```

repeated across pages.

Also avoid putting complete product/content datasets directly inside page components.

Use:

```text
Page
 ↓
Feature Component
 ↓
Hook / Query
 ↓
Service Layer
 ↓
Repository / Data Source
 ↓
Local Mock Data
```

Later:

```text
Page
 ↓
Feature Component
 ↓
Hook / Query
 ↓
Service Layer
 ↓
REST API
 ↓
Spring Boot
 ↓
PostgreSQL / CMS / CRM
```

The presentation layer must not care whether content comes from mock data, REST API, CMS or CRM.

---

# 6. CMS-READY CONTENT

Marketing content that may later be controlled by CMS must be separated from layout.

Prepare boundaries for:

- Homepage hero
- Hero description
- CTA labels
- Promotional banners
- Category descriptions
- Featured sections
- Plant care articles
- Promotions
- Footer content
- SEO metadata

Example:

```ts
type HeroContent = {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  image: string;
  imageAlt: string;
};
```

The page should consume content through a service/data boundary rather than embedding all content directly into JSX.

Do NOT build the full CMS now. Make the frontend CMS-ready.

---

# 7. PRODUCT DATA ARCHITECTURE

Use typed product models.

```ts
type ProductCategory = "plants" | "pots" | "seeds";
```

Prepare products for:

```text
Product
├── id
├── slug
├── name
├── category
├── description
├── price
├── compareAtPrice
├── images
├── thumbnail
├── rating
├── reviewCount
├── availability
├── badges
├── metadata
├── attributes
├── careInformation
└── relatedProducts
```

Future backend may additionally provide:

- SKU
- Inventory
- Variants
- Stock status
- Discounts
- Tax
- Shipping information
- Reviews
- CMS content
- SEO metadata

Keep the model extensible.

---

# 8. BUSINESS LOGIC BOUNDARY

Frontend owns:

- Presentation
- Interaction
- Navigation
- UI state
- Client validation
- Safe optimistic UX
- Loading/error/empty presentation

Future backend owns authoritative:

- Pricing
- Inventory
- Order creation
- Payment verification
- Authorization
- Coupon validation
- Refund logic
- Shipping rules
- Tax rules
- Transactional integrity

Never duplicate authoritative business logic permanently in frontend.

---

# 9. ROUTES

Build progressively toward:

```text
/
├── /plants
├── /pots
├── /seeds
├── /product/[slug]
├── /search
├── /wishlist
├── /cart
├── /checkout
├── /account
├── /account/orders
├── /account/orders/[id]
├── /plant-care
└── /flora-ai
```

Do not implement all routes in the first phase.

---

# 10. GLOBAL STRUCTURE

```text
Flora Fusion
│
├── Global Layout
│   ├── Header
│   ├── Navigation
│   ├── Search
│   ├── Flora AI
│   ├── Toast
│   └── Footer
│
├── Home
├── Catalog
│   ├── Plants
│   ├── Pots
│   └── Seeds
├── Product
│   └── Product Details
├── Discovery
│   └── Search
├── Shopping
│   ├── Wishlist
│   ├── Cart
│   └── Checkout
├── Customer
│   ├── Account
│   ├── Orders
│   └── Order Tracking
├── Content
│   └── Plant Care
└── Flora AI
```

---

# 11. COMPONENT ARCHITECTURE

Create reusable components only where real reuse exists.

Suggested structure:

```text
components/
├── layout/
├── navigation/
├── ui/
├── product/
├── catalog/
├── cart/
├── wishlist/
├── checkout/
├── account/
├── flora-ai/
├── content/
└── feedback/
```

Useful domain components:

```text
ProductCard
ProductGrid
ProductGallery
ProductPrice
ProductRating
ProductBadge
CategoryBanner
FilterChips
SearchBar
CartDrawer
WishlistButton
QuantitySelector
Toast
EmptyState
LoadingState
ErrorState
FloraAIButton
FloraAIPanel
```

Do not create hundreds of tiny abstractions.

---

# 12. DESIGN TOKEN IMPLEMENTATION

The supplied Flora Fusion Design Tokens file is authoritative.

All global visual values must originate from the token layer.

Use semantic names such as:

```css
--color-brand-forest
--color-brand-green
--color-brand-deep
--color-brand-sage
--color-brand-sage-light

--color-cream
--color-cream-soft
--color-beige
--color-sand
--color-white

--color-text-primary
--color-text-secondary
--color-text-muted

--color-border
--color-border-light

--radius-sm
--radius-md
--radius-lg

--duration-fast
--duration-normal
--duration-slow
```

Never invent random names such as:

```css
--green1
--newGreen
--randomPadding
--finalRadius
```

Prefer:

```css
color: var(--color-brand-forest);
```

instead of repeated hardcoded values.

Use exact values from the supplied Design Tokens file.

---

# 13. RESPONSIVE DESIGN

Validate every phase at:

Desktop:
- 1440+
- 1280
- 1024

Tablet:
- 768

Mobile:
- 480
- 390
- 360

Ensure:

- No horizontal overflow
- Correct typography scaling
- Correct product grids
- Correct image ratios
- Correct touch targets
- Mobile navigation
- Mobile drawers
- Mobile AI panel
- Usable checkout

Minimum touch target: **44px**

---

# 14. PRODUCT CATALOG

Exactly three primary categories:

```text
Plants
Pots
Seeds
```

### Plants filters

```text
All
Indoor
Outdoor
Flowering
Air Purifying
Succulents
```

### Pots filters

```text
All
Ceramic
Terracotta
Hanging
Decorative
Self-Watering
```

### Seeds filters

```text
All
Flower
Vegetable
Herb
Fruit
```

Do not invent additional primary product categories.

---

# 15. PRODUCT CARD

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

Reuse the same product-card system across:

- Homepage
- Catalog
- Related products
- Recommended products
- Flora AI recommendations

Do not create an unrelated AI product-card style.

---

# 16. HOMEPAGE

Hierarchy:

```text
Hero
↓
Primary CTA
↓
Trust Strip
↓
Categories
↓
Featured Products
↓
Flora AI
↓
Plant Care / Educational Content
↓
Footer
```

Use the existing prototype as the visual baseline.

Do not randomly redesign it.

---

# 17. HERO / BANNER / DECORATIVE IMAGES

Use approved Flora Fusion references/assets.

References are for:
- Visual direction
- Composition
- Image treatment
- Mood
- Editorial commerce feel

Do NOT copy another brand's:
- Identity
- Logo
- Products
- Categories
- Content
- Brand styling

Preserve Flora Fusion identity.

---

# 18. HEADER / NAVIGATION

Follow the Design Tokens.

Desktop navigation concepts:

```text
Home
Plants
Pots
Seeds
Search
Flora AI
Wishlist
Cart
```

Mobile navigation must follow the token specification.

---

# 19. FOOTER

Preserve the approved Flora Fusion footer.

Do not randomly add:
- Newsletter
- Extra navigation columns
- Unapproved product columns
- Social columns
- Customer-service columns

Approved ending includes:

- Copyright
- Terms
- Shipping Policy
- Privacy Policy
- Circular badge strip

Use exact approved assets.

---

# 20. CIRCULAR FOOTER BADGE STRIP

Preserve existing behavior.

Requirements:

- Full-width
- Repeating circular image badges
- Responsive
- No horizontal overflow
- Exact provided assets

Each circle rotates individually around its own center.

Do NOT rotate the entire row as one object.

Use GSAP.

Respect `prefers-reduced-motion`.

---

# 21. MOTION SYSTEM

Use:

- GSAP
- GSAP ScrollTrigger
- Lenis

Motion must be:

- Premium
- Restrained
- Smooth
- Purposeful
- Brand-aligned

Avoid:

- Animation everywhere
- Excessive parallax
- Constant movement
- Huge timelines
- Excessive stagger
- Slow blocking animations
- Animating every card unnecessarily

Prefer transform/opacity animation.

Do not use React state as a replacement for GSAP.

Browser-only animation APIs must be handled correctly in Next.js.

Do not initialize GSAP/Lenis during SSR.

Clean up GSAP contexts and ScrollTriggers.

---

# 22. REDUCED MOTION

Respect:

```css
prefers-reduced-motion
```

When enabled:

- Disable unnecessary parallax
- Reduce transforms
- Reduce stagger
- Reduce long transitions
- Disable unnecessary floating decoration

Functionality must remain usable.

---

# 23. FLORA AI

Flora AI is **customer-facing only**.

Do NOT add AI UI to:

- Admin
- Product management
- Analytics
- Order management

Customer labels:

```text
Flora AI
Find Your Perfect Plant
Ask Flora
```

Do NOT expose:

```text
AI Engine
AI Model
LLM
RAG
```

During frontend development, Flora AI may use mock responses/data.

The UI must later be able to connect to the backend AI service.

AI recommendations reuse normal product-card tokens.

Flora AI must not invent:

- Products
- Prices
- Inventory
- Discounts
- Delivery promises
- Policies

---

# 24. UI STATE ARCHITECTURE

Important asynchronous UI must support:

```text
Idle
Loading
Success
Empty
Error
```

Examples:

```text
Product loading
Search loading
Cart updating
Wishlist updating
Checkout submitting
Account loading
Order loading
Flora AI responding
```

Do not assume every operation succeeds.

---

# 25. EMPTY / ERROR STATES

Approved empty states:

Wishlist:
> Your green wishlist is waiting.

Cart:
> Your cart is ready for something green.

Search:
> We couldn't find that plant yet.

Approved error:

> Something went wrong. Please try again.

CTA:

> Try Again

Customer-facing errors should be clear, short, actionable and calm.

---

# 26. FUTURE API CONTRACT READINESS

Create a clean service boundary.

Example:

```text
services/
├── product.service.ts
├── category.service.ts
├── search.service.ts
├── cart.service.ts
├── wishlist.service.ts
├── order.service.ts
└── flora-ai.service.ts
```

Current:

```text
service → mock repository
```

Future:

```text
service → HTTP client → Spring Boot API
```

Do not make UI components directly responsible for HTTP calls.

Do not scatter `fetch()` throughout UI components.

---

# 27. CMS READINESS

Marketing/content sections must be replaceable by CMS data later.

Prepare boundaries for:

```text
Hero
Banner
Category content
Featured sections
Plant care articles
Promotions
Footer content
SEO metadata
```

Do not build the full CMS now.

---

# 28. CRM READINESS

Customer UI should be able to consume future CRM/backend data:

```text
Customer
Profile
Addresses
Wishlist
Orders
Order history
Preferences
Support interactions
```

Do not implement CRM now.

Prepare clean domain boundaries.

---

# 29. AUTHENTICATION READINESS

Do not implement complete backend authentication unless explicitly requested.

Prepare architecture for:

```text
User
Session
Role
Permissions
Customer profile
```

Do not permanently assume every user is anonymous.

---

# 30. SEO / METADATA

Use Next.js metadata architecture.

Prepare for:

- Page titles
- Descriptions
- Product metadata
- Category metadata
- Open Graph
- Canonical URLs
- Structured data where appropriate

Keep metadata data-driven so CMS/API can later supply it.

---

# 31. ACCESSIBILITY

Every phase must consider:

- Semantic HTML
- Keyboard navigation
- Visible focus
- Proper labels
- Alt text
- Accessible buttons
- Accessible dialogs
- Accessible drawers
- Screen-reader-friendly states
- Contrast
- 44px minimum touch targets
- Reduced motion

Do not sacrifice accessibility for visual effects.

---

# 32. PERFORMANCE

Optimize for:

- Next.js rendering strategy
- Image optimization
- Lazy loading where appropriate
- Code splitting
- Minimal client components
- Minimal unnecessary hydration
- Transform/opacity animation
- Efficient GSAP
- Avoiding large unnecessary dependencies

Do not make the whole application a client component unnecessarily.

---

# 33. CLIENT/SERVER BOUNDARY

Use `"use client"` only where necessary.

Typical client components:

- Interactive navigation
- Cart interactions
- Wishlist interactions
- Filters
- Search interaction
- Flora AI panel
- GSAP/Lenis animation components
- Interactive forms

Do not add `"use client"` to an entire page just because one child is interactive.

---

# 34. PHASE-BY-PHASE IMPLEMENTATION

Do NOT implement the entire application in one execution.

## PHASE 0 — REPOSITORY AUDIT

Before coding inspect:

- Existing files
- Prototype
- Assets
- Design tokens
- Motion specification
- Ecommerce specification
- package.json
- Next.js configuration
- Existing styles
- Existing routes
- Existing components
- Existing documentation
- Existing dependencies

Determine:

- What can be reused
- What should be migrated
- What should be replaced
- What should remain unchanged
- Current architecture
- Missing foundation

Do not mass-code.

Finish with an implementation plan.

**STOP after the audit and report findings. Wait for the next phase instruction.**

---

## PHASE 1 — FRONTEND FOUNDATION

Implement:

- Next.js foundation
- TypeScript
- Design token integration
- Global CSS architecture
- Typography
- Layout primitives
- Responsive foundation
- Image strategy
- Font setup
- Base accessibility
- GSAP setup
- Lenis setup
- Motion utility architecture

Suggested style structure:

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

Adapt to the existing repository if necessary.

Validate locally.

**STOP after Phase 1.**

---

## PHASE 2 — GLOBAL LAYOUT

Implement:

- Root layout
- Header
- Desktop navigation
- Mobile navigation
- Search entry
- Wishlist entry
- Cart entry
- Flora AI entry
- Footer
- Toast system
- Loading state
- Error state
- Empty state foundation

Validate desktop, tablet, mobile, keyboard navigation and overflow.

**STOP after Phase 2.**

---

## PHASE 3 — HOMEPAGE

Implement:

- Hero
- CTA
- Trust strip
- Categories
- Featured products
- Flora AI section
- Plant care / educational section
- Footer

Use prototype as visual baseline.

Use design tokens exactly.

Use mock data through service/data layer.

**STOP after local validation.**

---

## PHASE 4 — CATALOG / LISTING

Implement:

```text
/plants
/pots
/seeds
```

Include:

- Category banner
- Category-specific filters
- Search/filter interaction
- Sorting
- Product grid
- Product cards
- Wishlist interaction
- Loading
- Empty
- Error
- Responsive behavior

Use typed product data.

**STOP after validation.**

---

## PHASE 5 — PRODUCT DETAILS

Implement:

```text
/product/[slug]
```

Include:

- Product gallery
- Product name
- Price
- Rating
- Reviews
- Availability
- Metadata
- Description
- Care information
- Quantity
- Add to cart
- Buy now
- Wishlist
- Delivery information placeholder
- Related products
- Recommended products
- Flora AI entry

Keep backend-dependent business logic out of frontend.

**STOP after validation.**

---

## PHASE 6 — SEARCH / DISCOVERY

Implement:

```text
/search
```

Include:

- Search input
- Search results
- Filters
- Empty state
- Recent/search interaction where appropriate
- Product results
- Responsive behavior

Keep search service separate so future backend search can replace mock search.

**STOP after validation.**

---

## PHASE 7 — WISHLIST + CART

Implement:

```text
/wishlist
/cart
```

Include:

- Add/remove
- Quantity
- Product summary
- Empty states
- Loading
- Error
- Toast feedback
- Cart drawer if appropriate
- Responsive behavior

Prevent duplicate actions while requests process.

Current state may be local.

Future state must be replaceable by authenticated backend data.

**STOP after validation.**

---

## PHASE 8 — CHECKOUT UX

Implement:

- Address
- Delivery information
- Order summary
- Coupon UI placeholder
- Payment UI placeholder
- Validation
- Loading
- Error
- Success

Do NOT implement actual payment processing.

Do NOT make frontend authoritative for:

- Final price
- Tax
- Shipping
- Coupon validity
- Payment verification

These belong to the future backend.

**STOP after validation.**

---

## PHASE 9 — ACCOUNT / ORDERS

Implement:

```text
/account
/account/orders
/account/orders/[id]
```

Include:

- Profile
- Addresses
- Orders
- Order details
- Order status
- Empty states
- Loading
- Error

Keep it API-ready.

**STOP after validation.**

---

## PHASE 10 — PLANT CARE

Implement:

```text
/plant-care
```

Content must be structured so future CMS can provide it.

Prepare for:

- Article listing
- Article details
- Categories
- Search/filter if required later

**STOP after validation.**

---

## PHASE 11 — FLORA AI

Implement customer-facing Flora AI:

- Floating AI button
- AI panel
- Conversation UI
- Product recommendation cards
- Loading state
- Empty state
- Error state
- Responsive mobile panel

Current implementation may use mock responses.

Create a service boundary for future AI backend integration.

Do not implement admin AI.

**STOP after validation.**

---

## PHASE 12 — FULL RESPONSIVE + ACCESSIBILITY QA

Test complete frontend on desktop, tablet and mobile.

Check:

- Overflow
- Typography
- Spacing
- Navigation
- Product grids
- Drawers
- Modals
- Cart
- Checkout
- AI
- Footer
- Images
- Keyboard
- Focus
- Reduced motion

Fix critical issues before proceeding.

---

## PHASE 13 — PERFORMANCE + SEO

Validate:

- Image loading
- Rendering
- Hydration
- Client/server boundaries
- Metadata
- Accessibility
- Motion performance
- Bundle impact
- Unnecessary client components

Do not add unnecessary optimization complexity.

---

## PHASE 14 — TESTING

Prepare and implement:

### Unit tests
- Utilities
- Validation
- Calculations

### Component tests
- Product card
- Cart
- Filters
- Forms

### Integration tests
- Search
- Cart
- Checkout UX

### E2E tests
- Browse
- Search
- Add to cart
- Checkout
- Account
- Order journey

Do not test only happy paths.

---

## PHASE 15 — PRODUCTION READINESS

Before production deployment:

```bash
npm ci
npx tsc --noEmit
npm run lint
npm run build
```

Also verify:

- No console errors
- No hydration errors
- No broken images
- No broken links
- No horizontal overflow
- Responsive behavior
- Accessibility
- Reduced motion
- Loading/error/empty states
- Correct asset paths
- Correct metadata
- Correct production environment handling

Only after all checks pass should production deployment be considered.

---

# 35. LOCAL-FIRST DEVELOPMENT RULE

Every phase follows:

```text
Implement
↓
Run locally
↓
Visual inspection
↓
Desktop check
↓
Tablet check
↓
Mobile check
↓
Functional check
↓
Accessibility check
↓
Console check
↓
TypeScript
↓
Lint
↓
Build
↓
Git commit
↓
Next phase
```

Do not move to the next phase with known critical issues.

---

# 36. GIT WORKFLOW

Do not work directly on `main`.

Use:

```text
feature branch
↓
local validation
↓
commit
↓
review
↓
merge
```

Meaningful commit examples:

```text
feat(frontend): establish design system foundation
feat(home): implement Flora Fusion homepage
feat(catalog): add product listing experience
feat(product): add product detail page
feat(cart): implement cart experience
fix(mobile): resolve catalog overflow
```

Avoid meaningless commits:

```text
update
changes
final
test
done
```

---

# 37. DOCUMENTATION / PROGRESS

Maintain project documentation only when architecture or major implementation decisions change.

Record:

- Completed phase
- Current phase
- Important decisions
- Known issues
- Next phase
- Validation status

Do not create unnecessary documentation files.

---

# 38. DO NOT OVERENGINEER

Do NOT introduce:

- Microservices
- Redux without need
- Heavy UI frameworks
- Unnecessary state libraries
- Unnecessary AI frameworks
- WebGL
- Three.js without explicit requirement
- Full CMS implementation now
- Full CRM implementation now
- Backend implementation during frontend phases
- Unnecessary abstractions
- Duplicate design systems

Goal:

**Simple + scalable + maintainable + production-ready.**

---

# 39. CRITICAL RULES — NEVER VIOLATE

1. Design Tokens are the visual source of truth.
2. Existing prototype is the visual/UX baseline.
3. Motion specification controls animation behavior.
4. Ecommerce specification controls engineering architecture.
5. Use exact Flora Fusion logo/assets.
6. Do not randomly redesign the approved visual identity.
7. Product categories are Plants, Pots and Seeds.
8. Current content may be mock/local data.
9. Mock data must NOT be tightly coupled to UI components.
10. Build typed models and service boundaries from day one.
11. Future CMS must replace marketing content without page rewrites.
12. Future CRM/backend must replace customer data without UI rewrites.
13. Future Spring Boot API must replace mock services without changing presentation architecture.
14. Backend-authoritative business logic must not be duplicated permanently in frontend.
15. Flora AI is customer-facing only.
16. Use GSAP + ScrollTrigger + Lenis according to motion rules.
17. Respect reduced motion.
18. Mobile is a first-class experience.
19. Validate every phase locally.
20. Do not implement all phases in one execution.
21. Do not skip repository audit.
22. Do not deploy to production before full validation.
23. Do not modify unrelated files.
24. Do not create unnecessary abstractions.
25. Do not sacrifice visual quality for implementation speed.
26. Do not sacrifice architecture for quick hardcoded UI.
27. Do not sacrifice performance for animation.
28. Do not sacrifice accessibility for visual effects.

---

# 40. FINAL ARCHITECTURAL TARGET

Current:

```text
Next.js
   ↓
Feature Components
   ↓
Hooks / State
   ↓
Typed Services
   ↓
Mock Repository
```

Future:

```text
Next.js
   ↓
Feature Components
   ↓
Hooks / State
   ↓
Typed Services
   ↓
API Client
   ↓
Spring Boot REST API
   ↓
PostgreSQL
```

CMS content enters through the appropriate backend/CMS boundary.

CRM/customer data enters through the backend/domain boundary.

Future Flora AI:

```text
Next.js
   ↓
Flora AI Service
   ↓
Spring Boot
   ↓
AI Service / Provider
```

The frontend presentation layer should remain stable.

---

# 41. ANTIGRAVITY EXECUTION RULE

## FIRST EXECUTION

Only perform:

**PHASE 0 — REPOSITORY AUDIT**

Do NOT start implementing the entire frontend.

Inspect and report:

1. Current structure
2. Existing prototype structure
3. Existing assets
4. Existing design-token implementation
5. Existing dependencies
6. Existing routes
7. Existing components
8. What can be reused
9. What should be migrated
10. What is missing
11. Recommended frontend architecture
12. Phase 1 implementation plan
13. Risks / ambiguities
14. Validation plan

Then STOP.

Wait for explicit instruction to start Phase 1.

## EVERY NEXT PHASE

Implement ONLY the requested phase.

After implementation:

1. Run the local application.
2. Validate functionality.
3. Validate responsive behavior.
4. Validate visual consistency against the prototype and Design Tokens.
5. Validate accessibility.
6. Validate console/hydration errors.
7. Run relevant checks.
8. Update progress documentation if necessary.
9. Summarize exactly what changed.
10. List known issues.
11. STOP and wait for the next phase.

Never automatically continue into the next phase.

---

# 42. DEFINITION OF DONE

A phase is complete only when:

```text
Implementation
      +
Design-token compliance
      +
Prototype visual alignment
      +
Responsive validation
      +
Accessibility
      +
Functional validation
      +
Error/loading/empty states
      +
Type safety
      +
Lint
      +
Build
      +
Future API/CMS readiness
```

The objective is not merely to make pages look correct.

The objective is to build **Flora Fusion as a real commercial e-commerce frontend that can later connect to Spring Boot + PostgreSQL + CMS + CRM without a major frontend rewrite.**


# MASTER-SOURCE CONSOLIDATION

This section makes `frontendprompt.md` self-contained.

The original detailed `motion.md` and `ecommerce.md` specifications are incorporated below as authoritative implementation requirements for this project.

When implementing Flora Fusion:

1. `frontendprompt.md` is the master implementation document.
2. The Design Tokens content already represented in this document remains the visual source of truth.
3. The detailed Motion Specification below is the motion source of truth.
4. The detailed Ecommerce Specification below is the ecommerce/engineering source of truth.
5. The existing prototype remains the approved visual baseline unless an explicit newer instruction changes it.

Do not require separate copies of `motion.md` or `ecommerce.md` to understand these requirements.

IMPORTANT:
- Do not silently omit requirements from the consolidated specifications below.
- Do not replace them with generic framework conventions.
- Resolve conflicts by preserving the more specific Flora Fusion requirement and the explicit project scope.
- Do not implement all phases at once.
- Phase 0 remains audit-only.

---

# CONSOLIDATED MOTION SPECIFICATION

The following is the complete motion specification incorporated from the project's `motion.md` source.

\## MOTION, ANIMATION \& SMOOTH SCROLLING ARCHITECTURE



The application must have a premium, intentional motion system suitable for a modern 2026 AI-era e-commerce product.



Do NOT treat animation as decoration. Motion must improve:



\* Visual hierarchy

\* Product storytelling

\* User feedback

\* Navigation continuity

\* Content discovery

\* Perceived quality

\* Brand identity

\* Interaction clarity



The motion system must feel premium, restrained, smooth and purposeful — never flashy, childish, excessive or generic.



\---



\### 1. PRIMARY MOTION TECHNOLOGY STACK



Use the following motion architecture:



\* \*\*GSAP\*\* — primary advanced animation engine

\* \*\*GSAP ScrollTrigger\*\* — scroll-driven and viewport-driven animations

\* \*\*Lenis\*\* — smooth scrolling

\* \*\*CSS transitions\*\* — simple hover, focus and micro-interactions

\* \*\*React state / Framer-style state logic only when appropriate for UI state\*\*, not as a replacement for GSAP



The primary motion architecture is:



\*\*Lenis → Smooth Scrolling → GSAP / ScrollTrigger → Scroll-driven Motion → Premium UI Experience\*\*



Do not introduce another animation library unless there is a genuine architectural requirement.



\---



\### 2. LENIS SMOOTH SCROLLING



Integrate \*\*Lenis\*\* as the application's smooth scrolling layer.



Requirements:



\* Smooth scrolling must feel natural and premium.

\* Integrate Lenis correctly with GSAP and ScrollTrigger.

\* Ensure ScrollTrigger remains synchronized with Lenis.

\* Do not create scroll-jacking behavior.

\* Preserve normal browser scrolling semantics.

\* Ensure mouse-wheel, trackpad and touch interactions remain usable.

\* Test scrolling behavior on desktop, tablet and mobile.

\* Ensure modals, drawers, dropdowns and overlays can lock/unlock scrolling correctly.

\* Do not allow background scrolling when a modal, drawer or fullscreen overlay requires scroll locking.

\* Keyboard scrolling must continue to work.

\* Accessibility must not be negatively affected.

\* Respect `prefers-reduced-motion`.



Lenis must enhance scrolling rather than interfere with usability.



\---



\### 3. GSAP



Use GSAP for advanced animation sequences where CSS transitions are insufficient.



Potential use cases include:



\* Hero entrance animations

\* Product storytelling

\* Image reveal sequences

\* Product image transitions

\* Promotional sections

\* Category storytelling

\* Scroll-based product showcases

\* Sticky/pinned storytelling sections

\* Progressive section reveals

\* Navigation transitions

\* Mega-menu transitions

\* Cart drawer transitions

\* Product gallery transitions

\* CTA emphasis

\* Featured product interactions

\* AI recommendation sections

\* Editorial commerce sections

\* Visual transitions between major content blocks



GSAP animations should be modular and reusable.



Do not place large animation timelines directly inside page components when they can be extracted into reusable animation utilities/hooks.



\---



\### 4. GSAP SCROLLTRIGGER



Use \*\*ScrollTrigger\*\* for meaningful scroll-based experiences.



Examples:



\* Fade/slide section entrances

\* Image reveal on scroll

\* Product storytelling

\* Product image transformations

\* Progressive content reveals

\* Pinned product storytelling

\* Horizontal scrolling sections where genuinely useful

\* Parallax effects where they improve the experience

\* Sequential product/category presentation

\* Promotional campaign storytelling



ScrollTrigger must NOT be used simply because it is available.



Every scroll animation must have a UX purpose.



Avoid:



\* Excessive parallax

\* Constant movement

\* Large unnecessary vertical shifts

\* Animation on every single card

\* Endless stagger animations

\* Overly slow transitions

\* Scroll effects that make browsing tiring

\* Animations that delay access to content

\* Animations that interfere with product comparison or purchasing



\---



\### 5. ANIMATION HIERARCHY



Use a clear animation hierarchy.



\#### Level 1 — Micro Interaction



Prefer CSS transitions for:



\* Button hover

\* Button press

\* Link hover

\* Icon hover

\* Input focus

\* Card hover

\* Image hover

\* Wishlist interaction

\* Quantity controls

\* Toggle states



These should remain fast and subtle.



\#### Level 2 — Component Animation



Use GSAP or carefully structured CSS when required for:



\* Product gallery transitions

\* Cart drawer

\* Search panel

\* Mega menu

\* Filter panel

\* Quick-view modal

\* Product variant transitions

\* Recommendation carousel transitions

\* Notification/toast entrance



\#### Level 3 — Page / Section Animation



Use GSAP + ScrollTrigger for:



\* Hero storytelling

\* Major section reveals

\* Product showcases

\* Editorial commerce sections

\* Promotional campaigns

\* Category storytelling

\* Featured product presentations



\#### Level 4 — Signature Brand Motion



For important visual moments, create distinctive motion that reinforces the application's unique brand identity.



Examples:



\* Signature hero entrance

\* Product reveal

\* Brand transition

\* AI-powered recommendation reveal

\* Premium promotional storytelling

\* Special campaign sections



Signature motion should be used selectively.



\---



\### 6. PAGE LOAD EXPERIENCE



Do not create a long cinematic loading animation before the user can interact with the application.



Initial page loading should prioritize:



1\. Content availability

2\. Perceived performance

3\. Navigation readiness

4\. Product discovery

5\. Then visual enhancement



Use lightweight entrance animations only where they improve hierarchy.



The user should never feel that the application is deliberately making them wait for an animation.



\---



\### 7. PRODUCT CARD MOTION



Product cards should feel responsive and premium.



Potential interactions:



\* Image transition

\* Subtle image zoom

\* Hover elevation

\* Quick-action reveal

\* Wishlist feedback

\* Add-to-cart feedback

\* Variant selection feedback

\* Price/availability state transition



Avoid making every product card perform the same large animation.



Motion intensity should remain controlled.



\---



\### 8. PRODUCT DETAIL PAGE MOTION



The PDP should be one of the strongest motion experiences in the application.



Potential interactions:



\* Gallery transitions

\* Thumbnail selection

\* Image zoom

\* Variant changes

\* Product information reveal

\* Sticky purchase area transitions

\* Add-to-cart feedback

\* Wishlist feedback

\* Recommendation reveal

\* Related-product transitions

\* Scroll-driven storytelling where appropriate



The product itself must remain the visual focus.



Animation must never compete with product information, price, availability or purchase actions.



\---



\### 9. HERO SECTION MOTION



The hero section may use GSAP and ScrollTrigger for a premium first impression.



Possible elements:



\* Headline reveal

\* Supporting text reveal

\* CTA entrance

\* Product/visual reveal

\* Image movement

\* Layered depth

\* Subtle scroll response

\* Background transition

\* Product storytelling



Do not use generic:



\* Text bouncing

\* Excessive zoom

\* Random rotations

\* Large parallax

\* Overlapping animations everywhere



The hero animation must be specific to the product's brand identity.



\---



\### 10. NAVIGATION \& HEADER MOTION



Navigation should feel highly polished.



Consider:



\* Header state transition on scroll

\* Sticky header transformation

\* Search expansion

\* Mega-menu entrance

\* Category menu transitions

\* Mobile drawer transitions

\* Account/cart interaction feedback



Header motion should remain fast and functional.



Never sacrifice navigation speed for visual effects.



\---



\### 11. CART \& CHECKOUT MOTION



Cart interactions should provide clear feedback.



Examples:



\* Add-to-cart confirmation

\* Cart count update

\* Cart drawer entrance

\* Product item insertion

\* Quantity update

\* Item removal

\* Coupon application feedback

\* Checkout step transition

\* Payment state transition



Motion should communicate state changes clearly.



It must never hide or delay important commerce information.



\---



\### 12. AI EXPERIENCE MOTION



AI features must not look like generic chatbot widgets.



If AI functionality is present, use motion to create a native product experience.



Examples:



\* AI recommendation reveal

\* AI search suggestions

\* Conversational shopping interface

\* Personalized product discovery

\* Smart filters

\* AI-generated insights

\* Product comparison assistance

\* AI review summaries



Avoid generic:



> "AI assistant bubble"



with meaningless animated effects.



AI should feel embedded into the commerce workflow.



Motion should reinforce that experience.



\---



\### 13. RESPONSIVE MOTION



Motion must be responsive.



Desktop, tablet and mobile must not blindly use identical animation behavior.



For mobile:



\* Reduce animation complexity where appropriate.

\* Avoid expensive parallax.

\* Avoid excessive pinned sections.

\* Avoid long animation sequences.

\* Prioritize touch interaction.

\* Preserve scrolling performance.

\* Ensure gestures do not conflict with scrolling.

\* Ensure drawers and sheets behave naturally.



\---



\### 14. PERFORMANCE RULES



Animation performance is a first-class requirement.



Prefer animating:



\* `transform`

\* `opacity`



Avoid unnecessary animation of layout-triggering properties such as:



\* width

\* height

\* top

\* left

\* margin

\* padding



unless there is a specific reason.



Avoid unnecessary:



\* layout recalculation

\* DOM measurement loops

\* large animation timelines

\* excessive simultaneous animations

\* high-frequency React state updates during scroll



Scroll-driven animations must remain smooth.



Do not sacrifice Core Web Vitals for visual effects.



\---



\### 15. COMPONENT-LEVEL ANIMATION ARCHITECTURE



Animations must be maintainable.



Prefer reusable utilities/hooks/modules such as:



\* smooth-scroll initialization

\* GSAP context management

\* ScrollTrigger setup

\* reveal animation utilities

\* page transition utilities

\* product animation utilities

\* modal/drawer animation utilities



Ensure animations are properly cleaned up when React components unmount.



Avoid memory leaks and duplicated GSAP timelines.



Do not initialize the same Lenis or ScrollTrigger system multiple times unnecessarily.



\---



\### 16. NEXT.JS COMPATIBILITY



Because the current implementation uses Next.js:



\* Handle browser-only animation APIs correctly.

\* Do not execute GSAP/Lenis browser logic during server rendering.

\* Use client components only where required.

\* Keep the majority of components server-renderable where practical.

\* Avoid converting the entire application into Client Components just for animation.

\* Dynamically initialize browser-dependent animation systems when appropriate.

\* Ensure animations do not break SSR or hydration.



Animation architecture must remain compatible with a production Next.js application.



\---



\### 17. ACCESSIBILITY



Respect:



`prefers-reduced-motion`



When reduced motion is enabled:



\* Disable unnecessary decorative animation.

\* Reduce scroll-driven effects.

\* Reduce parallax.

\* Reduce long transitions.

\* Preserve functional feedback.

\* Maintain normal navigation and usability.



Accessibility takes priority over decorative motion.



\---



\### 18. MOTION TOKENS



Motion should be treated as part of the design system.



Define reusable motion values for:



\* Duration

\* Delay

\* Easing

\* Stagger

\* Distance

\* Scale

\* Opacity

\* Transition intensity



Do not scatter random animation values throughout the codebase.



Where appropriate, motion values should align with the existing design-token architecture.



\---



\### 19. MOTION SHOULD SUPPORT BRAND IDENTITY



Do not copy animation patterns from generic:



\* SaaS websites

\* AI dashboards

\* Template marketplaces

\* Random e-commerce templates

\* Dribbble-style concept designs



The animation language must emerge from the application's own:



\* Brand

\* Product category

\* Design tokens

\* Typography

\* Visual identity

---

# CONSOLIDATED ECOMMERCE / ENGINEERING SPECIFICATION

The following is the complete ecommerce and frontend engineering specification incorporated from the project's `ecommerce.md` source.

\# PRODUCTION-GRADE AI-NATIVE E-COMMERCE APPLICATION



\## Master Development Prompt for Antigravity — 2026 AI Era



\---



\# 1. ROLE



You are acting as a:



\* Principal Software Architect

\* Senior Next.js Engineer

\* Senior React Engineer

\* UI/UX Designer

\* Product Designer

\* E-Commerce Architect

\* Backend Architect

\* AI Engineer

\* SEO/AEO/GEO Engineer

\* Security Engineer

\* Performance Engineer

\* QA Engineer

\* DevOps Engineer



Your task is to build a \*\*premium, production-grade, AI-native e-commerce application\*\*.



The application may be created as an academic/college project, but \*\*DO NOT treat it as a basic college project\*\*.



The engineering quality must follow real-world production standards.



The final product should be architecturally capable of evolving into a real commercial e-commerce product without requiring a major rewrite.



\---



\# 2. MOST IMPORTANT PRINCIPLE



Do NOT start by blindly writing code.



Follow this sequence:



```text

UNDERSTAND

&#x20;   ↓

AUDIT

&#x20;   ↓

PLAN

&#x20;   ↓

DESIGN

&#x20;   ↓

ARCHITECT

&#x20;   ↓

IMPLEMENT

&#x20;   ↓

VALIDATE

&#x20;   ↓

REFINE

```



Before implementing anything:



1\. Inspect the complete existing repository.

2\. Inspect the existing design tokens.

3\. Inspect the sample prototype.

4\. Inspect all existing assets.

5\. Inspect the existing component structure.

6\. Inspect existing routes/pages.

7\. Understand the product/domain.

8\. Identify reusable patterns.

9\. Identify constraints.

10\. Create an implementation strategy.

11\. Then begin implementation.



Do not destroy existing working functionality unnecessarily.



Prefer:



\* reuse

\* modular architecture

\* incremental implementation

\* refactoring

\* reusable components

\* strongly typed contracts

\* future-compatible architecture



Avoid unnecessary rewrites.



\---



\# 3. CURRENT PHASE — NEXT.JS FIRST



This phase is specifically for the \*\*frontend application\*\*.



Build the customer-facing and required frontend/admin-ready architecture using:



\* Next.js latest stable

\* React

\* TypeScript

\* App Router

\* modern CSS/Tailwind where appropriate

\* server components where appropriate

\* client components only where interaction requires them

\* accessible semantic HTML

\* production-grade responsive architecture



Do NOT implement the Spring Boot backend in this phase.



The future backend will be:



```text

Spring Boot

\+

PostgreSQL

\+

REST APIs

\+

CMS

\+

Authentication / Authorization

\+

Business Services

\+

AI Services

```



The current frontend must therefore be architected so that replacing local/mock data with Spring Boot APIs later does \*\*not require rebuilding the UI\*\*.



\---



\# 4. FUTURE SYSTEM ARCHITECTURE



Design the frontend around this future architecture:



```text

&#x20;                   E-COMMERCE PLATFORM



&#x20;                        FRONTEND

&#x20;                           |

&#x20;                        Next.js

&#x20;                           |

&#x20;               +-----------+-----------+

&#x20;               |                       |

&#x20;         Customer App             Admin App

&#x20;               |                       |

&#x20;               +-----------+-----------+

&#x20;                           |

&#x20;                    API / DATA CONTRACT

&#x20;                           |

&#x20;                    Spring Boot Backend

&#x20;                           |

&#x20;       +-------------------+-------------------+

&#x20;       |                   |                   |

&#x20;  PostgreSQL              CMS             AI Services

&#x20;       |                   |                   |

&#x20;       +-------------------+-------------------+

&#x20;                           |

&#x20;                   External Services

&#x20;                           |

&#x20;         Payments / Email / SMS / Storage

&#x20;         Shipping / Search / Analytics etc.

```



The frontend must not become tightly coupled to mock data.



Use a clean abstraction:



```text

UI

&#x20;↓

Feature Components

&#x20;↓

Domain/Data Services

&#x20;↓

API Contract

&#x20;↓

Future Spring Boot REST API

```



During the current phase:



```text

UI

&#x20;↓

Feature Components

&#x20;↓

Typed Data/Mock Service

&#x20;↓

Local Data

```



Later:



```text

UI

&#x20;↓

Feature Components

&#x20;↓

Typed API Service

&#x20;↓

Spring Boot

&#x20;↓

PostgreSQL

```



The presentation layer should remain stable.



\---



\# 5. DESIGN TOKENS ARE THE VISUAL SOURCE OF TRUTH



The repository already contains the design tokens.



\*\*Inspect them first.\*\*



Do not invent a parallel design system.



Do not randomly introduce:



\* colors

\* typography

\* spacing

\* shadows

\* gradients

\* border radii

\* animation styles

\* component styles



Use the existing design tokens wherever applicable.



The sample prototype is a \*\*UX and visual reference\*\*.



The design tokens are the \*\*implementation source of truth\*\*.



Do not blindly convert the prototype into HTML.



Instead:



```text

Design Tokens

&#x20;     +

Prototype

&#x20;     +

Product Requirements

&#x20;     ↓

Professional Product Design

```



The final implementation must feel like a coherent branded product.



\---



\# 6. THE APPLICATION MUST NOT LOOK GENERIC



Do NOT create:



\* generic Tailwind layouts

\* generic Bootstrap-looking interfaces

\* generic SaaS dashboards

\* generic AI landing pages

\* generic Amazon clones

\* generic Shopify clones

\* excessive glassmorphism

\* random gradients

\* random shadows

\* excessive rounded cards

\* repetitive card grids

\* meaningless AI badges

\* unnecessary 3D effects

\* excessive animations

\* template-generated sections



The application must have:



\* recognizable brand identity

\* strong visual hierarchy

\* deliberate typography

\* meaningful spacing

\* intentional interaction patterns

\* premium product presentation

\* strong information architecture

\* domain-specific UX

\* high-quality micro-interactions

\* excellent responsive behavior



The user should feel:



> "This is a real e-commerce product."



Not:



> "This is a college project generated by AI."



\---



\# 7. PRODUCT IDENTITY



The e-commerce application must have its own identity.



Before implementation, determine from the provided product/domain:



\* target customer

\* product category

\* brand personality

\* purchase behavior

\* product discovery model

\* customer expectations

\* pricing model

\* catalog structure

\* product variants

\* purchasing journey

\* post-purchase journey



Do not force every e-commerce application into the same UI.



The underlying engineering standards may be reusable.



The product experience must be domain-specific.



\---



\# 8. COMPLETE E-COMMERCE FEATURE SCOPE



Treat the application as a complete e-commerce platform.



Do not reduce it to:



```text

Products

→ Cart

→ Checkout

```



The architecture must account for the following capabilities.



\---



\# 9. CUSTOMER HOME PAGE



Design the homepage according to the actual product domain.



Potential capabilities include:



\* brand identity

\* navigation

\* global search

\* hero experience

\* promotional campaigns

\* featured categories

\* featured products

\* new arrivals

\* best sellers

\* special offers

\* personalized recommendations

\* recently viewed products

\* frequently bought together

\* social proof

\* customer reviews

\* editorial content

\* promotional content

\* trust signals

\* newsletter/communication signup

\* footer



Do not add every section automatically.



Choose sections based on the product's actual business model.



The homepage should tell a coherent story.



\---



\# 10. PRODUCT CATALOG



Support a scalable catalog hierarchy:



```text

Category

&#x20;  ↓

Subcategory

&#x20;  ↓

Product

&#x20;  ↓

Variant

&#x20;  ↓

SKU

```



Consider:



\* categories

\* subcategories

\* collections

\* brands

\* product attributes

\* product specifications

\* variants

\* SKU

\* pricing

\* sale pricing

\* inventory

\* availability

\* product media

\* product badges

\* product status



Do not assume every product requires variants.



Model the domain correctly.



\---



\# 11. PRODUCT LISTING / PLP



Create a production-quality product listing experience.



Support where appropriate:



\* filtering

\* sorting

\* pagination or infinite loading

\* category filtering

\* price filtering

\* attribute filtering

\* availability filtering

\* brand filtering

\* rating filtering

\* search refinement

\* active filters

\* result counts

\* product comparison where appropriate

\* wishlist

\* quick view where appropriate

\* responsive filter behavior



Filters must work correctly on:



\* desktop

\* tablet

\* mobile



Do not create fake filters that do not correspond to actual product data.



\---



\# 12. PRODUCT DETAIL PAGE



The PDP is a critical conversion experience.



Support appropriate capabilities such as:



\* product images

\* image gallery

\* zoom

\* video where applicable

\* product title

\* brand

\* price

\* discount

\* availability

\* SKU

\* product variants

\* quantity selector

\* add to cart

\* buy now

\* wishlist

\* specifications

\* description

\* shipping information

\* return policy

\* reviews

\* ratings

\* FAQs

\* related products

\* recommended products

\* frequently bought together

\* recently viewed

\* trust information



The product page should prioritize clarity and purchase confidence.



\---



\# 13. PRODUCT VARIANTS AND SKU



Model variants correctly.



Examples:



\* size

\* color

\* storage

\* material

\* configuration

\* pack size

\* edition



Variant selection should affect:



\* SKU

\* price

\* availability

---

# FINAL MASTER-DOCUMENT RULE

For the Flora Fusion frontend implementation, this file is now intended to be self-contained.

Antigravity should read this file completely before implementation.

The user does not need to provide separate `motion.md` or `ecommerce.md` files for the requirements contained in this consolidated document.

The required execution model remains:

```text
Read frontendprompt.md completely
        ↓
Phase 0 — Audit only
        ↓
Stop and report findings
        ↓
User approval
        ↓
Phase 1
        ↓
Validate
        ↓
Commit
        ↓
Next phase
```

Never skip the audit.
Never implement the whole project in one execution.
Never replace approved Flora Fusion design decisions with generic templates.
