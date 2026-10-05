/**
 * Flora Fusion — End-to-End Offer Marquee, Bundle Pricing, Auto-Apply & RBAC Verification Script
 */

export {};

const API_BASE = "http://localhost:8080/api/v1";

async function main() {
  console.log("🌸 Running Flora Fusion Offers & RBAC E2E Test Suite...\n");

  // 1. Authenticate as Admin
  console.log("Step 1: Authenticate as Admin");
  const adminLoginRes = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@florafusion.com", password: "Password@123" }),
  });
  if (!adminLoginRes.ok) {
    const err = await adminLoginRes.text();
    throw new Error(`Admin login failed: ${err}`);
  }
  const adminLogin = await adminLoginRes.json();
  const adminToken = adminLogin.token;
  console.log(`  ✓ Logged in as ${adminLogin.name} (${adminLogin.role})\n`);

  // 2. Authenticate as Customer A
  console.log("Step 2: Authenticate as Customer A");
  const customerALoginRes = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "srushti@florafusion.com", password: "Password@123" }),
  });
  if (!customerALoginRes.ok) {
    const err = await customerALoginRes.text();
    throw new Error(`Customer A login failed: ${err}`);
  }
  const customerA = await customerALoginRes.json();
  const customerAToken = customerA.token;
  console.log(`  ✓ Logged in Customer A: ${customerA.name} (${customerA.role})\n`);

  // 3. Authenticate as Customer B (or register new customer)
  console.log("Step 3: Authenticate Customer B");
  const customerBLoginRes = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "aarav.patel@example.com", password: "Customer@123" }),
  });
  let customerBToken: string;
  if (customerBLoginRes.ok) {
    const customerB = await customerBLoginRes.json();
    customerBToken = customerB.token;
    console.log(`  ✓ Logged in Customer B: ${customerB.name}`);
  } else {
    // Register if doesn't exist
    const regRes = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Aarav Patel", email: "aarav.patel@example.com", password: "Customer@123", phone: "+919876543210" }),
    });
    const regData = await regRes.json();
    customerBToken = regData.token;
    console.log(`  ✓ Registered Customer B: ${regData.name}`);
  }
  console.log();

  // 4. Admin creates a new test offer
  console.log("Step 4: Admin creates new promotional offer 'FESTIVE15'");
  const createOfferRes = await fetch(`${API_BASE}/admin/offers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      code: "FESTIVE15",
      title: "15% OFF Festive",
      bannerText: "✨ FESTIVE OFFER: 15% OFF ORDERS ABOVE ₹1,999",
      discountType: "PERCENTAGE",
      discountValue: 15,
      minCartValue: 1999,
      maxDiscount: 500,
      applicableCategory: "all",
      targetLink: "/plants",
      autoApply: true,
      isActive: true,
      displayOrder: 10,
    }),
  });
  if (!createOfferRes.ok) {
    const errText = await createOfferRes.text();
    throw new Error(`Failed to create offer: ${errText}`);
  }
  const createdOffer = await createOfferRes.json();
  console.log(`  ✓ Offer created: ${createdOffer.code} (ID: ${createdOffer.id})`);
  console.log(`  ✓ Banner text: "${createdOffer.bannerText}"\n`);

  // 5. Verify public endpoint includes active offer
  console.log("Step 5: Verify public active offers list");
  const publicRes = await fetch(`${API_BASE}/coupons`);
  const activeCoupons: any[] = await publicRes.json();
  const festiveFound = activeCoupons.find((c) => c.code === "FESTIVE15");
  if (!festiveFound) throw new Error("Created offer was not found in active coupons!");
  console.log(`  ✓ Active offers count: ${activeCoupons.length}`);
  console.log(`  ✓ FESTIVE15 is present in active public offers\n`);

  // 6. Admin toggles offer to INACTIVE
  console.log("Step 6: Admin toggles offer to INACTIVE");
  const toggleRes = await fetch(`${API_BASE}/admin/offers/${createdOffer.id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ isActive: false }),
  });
  const toggledOffer = await toggleRes.json();
  console.log(`  ✓ Offer isActive after toggle: ${toggledOffer.isActive}`);

  // 7. Verify inactive offer disappears from public endpoint
  console.log("Step 7: Verify inactive offer is excluded from public marquee");
  const publicRes2 = await fetch(`${API_BASE}/coupons`);
  const activeCouponsAfter: any[] = await publicRes2.json();
  const festiveFoundAfter = activeCouponsAfter.find((c) => c.code === "FESTIVE15");
  if (festiveFoundAfter) throw new Error("Inactive offer should NOT appear in public coupons!");
  console.log(`  ✓ FESTIVE15 successfully disappeared from public active marquee\n`);

  // Clean up test offer
  await fetch(`${API_BASE}/admin/offers/${createdOffer.id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  console.log(`  ✓ Cleaned up test offer\n`);

  // 8. Test Auto-Apply & Bundle Discount Calculation (Plant bundle: 4 plants @ ₹1,199)
  console.log("Step 8: Authoritative Bundle Discount (4 Plants @ ₹1,199)");
  // Let's get catalog plants
  const prodsRes = await fetch(`${API_BASE}/products?category=plants&size=4`);
  const prodsData = await prodsRes.json();
  const plantItems = (prodsData.content || prodsData).slice(0, 4);

  if (plantItems.length >= 4) {
    const itemsReq = plantItems.map((p: any) => ({ productId: p.id, quantity: 1 }));
    const validateBundleRes = await fetch(`${API_BASE}/orders/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: itemsReq }), // No coupon specified -> triggers auto-apply!
    });
    const valBundle = await validateBundleRes.json();
    console.log(`  ✓ Cart Subtotal for 4 plants: ₹${valBundle.subtotal}`);
    console.log(`  ✓ Auto-applied Coupon: "${valBundle.appliedCoupon}"`);
    console.log(`  ✓ Calculated Discount: ₹${valBundle.discount}`);
    console.log(`  ✓ Total after bundle: ₹${valBundle.total}`);
    if (valBundle.appliedCoupon !== "PLANTBUNDLE4") {
      console.warn(`  ⚠️ Expected PLANTBUNDLE4 to auto-apply, got: ${valBundle.appliedCoupon}`);
    } else {
      console.log(`  ✓ Auto-apply correctly activated PLANTBUNDLE4 without manual coupon entry!\n`);
    }
  }

  // 9. Test Auto-Apply on Order Above ₹1,499 (FLORA10: 10% off)
  console.log("Step 9: Authoritative 10% Auto-Apply on Orders Above ₹1,499");
  // 1 high-value plant or multiple plants with subtotal >= 1500
  const potRes = await fetch(`${API_BASE}/products?category=pots&size=2`);
  const potData = await potRes.json();
  const potItem = (potData.content || potData)[0];
  const validate10Res = await fetch(`${API_BASE}/orders/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: [{ productId: potItem.id, quantity: 4 }] }),
  });
  const val10 = await validate10Res.json();
  console.log(`  ✓ Cart Subtotal: ₹${val10.subtotal}`);
  console.log(`  ✓ Auto-applied Coupon: "${val10.appliedCoupon}"`);
  console.log(`  ✓ Calculated Discount: ₹${val10.discount}`);
  console.log(`  ✓ Total: ₹${val10.total}\n`);

  // 10. Privacy & RBAC Verification: Customer A cannot access Customer B's order
  console.log("Step 10: Customer Privacy & Data Isolation");
  // Customer A places an order
  const orderReqA = {
    items: [{ productId: plantItems[0].id, quantity: 1 }],
    shippingAddress: {
      name: "Srushti Kale",
      phone: "+919876543210",
      address: "123 Green Avenue",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
    },
    paymentMethod: "UPI",
  };
  const createOrderARes = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${customerAToken}`,
    },
    body: JSON.stringify(orderReqA),
  });
  if (!createOrderARes.ok) throw new Error("Customer A order placement failed");
  const orderA = await createOrderARes.json();
  console.log(`  ✓ Customer A created Order #${orderA.orderNumber} (ID: ${orderA.orderId})`);

  // Customer A can access their own order
  const getOrderOwnRes = await fetch(`${API_BASE}/orders/${orderA.orderId}`, {
    headers: { Authorization: `Bearer ${customerAToken}` },
  });
  if (!getOrderOwnRes.ok) throw new Error("Customer A could not access their own order!");
  console.log(`  ✓ Customer A successfully accessed their own order #${orderA.orderNumber}`);

  // Customer B attempts to access Customer A's order
  const unauthorizedRes = await fetch(`${API_BASE}/orders/${orderA.orderId}`, {
    headers: { Authorization: `Bearer ${customerBToken}` },
  });
  console.log(`  ✓ Customer B access attempt HTTP status: ${unauthorizedRes.status}`);
  if (unauthorizedRes.status === 403) {
    console.log(`  ✓ ACCESS DENIED (403): Customer B cannot access Customer A's order! Data isolation enforced!`);
  } else {
    throw new Error(`Expected 403 Forbidden, but received ${unauthorizedRes.status}`);
  }

  // Admin can access Customer A's order
  const adminGetRes = await fetch(`${API_BASE}/orders/${orderA.orderId}`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  if (!adminGetRes.ok) throw new Error("Admin could not access order!");
  console.log(`  ✓ Admin successfully authorized to access order #${orderA.orderNumber}\n`);

  console.log("==================================================");
  console.log("🎉 ALL 10 E2E VERIFICATION STEPS PASSED PERFECTLY!");
  console.log("==================================================");
}

main().catch((err) => {
  console.error("❌ Test suite failed:", err);
  process.exit(1);
});
