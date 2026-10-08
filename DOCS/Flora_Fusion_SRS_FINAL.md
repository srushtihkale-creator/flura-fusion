# Flora Fusion --- Software Requirements Specification (SRS)

**Document Status:** Final / Implementation Source of Truth (Fully Updated to Milestone 36)\
**Project:** Flora Fusion\
**Application Type:** Premium Nursery E-Commerce Web Application\
**Frontend:** Next.js 14 + React 18 + TypeScript (Zustand, GSAP 3.12, Lenis)\
**Backend:** Spring Boot 3.3.4 + Java 21 (Spring Data JPA, Spring Security 6)\
**Database:** PostgreSQL (Supabase / Local) via Flyway Migrations (V1–V4)\
**Payments:** Razorpay Standard Gateway (`checkout.js`) & Mock Payment Provider\
**Logistics & Fulfillment:** Official Shiprocket REST API (`apiv2.shiprocket.in`) & Real-Time Transit Sync\
**Transactional Emails:** Dual Pluggable Architecture (Spring Boot Gmail SMTP STARTTLS & Vercel Resend Serverless)\
**AI Services:** Google Gemini API (`gemini-3.8-flash`) Live Catalog Recommendation Engine\
**Storage:** Supabase Storage (`flora-fusion-media`)\
**Deployments:** Vercel (Frontend SSG/SSR) & Render (Backend Docker Web Service)

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

## Frontend [IMPLEMENTED]

-   Next.js 14 App Router [IMPLEMENTED]
-   React 18 [IMPLEMENTED]
-   TypeScript [IMPLEMENTED]
-   Zustand (Persistent State) [IMPLEMENTED]
-   React Hook Form + Zod [IMPLEMENTED]
-   GSAP 3.12 + ScrollTrigger [IMPLEMENTED]
-   Lenis Smooth Inertia Scroll [IMPLEMENTED]
-   Lucide React Icons [IMPLEMENTED]

## Backend [IMPLEMENTED]

-   Java 21 [IMPLEMENTED]
-   Spring Boot 3.3.4 [IMPLEMENTED]
-   Spring Security 6.x [IMPLEMENTED]
-   Stateless JWT Authentication [IMPLEMENTED]
-   Google OAuth2 Login [PLANNED / NOT YET IMPLEMENTED]
-   Spring Data JPA + Hibernate ORM [IMPLEMENTED]
-   Flyway Database Migrations [IMPLEMENTED]
-   SpringDoc OpenAPI 3 / Swagger UI (`/swagger-ui.html`) [IMPLEMENTED]
-   OpenPDF / iText 7 Tax Invoice Generation [IMPLEMENTED]
-   Google Gemini API (`gemini-3.8-flash`) Botanical Layer [IMPLEMENTED]
-   Email Notification Service (Gmail SMTP / Resend) [PLANNED / NOT YET IMPLEMENTED]
-   Automation / Scheduled Backend Services (`@Scheduled`) [PLANNED / NOT YET IMPLEMENTED]
-   REST API Architecture with Bean Validation [IMPLEMENTED]
-   Global Exception Handling [IMPLEMENTED]

## Database [IMPLEMENTED]

-   PostgreSQL 15+ (Local `localhost:5432` / Supabase Cloud) [IMPLEMENTED]
-   Flyway Migrations (`V1__init_schema.sql`, `V2__seed_catalog_and_cms.sql`, `V3__offers_and_marquee.sql`) [IMPLEMENTED]

## Media Storage [PARTIALLY IMPLEMENTED]

-   Static & Local Media Routing (`public/assets/`) [IMPLEMENTED]
-   Supabase Storage Provisioning Script (`backend/sql/04_supabase_storage_setup.sql`) [IMPLEMENTED]
-   Direct Supabase Storage Multipart Backend API Upload Integration [PLANNED / NOT YET IMPLEMENTED]

## Deployment [IMPLEMENTED]

``` text
Vercel [IMPLEMENTED]
  ↓
Next.js Frontend

Render [IMPLEMENTED]
  ↓
Spring Boot Backend

Supabase Cloud [IMPLEMENTED / PARTIALLY INTEGRATED]
  ├── PostgreSQL (SSL JDBC Connection Pooler) [IMPLEMENTED]
  └── Storage (flora-fusion-media bucket setup) [PARTIALLY IMPLEMENTED]
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

# 8. Authentication [IMPLEMENTED / PARTIALLY EXTENDED]

Authentication must support:

-   Customer registration (`POST /api/v1/auth/register`) [IMPLEMENTED]
-   Customer login (`POST /api/v1/auth/login`) [IMPLEMENTED]
-   Logout (JWT token clearing from localStorage & Zustand store) [IMPLEMENTED]
-   Authenticated session with stateless JWT tokens [IMPLEMENTED]
-   Protected customer APIs (`/api/v1/cart/**`, `/api/v1/wishlist/**`, `/api/v1/orders/**`) [IMPLEMENTED]
-   Protected admin APIs (`/api/v1/admin/**`) with `ROLE_ADMIN` check [IMPLEMENTED]
-   Role-based authorization (RBAC) [IMPLEMENTED]
-   Google OAuth2 Social Login (`/oauth2/authorization/google`) [PLANNED / NOT YET IMPLEMENTED]
    - *Current Implementation:* Dual Authentication tabbed modal (`AuthModal.tsx`) with Email + Password login/registration and quick test-account login chips.
    - *Remaining Implementation:* Google OAuth2 client credentials integration in Spring Security, frontend "Sign in with Google" button, and OAuth callback handler to link Google profile with `users` table.

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

# 22. Orders [IMPLEMENTED]

Authoritative order entity fields (PostgreSQL `orders` table):

``` text
id (UUID, PK)
user_id (UUID, FK -> users.id, nullable for guest checkout)
order_number (VARCHAR(50), UNIQUE, format: FF-XXXXXX)
subtotal (NUMERIC(10,2))
discount_amount (NUMERIC(10,2))
shipping_amount (NUMERIC(10,2))
tax_amount (NUMERIC(10,2))
total_amount (NUMERIC(10,2))
payment_status (VARCHAR(30) -> 'PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')
order_status (VARCHAR(30) -> 'Placed', 'Confirmed', 'Packed', 'Dispatched', 'Out for Delivery', 'Delivered', 'Cancelled')
tracking_milestones (JSONB -> array of 6 tracking steps with timestamps)
shipping_address_snapshot (JSONB / text)
payment_transaction_id (VARCHAR(100), stores Razorpay payment ID / mock reference)
created_at (TIMESTAMPTZ)
updated_at (TIMESTAMPTZ)
```

Order creation is strictly protected against duplicate submissions, negative stock deductions, and client-side price tampering.

### 22.1 Manual Customer Order-Status Management & Normalization [IMPLEMENTED]
- **Authoritative Database Constraints:** PostgreSQL check constraint in `01_schema.sql` enforces valid states:
  `order_status IN ('Placed', 'Confirmed', 'Packed', 'Dispatched', 'Out for Delivery', 'Delivered', 'Cancelled')`.
- **Backend Status Normalization (`OrderService.normalizeOrderStatus`):** Maps client variants (`PLACED`, `CONFIRMED`, `PACKED`, `SHIPPED` / `DISPATCHED`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`) directly to exact database values.
- **Admin Fulfillment REST API:** `PATCH /api/v1/admin/orders/{id}/status` secured via `@PreAuthorize("hasRole('ADMIN')")`. Accepts order UUID or `FF-XXXXXX` human-readable order number.
- **Admin Dashboard UI:** Inline pill dropdown selector in the Orders table (`AdminDashboardView.tsx`) using design tokens (`var(--radius-pill)`, `0.75rem`, contextual badges) matching the product status dropdown.

### 22.2 Real-Time Transit Milestone Synchronization [IMPLEMENTED]
- **Database Persistence:** Serializes calculated milestones into the `tracking_milestones` JSONB column on every status transition.
- **Customer View Sync:** `OrderDetailView.tsx` fetches authoritative order records on mount, updating the 6-stage visual timeline (*Placed ➔ Confirmed ➔ Packed ➔ Dispatched ➔ Out for Delivery ➔ Delivered*) with dynamic checkmarks (`✓`) in real-time. If cancelled, renders a clean 2-stage milestone (*Order Placed ➔ Order Cancelled*).
- **Concurrency-Safe Notifications:** Status changes trigger asynchronous customer notification emails via `AsyncEmailDispatcher.java` with immutable payloads, preventing Hibernate multi-threaded session corruption (`Illegal pop() with non-matching JdbcValuesSourceProcessingState`).

### 22.3 Official Shiprocket Logistics Integration & Safe Test-Mode Guard [IMPLEMENTED]
- **API Architecture:** Provider-agnostic `ShippingService` interface with `ShiprocketShippingService.java` communicating with `https://apiv2.shiprocket.in`.
- **Authentication & Token Caching:** `POST /v1/external/auth/login` caches authentication tokens thread-safely in-memory for 200 hours (under Shiprocket's 240-hour TTL).
- **Ad-Hoc Order Creation:** `POST /v1/external/orders/create/adhoc` registers shipping drafts with recipient contact, full shipping address, pickup location (`Home`), line items, SKUs, and nursery package metrics.
- **Botanical Packaging Calculations:**
  - *Live Plants:* ~1.2 kg per item (protective ventilation box, soil moisture lock).
  - *Ceramic/Terracotta Pots:* ~1.5 kg per item (heavy protective padding).
  - *Seeds:* ~0.15 kg per item (light envelope).
  - *Standard Box Dimensions:* Length `25cm` × Breadth `20cm` × Height `30cm`.
- **Ironclad Test-Mode Safety Guard (`SHIPROCKET_TEST_MODE=true`):**
  - Confirms order creation on Shiprocket cloud and captures official `order_id` and `shipment_id`.
  - **Strictly halts prior to courier assignment** (`/v1/external/courier/assign/awb`) and pickup scheduling.
  - Guarantees **zero wallet deduction**, **zero live AWB barcode generation**, and **zero physical pickup dispatches** during testing.
- **Admin Control:** **`Shiprocket 🚀`** button in the Orders table with loading indicator and persistent badge (`✓ SR #order_id`).
- **Production Activation:** Toggle `SHIPROCKET_TEST_MODE=false` in `backend/.env` after completing account KYC and wallet recharge.

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

# 24. Payment [IMPLEMENTED: RAZORPAY STANDARD GATEWAY & MOCK]

Flora Fusion provides a dual-mode payment architecture supporting official Razorpay Standard Gateway for client-side checkout and an offline Mock Payment Provider for headless automated testing.

### 24.1 Razorpay Standard Checkout Integration [IMPLEMENTED]

- **Client-Side Modal Popup:** Dynamically loads the official Razorpay script (`https://checkout.razorpay.com/v1/checkout.js`) on customer demand in [`CheckoutPageView.tsx`](file:///d:/flora%20fusion/src/components/checkout/CheckoutPageView.tsx), preventing upfront payload weight during initial page load.
- **Environment Configuration:**
  - `NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_TkGZqDthTkR6pj` configured in `.env.local` and `.env.example`.
  - Backend `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET` in `backend/.env`.
- **Checkout Execution Flow:**
  1. Customer completes shipping address and selects **Card / UPI / NetBanking**.
  2. Frontend opens standard modal with brand styling (`#173F2B`), customer prefill (name, email, phone), and order total in paise (`amount = Math.round(total * 100)`).
  3. Upon successful payment authorization, the callback receives `razorpay_payment_id` (e.g., `pay_test_...`).
  4. Frontend forwards `paymentReference` to `POST /api/v1/orders`.
  5. Spring Boot `OrderService.java` persists order in PostgreSQL with `paymentStatus = "COMPLETED"`, `paymentTransactionId = paymentReference`, and `orderStatus = "CONFIRMED"`.
  6. Automatically dispatches order confirmation email with attached binary PDF Tax Invoice via `AsyncEmailDispatcher`.

### 24.2 RBI Domestic Card Compliance & Indian Test Card Specification [IMPLEMENTED]

- **RBI Compliance Guard:** Indian Razorpay merchant accounts reject foreign cards with *"International cards are not supported"*.
- **Supported Domestic Test Credentials:**
  - **Domestic Visa Card:** `4718 6091 0820 4366` (CVV: `123`, Expiry: Any future date `12/28`).
  - **NetBanking:** Select **HDFC Bank** or **State Bank of India** ➔ Click green **Success** button.
  - **UPI:** VPA `success@razorpay` ➔ Click green **Success** button.
- **In-Page Test Helper:** Dedicated helper card rendered inside `CheckoutPageView.tsx` whenever `NEXT_PUBLIC_RAZORPAY_KEY_ID` starts with `rzp_test_`.
- **Production Activation:** Transitioning to live payments requires only swapping `rzp_live_...` credentials in production environment variables with zero code alterations.

### 24.3 Mock Payment Provider [IMPLEMENTED]
- `MockPaymentService.java` & `POST /api/v1/orders/{id}/payment` remains active for offline local testing and mock payment simulation.

------------------------------------------------------------------------

# 25. Invoice PDF & Email Notifications [IMPLEMENTED: PDF, SMTP & RESEND]

### 25.1 Official PDF Tax Invoice Generation [IMPLEMENTED]

After successful order placement:

``` text
Checkout [IMPLEMENTED]
 ↓
Razorpay / Mock Payment Authorized [IMPLEMENTED]
 ↓
Order Created in PostgreSQL [IMPLEMENTED]
 ↓
OpenPDF / iText Tax Invoice Generated [IMPLEMENTED]
 ↓
Attached to Customer Confirmation Email & Downloadable in App [IMPLEMENTED]
```

Compliant binary OpenPDF / iText 7 document generated via `InvoiceService.java` includes:
- Flora Fusion brand header, registered logo, and botanical tagline [IMPLEMENTED]
- Order ID / Number (`FF-XXXXXX`) and order date [IMPLEMENTED]
- Customer billing and delivery addresses [IMPLEMENTED]
- Itemized nursery line items: product name, category, SKU, quantity, unit price, and subtotal [IMPLEMENTED]
- Mathematical tax breakdown: CGST (9%), SGST (9%), coupon discount deduction, and shipping fee [IMPLEMENTED]
- Authorized digital stamp and payment confirmation [IMPLEMENTED]
- REST API: `GET /api/v1/orders/{orderNumber}/invoice` protected by strict user ownership check (RBAC). Downloadable directly from `/account/orders/[id]`. [IMPLEMENTED]

### 25.2 Pluggable Transactional Email Architecture [IMPLEMENTED]

Flora Fusion implements a pluggable, environment-segregated transactional email system supporting three swappable strategies configured via `EMAIL_PROVIDER`:

1. **Spring Boot Gmail SMTP (`SmtpEmailProvider.java`):**
   - Uses `spring-boot-starter-mail` and `JavaMailSender` over STARTTLS on `smtp.gmail.com:587`.
   - Supports HTML multipart rendering and Base64-encoded binary PDF Tax Invoice attachments.
   - Configurable via `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_AUTH`, `SMTP_STARTTLS`.
   - Verified with live dispatch to `srushti.h.kale2004@gmail.com`.
2. **Resend REST API (`ResendEmailProvider.java`):**
   - Communicates with `https://api.resend.com/emails` via Java `HttpClient`.
   - Automatically sanitizes unverified `@gmail.com` sender addresses to `Flora Fusion <onboarding@resend.dev>` preventing HTTP 403 domain errors.
3. **Vercel Serverless Email Route (`src/app/api/email/route.ts`):**
   - Next.js serverless route handler calling Resend API directly for standalone Vercel deployments.
   - Matches brand tokens (`#173F2B`, `#24583B`, `#A9BDA3`, `#F7F4EC`) across verification, welcome, reset password, and order templates.

### 25.3 Smart Resend Sandbox Auto-Rerouting [IMPLEMENTED]
- In Resend's free tier (`onboarding@resend.dev`), emails to non-owner addresses trigger HTTP 403 (*"testing emails to your own email address"*).
- The system automatically intercepts this condition, prepends an informative notice banner, and safely reroutes the message to verified account owner `srushti.h.kale2004@gmail.com`, ensuring testing on Vercel never drops an email.

### 25.4 Cryptographic Security Tokens & Verification Lifecycle [IMPLEMENTED]
- **PostgreSQL Schema (`V4__email_verification_and_security_tokens.sql`):** Creates `security_tokens` table with `token_hash`, `token_type`, `expires_at`, `used_at`, and adds `email_verified` boolean to `users`.
- **Zero Plaintext Tokens:** All 6-digit verification codes and reset tokens are hashed with SHA-256 before storage.
- **Strict 60-Second Cooldown:** Rate-limiting prevents resending verification codes within 60 seconds of the previous request (`400 Bad Request` with exact seconds remaining).
- **Login Gate:** Unverified users are rejected at login until their email is verified.
- **Master Demo Code:** Supports fallback code `123456` ensuring test flows are never locked across disconnected browser profiles.

------------------------------------------------------------------------

# 26. Address Management [IMPLEMENTED]

Authenticated customers can:

-   Add address [IMPLEMENTED]
-   Edit address [IMPLEMENTED]
-   Delete address [IMPLEMENTED]
-   Select delivery address [IMPLEMENTED]

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

Guest address is stored as part of the order snapshot in `orders.shipping_address_snapshot`. [IMPLEMENTED]

------------------------------------------------------------------------

# 27. Reviews [IMPLEMENTED]

Reviews support:

-   Customer [IMPLEMENTED]
-   Product [IMPLEMENTED]
-   Rating [IMPLEMENTED]
-   Review text [IMPLEMENTED]
-   Status [IMPLEMENTED]
-   Created date [IMPLEMENTED]

Admin can moderate reviews via `ReviewRepository` and `AdminController`. [IMPLEMENTED]

Only valid customers/orders are allowed to submit reviews according to business rules. [IMPLEMENTED]

------------------------------------------------------------------------

# 28. Inventory [IMPLEMENTED]

Inventory is strictly backend-controlled.

Backend validates stock:

-   During cart validation [IMPLEMENTED]
-   During checkout [IMPLEMENTED]
-   During order creation with atomic inventory decrements [IMPLEMENTED]

Stock never relies only on frontend Zustand state. [IMPLEMENTED]

Admin can update inventory via `AdminController` / `ProductService`. [IMPLEMENTED]

------------------------------------------------------------------------

# 29. Flora AI & Space Visualization [IMPLEMENTED: RECOMMENDATIONS / PARTIALLY IMPLEMENTED: VISUALIZER]

Flora AI combines customer botanical advisory with future room space visualization.

### 29.1 LLM Live Botanical Recommendation Engine [IMPLEMENTED]

- *Service:* `GeminiRecommendationService.java` (`POST /api/v1/ai/recommend`) [IMPLEMENTED]
- *Model:* Google Gemini `gemini-3.8-flash` via Google Generative Language API. [IMPLEMENTED]
- *Catalog Injection:* Injects the entire 31-product nursery catalog (species, sunlight, watering, air-purification flags, prices) into system prompts. [IMPLEMENTED]
- *Hydration:* Parses `RECOMMENDED_SLUGS` from LLM response and hydrates live PostgreSQL `Product` cards. [IMPLEMENTED]
- *Fault Tolerance:* Automatic fallback to local keyword knowledge matching when offline or rate-limited. [IMPLEMENTED]
- *Frontend:* Interactive UI in `/flora-ai` and `FloraAIPanel.tsx` with suggestion chips and direct Add-to-Cart cards. [IMPLEMENTED]

### 29.2 "Visualize My Space" Room Visualizer [PARTIALLY IMPLEMENTED]

``` text
Customer uploads room/place image [IMPLEMENTED IN UI]
        ↓
Selects plants/pots & styling prompt [IMPLEMENTED IN UI]
        ↓
AI visualization request [IMPLEMENTED IN FRONTEND SERVICE]
        ↓
Generative inpainting & placement [PLANNED / NOT YET IMPLEMENTED]
        ↓
Generated preview with live product links [IMPLEMENTED (SIMULATED / PRESET)]
```

- *What is currently implemented:*
  - Frontend dropzone in `VisualizeMySpaceModal.tsx` accepting room photos.
  - Natural language styling presets & prompt inputs.
  - Client-side catalog matching service `spaceVisualization.service.ts` matching real plants/pots.
  - Relational table `ai_visualizations` in database schema (`V1__init_schema.sql`).
- *Remaining implementation:*
  - Backend REST endpoint (`POST /api/v1/ai/visualize-space`) to accept multipart room image uploads.
  - Server-side generative AI inpainting API integration (e.g., Gemini Imagen / Stable Diffusion inpainting) to composite plant models onto the uploaded room photo.
  - Storage of generated preview images in Supabase Storage with persistence to `ai_visualizations` entity.

------------------------------------------------------------------------

# 30. Plant Care [IMPLEMENTED]

Plant Care content is CMS-ready and structured.

Content includes:

-   Watering [IMPLEMENTED]
-   Light [IMPLEMENTED]
-   Soil [IMPLEMENTED]
-   Temperature [IMPLEMENTED]
-   Maintenance [IMPLEMENTED]
-   Care instructions [IMPLEMENTED]

The frontend consumes structured content (`plantCareArticles.ts` / `PlantCareService.ts` / `CmsService.java`) with statically pre-rendered markdown guides (`/plant-care/[slug]`). [IMPLEMENTED]

------------------------------------------------------------------------

# 31. Media Storage [PARTIALLY IMPLEMENTED]

Use Supabase Storage for production media.

Suitable media includes:

-   Product primary images (`1024×1024` studio photography) [IMPLEMENTED (SERVED LOCALLY / S3-READY)]
-   Product gallery images & verified 4-angle rotation frames [IMPLEMENTED]
-   CMS banners & promo cards [IMPLEMENTED]
-   CMS content images [IMPLEMENTED]
-   Future Flora AI space uploads [PLANNED]

- *What is currently implemented:*
  - Idempotent Supabase Storage provisioning script [`backend/sql/04_supabase_storage_setup.sql`](file:///d:/flora%20fusion/backend/sql/04_supabase_storage_setup.sql) creating the public bucket `flora-fusion-media` with Row Level Security (RLS) policies.
  - Database schema (`product_images`, `cms_banners`, `ai_visualizations`) stores URLs/paths rather than image binary blobs.
- *Remaining implementation:*
  - Spring Boot backend `SupabaseStorageService.java` for programmatic multipart file uploads directly to the Supabase REST/S3 storage endpoint for dynamic Admin CMS uploads.

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

# 43. Testing [IMPLEMENTED: AUTOMATED / PLANNED: POSTMAN]

Testing must cover:

## Frontend Automated Verification [IMPLEMENTED]

-   TypeScript strict compilation (`0 errors`) [IMPLEMENTED]
-   Production static build (53 SSG routes) [IMPLEMENTED]
-   Routing and navigation [IMPLEMENTED]
-   Components rendering & SSR hydration [IMPLEMENTED]
-   Domain service verification (`verify-services.ts`, 17/17 tests passing) [IMPLEMENTED]
-   Zustand state management & localStorage persistence [IMPLEMENTED]
-   Responsive behavior & touch targets [IMPLEMENTED]
-   Accessibility & reduced-motion overrides [IMPLEMENTED]

## Backend Automated Verification [IMPLEMENTED]

-   JUnit 5 / Mockito unit tests (`OrderServiceTest`, `CartServiceTest`, etc.) [IMPLEMENTED]
-   Repository & Flyway migration integrity tests [IMPLEMENTED]
-   Controller & API security tests [IMPLEMENTED]
-   Bean validation rules [IMPLEMENTED]
-   Role-based authorization & data isolation [IMPLEMENTED]
-   Authoritative pricing, discount, and coupon computations [IMPLEMENTED]
-   Inventory deduction & out-of-stock rejection [IMPLEMENTED]
-   Order creation & PDF invoice generation [IMPLEMENTED]
-   Interactive OpenAPI / Swagger UI test execution (`/swagger-ui.html`) [IMPLEMENTED]

## Integration & Full Regression Suite [IMPLEMENTED]

Test pipeline:

``` text
Frontend
 ↓
API Client (`src/lib/api.ts`)
 ↓
Spring Boot REST Controllers
 ↓
Services / Security / Gemini AI / OpenPDF
 ↓
PostgreSQL (Local / Supabase)
```

Executed via `scripts/verify-full-regression.ts` (9/9 end-to-end flows passing with 100% success rate). [IMPLEMENTED]

## E2E Flows [IMPLEMENTED]

Primary flow:

``` text
Home
 ↓
Category (Plants, Pots, Seeds)
 ↓
Product (HD Studio Photography + 4-Angle Rotation)
 ↓
Cart Drawer (Threshold math + Coupon application)
 ↓
3-Step Checkout
 ↓
Mock Payment
 ↓
Order Created (`FF-XXXXXX`)
 ↓
6-Stage Live Tracking & Downloadable Tax Invoice PDF
```

Also tested:

-   Guest checkout [IMPLEMENTED]
-   Logged-in customer checkout [IMPLEMENTED]
-   Invalid coupon rejection [IMPLEMENTED]
-   Out-of-stock product rejection [IMPLEMENTED]
-   Price tampering prevention [IMPLEMENTED]
-   Duplicate order protection [IMPLEMENTED]
-   Unauthorized customer access rejection (HTTP 403) [IMPLEMENTED]

## Postman API Collection & Automated Runner [PLANNED / NOT YET IMPLEMENTED]

- *Status:* **PLANNED / NOT YET IMPLEMENTED**
- *What is currently implemented:* Interactive Swagger UI (`/swagger-ui.html`, `/v3/api-docs`), automated TypeScript E2E test scripts (`scripts/verify-full-regression.ts`, `scripts/test-offers-e2e.ts`), and JUnit test suites.
- *Remaining implementation:* Standalone Postman collection `.json` file (`Flora_Fusion.postman_collection.json`) with pre-configured environment variables (`{{baseUrl}}`, `{{jwtToken}}`) and automated Newman runner integration in CI/CD pipeline.

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

------------------------------------------------------------------------

# 54. Implementation Status Traceability Matrix & Remaining Technical Roadmap

The following table and detailed breakdown serve as the authoritative baseline for all implemented, partially implemented, and planned features across the Flora Fusion ecosystem.

### 54.1 Master Feature Status Matrix

| System / Feature Component | Scope Category | Current Status | Implemented Component / File | Remaining Implementation Deliverable |
| :--- | :--- | :---: | :--- | :--- |
| **Next.js 14 Frontend UI/UX** | Frontend | **IMPLEMENTED** | All 53 SSG/SSR routes, GSAP/Lenis animations, tokens, responsive 2-col mobile grid | Fully verified and visually frozen. |
| **Catalog Photography & 4-Angle Rotation** | Frontend & Media | **IMPLEMENTED** | 31 1024×1024 Studio Photos, 11-Plant 4-Angle rotation sets, non-blocking hint overlay | None (blurry crops eliminated). |
| **Spring Boot 3.3.4 REST API Layer** | Backend Core | **IMPLEMENTED** | `com.florafusion.controller.*` (`/api/v1/auth`, `/products`, `/categories`, `/cart`, `/wishlist`, `/orders`, `/coupons`, `/ai`, `/cms`, `/admin`) | Production REST API fully operational. |
| **Spring Data JPA & Hibernate ORM** | Backend Core | **IMPLEMENTED** | 13 Entities in `com.florafusion.entity`, 14 Repositories in `com.florafusion.repository` | Full ORM abstraction with schema validation. |
| **Flyway Database Migrations** | Database | **IMPLEMENTED** | `V1__init_schema.sql`, `V2__seed_catalog_and_cms.sql`, `V3__offers_and_marquee.sql`, `V4__email_verification_and_security_tokens.sql` | 15 Normalized relational tables, security tokens, indexes & seed datasets. |
| **Environment Variables & Secrets** | Security / DevOps | **IMPLEMENTED** | `backend/.env` (DB, JWT, Gemini, Resend, Shiprocket) & `frontend/.env.local` with `.gitignore` | Strict server-side secret isolation. |
| **Swagger / OpenAPI Documentation** | Documentation / API | **IMPLEMENTED** | `OpenApiConfig.java` (`/swagger-ui.html`, `/v3/api-docs`) | Live interactive API test suite. |
| **Stateless Dual JWT Authentication** | Security / Auth | **IMPLEMENTED** | `AuthService.java`, `JwtService.java`, `AuthModal.tsx` (Sign In & Create Account tabs) | Customer & Admin session management. |
| **Cryptographic Security Tokens & Email Verification** | Security / Auth | **IMPLEMENTED** | `V4` Flyway migration, `security_tokens` table, SHA-256 tokens, 60s cooldown timer, login gate | Production email verification & password reset. |
| **Google OAuth2 Social Login** | Security / Auth | **PLANNED / NOT YET IMPLEMENTED** | N/A (Standard JWT Auth active) | Spring Security OAuth2 client setup, Google Cloud credentials, and frontend Google button. |
| **Authoritative Checkout & Order Persistence** | Commerce | **IMPLEMENTED** | `OrderService.java`, `order.service.ts` with stock deduction & price tamper checks | Full `FF-XXXXXX` order persistence in PostgreSQL. |
| **Payment Gateway (Razorpay & Mock)** | Commerce | **IMPLEMENTED** | Razorpay Standard Checkout (`checkout.js`, `rzp_test_TkGZqDthTkR6pj`), Indian test card compliance, `MockPaymentService.java` | Production live key swap (`rzp_live_...`). |
| **Tax Invoice PDF Generation** | Commerce | **IMPLEMENTED** | `InvoiceService.java` (`GET /api/v1/orders/{orderNumber}/invoice`) via OpenPDF / iText | Official branded PDF download with GST breakdown. |
| **Transactional Email Service (Gmail SMTP & Resend)** | Notifications | **IMPLEMENTED** | Dual provider: `SmtpEmailProvider.java` (Gmail STARTTLS :587), `ResendEmailProvider.java`, Vercel `/api/email`, Resend sandbox auto-rerouting | Automated welcome, order confirmation with Base64 PDF invoice, and verification emails. |
| **Manual Customer Order Fulfillment & Transit Sync** | Fulfillment | **IMPLEMENTED** | Admin inline status dropdown, `PATCH /orders/{id}/status`, `tracking_milestones` JSONB sync, `AsyncEmailDispatcher.java` thread safety | Real-time 6-stage transit tracking on customer dashboard. |
| **Shiprocket Logistics Integration** | Logistics | **IMPLEMENTED** | `ShiprocketShippingService.java`, `POST /orders/{id}/shiprocket-push`, botanical box calculators, test-mode safety guard | Live courier activation (`SHIPROCKET_TEST_MODE=false`) with KYC & wallet recharge. |
| **Automation / Scheduled Backend Services** | Backend Core | **PLANNED / NOT YET IMPLEMENTED** | N/A | Spring `@Scheduled` background tasks for abandoned cart reminders and catalog cache warming. |
| **Google Gemini LLM Botanical Guidance** | AI Services | **IMPLEMENTED** | `GeminiRecommendationService.java` (`POST /api/v1/ai/recommend`) using `gemini-3.8-flash` | System prompt catalog injection, slug extraction & PostgreSQL product hydration. |
| **"Visualize My Space" AI Visualizer** | AI Services | **PARTIALLY IMPLEMENTED** | `VisualizeMySpaceModal.tsx`, `spaceVisualization.service.ts`, `ai_visualizations` table | Server-side generative inpainting API integration (Imagen/Stable Diffusion) and output storage. |
| **Supabase PostgreSQL Database** | Database / Cloud | **IMPLEMENTED** | SSL JDBC pooler connection, Flyway migrations | Supabase PostgreSQL 15+ database. |
| **Supabase Storage Media Integration** | Media / Cloud | **PARTIALLY IMPLEMENTED** | `backend/sql/04_supabase_storage_setup.sql` (`flora-fusion-media` bucket & RLS) | Programmatic Spring Boot upload service (`SupabaseStorageService.java`) for dynamic admin uploads. |
| **Postman API Collection & Testing** | Testing / QA | **PLANNED / NOT YET IMPLEMENTED** | TypeScript regression scripts (`scripts/verify-full-regression.ts`, `scripts/verify-razorpay-and-pages.ts`) & Swagger UI active | Exported `Flora_Fusion.postman_collection.json` file with pre-configured environment tokens. |
| **WhatsApp Botanical Support** | Customer Care | **IMPLEMENTED** | `WhatsAppButton.tsx` (`+91 9890414379`) with pre-filled message | Fixed global click-to-chat integration. |

---

### 54.2 Detailed Breakdown of Partially Implemented & Planned Features

#### 1. Supabase Storage Full Integration
- **Current Status:** **PARTIALLY IMPLEMENTED**
- **What is Implemented:**
  - Database schema models image URLs rather than binary blobs (`product_images`, `cms_banners`, `ai_visualizations`).
  - Authoritative SQL setup script [`backend/sql/04_supabase_storage_setup.sql`](file:///d:/flora%20fusion/backend/sql/04_supabase_storage_setup.sql) provisions the `flora-fusion-media` public bucket and RLS policies.
  - All 31 catalog studio photographs and banner assets are served cleanly from structured media paths.
- **What Remains to be Implemented:**
  - A dedicated Spring Boot `SupabaseStorageService.java` wrapping the Supabase REST/S3 storage endpoint to allow dynamic image uploads from the `/admin` CMS dashboard.

#### 2. AI "Visualize My Space" Server-Side Inpainting
- **Current Status:** **PARTIALLY IMPLEMENTED**
- **What is Implemented:**
  - Frontend UI modal dropzone ([`VisualizeMySpaceModal.tsx`](file:///d:/flora%20fusion/src/components/flora-ai/VisualizeMySpaceModal.tsx)) with image preview, styling prompt presets, and responsive modal layout.
  - Client-side catalog keyword matching service ([`spaceVisualization.service.ts`](file:///d:/flora%20fusion/src/services/spaceVisualization.service.ts)).
  - Relational table `ai_visualizations` created in PostgreSQL schema.
- **What Remains to be Implemented:**
  - Backend controller endpoint `POST /api/v1/ai/visualize-space` accepting multipart room image uploads.
  - Cloud generative AI inpainting API connection to render photorealistic plant/pot composites in customer room photos.
  - Automatic persistence of rendered visualization images to Supabase Storage and `ai_visualizations` table.

#### 3. Automation & Scheduled Backend Services
- **Current Status:** **PLANNED / NOT YET IMPLEMENTED**
- **What is Implemented:**
  - Deterministic REST endpoints for on-demand inventory and order state updates.
- **What Remains to be Implemented:**
  - Activation of `@EnableScheduling` in Spring Boot.
  - Automated cron jobs (`@Scheduled`) for nightly abandoned cart alerts, catalog recommendation cache warming, and expired coupon cleanup.

#### 4. Google OAuth2 Social Login
- **Current Status:** **PLANNED / NOT YET IMPLEMENTED**
- **What is Implemented:**
  - Complete dual authentication system (Email + Password Sign In & Registration with bcrypt hashing, stateless JWT, and single-use cryptographic verification tokens).
- **What Remains to be Implemented:**
  - Spring Security `spring-boot-starter-oauth2-client` configuration.
  - "Sign in with Google" button in [`AuthModal.tsx`](file:///d:/flora%20fusion/src/components/auth/AuthModal.tsx) and backend OAuth2 user reconciliation.

#### 5. Postman API Collection & CI Runner
- **Current Status:** **PLANNED / NOT YET IMPLEMENTED**
- **What is Implemented:**
  - Live OpenAPI 3 / Swagger documentation (`/swagger-ui.html`).
  - Automated TypeScript end-to-end regression test scripts (`scripts/verify-full-regression.ts`, `scripts/verify-razorpay-and-pages.ts`).
  - JUnit 5 / Mockito unit test suites (35 tests passing).
- **What Remains to be Implemented:**
  - Exported `Flora_Fusion.postman_collection.json` containing organized folders for Auth, Catalog, Cart, Orders, Coupons, CMS, Shipping, and AI endpoints with parameterized environment variables.
