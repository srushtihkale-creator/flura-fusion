/**
 * Flora Fusion — Automated Verification & Unit Test Suite
 * Validates domain services, calculations, catalog integrity, and business logic
 * per frontendprompt.md Phase 14
 */

import assert from "node:assert";

// Load catalog data & articles
import { FLORA_CATALOG, getAllProducts, getProductBySlug, getProductById } from "../src/data/catalog";
import { PLANT_CARE_ARTICLES } from "../src/data/plantCareArticles";
import { CartService } from "../src/services/cart.service";
import { OrderService } from "../src/services/order.service";
import { SearchService } from "../src/services/search.service";
import { ProductService } from "../src/services/product.service";

console.log("🌱 Starting Flora Fusion Test & Verification Suite...\n");

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err: any) {
    console.error(`  ✗ ${name}:`, err.message);
    failed++;
  }
}

async function runAllTests() {
  // 1. Catalog Integrity Tests
  console.log("--- 1. Catalog Integrity & Schema Tests ---");
  await test("Catalog contains strictly 3 categories (plants, pots, seeds)", () => {
    const categories = Object.keys(FLORA_CATALOG);
    assert.deepStrictEqual(categories.sort(), ["plants", "pots", "seeds"].sort());
  });

  await test("Exact catalog counts: 11 Plants, 10 Pots, 10 Seeds (31 Total)", () => {
    assert.strictEqual(FLORA_CATALOG.plants.length, 11, "Should have 11 plants");
    assert.strictEqual(FLORA_CATALOG.pots.length, 10, "Should have 10 pots");
    assert.strictEqual(FLORA_CATALOG.seeds.length, 10, "Should have 10 seeds");
    assert.strictEqual(getAllProducts().length, 31, "Total products must be 31");
  });

  await test("Every product has required attributes (id, slug, name, price, rating, image, inStock)", () => {
    for (const product of getAllProducts()) {
      assert.ok(product.id, `Product missing id`);
      assert.ok(product.slug, `Product ${product.id} missing slug`);
      assert.ok(product.name, `Product ${product.id} missing name`);
      assert.ok(product.price > 0, `Product ${product.name} invalid price`);
      assert.ok(product.rating >= 4.0, `Product ${product.name} invalid rating`);
      assert.ok(product.image, `Product ${product.name} missing image`);
      assert.strictEqual(typeof product.inStock, "boolean", `Product ${product.name} invalid inStock`);
    }
  });

  await test("Slug uniqueness across entire catalog", () => {
    const slugs = getAllProducts().map((p) => p.slug);
    const uniqueSlugs = new Set(slugs);
    assert.strictEqual(slugs.length, uniqueSlugs.size, "Slugs must be strictly unique");
  });

  await test("Slug lookup returns correct product", () => {
    const p = getProductBySlug("monstera-deliciosa");
    assert.ok(p, "Monstera Deliciosa must be found");
    assert.strictEqual(p.name, "Monstera Deliciosa");
    assert.strictEqual(p.price, 999);
  });

  // 2. Product Service Category Filters & Sorting Tests
  console.log("\n--- 2. Product Service Category Filters & Sorting Tests ---");
  await test("ProductService.getByCategory('plants', 'indoor') filters correctly", async () => {
    const indoorPlants = await ProductService.getByCategory("plants", "indoor");
    assert.ok(indoorPlants.length > 0, "Should return indoor plants");
    for (const p of indoorPlants) {
      assert.strictEqual(p.category, "plants");
    }
  });

  await test("ProductService sorting by price-low sorts in ascending order", async () => {
    const sorted = await ProductService.getByCategory("plants", "all", "price-low");
    for (let i = 0; i < sorted.length - 1; i++) {
      assert.ok(sorted[i].price <= sorted[i + 1].price, "Prices must be ascending");
    }
  });

  // 3. Cart Calculation & Coupon Engine Tests
  console.log("\n--- 3. Cart Calculation & Coupon Engine Tests ---");
  await test("CartService calculates totals with free shipping threshold >= 799", () => {
    const mockItems = [
      { id: "plant-1", slug: "money-plant", name: "Money Plant", price: 399, image: "", category: "plants", quantity: 2 },
    ];
    // 399 * 2 = 798 (just below 799)
    const below = CartService.calculateTotals(mockItems, null);
    assert.strictEqual(below.subtotal, 798);
    assert.strictEqual(below.shipping, 79);
    assert.strictEqual(below.total, 877);

    // Add 1 more item -> subtotal > 799
    const above = CartService.calculateTotals(
      [...mockItems, { id: "seed-1", slug: "basil-seeds", name: "Basil Seeds", price: 99, image: "", category: "seeds", quantity: 1 }],
      null
    );
    assert.strictEqual(above.subtotal, 897);
    assert.strictEqual(above.shipping, 0, "Free delivery when subtotal >= 799");
    assert.strictEqual(above.total, 897);
  });

  await test("CartService validates coupon FLORA10 (10% discount)", () => {
    const mockItems = [
      { id: "plant-9", slug: "monstera-deliciosa", name: "Monstera Deliciosa", price: 1000, image: "", category: "plants", quantity: 1 },
    ];
    const res = CartService.calculateTotals(mockItems, "FLORA10");
    assert.strictEqual(res.discount, 100);
    assert.strictEqual(res.total, 900);
  });

  await test("CartService validates coupon NATURE20 minimum order rule", () => {
    const invalid = CartService.validateCoupon("NATURE20", 500);
    assert.strictEqual(invalid.valid, false);

    const valid = CartService.validateCoupon("NATURE20", 1200);
    assert.strictEqual(valid.valid, true);
    assert.strictEqual(valid.discountRate, 0.2);
  });

  // 4. Order Service Creation & Tracking Steps
  console.log("\n--- 4. Order Service Creation & Tracking Tests ---");
  await test("OrderService creates realistic order with 6 tracking stages", async () => {
    const order = await OrderService.createOrder({
      items: [
        { id: "plant-1", slug: "money-plant", name: "Money Plant", price: 399, image: "/test.jpg", category: "plants", quantity: 1 },
      ],
      shippingAddress: {
        fullName: "Test User",
        phone: "9876543210",
        addressLine1: "123 Green St",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411001",
      },
      deliveryMethod: "Standard",
      paymentMethod: "UPI",
      couponCode: null,
    });

    assert.ok(order.orderId.startsWith("FF-"), "Order ID must start with FF-");
    assert.strictEqual(order.items.length, 1);
    assert.strictEqual(order.trackingSteps.length, 6, "Must have exactly 6 tracking stages");
    assert.strictEqual(order.status, "Confirmed");
  });

  await test("OrderService enforces authoritative stock validation", async () => {
    // Mock an out-of-stock item
    const outOfStockItems = [
      { id: "non-existent-or-oos", slug: "rare-plant", name: "Rare Plant", price: 999, image: "", category: "plants", quantity: 1 },
    ];
    // Non-existent in catalog is treated gracefully, but if marked inStock: false it must throw
    const catalogItem = getProductById("plant-1")!;
    const originalStock = catalogItem.inStock;
    (catalogItem as any).inStock = false;

    let threw = false;
    try {
      await OrderService.createOrder({
        items: [{ id: "plant-1", slug: "money-plant", name: "Money Plant", price: 399, image: "", category: "plants", quantity: 1 }],
        shippingAddress: {
          fullName: "Test User",
          phone: "9876543210",
          addressLine1: "123 Green St",
          city: "Pune",
          state: "Maharashtra",
          pincode: "411001",
        },
        deliveryMethod: "Standard",
        paymentMethod: "UPI",
        couponCode: null,
      });
    } catch (err: any) {
      threw = true;
      assert.ok(err.message.includes("out of stock"));
    } finally {
      (catalogItem as any).inStock = originalStock; // restore
    }
    assert.ok(threw, "OrderService must throw when an item is out of stock");
  });

  // 5. Search Service Tests
  console.log("\n--- 5. Search Service Tests ---");
  await test("SearchService finds products by keyword", async () => {
    const res = await SearchService.search({ query: "snake" });
    assert.ok(res.length > 0, "Should match Snake Plant");
    assert.ok(res.some((p) => p.name.includes("Snake Plant")));
  });

  await test("SearchService filters by category", async () => {
    const res = await SearchService.search({ query: "", category: "pots" });
    assert.strictEqual(res.length, 10, "Should return all 10 pots");
    for (const p of res) {
      assert.strictEqual(p.category, "pots");
    }
  });

  // 6. Plant Care Articles CMS Tests
  console.log("\n--- 6. Plant Care Articles CMS Tests ---");
  await test("Plant Care articles dataset contains all required editorial articles", () => {
    assert.ok(PLANT_CARE_ARTICLES.length >= 5, "Should have at least 5 plant care articles");
    for (const art of PLANT_CARE_ARTICLES) {
      assert.ok(art.id && art.slug && art.title && art.contentMarkdown, `Article ${art.id} incomplete`);
      assert.ok(art.readTime.includes("min read"), `Article ${art.title} missing read time`);
    }
  });

  // Summary
  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests();
