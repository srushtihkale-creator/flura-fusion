# Flora Fusion — Antigravity Prototype Build Prompt

## 0. ROLE

You are an expert product designer, UI/UX designer, frontend architect, and senior frontend engineer.

Build a **complete, polished, production-quality frontend prototype** for a premium plant nursery e-commerce website called **Flora Fusion**.

This is NOT a generic AI-generated landing page.

This is NOT a CRUD demo.

This is NOT a dashboard-first project.

The result must feel like a real premium Indian plant-commerce brand with a carefully designed visual system, realistic product catalog, responsive layouts, smooth interactions, and meaningful customer-facing AI.

---

# 1. PROJECT

## Brand

**Flora Fusion**

## Brand line

**Nature Meets Your Space**

## Products

Flora Fusion sells only three product categories:

1. **Plants**
2. **Pots**
3. **Seeds**

Do NOT introduce unrelated product categories.

Examples of products:

### Plants
- Money Plant
- Snake Plant
- Peace Lily
- Areca Palm
- ZZ Plant
- Jade Plant
- Lavender
- Ficus Elastica
- Monstera Deliciosa
- Aloe Vera
- Rubber Plant

### Pots
- Ceramic Ripple Pot
- Terracotta Pot
- Self-Watering Pot
- Hanging Planter
- Marble Pot
- Metal Pot
- Ribbed Ceramic Pot
- Bamboo Pot
- Decorative Pot
- Minimal White Pot

### Seeds
- Basil Seeds
- Tomato Seeds
- Sunflower Seeds
- Marigold Seeds
- Mint Seeds
- Lettuce Seeds
- Chilli Seeds
- Coriander Seeds
- Carrot Seeds
- Wildflower Seeds

Use realistic names, descriptions, prices, ratings, stock states, metadata and imagery.

---

# 2. PRIMARY DESIGN REFERENCES

The supplied Flora Fusion reference images are the visual source of truth.

There are two key visual references:

### Reference A — Flora Fusion homepage / brand system

The reference contains:

- Flora Fusion logo
- Botanical leaf mark
- Warm cream background
- Forest green typography
- Editorial serif headings
- Clean sans-serif interface text
- Premium hero section
- Plants / Pots / Seeds navigation
- Search bar
- Account / Wishlist / Cart
- Mobile app-like layout
- Category cards
- Product grids
- Category promotional banners
- Footer
- Flora AI customer assistant

### Reference B — Catalog system

The catalog reference contains three major sections:

```text
Plants
Pots
Seeds
```

Each section contains:

- Category heading
- Category filters
- Large product cards
- Product image
- Wishlist icon
- Product name
- Short description
- Rating
- Price
- Product metadata
- Category-specific styling

Maintain this visual language.

Do NOT redesign the visual identity into a different style.

---

# 3. DESIGN SOURCE FILES

The project also has two design specification files:

```text
design.md
design_tokens.md
```

Treat these as the project's design-system source of truth.

Before implementation:

1. Read `design.md`
2. Read `design_tokens.md`
3. Understand the supplied reference images
4. Follow their visual hierarchy
5. Build the implementation from the design system

Do not invent a completely different design system.

---

# 4. VISUAL DIRECTION

Flora Fusion should feel:

- Botanical
- Premium
- Calm
- Natural
- Warm
- Editorial
- Modern
- Trustworthy
- Spacious
- Commerce-focused

The visual language should combine:

```text
Premium nursery photography
+
Editorial typography
+
Warm natural colors
+
Minimal commerce UI
+
Subtle motion
+
Helpful AI
```

Avoid:

- Neon colors
- Cyberpunk
- Dark futuristic UI
- Excessive gradients
- Excessive glassmorphism
- Generic SaaS cards
- Generic AI chatbot appearance
- Excessive rounded cards
- Excessive shadows
- Over-animation
- Gaming-style interfaces

---

# 5. CORE COLOR SYSTEM

Use the design tokens.

Primary:

```text
Forest Green
#173F2B
```

Secondary:

```text
Green
#24583B
```

Deep:

```text
#123222
```

Sage:

```text
#A9BDA3
```

Light Sage:

```text
#DDE7D8
```

Background:

```text
Warm Cream
#F7F4EC
```

Soft Cream:

```text
#FBF9F4
```

Beige:

```text
#EEE8DA
```

White:

```text
#FFFFFF
```

Use color tokens rather than random hardcoded colors.

---

# 6. TYPOGRAPHY

Use:

```text
Display / headings:
Editorial serif

UI / body:
Modern sans-serif
```

Preferred conceptual pairing:

```css
--font-display: "Cormorant Garamond", Georgia, serif;
--font-body: "Inter", "Helvetica Neue", Arial, sans-serif;
```

Headings should feel premium and editorial.

Product names and UI should remain highly readable.

---

# 7. RESPONSIVE TARGETS

The prototype must be fully responsive for:

```text
Desktop
Laptop
Tablet
Mobile
```

At minimum:

```text
1440px+
1280px
1024px
768px
480px
360px
```

Do not simply shrink the desktop layout.

Create intentional responsive layouts.

---

# 8. DESKTOP EXPERIENCE

Desktop should include:

### Header

- Flora Fusion logo
- Plants
- Pots
- Seeds
- About
- Search
- Account
- Wishlist
- Cart

Header should be clean and premium.

### Hero

Large editorial hero:

```text
GREEN SPACES. HAPPIER PLACES.

Bring Nature
Home

Discover a wide range of healthy plants,
beautiful pots and seeds — all in one place.

Shop Now →
```

Use premium botanical imagery.

Hero should have depth through subtle animation.

### Trust strip

Use:

```text
Healthy Plants
Direct from Nurseries

Safe & Secure
Payments

Fast & Reliable
Delivery

Expert Support
Plant Care Guidance
```

### Category section

Three major categories:

```text
Plants
Pots
Seeds
```

### Featured catalog

Show real-looking product cards.

### Promotional category banners

Three banners:

```text
Plants
Indoor, outdoor, flowering, succulents & more.

Pots
Ceramic, plastic, terracotta,
hanging & decorative.

Seeds
Grow your own happiness from scratch.
```

### Footer

Include:

- Logo
- About Us
- Plant Care Guide
- FAQs
- Contact Us
- Social links
- Newsletter
- Brand statement

---

# 9. MOBILE EXPERIENCE

Mobile should feel like a real commerce app.

Header:

```text
Logo
Account
Cart
```

Search should be prominent.

Use mobile bottom navigation:

```text
Home
Categories
Flora AI
Wishlist
Account
```

The mobile layout should not simply be a compressed desktop layout.

Use:

- 2-column product grid
- Compact product cards
- Large touch targets
- Sticky bottom navigation
- Mobile-friendly AI panel
- Mobile-friendly filters
- Swipeable product sections where appropriate

---

# 10. CATALOG PAGES

Create dedicated catalog pages:

```text
/Plants
/Pots
/Seeds
```

## Plants page

Heading:

```text
Plants
```

Supporting text:

```text
Green companions for a healthier, happier you.
```

Filters:

```text
All
Indoor
Outdoor
Flowering
Air Purifying
Succulents
```

Product cards should include:

- Image
- Wishlist
- Product name
- Short description
- Rating
- Price
- Light requirement
- Water requirement

---

## Pots page

Heading:

```text
Pots
```

Supporting text:

```text
The perfect home for your plants.
```

Filters:

```text
All
Ceramic
Terracotta
Hanging
Decorative
Self-Watering
```

Metadata:

- Size
- Material
- Style

---

## Seeds page

Heading:

```text
Seeds
```

Supporting text:

```text
Grow your own dreams.
```

Filters:

```text
All
Flower
Vegetable
Herb
Fruit
```

Metadata:

- Seed type
- Difficulty
- Growing category

---

# 11. PRODUCT CARD

Every product card should have:

```text
Product image
Wishlist button
Optional badge
Product name
Short description
Rating
Price
Metadata
```

Example:

```text
Money Plant

Brings good luck & positivity

★ 4.8 (124)

₹399

Indoor · Low Water
```

Card should feel premium.

Do not overload the card.

---

# 12. PRODUCT DETAIL PAGE

Create a realistic product details experience.

Include:

- Image gallery
- Product title
- Rating
- Price
- Original price if applicable
- Discount
- Availability
- Product description
- Product attributes
- Plant care / material / seed information
- Quantity
- Add to Cart
- Buy Now
- Wishlist
- Delivery information
- Return information
- Related products
- Frequently bought together

For plants include:

```text
Light
Water
Difficulty
Placement
```

For pots:

```text
Material
Size
Drainage
Placement
```

For seeds:

```text
Type
Difficulty
Season
Growing guidance
```

---

# 13. SEARCH

Implement a polished search experience.

Search placeholder:

```text
Search for plants, pots or seeds...
```

Support:

- Search suggestions
- Recent searches
- Category suggestions
- Product suggestions
- Typo-friendly UI
- Filter results
- Empty state

Example natural-language searches:

```text
low light plants
plants for bedroom
small ceramic pot
easy flower seeds
plants under ₹500
```

---

# 14. FLORA AI

## IMPORTANT

AI is **customer-facing only**.

Do NOT create:

- Admin AI
- Admin AI dashboard
- AI analytics dashboard
- AI inventory prediction screen
- AI review-analysis admin screen

The only AI experience should be for customers.

Name:

**Flora AI**

---

# 15. FLORA AI PURPOSE

Flora AI should help customers discover and understand products.

It can help with:

### Product discovery

```text
I need a low-maintenance plant for my bedroom.
```

### Recommendations

```text
Which plant is good for low light?
```

### Budget

```text
Show me plants under ₹500.
```

### Pots

```text
I need a white ceramic pot for a medium plant.
```

### Seeds

```text
Which seeds are easy for beginners?
```

### Care

```text
How often should I water a Snake Plant?
```

### Shopping combinations

```text
I bought a Money Plant.
Which pot should I get?
```

---

# 16. FLORA AI RULES

AI must never invent:

- Products
- Prices
- Stock
- Discounts
- Delivery promises
- Return policies
- Product specifications

AI responses should be based on actual product data available in the application.

AI should behave as:

```text
Customer assistant
+
Product discovery assistant
+
Plant-care guide
```

Not as a generic chatbot.

---

# 17. FLORA AI UI

Desktop:

Floating AI launcher near the bottom-right.

Mobile:

Floating AI button above bottom navigation.

AI panel:

```text
Flora AI

Hi! I'm Flora 🌿
What are you looking for today?

[ Find a plant ]
[ Find a pot ]
[ Find seeds ]
[ Plant care ]
```

Input:

```text
Ask Flora anything...
```

AI recommendation cards should use the same product-card design system.

---

# 18. FLORA AI INTERACTIONS

Examples:

User:

```text
I need a plant for a low-light bedroom.
```

Flora AI:

```text
A Snake Plant could be a good fit for a low-light bedroom.

Why:
• Low light tolerant
• Low maintenance
• Suitable for indoor spaces

₹499

View Plant
```

The product shown must exist in the product catalog.

---

# 19. AI ANIMATION

Flora AI launcher should have subtle botanical motion.

Possible:

```text
small leaf rotation
gentle floating
soft pulse
```

Do NOT make it flashy.

---

# 20. GSAP — REQUIRED

Use **GSAP** as the primary animation engine.

Animations must feel premium and restrained.

Do not add animation just because animation is possible.

Use animation to communicate:

- hierarchy
- interaction
- depth
- state change
- navigation
- product discovery

---

# 21. LENIS — REQUIRED

Use **Lenis** for smooth scrolling.

Integrate Lenis properly with GSAP.

Scrolling should feel:

```text
Smooth
Natural
Premium
Responsive
```

Do NOT create scroll-jacking.

---

# 22. FLOATING ANIMATION — REQUIRED

Flora Fusion must include subtle floating animation.

Use GSAP.

Examples:

### Decorative leaves

```text
slow vertical movement
+
small rotation
```

### Hero botanical elements

```text
gentle floating
+
subtle depth movement
```

### Decorative objects

```text
slow drift
+
small rotation
```

Floating should feel like natural air movement.

Avoid synchronized movement.

---

# 23. LEVITATION EFFECT — REQUIRED

Use a subtle **levitation effect** for selected visual objects.

Good candidates:

- Hero plant
- Featured pot
- Floating botanical leaf
- AI botanical decoration
- Selected product hover

Concept:

```text
translateY(-6px)
+
tiny rotate
+
soft shadow variation
```

The effect should be slow and elegant.

Example conceptual GSAP behavior:

```js
gsap.to(element, {
  y: -8,
  rotation: 1.5,
  duration: 2.8,
  ease: "sine.inOut",
  repeat: -1,
  yoyo: true
});
```

Do not apply this to every product card.

---

# 24. ZERO-GRAVITY MOTION — REQUIRED

Add a restrained **zero-gravity motion system** for selected decorative botanical objects.

The effect should simulate objects gently drifting in space.

Use:

```text
x
y
rotation
rotationX
rotationY
```

with very small values.

Example concept:

```text
Leaf A:
x + 6px
y - 10px
rotation + 2deg

Leaf B:
x - 8px
y + 7px
rotation - 3deg

Pot:
y - 5px
rotationY + 1deg
```

Motion must be:

- slow
- organic
- asynchronous
- subtle

Do NOT create a chaotic floating website.

---

# 25. 3D FLOATING OBJECTS

Use CSS 3D transforms + GSAP where appropriate.

Use:

```css
perspective: 1200px;
transform-style: preserve-3d;
```

Allowed:

```text
rotateX
rotateY
translateZ
translateY
```

Use these effects mostly in:

- Hero
- Category promotional areas
- Flora AI visual
- Special promotional sections

Do not turn the entire site into a 3D experience.

---

# 26. PRODUCT HOVER MOTION

Desktop product card hover:

```text
Image scale: 1.02–1.04
Card moves upward: 2–4px
Shadow becomes slightly stronger
```

Wishlist icon can scale slightly.

Keep the interaction fast.

---

# 27. CATEGORY HOVER

Category cards:

```text
Image scale: 1.03
Overlay changes slightly
CTA moves 2–3px
```

Use GSAP for richer category interactions where useful.

---

# 28. HERO ANIMATION

Hero entrance should be staged.

Suggested order:

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
Decorative botanical elements
```

Use GSAP timeline.

Keep duration around:

```text
0.7s–1.2s
```

Do not delay the page unnecessarily.

---

# 29. SCROLL REVEALS

Sections can reveal as they enter the viewport.

Default:

```text
opacity: 0 → 1
y: 24px → 0
```

Use:

```text
0.6s–0.8s
```

Product grids can use subtle stagger.

Avoid large movement.

---

# 30. PARALLAX

Use subtle parallax for:

- Hero background
- Botanical decorations
- Category banners

Parallax should be small.

Do not create aggressive movement.

---

# 31. REDUCED MOTION

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

When enabled:

- Disable zero-gravity loops
- Disable floating loops
- Disable parallax
- Reduce transforms
- Reduce stagger
- Keep usability intact

---

# 32. PAGE TRANSITIONS

Use subtle transitions between major pages if routing supports them.

Preferred:

```text
opacity
+
small vertical movement
```

Avoid cinematic transitions that slow navigation.

---

# 33. CART

Cart must include:

- Product image
- Product name
- Variant if applicable
- Quantity controls
- Price
- Remove
- Wishlist/move-to-wishlist
- Subtotal
- Shipping
- Discount
- Total
- Checkout CTA

Do not make the cart look like a dashboard.

---

# 34. WISHLIST

Wishlist:

- Product grid
- Remove
- Add to cart
- Availability
- Price
- Empty state

Empty state:

```text
Your green wishlist is waiting.
```

---

# 35. CHECKOUT

Build a realistic checkout flow.

Steps:

```text
Cart
→ Address
→ Delivery
→ Coupon
→ Payment
→ Confirmation
```

Prototype payment UI can be simulated.

Do not implement fake payment-provider claims.

---

# 36. ORDER CONFIRMATION

After checkout show:

```text
Order confirmed
```

Include:

- Order number
- Products
- Total
- Delivery address
- Estimated delivery
- Track Order CTA

---

# 37. ORDER TRACKING

Show:

```text
Placed
Confirmed
Processing
Shipped
Out for Delivery
Delivered
```

Use subtle progress animation.

---

# 38. ABOUT PAGE

Create an elegant brand page.

Include:

```text
Nature Meets Your Space
```

Content direction:

- Plants
- Pots
- Seeds
- Plant care
- Sustainable living
- Helping people bring nature indoors

Use editorial imagery.

---

# 39. PLANT CARE PAGE

Create a useful educational experience.

Sections:

```text
Indoor Plant Care
Watering
Light
Potting
Repotting
Common Problems
Beginner Plants
```

Keep it visual and readable.

Flora AI can link users from care content to relevant products.

---

# 40. NAVIGATION

Desktop navigation:

```text
Plants
Pots
Seeds
About
```

Search centered or prominent.

Right:

```text
Account
Wishlist
Cart
```

Mobile:

```text
Logo
Account
Cart
```

Bottom:

```text
Home
Categories
Flora AI
Wishlist
Account
```

---

# 41. PRODUCT DATA

Create realistic frontend seed data.

Every product should have:

```js
{
  id,
  category,
  name,
  slug,
  description,
  price,
  originalPrice,
  rating,
  reviewCount,
  image,
  images,
  badge,
  stock,
  metadata
}
```

Plant metadata:

```js
{
  placement,
  light,
  watering,
  difficulty
}
```

Pot metadata:

```js
{
  material,
  size,
  drainage,
  style
}
```

Seed metadata:

```js
{
  type,
  difficulty,
  season
}
```

---

# 42. IMAGE DIRECTION

Product imagery should follow one visual language.

Plants:

```text
Warm neutral background
Soft natural light
Premium nursery product photography
```

Pots:

```text
Minimal studio composition
Warm neutral environment
```

Seeds:

```text
Clean seed packet
Warm neutral background
Natural botanical context
```

Do not mix:

- dark product photos
- neon backgrounds
- unrelated stock-photo styles
- inconsistent aspect ratios

---

# 43. COMPONENT SYSTEM

Build reusable components.

Recommended:

```text
Header
MobileHeader
BottomNavigation
SearchBar
Hero
TrustStrip
CategoryCard
CategoryBanner
ProductCard
ProductGrid
FilterChips
ProductGallery
ProductInfo
Rating
Price
WishlistButton
QuantitySelector
CartItem
CartSummary
CheckoutStepper
AddressCard
OrderTimeline
FloraAI
AIProductCard
Footer
Toast
Modal
Drawer
```

---

# 44. FRONTEND ARCHITECTURE

Prefer a component-based architecture.

Separate:

```text
UI
Data
State
Animations
Utilities
```

Do not place the entire prototype in one giant component/file.

---

# 45. STATE MANAGEMENT

Prototype state should support:

```text
Cart
Wishlist
Search
Filters
Selected category
AI conversation
Checkout
Order
```

Use a clean state architecture appropriate to the selected frontend stack.

---

# 46. FRONTEND AUTH

Prototype can include:

```text
Login
Register
Account
Wishlist
Orders
```

Use realistic UI.

Do not expose passwords or sensitive data.

---

# 47. ADMIN

For this prototype:

**Do not build an AI admin interface.**

If an admin area is included for completeness, keep it minimal and focused on normal commerce administration:

```text
Products
Categories
Orders
Customers
Inventory
Coupons
Reviews
CMS
```

No Admin AI.

---

# 48. ACCESSIBILITY

Implement:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Accessible buttons
- Accessible labels
- Alt text
- Proper heading hierarchy
- Sufficient contrast
- Reduced motion support
- Touch targets >= 44px

---

# 49. PERFORMANCE

Prioritize:

- Image lazy loading
- Responsive images
- Avoid unnecessary re-renders
- Transform/opacity animations
- Efficient GSAP timelines
- Cleanup GSAP contexts
- Efficient scroll triggers
- Avoid animation on hidden elements
- Keep Lenis smooth
- Avoid excessive DOM nodes

Do not sacrifice performance for visual effects.

---

# 50. GSAP IMPLEMENTATION RULES

Use GSAP for:

```text
Hero entrance
Scroll reveal
Floating objects
Levitation
Zero-gravity motion
3D decorative motion
Product hover
Category hover
AI launcher
AI panel
Order timeline
Selected page transitions
```

Use CSS transitions for very small micro-interactions where GSAP is unnecessary.

Do not use multiple animation libraries.

GSAP is the main animation engine.

---

# 51. LENIS IMPLEMENTATION RULES

Use Lenis for smooth scrolling.

If using GSAP ScrollTrigger, synchronize Lenis and GSAP correctly.

Avoid:

```text
nested smooth scrolling
scroll hijacking
long scroll delays
```

---

# 52. ANIMATION SAFETY

Every continuous animation must:

- Be subtle
- Have a purpose
- Be removable under reduced-motion
- Not interfere with clicks
- Not block scrolling
- Not cause layout shifts

---

# 53. DESIGN DETAILS THAT MUST MATCH THE REFERENCE

Pay special attention to:

### Header

Thin, premium, spacious.

### Hero

Warm photographic environment + editorial typography.

### Product cards

Clean cream/white cards with subtle borders.

### Category titles

Large serif headings.

### Category filters

Small rounded chips.

### Prices

Dark green, clearly visible.

### Ratings

Small warm star accent.

### Metadata

Small muted text + simple icons.

### Footer

Minimal, editorial and spacious.

---

# 54. MOBILE DESIGN DETAILS

Mobile product cards should be compact but readable.

Recommended:

```text
2-column grid
```

Do not make product cards too narrow.

Mobile hero should stack:

```text
Text
↓
CTA
↓
Image
```

or use a carefully composed image background.

---

# 55. EMPTY / LOADING / ERROR STATES

Implement:

### Loading

Subtle skeleton.

### Empty

Friendly botanical message.

### Error

Clear retry CTA.

### Offline / failed request

Use calm messaging.

---

# 56. INTERACTION QUALITY

Every important action should provide feedback.

Examples:

Add to cart:

```text
Added to cart
```

Wishlist:

```text
Saved to wishlist
```

Checkout:

```text
Order confirmed
```

AI:

```text
Flora is thinking...
```

Feedback should be subtle and fast.

---

# 57. NO GENERIC PLACEHOLDERS

Do not use:

```text
Product 1
Product 2
Lorem ipsum
Test product
Sample text
Image placeholder
```

Use realistic Flora Fusion content.

---

# 58. NO TECHNICAL LANGUAGE IN CUSTOMER UI

Customer UI should not show:

```text
API
LLM
RAG
Vector database
AI model
Backend
SKU
JSON
```

unless a business-facing context genuinely requires it.

The user should experience a polished commerce website.

---

# 59. DO NOT OVERBUILD

The goal is a highly polished prototype.

Do not add unnecessary features just to increase feature count.

Prioritize:

```text
Visual quality
UX
Responsive behavior
Commerce flow
Product discovery
Flora AI
Animation quality
Performance
```

---

# 60. EXPECTED ROUTES

Implement at least:

```text
/
 /plants
 /pots
 /seeds
 /product/:slug
 /search
 /wishlist
 /cart
 /checkout
 /order-confirmation
 /orders
 /orders/:id
 /about
 /plant-care
 /account
```

If the chosen stack handles routing differently, preserve the same information architecture.

---

# 61. EXPECTED PROTOTYPE FLOW

The complete customer journey should work:

```text
Home
↓
Browse Plants
↓
Filter
↓
Open Product
↓
Add to Wishlist
↓
Add to Cart
↓
Open Cart
↓
Checkout
↓
Payment Prototype
↓
Order Confirmation
↓
Order Tracking
↓
Review / Plant Care
```

Alternative:

```text
Home
↓
Flora AI
↓
Ask for recommendation
↓
AI recommends real catalog product
↓
View Product
↓
Add to Cart
```

---

# 62. FLORA AI DEMO SCENARIOS

Provide working demo intents such as:

### Scenario 1

```text
Find me a low-light plant.
```

### Scenario 2

```text
I need a plant under ₹500.
```

### Scenario 3

```text
Suggest an easy plant for beginners.
```

### Scenario 4

```text
I need a ceramic pot for a medium plant.
```

### Scenario 5

```text
Which seeds are easy to grow?
```

### Scenario 6

```text
How do I care for a Snake Plant?
```

AI should map these to actual product data and predefined knowledge where applicable.

---

# 63. VISUAL QA CHECKLIST

Before considering the prototype complete, verify:

## Desktop

- Header alignment
- Hero composition
- Product grids
- Category banners
- Footer
- No horizontal overflow
- Typography hierarchy

## Tablet

- Navigation
- Grid behavior
- Hero scaling
- Product card readability

## Mobile

- Header
- Search
- 2-column product grid
- Bottom navigation
- Flora AI
- Cart
- Checkout
- No horizontal overflow

---

# 64. ANIMATION QA

Verify:

- Hero entrance is smooth
- Scroll reveals are not excessive
- Floating objects feel natural
- Levitation is subtle
- Zero-gravity motion is asynchronous
- 3D transforms do not cause clipping
- Product hover feels responsive
- Lenis does not interfere with interaction
- Reduced motion works

---

# 65. FINAL QUALITY BAR

The final prototype should look like a real premium e-commerce brand.

It should be believable as:

```text
A modern Indian plant nursery
+
Premium lifestyle brand
+
Commerce experience
+
Helpful customer AI
```

The site must feel intentionally designed.

Not:

```text
AI generated website
```

Not:

```text
college CRUD project
```

Not:

```text
generic Shopify clone
```

---

# 66. FINAL IMPLEMENTATION PRIORITY

Follow this priority order:

```text
1. Design fidelity
2. Responsive layout
3. Product catalog
4. Navigation
5. Product details
6. Cart
7. Wishlist
8. Checkout
9. Order tracking
10. Flora AI
11. GSAP animation
12. Lenis smooth scrolling
13. Floating animation
14. Levitation
15. Zero-gravity motion
16. 3D decorative effects
17. Accessibility
18. Performance
```

---

# 67. MOST IMPORTANT RULE

Do not change the established Flora Fusion visual identity.

Use the supplied references as the visual foundation.

Use:

```text
design.md
design_tokens.md
reference images
```

together.

The implementation should feel like **one coherent brand system**, not separate pages designed independently.

---

# 68. FINAL CREATIVE DIRECTION

Flora Fusion should communicate:

> **Nature Meets Your Space**

through:

```text
Warm cream backgrounds
+
Deep botanical green
+
Editorial serif typography
+
Premium plant photography
+
Clean product cards
+
Natural whitespace
+
Subtle GSAP motion
+
Lenis smooth scrolling
+
Floating botanical elements
+
Elegant levitation
+
Restrained zero-gravity motion
+
Helpful Flora AI
```

The result should be visually rich, but never noisy.

Premium, but never overly luxurious.

Modern, but still botanical.

Animated, but never distracting.

AI-powered, but still human and trustworthy.
