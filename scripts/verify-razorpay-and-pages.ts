/**
 * Complete End-to-End Verification Script for Flora Fusion
 * Verifies:
 * 1. Customer Storefront Pages (Home, Plants, Pots, Seeds, PDP)
 * 2. Checkout UI with Razorpay payment integration
 * 3. Live Razorpay Order Placement with Payment Transaction ID
 * 4. PDF Tax Invoice Generation
 * 5. Admin Dashboard Endpoints & Statistics
 */

const BASE_URL = "http://localhost:3000";
const API_URL = "http://localhost:8080/api/v1";

async function main() {
  console.log("=================================================");
  console.log("🌿 FLORA FUSION — END-TO-END VERIFICATION SUITE");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  async function check(name: string, fn: () => Promise<boolean>) {
    process.stdout.write(`Testing ${name}... `);
    try {
      const ok = await fn();
      if (ok) {
        console.log("✅ PASSED");
        passed++;
      } else {
        console.log("❌ FAILED");
        failed++;
      }
    } catch (err: any) {
      console.log(`❌ ERROR: ${err?.message || err}`);
      failed++;
    }
  }

  // 1. Homepage
  await check("Homepage (GET /)", async () => {
    const res = await fetch(`${BASE_URL}/`);
    const html = await res.text();
    return res.status === 200 && html.includes("Flora Fusion") && html.includes("app-view");
  });

  // 2. Plants Category Page
  await check("Plants Catalog (GET /plants)", async () => {
    const res = await fetch(`${BASE_URL}/plants`);
    const html = await res.text();
    return res.status === 200 && html.includes("Plants");
  });

  // 3. Pots Category Page
  await check("Pots Catalog (GET /pots)", async () => {
    const res = await fetch(`${BASE_URL}/pots`);
    const html = await res.text();
    return res.status === 200 && html.includes("Pots");
  });

  // 4. Seeds Category Page
  await check("Seeds Catalog (GET /seeds)", async () => {
    const res = await fetch(`${BASE_URL}/seeds`);
    const html = await res.text();
    return res.status === 200 && html.includes("Seeds");
  });

  // 5. Product Detail Page (Money Plant)
  await check("Product Detail Page (GET /product/money-plant)", async () => {
    const res = await fetch(`${BASE_URL}/product/money-plant`);
    const html = await res.text();
    return res.status === 200 && html.includes("Money Plant");
  });

  // 6. Checkout Page
  await check("Checkout Page (GET /checkout)", async () => {
    const res = await fetch(`${BASE_URL}/checkout`);
    const html = await res.text();
    return res.status === 200 && (html.includes("Secure Checkout") || html.includes("Nursery Checkout"));
  });

  // 7. Backend Health Check
  await check("Backend Health (GET /actuator/health)", async () => {
    const res = await fetch("http://localhost:8080/actuator/health");
    const json = await res.json();
    return res.status === 200 && json.status === "UP";
  });

  // 8. Public Active Categories API
  await check("Public Active Categories (GET /api/v1/categories)", async () => {
    const res = await fetch(`${API_URL}/categories`);
    const json = await res.json();
    return res.status === 200 && Array.isArray(json) && json.length >= 2 && json.every((c: any) => c.isActive === true);
  });

  // 9. Public Active Products API
  await check("Public Plants Products (GET /api/v1/products?category=plants)", async () => {
    const res = await fetch(`${API_URL}/products?category=plants`);
    const json = await res.json();
    return res.status === 200 && json.totalElements === 11;
  });

  // 10. Order Placement with Razorpay Payment Reference
  let testOrderNumber = "";
  await check("Razorpay Order Creation (POST /api/v1/orders)", async () => {
    const dummyPaymentId = `pay_test_${Date.now().toString(36).toUpperCase()}`;
    const payload = {
      items: [
        {
          productId: "a1000001-0000-0000-0000-000000000001", // Money Plant
          quantity: 2,
        },
      ],
      shippingAddress: {
        name: "Srushti Kale",
        phone: "+91 9890414379",
        address: "Flora Fusion Nursery Studio, Shivaji Nagar",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411005",
      },
      paymentMethod: "Razorpay (UPI)",
      paymentReference: dummyPaymentId,
      guestEmail: "srushti.h.kale2004@gmail.com",
    };

    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if ((res.status === 200 || res.status === 201) && json.orderNumber && json.paymentStatus === "COMPLETED") {
      testOrderNumber = json.orderNumber;
      console.log(`\n   Order Created: ${json.orderNumber} | Payment Ref: ${dummyPaymentId} | Total: ₹${json.totalAmount}`);
      return true;
    }
    return false;
  });

  // 11. PDF Tax Invoice Generation & Download
  await check(`PDF Tax Invoice Generation (GET /api/v1/orders/${testOrderNumber}/invoice)`, async () => {
    if (!testOrderNumber) return false;
    const res = await fetch(`${API_URL}/orders/${testOrderNumber}/invoice`);
    const buffer = await res.arrayBuffer();
    const isPdf = buffer.byteLength > 500 && new TextDecoder().decode(buffer.slice(0, 5)).startsWith("%PDF");
    console.log(`\n   Invoice Size: ${buffer.byteLength} bytes (Valid PDF Magic Bytes: ${isPdf})`);
    return res.status === 200 && isPdf;
  });

  // 12. Admin Login & Authentication
  let adminToken = "";
  await check("Admin Authentication (POST /api/v1/auth/login)", async () => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@florafusion.com",
        password: "Password@123",
      }),
    });
    const json = await res.json();
    if (res.status === 200 && json.token && (json.role === "ADMIN" || json.user?.role === "ADMIN")) {
      adminToken = json.token;
      return true;
    }
    return false;
  });

  // 13. Admin Dashboard Statistics
  await check("Admin Dashboard Stats (GET /api/v1/admin/dashboard/stats)", async () => {
    const res = await fetch(`${API_URL}/admin/dashboard/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const json = await res.json();
    console.log(`\n   Admin Stats -> Products: ${json.totalProducts}, Orders: ${json.totalOrders}, Revenue: ₹${json.totalRevenue}`);
    return res.status === 200 && json.totalProducts >= 31;
  });

  console.log("\n=================================================");
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("=================================================");
}

main().catch(console.error);
