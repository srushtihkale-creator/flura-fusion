# Flora Fusion --- Software Requirements Specification (SRS)

**Document Status:** Final / Implementation Source of Truth\
**Project:** Flora Fusion\
**Application Type:** Premium Nursery E-Commerce Web Application\
**Frontend:** Next.js + React + TypeScript\
**Backend:** Spring Boot + Java\
**Database:** PostgreSQL\
**Storage:** Supabase Storage\
**Frontend Deployment:** Vercel\
**Backend Deployment:** Render

------------------------------------------------------------------------

# 1. Purpose

Flora Fusion is a premium online nursery e-commerce application for
selling:

-   Plants
-   Pots
-   Seeds

The system must provide a polished customer shopping experience and a
secure Admin/CMS system for managing products, inventory, pricing,
discounts, content, orders and media.

The approved frontend is the visual and UX baseline.

**Backend and CMS must be built around the approved frontend. The
frontend must not be redesigned to fit the backend.**

------------------------------------------------------------------------

# 2. Core Product Vision

Flora Fusion should feel like a real premium commercial nursery platform
rather than a generic college e-commerce project.

The application must provide:

-   Premium and trustworthy visual design
-   Simple product discovery
-   High-quality product imagery
-   Product gallery and supported 360° viewing
-   Search
-   Wishlist
-   Cart
-   Guest and authenticated checkout
-   Orders
-   Invoice PDF
-   Backend-controlled pricing and inventory
-   Admin dashboard
-   CMS
-   Discounts and coupons
-   Reviews
-   Plant-care content
-   Future Flora AI space visualization

------------------------------------------------------------------------

# 3. Non-Negotiable Frontend Rule

The current approved frontend UI/UX is frozen as the design baseline.

Backend implementation must NOT unnecessarily change:

-   Layout
-   Colors
-   Typography
-   Spacing
-   Buttons
-   Cards
-   Navigation
-   Product page structure
-   Existing animations
-   Product imagery
-   Responsive behavior
-   Visual hierarchy

Only genuine technical fixes or changes required for backend integration
are allowed.

Architecture should follow:

``` text
Current:

UI
 ↓
Components
 ↓
Typed Services
 ↓
Local / Mock Data
```

Future:

``` text
UI
 ↓
Components
 ↓
Typed Services
 ↓
REST API
 ↓
Spring Boot
 ↓
PostgreSQL
```

------------------------------------------------------------------------

# 4. Existing Frontend Scope

The current frontend contains:

-   Home
-   Plants
-   Pots
-   Seeds
-   Product details
-   Search
-   Wishlist
-   Cart
-   Checkout
-   Account
-   Orders
-   Order details
-   Flora AI
-   Plant Care
-   About

The current product catalog contains:

-   Plants
-   Pots
-   Seeds

The frontend already contains service abstractions that should be
retained and connected to backend APIs instead of being rewritten into
component-level API calls.

------------------------------------------------------------------------

# 5. Technology Stack

## Frontend

-   Next.js
-   React
-   TypeScript
-   Zustand
-   React Hook Form
-   Zod
-   GSAP
-   ScrollTrigger
-   Lenis
-   Lucide React

## Backend

-   Java
-   Spring Boot
-   Spring Security
-   JWT-based authentication/session strategy
-   Spring Data JPA
-   Hibernate
-   REST APIs
-   Bean Validation
-   Global exception handling

## Database

-   PostgreSQL
-   Supabase PostgreSQL

## Media Storage

-   Supabase Storage

## Deployment

``` text
Vercel
  ↓
Next.js Frontend

Render
  ↓
Spring Boot Backend

Supabase
  ├── PostgreSQL
  └── Storage
```

------------------------------------------------------------------------

# 6. Architecture

## Customer Application

``` text
Customer
   ↓
Next.js
   ↓
Service Layer
   ↓
API Client
   ↓
Spring Boot REST API
   ↓
Business Services
   ↓
Repositories
   ↓
PostgreSQL
```

## Admin/CMS

``` text
Admin
   ↓
Next.js /admin
   ↓
Admin Services
   ↓
Spring Boot REST API
   ↓
Authorization
   ↓
Business Services
   ↓
PostgreSQL / Storage
```

------------------------------------------------------------------------

# 7. User Roles

Only two roles are required initially.

## CUSTOMER

Can:

-   Browse products
-   Search
-   View products
-   Use gallery/360 viewer where supported
-   Add to wishlist
-   Add to cart
-   Checkout
-   Place orders
-   View orders
-   Download invoices
-   Manage profile
-   Manage addresses
-   Submit reviews

## ADMIN

Can:

-   Access Admin Dashboard
-   Manage products
-   Manage categories
-   Manage product media
-   Manage inventory
-   Manage prices
-   Manage discounts
-   Manage coupons
-   Manage orders
-   Manage customers
-   Manage reviews
-   Manage website content
-   Manage CMS content
-   View basic analytics

Public signup must never allow a customer to choose ADMIN role.

Backend must enforce role authorization.

------------------------------------------------------------------------

# 8. Authentication

Authentication must support:

-   Customer registration
-   Customer login
-   Logout
-   Authenticated session
-   Protected customer APIs
-   Protected admin APIs
-   Role-based authorization

Recommended model:

``` text
users
 ├── id
 ├── name
 ├── email
 ├── phone
 ├── password_hash
 ├── role
 ├── status
 ├── created_at
 └── updated_at
```

Authentication secrets must remain server-side.

------------------------------------------------------------------------

# 9. Guest Checkout

Login must NOT be mandatory for purchasing.

## Guest flow

``` text
Product
 ↓
Buy Now
 ↓
Checkout
 ↓
Guest Information
 ↓
Address
 ↓
Order Summary
 ↓
Mock Payment
 ↓
Order Created
 ↓
Invoice PDF
```

Guest checkout must collect:

-   Email
-   Full name
-   Mobile number
-   Delivery address
-   City
-   State
-   Pincode

Guest orders must remain associated with the guest email even if there
is no user account.

------------------------------------------------------------------------

# 10. CMS --- Mandatory Requirement

CMS is an actual implementation requirement, not merely a future
feature.

The Admin dashboard must provide content-management functionality.

## CMS responsibilities

Admin should be able to manage:

### Homepage

-   Hero/banner content
-   Promotional sections
-   Featured products
-   Featured categories
-   Marketing content
-   Section visibility/order where applicable

### Product Content

-   Product name
-   Description
-   Category
-   Price
-   SKU
-   Images
-   Gallery
-   Supported 360° images
-   Product status
-   Stock
-   Plant-care information where applicable

### Static Content

-   About page
-   Plant Care content
-   Other configurable informational sections

### Media

Product and CMS media must be stored using storage URLs/paths.

Images must not be stored as binary data inside PostgreSQL.

------------------------------------------------------------------------

# 11. Admin Dashboard

Admin route:

``` text
/admin
```

Suggested sections:

``` text
/admin
/admin/dashboard
/admin/products
/admin/categories
/admin/inventory
/admin/discounts
/admin/coupons
/admin/orders
/admin/customers
/admin/reviews
/admin/content
/admin/media
```

The Admin UI should use the same approved Flora Fusion design system
while remaining visually distinct enough to be usable as an
administrative interface.

Backend authorization is mandatory even if frontend route protection
exists.

------------------------------------------------------------------------

# 12. Product Management

Products must support:

-   Plants
-   Pots
-   Seeds

Product fields should include at minimum:

``` text
id
category_id
name
slug
description
sku
base_price
status
stock_quantity
created_at
updated_at
```

Additional metadata can be added where required by the existing
frontend.

Product slugs must be unique.

Products must support active/inactive status.

------------------------------------------------------------------------

# 13. Product Images and Media

Use a separate product media model.

Suggested fields:

``` text
id
product_id
media_url
media_type
sort_order
alt_text
created_at
```

Supported media types may include:

-   PRIMARY
-   GALLERY
-   ANGLE_360
-   OTHER

The architecture must support future CMS/storage-based media URLs.

Existing supported product gallery/angle behavior must continue to work.

Do not claim continuous 360° viewing where the product does not have
sufficient angle assets.

------------------------------------------------------------------------

# 14. Categories

Categories must be backend-driven.

Initial categories:

-   Plants
-   Pots
-   Seeds

Admin must be able to manage category:

-   Name
-   Slug
-   Description
-   Image
-   Active status
-   Display order

------------------------------------------------------------------------

# 15. Search

Search must be API-ready.

Future API:

``` http
GET /api/v1/search?q={query}
```

Search should support:

-   Product name
-   Category
-   Relevant searchable product information

Frontend search UI should remain unchanged unless a technical
integration requires a minimal change.

------------------------------------------------------------------------

# 16. Cart

Cart functionality must support:

-   Add product
-   Remove product
-   Update quantity
-   Clear cart
-   Validate stock
-   Calculate subtotal

Frontend cart state may remain in Zustand for client experience, but
backend must validate cart data before order creation.

Frontend-provided price must never be treated as authoritative.

------------------------------------------------------------------------

# 17. Wishlist

Wishlist must support:

-   Add product
-   Remove product
-   View wishlist
-   Authenticated customer persistence

Guest/local wishlist may remain client-side where appropriate.

------------------------------------------------------------------------

# 18. Pricing

Pricing must be backend-controlled.

Frontend must display backend-provided values but must never be trusted
for final checkout totals.

Backend owns:

-   Product price
-   Discount
-   Coupon
-   Stock
-   Shipping
-   Tax if applicable
-   Final order total

Example:

``` json
{
  "price": 999,
  "discount": {
    "type": "PERCENTAGE",
    "value": 20
  },
  "finalPrice": 799
}
```

------------------------------------------------------------------------

# 19. Discounts

Discounts must be database/backend driven.

Suggested discount fields:

``` text
id
name
type
value
start_at
end_at
active
minimum_cart_value
maximum_discount
usage_limit
created_at
updated_at
```

Supported types:

-   PERCENTAGE
-   FIXED_AMOUNT

Discount applicability should support products and/or categories.

Changing a discount must not require a frontend redeployment.

------------------------------------------------------------------------

# 20. Coupons

Coupons should support:

-   Coupon code
-   Discount type
-   Discount value
-   Start/end date
-   Minimum cart value
-   Maximum discount
-   Usage limit
-   Active/inactive state
-   Applicable products/categories where required

Coupon validation must happen on the backend.

------------------------------------------------------------------------

# 21. Checkout

Checkout must support:

-   Guest checkout
-   Logged-in checkout
-   Address selection
-   New address
-   Cart validation
-   Stock validation
-   Price validation
-   Discount validation
-   Coupon validation
-   Final total calculation
-   Payment step

The backend must calculate the authoritative order total.

------------------------------------------------------------------------

# 22. Orders

Suggested order fields:

``` text
id
user_id nullable
guest_email nullable
order_number
subtotal
discount_amount
shipping_amount
tax_amount
total_amount
payment_status
order_status
shipping_address_snapshot
created_at
updated_at
```

Order creation must be safe against duplicate submissions.

Use idempotency where appropriate.

------------------------------------------------------------------------

# 23. Order Items

Order items must store historical purchase information.

Suggested fields:

``` text
id
order_id
product_id
product_name_snapshot
sku_snapshot
quantity
unit_price
discount_amount
line_total
```

The order must remain historically correct even if a product's name or
price changes later.

------------------------------------------------------------------------

# 24. Payment

The project currently has no real users/business payment requirement.

Therefore:

### Current implementation

Use a **Mock Payment Service**.

Architecture:

``` text
PaymentService
      ↓
MockPaymentService
```

The payment layer must be provider-agnostic so a real provider can be
added later.

Future:

``` text
PaymentService
      ↓
RazorpayPaymentService
```

Frontend must not contain payment secrets.

If a real gateway is added later:

-   Backend creates payment order
-   Customer completes payment
-   Backend verifies payment
-   Webhook is handled where required
-   Order is created/updated only after valid payment state

------------------------------------------------------------------------

# 25. Invoice PDF

Email is NOT required in the current version.

After successful order placement:

``` text
Checkout
 ↓
Payment
 ↓
Order Created
 ↓
Order Confirmation
 ↓
Invoice PDF
```

Invoice must include:

-   Flora Fusion branding
-   Order ID
-   Order date
-   Customer/guest details
-   Delivery address
-   Items
-   Quantity
-   Price
-   Discount
-   Shipping
-   Total
-   Payment status

Customers should be able to download invoices from My Orders.

Backend should generate invoice data from authoritative order
information.

------------------------------------------------------------------------

# 26. Address Management

Authenticated customers can:

-   Add address
-   Edit address
-   Delete address
-   Select delivery address

Suggested fields:

``` text
id
user_id
full_name
phone
address_line
city
state
pincode
created_at
updated_at
```

Guest address is stored as part of the order snapshot.

------------------------------------------------------------------------

# 27. Reviews

Reviews should support:

-   Customer
-   Product
-   Rating
-   Review text
-   Status
-   Created date

Admin must be able to moderate reviews.

Only valid customers/orders should be allowed to submit reviews
according to the final business rule.

------------------------------------------------------------------------

# 28. Inventory

Inventory must be backend-controlled.

Backend must validate stock:

-   During cart validation
-   During checkout
-   During order creation

Stock must never rely only on frontend Zustand state.

Admin must be able to update inventory.

------------------------------------------------------------------------

# 29. Flora AI

Flora AI is part of the broader Flora Fusion vision.

Future functionality:

``` text
Customer uploads room/place image
        ↓
Selects plants/pots
        ↓
AI visualization
        ↓
Generated preview
```

The architecture should support storing:

-   User
-   Input image
-   Selected products
-   Generated result
-   Status
-   Timestamps

Suggested future table:

``` text
ai_visualizations
```

This feature may be implemented after the core commerce system.

------------------------------------------------------------------------

# 30. Plant Care

Plant Care content should be CMS-ready.

Content may include:

-   Watering
-   Light
-   Soil
-   Temperature
-   Maintenance
-   Care instructions

The frontend should consume structured content rather than requiring
permanent hardcoded text.

------------------------------------------------------------------------

# 31. Media Storage

Use Supabase Storage for production media.

Suitable media includes:

-   Product primary images
-   Product gallery images
-   360° angle images
-   CMS banners
-   CMS content images
-   Future Flora AI uploads

Database should store media URLs or storage paths, not image binaries.

Static application assets that are tightly coupled to the frontend may
remain in the repository where appropriate.

------------------------------------------------------------------------

# 32. Motion and Animation

Motion must follow the approved motion architecture.

Primary tools:

-   GSAP
-   ScrollTrigger
-   Lenis
-   CSS transitions

Architecture:

``` text
Lenis
 ↓
Smooth Scrolling
 ↓
GSAP / ScrollTrigger
 ↓
Scroll-driven Motion
 ↓
Premium UI
```

Motion must be:

-   Premium
-   Restrained
-   Intentional
-   Purposeful
-   Smooth

Avoid:

-   Scroll-jacking
-   Excessive parallax
-   Constant movement
-   Huge layout shifts
-   Endless stagger
-   Long cinematic loading
-   Expensive mobile effects

Prefer:

-   transform
-   opacity

Avoid layout-reflow animations where possible.

All animation code must:

-   Clean up GSAP/ScrollTrigger instances
-   Avoid duplicate Lenis initialization
-   Respect `prefers-reduced-motion`
-   Work safely with Next.js client/server boundaries
-   Be reduced appropriately on mobile

Do not redesign existing approved motion without a genuine technical
reason.

------------------------------------------------------------------------

# 33. State Management

Separate state into:

## Local UI State

Examples:

-   Modal open/close
-   Filters
-   Viewer zoom
-   Temporary form state

## Client Application State

Zustand may manage:

-   Cart
-   Wishlist
-   Local checkout state
-   Relevant persisted client state

## Server State

Backend owns:

-   Products
-   Prices
-   Stock
-   Discounts
-   Orders
-   Customers
-   CMS content
-   Reviews
-   Authoritative checkout information

------------------------------------------------------------------------

# 34. API Client

A centralized typed API client must be used.

Expected pattern:

``` text
Component
   ↓
Service
   ↓
apiFetch<T>()
   ↓
REST API
```

API base URL must be environment-driven.

Example:

``` env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

Production must use the production backend URL.

No API secrets may be exposed through public frontend environment
variables.

------------------------------------------------------------------------

# 35. Suggested API Structure

Base:

``` text
/api/v1
```

Suggested endpoints:

``` text
/auth
/users
/products
/categories
/search
/cart
/wishlist
/addresses
/orders
/payments
/discounts
/coupons
/reviews
/plant-care
/cms
/admin
/media
/ai
```

Exact endpoint design may be finalized during backend implementation
while preserving the frontend service contracts.

------------------------------------------------------------------------

# 36. Suggested Database Tables

Core database:

1.  users
2.  addresses
3.  categories
4.  products
5.  product_images
6.  carts
7.  cart_items
8.  wishlists
9.  wishlist_items
10. orders
11. order_items
12. payments
13. discounts
14. discount_products
15. coupons
16. reviews

Future/extended:

17. ai_visualizations

CMS may use dedicated content tables/entities depending on the final CMS
model, for example:

-   cms_pages
-   cms_sections
-   cms_banners
-   cms_media

The exact CMS table structure should be finalized during ERD design
based on the content requirements.

------------------------------------------------------------------------

# 37. Security

Backend must enforce:

-   Authentication
-   Authorization
-   Role checks
-   Input validation
-   Password hashing
-   Secure token/session handling
-   CORS configuration
-   Rate limiting where appropriate
-   No secret exposure
-   Server-side price validation
-   Server-side stock validation
-   Server-side discount validation
-   Server-side coupon validation
-   Order ownership checks
-   Admin authorization

Frontend role checks are UX protection only.

Backend authorization is authoritative.

------------------------------------------------------------------------

# 38. Error Handling

Provide consistent API error responses.

Frontend must support:

-   Loading states
-   Error states
-   Empty states
-   Retry where appropriate
-   Invalid route handling
-   Failed checkout handling
-   Failed API handling
-   Payment failure handling

Next.js should include appropriate:

-   `not-found`
-   `error`
-   loading states

------------------------------------------------------------------------

# 39. Responsive Design

The existing approved responsive behavior must be preserved.

The application must work on:

-   Desktop
-   Laptop
-   Tablet
-   Mobile

Mobile must not receive unnecessary heavy animation or interaction
complexity.

------------------------------------------------------------------------

# 40. Accessibility

The system should follow accessible practices including:

-   Keyboard navigation
-   Focus states
-   Semantic HTML
-   Accessible buttons/controls
-   Appropriate labels
-   Alt text
-   Modal accessibility
-   Reduced motion support
-   Sufficient contrast

Product 360/gallery interactions must remain keyboard-accessible where
supported.

------------------------------------------------------------------------

# 41. SEO / AEO / GEO

The production application should support:

-   Metadata
-   Product metadata
-   Category metadata
-   Open Graph data
-   Structured data where appropriate
-   Clean URLs
-   SEO-friendly product slugs
-   Crawlable content
-   Useful page titles/descriptions

CMS content should remain SEO-friendly.

------------------------------------------------------------------------

# 42. Performance

Performance requirements:

-   Optimize images
-   Lazy-load appropriate media
-   Preload only important product/gallery assets
-   Avoid unnecessary JavaScript
-   Avoid layout shifts
-   Clean animation lifecycle
-   Avoid unnecessary API calls
-   Use caching where appropriate
-   Keep mobile performance a priority

360° assets should not all be loaded unnecessarily when not needed.

------------------------------------------------------------------------

# 43. Testing

Testing must cover:

## Frontend

-   TypeScript
-   Build
-   Routing
-   Components
-   Services
-   State management
-   Responsive behavior
-   Accessibility

## Backend

-   Unit tests
-   Repository/service tests
-   Controller/API tests
-   Validation
-   Authorization
-   Pricing
-   Discount
-   Coupon
-   Inventory
-   Order creation
-   Payment state

## Integration

Test:

``` text
Frontend
 ↓
API
 ↓
Spring Boot
 ↓
PostgreSQL
```

## E2E

Primary flow:

``` text
Home
 ↓
Category
 ↓
Product
 ↓
Gallery / supported 360
 ↓
Cart
 ↓
Checkout
 ↓
Mock Payment
 ↓
Order
 ↓
Invoice
```

Also test:

-   Guest checkout
-   Logged-in checkout
-   Invalid coupon
-   Out-of-stock product
-   Price change before checkout
-   Payment failure
-   Duplicate order submission
-   Unauthorized admin access

------------------------------------------------------------------------

# 44. Production Configuration

Environment-specific configuration must be used.

Development:

``` text
Frontend → localhost
Backend → localhost
Database → development PostgreSQL
```

Production:

``` text
Vercel
 ↓
Next.js

Render
 ↓
Spring Boot

Supabase
 ├── PostgreSQL
 └── Storage
```

Secrets must be stored in platform environment variables.

Never commit:

-   Passwords
-   JWT secrets
-   Database credentials
-   Payment secrets
-   Private API keys

------------------------------------------------------------------------

# 45. Development Workflow

## Phase 1 --- Frontend Validation

1.  Run frontend locally.
2.  Test all routes.
3.  Test responsive behavior.
4.  Test products.
5.  Test gallery/360.
6.  Test search.
7.  Test wishlist.
8.  Test cart.
9.  Test checkout.
10. Test mock payment.
11. Test order.
12. Test invoice.
13. Fix genuine technical issues only.
14. Freeze frontend.

## Phase 2 --- Database

1.  Finalize ERD.
2.  Finalize tables.
3.  Finalize columns.
4.  Finalize relationships.
5.  Create PostgreSQL database.
6.  Create migrations.

## Phase 3 --- Spring Boot

1.  Create project.
2.  Configure PostgreSQL.
3.  Configure JPA/Hibernate.
4.  Create entities.
5.  Repositories.
6.  Services.
7.  Controllers.
8.  Validation.
9.  Exception handling.

## Phase 4 --- Authentication and RBAC

1.  CUSTOMER authentication.
2.  ADMIN authentication.
3.  Authorization.
4.  Protected APIs.
5.  Protected `/admin`.

## Phase 5 --- Catalog

1.  Categories.
2.  Products.
3.  Product media.
4.  Inventory.
5.  Search.
6.  Frontend service integration.

## Phase 6 --- Shopping

1.  Cart.
2.  Wishlist.
3.  Addresses.

## Phase 7 --- Checkout and Orders

1.  Guest checkout.
2.  Logged-in checkout.
3.  Price validation.
4.  Stock validation.
5.  Discount validation.
6.  Coupon validation.
7.  Order creation.
8.  Idempotency.

## Phase 8 --- Payment

Implement Mock Payment first.

Keep provider abstraction ready for a future real payment gateway.

## Phase 9 --- Invoice

Generate downloadable order invoice PDF.

## Phase 10 --- Admin + CMS

Implement:

-   Dashboard
-   Products
-   Categories
-   Inventory
-   Discounts
-   Coupons
-   Orders
-   Customers
-   Reviews
-   CMS
-   Media management

CMS must be functional, not only documented as future scope.

## Phase 11 --- Flora AI

Implement room/place visualization after core commerce functionality is
stable.

## Phase 12 --- Production

1.  Production environment variables.
2.  Production database.
3.  Storage.
4.  Backend deployment.
5.  Frontend deployment.
6.  Integration testing.
7.  Smoke testing.
8.  Security review.
9.  Performance review.

------------------------------------------------------------------------

# 46. Frontend-to-Backend Migration Rule

Existing service boundaries must be preserved.

Example:

``` text
Before:

Product Page
 ↓
product.service.ts
 ↓
local product data
```

After:

``` text
Product Page
 ↓
product.service.ts
 ↓
apiFetch()
 ↓
Spring Boot
 ↓
PostgreSQL
```

Components should not be rewritten to contain direct database/API logic.

------------------------------------------------------------------------

# 47. Backend Authority Rule

The frontend is never authoritative for:

-   Price
-   Discount
-   Coupon
-   Stock
-   Shipping
-   Tax
-   Final order total
-   Payment status
-   Permissions

The backend must recalculate and validate these values.

------------------------------------------------------------------------

# 48. CMS Authority Rule

CMS-managed content must come from backend APIs.

Do not require frontend source-code changes for normal admin content
updates.

Examples:

``` text
Admin changes banner
→ Save CMS content
→ API
→ Database/Storage
→ Customer frontend receives updated content
```

and:

``` text
Admin changes product price
→ Backend database
→ Product API
→ Customer frontend
```

No frontend redeployment should be required for normal CMS/product
content updates.

------------------------------------------------------------------------

# 49. Design and Engineering Principles

The implementation must follow:

-   Existing approved design is the source of visual truth.
-   SRS is the source of functional/technical truth.
-   Do not rebuild working frontend unnecessarily.
-   Do not introduce unnecessary libraries.
-   Keep services typed.
-   Keep components focused.
-   Keep business rules on backend.
-   Keep secrets on backend.
-   Prefer reusable abstractions.
-   Keep production deployment in mind.
-   Avoid over-engineering.
-   Do not create unnecessary roles.
-   Do not add features that conflict with the approved scope.

------------------------------------------------------------------------

# 50. Current Frontend Audit Baseline

Latest frontend audit status:

**READY WITH FIXES**

Verified/fixed areas include:

-   TypeScript/imports/runtime
-   SSR/client boundaries
-   Production build
-   Routes
-   Assets
-   Product/gallery/360 foundations
-   Cart
-   Wishlist
-   Checkout
-   Orders
-   Search service
-   Zustand persistence
-   Service layer/mock separation
-   Spring Boot API readiness
-   Environment configuration
-   Loading/error/empty states
-   Responsive/accessibility
-   GSAP/Lenis cleanup
-   Performance
-   Dependencies
-   ESLint

Latest service verification:

**15/15 tests passing**

The approved UI/UX must remain unchanged while backend integration
proceeds.

Known future limitation:

-   Continuous 24-frame true 360° assets are not available for every
    product. Existing supported multi-angle assets should be used
    honestly; future asset ingestion can expand coverage.

------------------------------------------------------------------------

# 51. Definition of Done

Flora Fusion is considered complete when:

### Frontend

-   Approved UI/UX is preserved.
-   All customer routes work.
-   Responsive behavior works.
-   Product/gallery/360 functionality works where assets exist.
-   Search works.
-   Cart works.
-   Wishlist works.
-   Checkout works.

### Backend

-   Spring Boot API works.
-   PostgreSQL works.
-   Authentication works.
-   RBAC works.
-   Product/catalog APIs work.
-   Cart/wishlist APIs work.
-   Checkout/order APIs work.
-   Backend pricing/stock validation works.

### CMS/Admin

-   Admin login works.
-   Admin authorization works.
-   Product management works.
-   Inventory management works.
-   Discount/coupon management works.
-   Order management works.
-   Customer management works.
-   Review management works.
-   CMS content management works.
-   Media management works.

### Commerce

-   Guest checkout works.
-   Logged-in checkout works.
-   Mock payment works.
-   Orders are persisted.
-   Invoice PDF works.
-   Duplicate order protection works.

### Production

-   Environment configuration works.
-   Secrets are protected.
-   Frontend deploys successfully.
-   Backend deploys successfully.
-   PostgreSQL works.
-   Storage works.
-   End-to-end smoke test passes.

------------------------------------------------------------------------

# 52. Final Architecture

``` text
                         ┌───────────────────────┐
                         │       CUSTOMER        │
                         └───────────┬───────────┘
                                     ↓
                         ┌───────────────────────┐
                         │   Next.js Frontend    │
                         │       Vercel          │
                         └───────────┬───────────┘
                                     ↓
                         ┌───────────────────────┐
                         │ Typed Service Layer   │
                         │     API Client        │
                         └───────────┬───────────┘
                                     ↓
                         ┌───────────────────────┐
                         │   Spring Boot REST    │
                         │        Render         │
                         └───────────┬───────────┘
                                     ↓
              ┌────────────────────┼────────────────────┐
              ↓                    ↓                    ↓
       ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
       │ PostgreSQL   │     │ Auth / RBAC  │     │ CMS / Admin  │
       │   Supabase   │     │              │     │              │
       └──────────────┘     └──────────────┘     └──────────────┘
              │
              ↓
       ┌──────────────┐
       │ Supabase     │
       │ Storage      │
       └──────────────┘
```

------------------------------------------------------------------------

# 53. Final Implementation Principle

**Build the backend, database, authentication, CMS, admin and commerce
services around the approved Flora Fusion frontend.**

Do not rebuild the frontend around the backend.

The final target is:

``` text
Premium Frontend
        +
Spring Boot Backend
        +
PostgreSQL
        +
Admin/CMS
        +
Storage
        +
Secure Commerce Logic
        +
Production Deployment
```

This SRS is the implementation source of truth for the Flora Fusion
project.
