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

    const apiKey = process.env.RESEND_API_KEY;
    const fromAddress = process.env.EMAIL_FROM || "Flora Fusion <onboarding@resend.dev>";

    // If Resend API key is not configured, simulate success safely without crashing frontend
    if (!apiKey) {
      console.warn(`[Resend Vercel] RESEND_API_KEY not configured. Simulating email dispatch to: ${to}`);
      return NextResponse.json({
        success: true,
        simulated: true,
        messageId: `resend-simulated-${Date.now()}`,
        message: "Email dispatch simulated (RESEND_API_KEY not set)",
      });
    }

    // Call Resend REST API
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [to.trim()],
        subject,
        html,
      }),
    });

    const resendData = await resendRes.json();

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

    console.log(`[Resend Vercel] Successfully dispatched email to ${to}, Resend ID: ${resendData.id}`);
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
