import { NextResponse } from "next/server";
import {
  buildVerificationEmailHtml,
  buildWelcomeEmailHtml,
  buildPasswordResetEmailHtml,
  buildOrderConfirmationEmailHtml,
} from "@/lib/email-templates";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, to, name, code, url, order, subject: customSubject, html: customHtml } = body;

    if (!to) {
      return NextResponse.json({ error: "Recipient email is required" }, { status: 400 });
    }

    let subject = customSubject;
    let html = customHtml;

    const frontendUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://flura-fusion.vercel.app";

    switch (type) {
      case "verification":
        subject = "Verify your email — Flora Fusion 🌿";
        html = buildVerificationEmailHtml(
          name || "Plant Lover",
          code || "123456",
          url || `${frontendUrl}/verify-email?code=${code}&email=${encodeURIComponent(to)}`
        );
        break;

      case "welcome":
        subject = "Welcome to Flora Fusion! 🍃";
        html = buildWelcomeEmailHtml(name || "Plant Lover", url || `${frontendUrl}/plants`);
        break;

      case "reset":
        subject = "Reset your password — Flora Fusion 🔐";
        html = buildPasswordResetEmailHtml(
          name || "Customer",
          code || "123456",
          url || `${frontendUrl}/reset-password?token=${code}&email=${encodeURIComponent(to)}`
        );
        break;

      case "order":
        subject = `Order Confirmed: ${order?.id || "FF-Order"} 🌿 Flora Fusion`;
        html = buildOrderConfirmationEmailHtml(
          order || {},
          name || order?.shippingAddress?.fullName || "Customer",
          url || `${frontendUrl}/account/orders`
        );
        break;
    }

    if (!subject || !html) {
      return NextResponse.json({ error: "Missing subject or HTML content" }, { status: 400 });
    }

    const cleanTo = (to || "").trim().toLowerCase();
    const apiKey = process.env.RESEND_API_KEY;
    const fromAddress = process.env.EMAIL_FROM || "Flora Fusion <onboarding@resend.dev>";

    // If Resend API key is not configured, simulate success safely without crashing frontend
    if (!apiKey) {
      console.warn(`[Resend Vercel] RESEND_API_KEY not configured. Simulating email dispatch to: ${cleanTo}`);
      return NextResponse.json({
        success: true,
        simulated: true,
        messageId: `resend-simulated-${Date.now()}`,
        message: "Email dispatch simulated (RESEND_API_KEY not set)",
      });
    }

    // Call Resend REST API
    let resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [cleanTo],
        subject,
        html,
      }),
    });

    let resendData = await resendRes.json().catch(() => ({}));

    // Handle Resend testing restriction in sandbox mode (onboarding@resend.dev):
    // In free tier / sandbox, Resend ONLY allows sending to the account owner email (srushti.h.kale2004@gmail.com).
    // If the requested recipient was different, automatically deliver the email to the owner email with a notice banner,
    // ensuring the developer/tester actually gets the verification email in their inbox!
    const isSandboxRestriction =
      !resendRes.ok &&
      resendRes.status === 403 &&
      typeof resendData.message === "string" &&
      resendData.message.toLowerCase().includes("testing emails to your own email address");

    if (isSandboxRestriction) {
      const ownerEmail = "srushti.h.kale2004@gmail.com";
      console.warn(`[Resend Sandbox] Recipient ${cleanTo} restricted. Rerouting to verified owner: ${ownerEmail}`);

      const banner = `
        <div style="background-color: #FEF3C7; border: 1px solid #F59E0B; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #92400E; line-height: 1.5;">
          <strong>🌿 Flora Fusion Sandbox Mode Notice:</strong><br />
          This message was originally addressed to: <code>${cleanTo}</code>.<br />
          Because Resend is currently operating in sandbox testing mode with <code>onboarding@resend.dev</code>, this email was securely delivered to your registered inbox: <strong>${ownerEmail}</strong>.
        </div>
      `;

      const sandboxSubject = `[Sandbox: ${cleanTo}] ${subject}`;
      const sandboxHtml = banner + html;

      resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [ownerEmail],
          subject: sandboxSubject,
          html: sandboxHtml,
        }),
      });

      resendData = await resendRes.json().catch(() => ({}));

      if (resendRes.ok) {
        console.log(`[Resend Sandbox] Successfully delivered to owner ${ownerEmail}, Resend ID: ${resendData.id}`);
        return NextResponse.json({
          success: true,
          id: resendData.id,
          sandboxRedirected: true,
          deliveredTo: ownerEmail,
          originalRecipient: cleanTo,
        });
      }
    }

    if (!resendRes.ok) {
      console.error(`[Resend Vercel] Error from Resend API (${resendRes.status}):`, resendData);
      return NextResponse.json(
        {
          success: false,
          error: resendData.message || "Failed to dispatch email via Resend",
        },
        { status: resendRes.status }
      );
    }

    console.log(`[Resend Vercel] Successfully dispatched email to ${cleanTo}, Resend ID: ${resendData.id}`);
    return NextResponse.json({
      success: true,
      id: resendData.id,
    });
  } catch (error: any) {
    console.error("[Resend Vercel] Internal error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
