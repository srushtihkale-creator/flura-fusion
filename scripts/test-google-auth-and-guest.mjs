// Integration Test Script: Google Auth + Existing Auth + Guest Checkout Verification

async function waitForServer(url, timeoutMs = 45000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {
      // wait and retry
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Server did not respond at ${url} within ${timeoutMs}ms`);
}

async function runTests() {
  console.log("🌸 Checking Spring Boot backend health...");
  await waitForServer("http://localhost:8080/api/v1/products");
  console.log("✅ Spring Boot backend is UP and healthy on port 8080!\n");

  let passed = 0;
  let failed = 0;

  // Test 1: Google Auth - New User Registration
  try {
    const testEmail = `google_user_${Date.now()}@florafusion.com`;
    const res = await fetch("http://localhost:8080/api/v1/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idToken: `test_google_token:${testEmail}:Srushti Google QA`,
      }),
    });
    const data = await res.json();
    if (res.ok && data.token && data.email === testEmail && data.role === "CUSTOMER" && data.emailVerified === true) {
      console.log("✅ [1/5] Google Auth: New User Registration & Immediate Activation - PASSED");
      passed++;
    } else {
      console.error("❌ [1/5] Google Auth New User - FAILED:", res.status, data);
      failed++;
    }
  } catch (e) {
    console.error("❌ [1/5] Google Auth New User - EXCEPTION:", e.message);
    failed++;
  }

  // Test 2: Google Auth - Existing User Login
  try {
    const testEmail = "srushti@florafusion.com";
    const res = await fetch("http://localhost:8080/api/v1/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idToken: `test_google_token:${testEmail}:Srushti Kale`,
      }),
    });
    const data = await res.json();
    if (res.ok && data.token && data.email === testEmail) {
      console.log("✅ [2/5] Google Auth: Existing User Login - PASSED");
      passed++;
    } else {
      console.error("❌ [2/5] Google Auth Existing User - FAILED:", res.status, data);
      failed++;
    }
  } catch (e) {
    console.error("❌ [2/5] Google Auth Existing User - EXCEPTION:", e.message);
    failed++;
  }

  // Test 3: Google Auth - Blank Token Validation
  try {
    const res = await fetch("http://localhost:8080/api/v1/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: "" }),
    });
    if (res.status === 400) {
      console.log("✅ [3/5] Google Auth: Blank Token Rejection (400 Bad Request) - PASSED");
      passed++;
    } else {
      console.error("❌ [3/5] Google Auth Blank Token - FAILED, expected 400 got:", res.status);
      failed++;
    }
  } catch (e) {
    console.error("❌ [3/5] Google Auth Blank Token - EXCEPTION:", e.message);
    failed++;
  }

  // Test 4: Existing Email/Password Login
  try {
    const res = await fetch("http://localhost:8080/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "srushti@florafusion.com",
        password: "Password@123",
      }),
    });
    const data = await res.json();
    if (res.ok && data.token && data.email === "srushti@florafusion.com") {
      console.log("✅ [4/5] Existing Email/Password Login Preserved - PASSED");
      passed++;
    } else {
      console.error("❌ [4/5] Existing Login - FAILED:", res.status, data);
      failed++;
    }
  } catch (e) {
    console.error("❌ [4/5] Existing Login - EXCEPTION:", e.message);
    failed++;
  }

  // Test 5: Guest Checkout (Completely open without Authorization header)
  try {
    // First get a valid product slug/id
    const prodRes = await fetch("http://localhost:8080/api/v1/products");
    const prodJson = await prodRes.json();
    const products = Array.isArray(prodJson) ? prodJson : (prodJson.content || []);
    const testProduct = products[0] || { id: "p1", price: 499 };

    const guestOrderPayload = {
      items: [
        {
          productId: testProduct.id,
          quantity: 1,
          price: testProduct.price,
        },
      ],
      shippingAddress: {
        name: "Guest Customer",
        phone: "9876543210",
        address: "123 Guest Floral Street",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411001",
      },
      deliveryMethod: "Standard",
      paymentMethod: "COD",
      couponCode: null,
    };

    const orderRes = await fetch("http://localhost:8080/api/v1/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(guestOrderPayload),
    });

    const orderData = await orderRes.json();
    if (orderRes.status === 201 && orderData.orderId) {
      console.log(`✅ [5/5] Guest Checkout: Placed order ${orderData.orderId} without account - PASSED`);
      passed++;
    } else {
      console.error("❌ [5/5] Guest Checkout - FAILED:", orderRes.status, orderData);
      failed++;
    }
  } catch (e) {
    console.error("❌ [5/5] Guest Checkout - EXCEPTION:", e.message);
    failed++;
  }

  console.log("\n========================================");
  console.log(`Summary: ${passed} PASSED, ${failed} FAILED`);
  console.log("========================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Fatal test error:", err);
  process.exit(1);
});
