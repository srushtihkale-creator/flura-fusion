# Flora Fusion — Spring Boot Backend API

> **Application:** Flora Fusion Backend REST API  
> **Framework:** Spring Boot 3.3.4 · Java 21 (LTS) · Spring Security (Stateless JWT) · Spring Data JPA · PostgreSQL  
> **Source Specification:** [`DOCS/Flora_Fusion_SRS_FINAL.md`](file:///d:/flora%20fusion/DOCS/Flora_Fusion_SRS_FINAL.md)

---

## 1. Quick Start & Setup

### Prerequisites
- **Java:** JDK 21+ (`java -version`)
- **Maven:** 3.9+ (`mvn -version`)
- **Database:** PostgreSQL 14+ (Local or Supabase PostgreSQL instance)

### Configuration (`.env` or Environment Variables)
Place your credentials in your private `.env` or system environment variables (never committed to git):

```env
PORT=8080
SPRING_PROFILES_ACTIVE=dev
DATABASE_URL=jdbc:postgresql://<HOST>:<PORT>/<DATABASE>?sslmode=require
DATABASE_USERNAME=<YOUR_USERNAME>
DATABASE_PASSWORD=<YOUR_PASSWORD>
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://*.vercel.app
```

---

## 2. Database Schema & Seed Data

The schema and catalog datasets are pre-packaged in `backend/sql/` and `src/main/resources/db/migration/`:

1. **Schema DDL:** [`backend/sql/01_schema.sql`](file:///d:/flora%20fusion/backend/sql/01_schema.sql)  
   Creates all 15 relational tables: `users`, `addresses`, `categories`, `products`, `product_images`, `carts`, `cart_items`, `wishlists`, `wishlist_items`, `coupons`, `discounts`, `orders`, `order_items`, `reviews`, `cms_banners`, `cms_pages`, and `ai_visualizations`.

2. **Catalog & CMS Seed Script:** [`backend/sql/02_seed_data.sql`](file:///d:/flora%20fusion/backend/sql/02_seed_data.sql)  
   Seeds all 31 existing products (11 Plants, 10 Pots, 10 Seeds) with 100% price, botanical specification, care guide, and 4-angle studio photography parity. Includes default admin user (`admin@florafusion.com` / `Password@123`) and sample coupons (`FLORA10`, `NATURE20`).

To apply the scripts directly to your database:
```bash
psql -h <HOST> -U <USER> -d <DBNAME> -f backend/sql/01_schema.sql
psql -h <HOST> -U <USER> -d <DBNAME> -f backend/sql/02_seed_data.sql
```

---

## 3. Building and Running

### Compile & Test
```bash
cd backend
mvn clean test
```

### Run Locally
```bash
mvn spring-boot:run
```

Once running:
- **API Base:** `http://localhost:8080/api/v1`
- **Interactive Swagger UI:** `http://localhost:8080/swagger-ui.html`
- **OpenAPI 3 JSON:** `http://localhost:8080/v3/api-docs`
- **Actuator Health:** `http://localhost:8080/actuator/health`

---

## 4. REST API Endpoint Catalog

| Module | Method & Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST /api/v1/auth/register` | Public | Customer registration (`ROLE_CUSTOMER` enforced) |
| **Auth** | `POST /api/v1/auth/login` | Public | Credentials authentication, returns JWT token |
| **Auth** | `GET /api/v1/auth/me` | Authenticated | Current user profile |
| **Categories** | `GET /api/v1/categories` | Public | All active categories (Plants, Pots, Seeds) |
| **Categories** | `GET /api/v1/categories/{slug}` | Public | Category details |
| **Products** | `GET /api/v1/products` | Public | Catalog listing with filters (`category`, `sort`, `page`) |
| **Products** | `GET /api/v1/products/{slug}` | Public | Full product specs, care guide & multi-angle images |
| **Products** | `GET /api/v1/products/{slug}/related`| Public | Related cross-selling items |
| **Search** | `GET /api/v1/search?q={query}` | Public | Full-text catalog search |
| **Cart** | `GET /api/v1/cart` | Customer | Persistent user shopping cart |
| **Cart** | `POST /api/v1/cart/items` | Customer | Add product to cart |
| **Cart** | `PUT /api/v1/cart/items/{id}` | Customer | Update quantity (0 removes item) |
| **Cart** | `DELETE /api/v1/cart/items/{id}` | Customer | Remove cart item |
| **Wishlist** | `GET /api/v1/wishlist` | Customer | Saved wishlist items |
| **Wishlist** | `POST /api/v1/wishlist/toggle/{id}` | Customer | Toggle product in wishlist |
| **Checkout** | `POST /api/v1/orders/validate` | Public | Authoritative stock, coupon, and price validation |
| **Orders** | `POST /api/v1/orders` | Public / Customer | Create order (guest & customer supported) |
| **Orders** | `GET /api/v1/orders/track/{number}` | Public | 6-stage live tracking milestones |
| **Orders** | `GET /api/v1/orders/my-orders` | Customer | Customer order history |
| **Orders** | `GET /api/v1/orders/{number}/invoice` | Public / Customer | Official Flora Fusion branded PDF invoice |
| **CMS** | `GET /api/v1/cms/banners` | Public | Active homepage and promo banners |
| **CMS** | `GET /api/v1/cms/pages` | Public | Editorial plant care articles |
| **CMS** | `GET /api/v1/plant-care/{slug}` | Public | Plant care article markdown |
| **Admin** | `GET /api/v1/admin/dashboard/stats` | `ROLE_ADMIN` | Business revenue and order statistics |
| **Admin** | `GET /api/v1/admin/orders` | `ROLE_ADMIN` | All customer orders |
| **Admin** | `PATCH /api/v1/admin/orders/{id}/status`| `ROLE_ADMIN` | Update order fulfillment status |
| **Admin** | `PUT /api/v1/admin/products/{id}/stock`| `ROLE_ADMIN` | Adjust inventory stock quantity |
| **Admin** | `PUT /api/v1/admin/products/{id}/price`| `ROLE_ADMIN` | Adjust product base and original price |
