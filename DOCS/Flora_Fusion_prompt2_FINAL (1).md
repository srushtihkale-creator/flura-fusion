# Flora Fusion — Final Antigravity Prompt
## Final HTML Prototype + Complete Refinement Specification

You are the final implementation agent for the **Flora Fusion** project.

Build and deliver the **complete polished HTML/CSS/JavaScript prototype** of Flora Fusion based on the approved reference designs, the existing project foundation, and the refinement requirements below.

This is the **FINAL PROMPT**.

The final output must be a working, polished, responsive prototype — not a design explanation, not a wireframe, and not a partial demo.

---

## 1. PROJECT IDENTITY

Brand: **Flora Fusion**

Main product categories:
1. Plants
2. Pots
3. Seeds

The website should feel premium, botanical, calm, warm, editorial, modern, natural, trustworthy, and realistic.

It must NOT look like a generic AI-generated website, CRUD project, dashboard, portfolio animation showcase, tech/cyber website, or overly animated demo.

---

## 2. FINAL IMPLEMENTATION

Create the final working prototype using:
- HTML
- CSS
- JavaScript

If an existing project/framework is present, preserve it rather than unnecessarily rebuilding the architecture.

The prototype must demonstrate:
- Navigation
- Product browsing
- Product filtering
- Search
- Wishlist interaction
- Cart interaction
- Product detail interaction
- Customer-side Flora AI
- Responsive layouts
- Smooth scrolling
- Animations
- Final footer/sub-footer

---

## 3. PRESERVE THE EXISTING PROJECT

If an existing Flora Fusion prototype is present:

**Refine it. Do not rebuild it from zero.**

Preserve working:
- Routes
- Components
- Product data
- Cart logic
- Wishlist logic
- Search logic
- Existing AI UI
- Existing responsive structure
- Existing assets
- Existing GSAP implementation
- Existing Lenis implementation
- Existing design tokens

Do not remove working features or introduce unnecessary dependencies.

---

## 4. APPROVED VISUAL DIRECTION

Use the supplied Flora Fusion reference images as the visual source of truth.

Maintain:
- Warm cream/off-white backgrounds
- Deep botanical green
- Sage green
- Soft beige
- Muted terracotta
- Natural photography
- Editorial serif headings
- Clean sans-serif UI
- Spacious layouts
- Soft borders
- Subtle shadows
- Premium product cards
- Minimal navigation
- Botanical decorative details

Do NOT introduce neon green, purple gradients, heavy black layouts, excessive glassmorphism, excessive pill UI, glowing neon effects, cyber aesthetics, or overly dark interfaces.

---

## 5. PRODUCT CATALOG

Only these three main categories are allowed.

### Plants
Use products such as:
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

Filters:
- Indoor
- Outdoor
- Flowering
- Air Purifying
- Succulents

### Pots
Use products such as:
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

Filters:
- Ceramic
- Terracotta
- Hanging
- Decorative
- Self-Watering

### Seeds
Use products such as:
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

Filters:
- Flower
- Vegetable
- Herb
- Fruit

Do not create additional main product categories.

---

## 6. ASSETS

There is a proper project assets folder.

Use the existing assets. Do not assume assets are missing.

Use real Flora Fusion product assets wherever available.

Do not replace existing good assets with random stock images, fake URLs, unrelated images, or generic placeholders.

Use existing assets for:
- Hero
- Plants
- Pots
- Seeds
- Category banners
- Icons

Optimize image loading where possible.

---

## 7. HOMEPAGE STRUCTURE

Maintain this hierarchy:

1. Header
2. Hero
3. Trust/service strip
4. Plants catalog
5. Pots catalog
6. Seeds catalog
7. Category banners
8. Supporting content if already present
9. Main footer
10. Final sub-footer/copyright strip
11. Decorative repeating badge banner at the very end

Do not make the homepage unnecessarily long.

---

## 8. HEADER

Desktop:
Logo
Plants
Pots
Seeds
About
Search
Account
Wishlist
Cart

Keep it minimal.

Mobile should use a compact header.

---

## 9. HERO

The hero should communicate:

**Bring Nature Home**

Include:
- Editorial headline
- Supporting copy
- Primary CTA
- High-quality plant composition
- Warm natural background
- Botanical decorative elements
- Subtle depth

The hero must be the strongest visual section.

---

## 10. GSAP + SCROLLTRIGGER

Use **GSAP** as the primary animation engine and **ScrollTrigger** for scroll-based effects.

Animation should feel:
- Organic
- Calm
- Premium
- Natural
- Controlled

Do not replace GSAP with another animation library.

---

## 11. LENIS

Use **Lenis** for smooth scrolling.

Ensure:
- Only one Lenis instance
- Correct GSAP/ScrollTrigger synchronization
- No duplicate animation loops
- No memory leaks
- No scroll jank

Mobile should use lighter motion.

---

## 12. FLOATING ANIMATION

Implement subtle botanical **Floating Animation**.

Suitable elements:
- Leaves
- Botanical decorations
- Small hero objects
- Decorative particles

Use independent timing, duration, and delay.

Do not make all objects move together.

---

## 13. LEVITATION EFFECT

Implement a subtle **Levitation Effect** on selected hero visual elements.

Use:
- Small Y movement
- Very small rotation
- Subtle depth
- Optional soft shadow change

Do not make the entire hero float.

Do not make every product card float.

---

## 14. ZERO-GRAVITY MOTION

Use **Zero-Gravity Motion** selectively.

Create three motion layers:

### Background
Very slow botanical movement.

### Main object
Gentle vertical movement + subtle rotation.

### Small decorations
Independent X/Y movement + tiny rotation.

Use different durations and delays.

Do not make the effect robotic.

---

## 15. SUBTLE 3D DEPTH

Use restrained 3D depth in the hero.

Possible transforms:
- perspective
- rotateX
- rotateY
- translateZ

Mouse interaction may subtly affect the hero.

Keep it restrained, approximately ±3 degrees rotation with small translate values.

Do not apply aggressive 3D tilt to product cards.

---

## 16. PRODUCT CARDS

Product cards should feel like premium botanical catalog cards.

Structure:
- Product image
- Wishlist
- Product name
- Short description
- Rating
- Price
- Care/material metadata
- Optional CTA

Hover:
- Image scale around 1.02–1.03
- Card translateY around -2 to -3px
- Subtle shadow increase

Do not use aggressive tilt or rotation.

---

## 17. CATALOG SECTIONS

### Plants
Indoor · Outdoor · Flowering · Air Purifying · Succulents

### Pots
Ceramic · Terracotta · Hanging · Decorative · Self-Watering

### Seeds
Flower · Vegetable · Herb · Fruit

Each section should include:
- Category icon
- Editorial heading
- Short description
- Filters
- Product grid
- View-all action where appropriate

---

## 18. PRODUCT IMAGES

All product cards must have:
- Consistent image ratio
- Consistent crop
- Correct object-fit
- No stretching
- No layout shift
- Appropriate lazy loading

Hero image can load with priority.

---

## 19. ICON SYSTEM

Do not use emojis as the primary interface icon system.

Use consistent SVG/icon-library icons for:
- Search
- Account
- Wishlist
- Cart
- Leaf
- Water
- Sunlight
- Delivery
- Payment
- Support
- Plant care
- Material

All icons should have consistent visual weight.

---

## 20. TRUST STRIP

Below the hero, include:

Healthy Plants — Direct from Nurseries
Safe & Secure — Payments
Fast & Reliable — Delivery
Expert Support — Plant Care Guidance

Use minimal line icons.

---

## 21. SEARCH EXPERIENCE

When search is activated, provide a refined search panel.

Before typing:
Recent Searches

Popular Searches:
- Low Light Plants
- Indoor Plants
- Ceramic Pots
- Easy Seeds

Categories:
- Plants
- Pots
- Seeds

While typing show:
- Products
- Categories
- Suggestions

Keep it fast and clean.

---

## 22. FLORA AI — CUSTOMER ONLY

**AI must exist ONLY on the customer-facing side.**

Do NOT add AI to:
- Admin dashboard
- Admin analytics
- Admin product management
- Admin order management

AI name:

**Flora AI**

Positioning:

**Your Plant Guide**

It should feel like a shopping assistant and plant-care guide.

---

## 23. FLORA AI CAPABILITIES

Support:

### Product discovery
- Low-light plants
- Plants under ₹500
- Easy plants for beginners

### Category discovery
- Show me pots
- Show flower seeds

### Compatibility
- Which pot should I get for my Money Plant?

### Plant care
- How often should I water a Snake Plant?
- Does this plant need bright light?

### Shopping
- I need two plants and one pot.

AI should connect recommendations to the real catalog.

---

## 24. FLORA AI MUST USE REAL CATALOG DATA

AI must NOT invent:
- Products
- Prices
- Inventory
- Discounts
- Delivery promises
- Policies

If recommending a product, show the actual product with:
- Product name
- Price
- Relevant metadata
- View Product
- Add to Cart

---

## 25. FLORA AI MOBILE

On mobile use a polished bottom sheet/focused chat.

Suggested structure:

Flora AI
Your Plant Guide

"Hi! What are you looking for?"

Quick actions:
- Low-light plants
- Plants under ₹500
- Help me choose

Input:
Ask Flora AI...

Do not allow the AI sheet to conflict with mobile bottom navigation.

---

## 26. PRODUCT DETAIL

If practical, provide a complete product detail page/route.

Include:
- Large image
- Product name
- Rating
- Price
- Availability
- Care/material metadata
- Add to Cart
- Buy Now

Below:
- About
- Care
- Delivery
- Reviews
- Related products
- Recommended products

---

## 27. CROSS-SELLING

Use only the three categories.

Examples:
- Snake Plant + Ceramic Pot
- Tomato Seeds + Suitable Pot
- Money Plant + Decorative Pot

Use:
- Frequently Bought Together
or
- Recommended For You

Do not overuse recommendations.

---

## 28. WISHLIST

Empty state:

**Your little garden is waiting.**

**Save plants, pots and seeds you love.**

[Explore Plants]

---

## 29. CART

Preserve working cart functionality.

Include:
- Product image
- Product name
- Quantity
- Price
- Remove
- Subtotal
- Shipping
- Total
- Checkout CTA

---

## 30. CHECKOUT

Preserve the existing flow:

Cart
→ Address
→ Delivery
→ Payment
→ Confirmation

Use a clear progress indicator.

---

## 31. MOBILE NAVIGATION

Use:

Home
Categories
Flora AI
Wishlist
Account

Cart can remain in the header.

Ensure comfortable touch targets.

---

## 32. RESPONSIVE DESIGN

Support:
- Mobile
- Tablet
- Laptop
- Desktop

Do not simply scale desktop down.

Mobile:
- Compact header
- 2-column product grid where appropriate
- Bottom navigation
- Focused AI
- Reduced animation

Tablet:
- Adaptive grids
- Balanced spacing
- Adaptive hero

Desktop:
- Full navigation
- Richer hero
- Larger product grids
- Subtle mouse-based 3D

---

## 33. TYPOGRAPHY

Use:
- One editorial serif for major headings
- One clean sans-serif for body/UI

Avoid unnecessary fonts.

---

## 34. DESIGN TOKENS

Use the existing `design_tokens.md` as the source of truth for:
- Colors
- Typography
- Spacing
- Radius
- Shadows
- Breakpoints
- Motion

Do not create conflicting values.

---

## 35. SCROLL REVEALS

Use GSAP ScrollTrigger for subtle:
- Fade
- TranslateY
- Image scale
- Stagger

Do not animate every element independently.

Do not hijack scrolling.

---

## 36. REDUCED MOTION

Support:

`prefers-reduced-motion`

When enabled:
- Disable floating
- Disable zero-gravity
- Reduce parallax
- Reduce scroll reveals
- Reduce transforms

All content must remain usable.

---

## 37. LOADING + EMPTY STATES

Use subtle skeleton loading where appropriate.

Flora AI:
**Flora AI is thinking...**

Cart:
**Your garden basket is empty.**

Search:
**No plants found for that search.**

Provide useful next actions.

---

## 38. ACCESSIBILITY

Perform a complete accessibility pass.

Ensure:
- Keyboard navigation
- Visible focus
- Correct button semantics
- Accessible labels
- Image alt text
- Sufficient contrast
- Escape closes overlays
- AI input is keyboard accessible
- Touch targets are large enough
- Reduced motion support

---

## 39. PERFORMANCE

Do not sacrifice performance for animation.

Ensure:
- Optimized images
- Lazy-loaded catalog images
- No unnecessary re-renders
- No duplicate event listeners
- No memory leaks
- Efficient GSAP timelines
- Transform/opacity-based animation where possible
- No unnecessary dependencies

---

## 40. CONTENT SAFETY / DATA ACCURACY

Do not invent unsupported product claims.

Avoid unsupported:
- Medical claims
- Guaranteed outcomes
- Certifications
- Pet-safety claims
- NASA claims
- Vastu/Feng Shui claims

Only use claims supported by the actual project data.

---

# 41. MAIN FOOTER

Keep the main footer consistent with the approved Flora Fusion reference.

If the existing design contains:
- Brand area
- About links
- Plant Care Guide
- FAQs
- Contact
- Social links
- Newsletter

these may remain in the **main footer**.

However, the **very bottom ending area must follow the exact sub-footer specification below.**

---

# 42. FINAL BOTTOM ENDING BAR / SUB-FOOTER

Create ONLY the bottom ending bar of the website.

The final ending area must contain:

### Copyright

**© 2026 Flora Fusion. All rights reserved.**

Use the current year dynamically if appropriate.

### Legal links

- Terms
- Shipping Policy
- Privacy Policy

Recommended desktop arrangement:

Left:
© 2026 Flora Fusion. All rights reserved.

Right:
Terms | Shipping Policy | Privacy Policy

Recommended mobile behavior:

Wrap or stack cleanly.

No horizontal overflow.

---

# 43. IMPORTANT SUB-FOOTER RESTRICTION

The sub-footer must NOT contain:

- Top navigation columns
- Product category columns
- Newsletter
- Newsletter input
- Social media columns
- Customer service columns
- Large navigation menus
- Duplicate footer content

The requested ending area is specifically:

**Copyright + Terms + Shipping Policy + Privacy Policy**

followed by the decorative repeating badge banner.

Do not copy the full Ugaoo footer.

Use the Ugaoo concept only as visual inspiration while keeping everything branded as Flora Fusion.

---

# 44. DECORATIVE REPEATING BADGE BANNER

Immediately after the copyright/legal strip, create the final decorative repeating badge banner at the absolute end of the page.

It should feel like a premium botanical nursery brand.

Use a repeating phrase/badge such as:

**A GREENER TOMORROW TOGETHER • FLORA FUSION • GROW WITH NATURE •**

Repeat continuously across the full width.

You may refine the wording to better fit Flora Fusion.

Use:
- Botanical leaf motifs
- Small separators
- Brand typography
- Deep botanical green
- Cream/neutral palette
- Subtle decorative details

This is a decorative ending element, not navigation.

---

# 45. FINAL BADGE ANIMATION

The repeating badge banner may use a subtle continuous marquee.

Use GSAP if appropriate.

Motion must be:
- Slow
- Continuous
- Seamless
- Linear
- Non-distracting

Respect:

`prefers-reduced-motion`

When reduced motion is enabled, stop the marquee or show a static version.

Do not let the banner overpower the footer.

---

# 46. FOOTER ENDING HIERARCHY

The final bottom of the page should visually progress:

Main Footer
↓
Thin divider
↓
Copyright + legal links
↓
Decorative repeating botanical badge strip
↓
End of page

The ending should feel deliberate, polished, and premium.

---

# 47. MICROINTERACTIONS

Add subtle interactions to:
- Wishlist
- Cart
- Search
- Buttons
- Filters
- Navigation
- Flora AI
- Product cards
- Legal links

Examples:
- Wishlist heart transition
- Cart confirmation
- Button press feedback
- Search open/close transition
- Filter selection
- AI message appearance

Do not over-animate.

---

# 48. ANIMATION PHILOSOPHY

The rule is:

**Premium motion, not maximum motion.**

Animation should support:
- Discovery
- Hierarchy
- Depth
- Delight

Animation must never interfere with:
- Reading
- Product selection
- Price visibility
- Navigation
- Checkout
- AI interaction

---

# 49. RESPONSIVE QA

Test the final UI at:
- 320px
- 375px
- 390px
- 430px
- Tablet widths
- 1366px
- 1440px
- Large desktop

Check:
- No horizontal overflow
- No clipped text
- No overlapping elements
- No broken grids
- No fixed-element collisions
- No AI/bottom-nav collision
- No footer overflow
- Legal links remain accessible

---

# 50. TECHNICAL QA

Before final delivery check:
- No console errors
- No broken image paths
- No missing assets
- No broken links
- No duplicate IDs
- No invalid HTML
- No duplicate Lenis instances
- No duplicate GSAP loops
- No memory leaks
- No layout shift from images
- No broken responsive states
- No inaccessible buttons
- No inaccessible dialogs
- No admin AI
- No additional main product categories

---

# 51. FINAL VISUAL QA

Compare the final implementation against the approved Flora Fusion reference images.

Verify:
- Overall composition
- Color palette
- Product card style
- Product imagery
- Typography
- Hero hierarchy
- Category sections
- Footer
- Mobile layout
- Botanical visual language

If something looks generic, refine it toward the approved Flora Fusion reference direction.

---

# 52. DO NOT DO THESE THINGS

Do NOT:
1. Rebuild unnecessarily.
2. Remove existing working functionality.
3. Add AI to admin.
4. Add new main product categories.
5. Replace GSAP.
6. Replace Lenis.
7. Add excessive animation.
8. Use emoji as the primary icon system.
9. Invent products.
10. Invent prices.
11. Invent inventory.
12. Invent policies.
13. Use random stock images.
14. Change the approved brand palette.
15. Add excessive gradients.
16. Add excessive glassmorphism.
17. Add excessive 3D.
18. Add newsletter content to the final sub-footer.
19. Add navigation columns to the final sub-footer.
20. Copy Ugaoo branding directly.
21. Make the footer overly large.
22. Sacrifice mobile usability for desktop visuals.
23. Sacrifice accessibility for animation.
24. Sacrifice performance for animation.

---

# 53. DEFINITION OF DONE

The final prototype is complete when it feels like:

**A premium, production-quality Flora Fusion plant-commerce website prototype.**

It should combine:

- Approved Flora Fusion visual identity
- Plants / Pots / Seeds catalog
- Premium product cards
- Search
- Filters
- Cart
- Wishlist
- Product detail
- Customer-only Flora AI
- Responsive mobile/tablet/desktop UI
- GSAP
- ScrollTrigger
- Lenis smooth scrolling
- Floating Animation
- Levitation Effect
- Zero-Gravity Motion
- Subtle 3D hero depth
- Accessibility
- Performance optimization
- Loading states
- Branded empty states
- Complete main footer
- Final copyright/legal sub-footer
- Final decorative repeating botanical badge banner

The final output must be a **working HTML/CSS/JavaScript prototype**.

**Refine the existing foundation, preserve working functionality, use the approved assets and design language, implement every refinement above, and deliver the complete Flora Fusion experience.**
