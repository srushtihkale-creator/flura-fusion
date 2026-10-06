/**
 * Flora Fusion — Botanical HTML Email Templates
 * Standardized across both Java Spring Boot (EmailTemplateService.java) and Next.js / Vercel Serverless.
 * Design tokens: Forest Green (#173F2B), Deep Green (#24583B), Sage (#A9BDA3), Cream (#F7F4EC).
 */

function wrapInBaseLayout(title: string, innerHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F4EC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #173F2B; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F7F4EC; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(23,63,43,0.06);">
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #173F2B; padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 28px; font-weight: 700; color: #FFFFFF; letter-spacing: 1px;">FLORA FUSION</h1>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #A9BDA3; letter-spacing: 2px; text-transform: uppercase;">Nature Meets Your Space</p>
            </td>
          </tr>
          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px;">
              ${innerHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #FBF9F4; border-top: 1px solid #EAE5D9; padding: 28px 24px; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #173F2B;">Flora Fusion Plant Nursery & Botanical Living</p>
              <p style="margin: 0 0 16px 0; font-size: 12px; color: #66786D;">Pune, Maharashtra · Customer Care WhatsApp: +91 98904 14379</p>
              <p style="margin: 0; font-size: 11px; color: #8A9A90;">&copy; ${new Date().getFullYear()} Flora Fusion. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildVerificationEmailHtml(name: string, code: string, verifyUrl: string): string {
  const safeName = name || "Plant Lover";
  const content = `
    <h2 style="font-family: Georgia, serif; font-size: 24px; color: #173F2B; margin-top: 0; margin-bottom: 16px;">Verify Your Email Address 🌿</h2>
    <p style="font-size: 15px; line-height: 1.6; color: #33443C; margin-bottom: 24px;">
      Welcome to Flora Fusion, <strong>${safeName}</strong>! To activate your botanical account and secure your green space, please enter the verification code below.
    </p>
    <div style="background-color: #F7F4EC; border: 1px dashed #A9BDA3; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
      <span style="font-size: 13px; color: #66786D; display: block; margin-bottom: 6px;">Your 6-Digit Verification Code:</span>
      <span style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #173F2B; font-family: monospace;">${code}</span>
    </div>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${verifyUrl}" style="background-color: #173F2B; color: #FFFFFF; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-size: 15px; font-weight: 600; display: inline-block; box-shadow: 0 4px 14px rgba(23,63,43,0.25);">
        Verify Email Address →
      </a>
    </div>
    <p style="font-size: 13px; line-height: 1.5; color: #66786D; margin-top: 24px;">
      This code is valid for 15 minutes. If you did not create an account on Flora Fusion, you can safely ignore this email.
    </p>
  `;
  return wrapInBaseLayout("Verify Your Email — Flora Fusion", content);
}

export function buildWelcomeEmailHtml(name: string, exploreCatalogUrl: string): string {
  const safeName = name || "Plant Lover";
  const content = `
    <h2 style="font-family: Georgia, serif; font-size: 26px; color: #173F2B; margin-top: 0; margin-bottom: 16px;">Welcome to Flora Fusion! 🍃</h2>
    <p style="font-size: 15px; line-height: 1.6; color: #33443C; margin-bottom: 16px;">
      Hello <strong>${safeName}</strong>, we're thrilled to welcome you to our community of plant enthusiasts and nature lovers!
    </p>
    <p style="font-size: 15px; line-height: 1.6; color: #33443C; margin-bottom: 24px;">
      Whether you're greening your sunny balcony, searching for hardy indoor air-purifiers, handcrafted ceramic pots, or organic kitchen herb seeds, we've got you covered.
    </p>
    <div style="background-color: #F7F4EC; border-radius: 12px; padding: 20px; margin: 24px 0; border-left: 4px solid #173F2B;">
      <h3 style="font-size: 16px; color: #173F2B; margin-top: 0; margin-bottom: 8px;">🎁 Welcome Gift For You</h3>
      <p style="font-size: 14px; color: #33443C; margin: 0;">
        Use coupon code <strong style="background: #DDE7D8; padding: 2px 8px; border-radius: 4px; color: #173F2B;">WELCOME50</strong> for Flat ₹50 OFF on your first order of ₹499 or more!
      </p>
    </div>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${exploreCatalogUrl}" style="background-color: #173F2B; color: #FFFFFF; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-size: 15px; font-weight: 600; display: inline-block; box-shadow: 0 4px 14px rgba(23,63,43,0.25);">
        Explore Botanical Catalog →
      </a>
    </div>
  `;
  return wrapInBaseLayout("Welcome to Flora Fusion", content);
}

export function buildPasswordResetEmailHtml(name: string, code: string, resetUrl: string): string {
  const safeName = name || "Customer";
  const content = `
    <h2 style="font-family: Georgia, serif; font-size: 26px; color: #173F2B; margin-top: 0; margin-bottom: 16px;">Password Reset Request 🔐</h2>
    <p style="font-size: 15px; line-height: 1.6; color: #33443C; margin-bottom: 16px;">
      Hello <strong>${safeName}</strong>, we received a request to reset your password for your Flora Fusion account.
    </p>
    <div style="background-color: #F7F4EC; border: 1px dashed #A9BDA3; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
      <span style="font-size: 13px; color: #66786D; display: block; margin-bottom: 6px;">Your 6-Digit Password Reset Code:</span>
      <span style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #173F2B; font-family: monospace;">${code}</span>
    </div>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${resetUrl}" style="background-color: #173F2B; color: #FFFFFF; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-size: 15px; font-weight: 600; display: inline-block; box-shadow: 0 4px 14px rgba(23,63,43,0.25);">
        Reset Password →
      </a>
    </div>
    <p style="font-size: 13px; line-height: 1.5; color: #66786D; margin-top: 24px;">
      This code is valid for 1 hour. If you did not request a password reset, please ignore this email; your account remains secure.
    </p>
  `;
  return wrapInBaseLayout("Reset Your Password — Flora Fusion", content);
}

export function buildOrderConfirmationEmailHtml(order: any, customerName: string, trackingUrl: string): string {
  const safeName = customerName || "Customer";
  const itemsHtml = (order.items || [])
    .map(
      (item: any) => `
        <tr style="border-bottom: 1px solid #EAE5D9;">
          <td style="padding: 12px 0; font-size: 14px; color: #173F2B; font-weight: 600;">
            ${item.name}
            <span style="display: block; font-size: 12px; color: #66786D; font-weight: normal;">Qty: ${item.quantity}</span>
          </td>
          <td style="padding: 12px 0; text-align: right; font-size: 14px; color: #173F2B; font-weight: 600;">
            ₹${(item.price * item.quantity).toLocaleString("en-IN")}
          </td>
        </tr>
      `
    )
    .join("");

  const address = order.shippingAddress || {};
  const content = `
    <div style="background-color: #DDE7D8; color: #173F2B; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 6px 14px; border-radius: 999px; display: inline-block; margin-bottom: 16px;">
      ✓ Order Confirmed
    </div>
    <h2 style="font-family: Georgia, serif; font-size: 26px; color: #173F2B; margin-top: 0; margin-bottom: 8px;">
      Thank you for your order, ${safeName}!
    </h2>
    <p style="font-size: 14px; color: #66786D; margin-bottom: 24px;">
      Order Number: <strong style="color: #173F2B;">${order.id}</strong> · Placed on ${order.date || "Today"}
    </p>

    <div style="border: 1px solid #EAE5D9; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <h3 style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; color: #173F2B; margin-top: 0; margin-bottom: 12px; border-bottom: 1px solid #EAE5D9; padding-bottom: 8px;">Order Summary</h3>
      <table style="width: 100%; border-collapse: collapse;">
        ${itemsHtml}
      </table>
      <table style="width: 100%; margin-top: 16px; border-top: 2px solid #EAE5D9; padding-top: 12px;">
        <tr>
          <td style="font-size: 14px; color: #66786D; padding: 4px 0;">Subtotal:</td>
          <td style="font-size: 14px; color: #173F2B; text-align: right; padding: 4px 0;">₹${(order.subtotal || 0).toLocaleString("en-IN")}</td>
        </tr>
        <tr>
          <td style="font-size: 14px; color: #66786D; padding: 4px 0;">Shipping Fee:</td>
          <td style="font-size: 14px; color: #173F2B; text-align: right; padding: 4px 0;">${order.shippingFee === 0 ? "FREE" : `₹${order.shippingFee}`}</td>
        </tr>
        <tr style="border-top: 1px solid #EAE5D9;">
          <td style="font-size: 16px; font-weight: 700; color: #173F2B; padding: 10px 0 0 0;">Total Amount:</td>
          <td style="font-size: 18px; font-weight: 700; color: #173F2B; text-align: right; padding: 10px 0 0 0;">₹${(order.total || 0).toLocaleString("en-IN")}</td>
        </tr>
      </table>
    </div>

    <div style="background-color: #F7F4EC; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
      <h4 style="font-size: 13px; text-transform: uppercase; color: #173F2B; margin: 0 0 6px 0;">Shipping To:</h4>
      <p style="font-size: 13px; line-height: 1.5; color: #33443C; margin: 0;">
        <strong>${address.fullName || safeName}</strong> (${address.phone || ""})<br/>
        ${address.addressLine1 || ""}, ${address.city || ""}, ${address.state || ""} - ${address.pincode || ""}
      </p>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${trackingUrl}" style="background-color: #173F2B; color: #FFFFFF; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-size: 15px; font-weight: 600; display: inline-block; box-shadow: 0 4px 14px rgba(23,63,43,0.25);">
        Track Your Order Live →
      </a>
    </div>
  `;
  return wrapInBaseLayout(`Order Confirmed — ${order.id}`, content);
}
