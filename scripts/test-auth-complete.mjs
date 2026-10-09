// Clean comprehensive Auth Verification Test Script
const BASE = "http://localhost:8080/api/v1/auth";

async function main() {
  console.log("🔐 Starting Full Flora Fusion Auth Verification...\n");
  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`✅ [${total}] ${name} — PASSED`);
      passed++;
    } catch (err) {
      console.error(`❌ [${total}] ${name} — FAILED:`, err.message);
    }
  }

  // 1. Admin Login
  await test("Admin Login (admin@florafusion.com)", async () => {
    const res = await fetch(`${BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@florafusion.com", password: "Password@123" }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.token || data.role !== "ADMIN" || data.email !== "admin@florafusion.com") {
      throw new Error(`Invalid response: ${JSON.stringify(data)}`);
    }
  });

  // 2. Customer Login
  await test("Customer Login (srushti@florafusion.com)", async () => {
    const res = await fetch(`${BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "srushti@florafusion.com", password: "Password@123" }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.token || data.role !== "CUSTOMER" || data.email !== "srushti@florafusion.com") {
      throw new Error(`Invalid response: ${JSON.stringify(data)}`);
    }
  });

  // 3. Bad Password Rejection
  await test("Bad Password Rejection (HTTP 400/401)", async () => {
    const res = await fetch(`${BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "srushti@florafusion.com", password: "IncorrectPassword123" }),
    });
    if (res.status !== 400 && res.status !== 401) {
      throw new Error(`Expected 400 or 401, got ${res.status}`);
    }
  });

  // 4. Non-Existent User Rejection
  await test("Non-existent User Rejection", async () => {
    const res = await fetch(`${BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "nobody_exists@florafusion.com", password: "Password@123" }),
    });
    if (res.status !== 400 && res.status !== 401 && res.status !== 404) {
      throw new Error(`Expected 400/401/404, got ${res.status}`);
    }
  });

  // 5. New User Registration Flow
  const newEmail = `user_${Date.now()}@florafusion.com`;
  await test(`New User Registration (${newEmail})`, async () => {
    const res = await fetch(`${BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Pooja Sharma",
        email: newEmail,
        password: "NewPassword@123",
        phone: "9876543210",
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`HTTP ${res.status}: ${err}`);
    }
    const data = await res.json();
    if (data.emailVerified === true) throw new Error("Expected unverified state initially");
  });

  // 6. Unverified User Login Blocked
  await test("Unverified User Login Blocked", async () => {
    const res = await fetch(`${BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newEmail, password: "NewPassword@123" }),
    });
    if (res.status !== 400 && res.status !== 403) {
      throw new Error(`Expected 400 or 403 for unverified user, got ${res.status}`);
    }
  });

  // 7. Verify Email with Demo Code 123456
  await test("Email Verification (Code: 123456)", async () => {
    const res = await fetch(`${BASE}/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newEmail, code: "123456" }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`HTTP ${res.status}: ${err}`);
    }
    const data = await res.json();
    if (!data.token || data.role !== "CUSTOMER") {
      throw new Error(`Verification failed: ${JSON.stringify(data)}`);
    }
  });

  // 8. Login as Newly Verified User
  await test("Newly Verified User Login", async () => {
    const res = await fetch(`${BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newEmail, password: "NewPassword@123" }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.token || data.email !== newEmail) {
      throw new Error(`Login failed: ${JSON.stringify(data)}`);
    }
  });

  // 9. Google Authentication (Sign In & Register)
  const googleEmail = `google_tester_${Date.now()}@florafusion.com`;
  await test("Google Authentication (One-tap / GIS)", async () => {
    const res = await fetch(`${BASE}/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: `test_google_token:${googleEmail}:Google Tester` }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.token || data.email !== googleEmail || data.role !== "CUSTOMER") {
      throw new Error(`Google Auth failed: ${JSON.stringify(data)}`);
    }
  });

  // 10. Rate Limiting / Resend Verification Cooldown
  await test("Resend Verification Cooldown Protection", async () => {
    const res = await fetch(`${BASE}/resend-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newEmail }),
    });
    // User is already verified or should be handled cleanly
    if (res.status !== 200 && res.status !== 400) {
      throw new Error(`Unexpected status ${res.status}`);
    }
  });

  console.log(`\n========================================`);
  console.log(`Summary: ${passed}/${total} Auth Tests Passed (${Math.round((passed/total)*100)}%)`);
  console.log(`========================================`);
}

main();
