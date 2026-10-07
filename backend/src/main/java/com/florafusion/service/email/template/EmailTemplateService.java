package com.florafusion.service.email.template;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.florafusion.dto.order.ShippingAddressDto;
import com.florafusion.entity.Order;
import com.florafusion.entity.OrderItem;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

/**
 * Generates branded, responsive botanical HTML email templates for Flora Fusion.
 * Adheres strictly to Flora Fusion design tokens (#173F2B, #24583B, #F7F4EC).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmailTemplateService {

    private final ObjectMapper objectMapper;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd MMMM yyyy, hh:mm a");
    private static final Locale INDIA_LOCALE = new Locale("en", "IN");

    // ==========================================
    // 1. EMAIL VERIFICATION
    // ==========================================
    public String buildVerificationEmail(String name, String verificationUrl, String code) {
        String safeName = sanitize(name != null ? name : "Plant Lover");
        String content = """
            <h2 style="font-family: Georgia, serif; font-size: 24px; color: #173F2B; margin-top: 0; margin-bottom: 16px;">Verify Your Email Address 🌿</h2>
            <p style="font-size: 15px; line-height: 1.6; color: #33443C; margin-bottom: 24px;">
                Welcome to Flora Fusion, <strong>%s</strong>! To activate your botanical account and secure your green space, please verify your email address.
            </p>
            %s
            <div style="text-align: center; margin: 32px 0;">
                <a href="%s" style="background-color: #173F2B; color: #FFFFFF; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-size: 15px; font-weight: 600; display: inline-block; box-shadow: 0 4px 14px rgba(23,63,43,0.25);">
                    Verify Email Address →
                </a>
            </div>
            <p style="font-size: 13px; line-height: 1.5; color: #66786D; margin-top: 24px;">
                If you did not create an account on Flora Fusion, you can safely ignore this email. This link will expire in 24 hours.
            </p>
            """.formatted(
                safeName,
                code != null && !code.isBlank() ? """
                    <div style="background-color: #F7F4EC; border: 1px dashed #A9BDA3; border-radius: 12px; padding: 16px; text-align: center; margin: 20px 0;">
                        <span style="font-size: 13px; color: #66786D; display: block; margin-bottom: 4px;">Verification Code:</span>
                        <span style="font-size: 28px; font-weight: 700; letter-spacing: 4px; color: #173F2B;">%s</span>
                    </div>
                """.formatted(code) : "",
                verificationUrl
        );

        return wrapInBaseLayout("Verify Your Email — Flora Fusion", content);
    }

    // ==========================================
    // 2. WELCOME EMAIL
    // ==========================================
    public String buildWelcomeEmail(String name, String exploreCatalogUrl) {
        String safeName = sanitize(name != null ? name : "Plant Lover");
        String content = """
            <h2 style="font-family: Georgia, serif; font-size: 26px; color: #173F2B; margin-top: 0; margin-bottom: 16px;">Welcome to Flora Fusion! 🍃</h2>
            <p style="font-size: 15px; line-height: 1.6; color: #33443C; margin-bottom: 16px;">
                Hello <strong>%s</strong>, we're thrilled to welcome you to our growing community of plant enthusiasts and nature lovers.
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
                <a href="%s" style="background-color: #173F2B; color: #FFFFFF; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-size: 15px; font-weight: 600; display: inline-block; box-shadow: 0 4px 14px rgba(23,63,43,0.25);">
                    Explore Botanical Catalog →
                </a>
            </div>
            """.formatted(safeName, exploreCatalogUrl);

        return wrapInBaseLayout("Welcome to Flora Fusion", content);
    }

    // ==========================================
    // 3. ORDER CONFIRMATION
    // ==========================================
    public String buildOrderConfirmationEmail(Order order, String trackingUrl) {
        String recipientName = getRecipientName(order);
        String formattedDate = order.getCreatedAt() != null 
                ? DATE_FORMATTER.format(order.getCreatedAt().atZone(ZoneId.systemDefault())) 
                : "Just now";

        StringBuilder itemsHtml = new StringBuilder();
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                itemsHtml.append("""
                    <tr style="border-bottom: 1px solid #EAE5D9;">
                        <td style="padding: 12px 0; font-size: 14px; color: #173F2B; font-weight: 600;">
                            %s
                            <span style="display: block; font-size: 12px; color: #66786D; font-weight: normal;">SKU: %s · Qty: %d</span>
                        </td>
                        <td style="padding: 12px 0; text-align: right; font-size: 14px; color: #173F2B; font-weight: 600;">
                            %s
                        </td>
                    </tr>
                """.formatted(
                        sanitize(item.getProductNameSnapshot()),
                        sanitize(item.getSkuSnapshot() != null ? item.getSkuSnapshot() : "N/A"),
                        item.getQuantity(),
                        formatCurrency(item.getLineTotal())
                ));
            }
        }

        ShippingAddressDto address = parseShippingAddress(order.getShippingAddressSnapshot());
        String addressHtml = address != null ? """
            <p style="font-size: 13px; line-height: 1.5; color: #33443C; margin: 0;">
                <strong>%s</strong> (%s)<br/>
                %s, %s, %s - %s
            </p>
        """.formatted(
                sanitize(address.name()),
                sanitize(address.phone()),
                sanitize(address.address()),
                sanitize(address.city()),
                sanitize(address.state()),
                sanitize(address.pincode())
        ) : "<p style=\"font-size: 13px; color: #66786D;\">Standard Shipping Address</p>";

        String content = """
            <div style="background-color: #DDE7D8; color: #173F2B; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 6px 14px; border-radius: 999px; display: inline-block; margin-bottom: 16px;">
                ✓ Order Confirmed
            </div>
            <h2 style="font-family: Georgia, serif; font-size: 26px; color: #173F2B; margin-top: 0; margin-bottom: 8px;">
                Thank you for your order, %s!
            </h2>
            <p style="font-size: 14px; color: #66786D; margin-bottom: 24px;">
                Order Number: <strong style="color: #173F2B;">%s</strong> · Placed on %s
            </p>

            <div style="border: 1px solid #EAE5D9; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <h3 style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; color: #173F2B; margin-top: 0; margin-bottom: 12px; border-bottom: 1px solid #EAE5D9; padding-bottom: 8px;">Order Summary</h3>
                <table style="width: 100%%; border-collapse: collapse;">
                    %s
                </table>
                
                <table style="width: 100%%; margin-top: 16px; border-top: 2px solid #EAE5D9; padding-top: 12px;">
                    <tr>
                        <td style="font-size: 14px; color: #66786D; padding: 4px 0;">Subtotal:</td>
                        <td style="font-size: 14px; color: #173F2B; text-align: right; padding: 4px 0;">%s</td>
                    </tr>
                    <tr>
                        <td style="font-size: 14px; color: #66786D; padding: 4px 0;">Discount:</td>
                        <td style="font-size: 14px; color: #2E7D32; text-align: right; padding: 4px 0;">- %s</td>
                    </tr>
                    <tr>
                        <td style="font-size: 14px; color: #66786D; padding: 4px 0;">Shipping Fee:</td>
                        <td style="font-size: 14px; color: #173F2B; text-align: right; padding: 4px 0;">%s</td>
                    </tr>
                    <tr style="border-top: 1px solid #EAE5D9;">
                        <td style="font-size: 16px; font-weight: 700; color: #173F2B; padding: 10px 0 0 0;">Total Amount:</td>
                        <td style="font-size: 18px; font-weight: 700; color: #173F2B; text-align: right; padding: 10px 0 0 0;">%s</td>
                    </tr>
                </table>
            </div>

            <div style="background-color: #F7F4EC; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
                <h4 style="font-size: 13px; text-transform: uppercase; color: #173F2B; margin: 0 0 6px 0;">Shipping To:</h4>
                %s
            </div>

            <div style="text-align: center; margin: 32px 0;">
                <a href="%s" style="background-color: #173F2B; color: #FFFFFF; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-size: 15px; font-weight: 600; display: inline-block; box-shadow: 0 4px 14px rgba(23,63,43,0.25);">
                    Track Your Order Live →
                </a>
            </div>
            """.formatted(
                recipientName,
                order.getOrderNumber(),
                formattedDate,
                itemsHtml.toString(),
                formatCurrency(order.getSubtotal()),
                formatCurrency(order.getDiscountAmount()),
                order.getShippingAmount().compareTo(BigDecimal.ZERO) == 0 ? "FREE" : formatCurrency(order.getShippingAmount()),
                formatCurrency(order.getTotalAmount()),
                addressHtml,
                trackingUrl
        );

        return wrapInBaseLayout("Order Confirmed — " + order.getOrderNumber(), content);
    }

    // ==========================================
    // 4. INVOICE EMAIL
    // ==========================================
    public String buildInvoiceEmail(Order order, String trackingUrl) {
        String recipientName = getRecipientName(order);
        String content = """
            <h2 style="font-family: Georgia, serif; font-size: 26px; color: #173F2B; margin-top: 0; margin-bottom: 12px;">Tax Invoice for Order %s</h2>
            <p style="font-size: 15px; line-height: 1.6; color: #33443C; margin-bottom: 20px;">
                Dear <strong>%s</strong>, please find attached your official Flora Fusion Tax Invoice (PDF) for order <strong>%s</strong>.
            </p>
            <div style="background-color: #F7F4EC; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <table style="width: 100%%;">
                    <tr>
                        <td style="font-size: 14px; color: #66786D;">Order Total:</td>
                        <td style="font-size: 16px; font-weight: 700; color: #173F2B; text-align: right;">%s</td>
                    </tr>
                    <tr>
                        <td style="font-size: 14px; color: #66786D;">Payment Status:</td>
                        <td style="font-size: 14px; font-weight: 600; color: #2E7D32; text-align: right;">%s</td>
                    </tr>
                </table>
            </div>
            <div style="text-align: center; margin: 28px 0;">
                <a href="%s" style="background-color: #173F2B; color: #FFFFFF; text-decoration: none; padding: 12px 28px; border-radius: 999px; font-size: 14px; font-weight: 600; display: inline-block;">
                    View Order Online →
                </a>
            </div>
            """.formatted(
                order.getOrderNumber(),
                recipientName,
                order.getOrderNumber(),
                formatCurrency(order.getTotalAmount()),
                order.getPaymentStatus(),
                trackingUrl
        );

        return wrapInBaseLayout("Tax Invoice — " + order.getOrderNumber(), content);
    }

    // ==========================================
    // 5. ORDER STATUS UPDATE
    // ==========================================
    public String buildOrderStatusUpdateEmail(String orderNumber, String recipientName, String previousStatus, String newStatus, String trackingUrl) {
        String safeRecipientName = sanitize(recipientName != null ? recipientName : "Valued Customer");
        String statusMessage = switch (newStatus.toLowerCase()) {
            case "confirmed" -> "Your order has been confirmed by our nursery and is being prepared for fulfillment.";
            case "packed" -> "Your plants and pots have been safely insulated and packed in transit-safe eco containers.";
            case "dispatched", "shipped" -> "Your green package is on its way! It has been dispatched with our logistics partner.";
            case "out for delivery" -> "Exciting news! Your Flora Fusion delivery partner is out for delivery in your area today.";
            case "delivered" -> "Your plants have arrived safely at your doorstep. Welcome nature into your home!";
            case "cancelled" -> "Your order has been cancelled. If any payment was deducted, a refund has been initiated.";
            default -> "Your order status has been updated to " + newStatus + ".";
        };

        String content = """
            <div style="background-color: #DDE7D8; color: #173F2B; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 6px 14px; border-radius: 999px; display: inline-block; margin-bottom: 16px;">
                Status Update: %s
            </div>
            <h2 style="font-family: Georgia, serif; font-size: 26px; color: #173F2B; margin-top: 0; margin-bottom: 12px;">
                Order %s is now %s 📦
            </h2>
            <p style="font-size: 15px; line-height: 1.6; color: #33443C; margin-bottom: 20px;">
                Hello <strong>%s</strong>, %s
            </p>
            <div style="background-color: #F7F4EC; border-radius: 12px; padding: 18px; margin-bottom: 24px; text-align: center;">
                <span style="font-size: 12px; text-transform: uppercase; color: #66786D; display: block; margin-bottom: 4px;">Current Stage</span>
                <span style="font-size: 20px; font-weight: 700; color: #173F2B;">%s</span>
            </div>
            <div style="text-align: center; margin: 32px 0;">
                <a href="%s" style="background-color: #173F2B; color: #FFFFFF; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-size: 15px; font-weight: 600; display: inline-block; box-shadow: 0 4px 14px rgba(23,63,43,0.25);">
                    View Live Tracking Timeline →
                </a>
            </div>
            """.formatted(
                newStatus,
                orderNumber,
                newStatus,
                safeRecipientName,
                statusMessage,
                newStatus,
                trackingUrl
        );

        return wrapInBaseLayout("Order " + orderNumber + " Status: " + newStatus, content);
    }

    public String buildOrderStatusUpdateEmail(Order order, String previousStatus, String newStatus, String trackingUrl) {
        String recipientName = getRecipientName(order);
        return buildOrderStatusUpdateEmail(order.getOrderNumber(), recipientName, previousStatus, newStatus, trackingUrl);
    }

    // ==========================================
    // 6. FORGOT PASSWORD / PASSWORD RESET
    // ==========================================
    public String buildPasswordResetEmail(String name, String resetUrl, String code) {
        String safeName = sanitize(name != null ? name : "Customer");
        String content = """
            <h2 style="font-family: Georgia, serif; font-size: 26px; color: #173F2B; margin-top: 0; margin-bottom: 16px;">Password Reset Request 🔐</h2>
            <p style="font-size: 15px; line-height: 1.6; color: #33443C; margin-bottom: 16px;">
                Hello <strong>%s</strong>, we received a request to reset your password for your Flora Fusion account.
            </p>
            %s
            <div style="text-align: center; margin: 32px 0;">
                <a href="%s" style="background-color: #173F2B; color: #FFFFFF; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-size: 15px; font-weight: 600; display: inline-block; box-shadow: 0 4px 14px rgba(23,63,43,0.25);">
                    Reset Password →
                </a>
            </div>
            <p style="font-size: 13px; line-height: 1.5; color: #66786D; margin-top: 24px;">
                If you did not make this request, you can safely ignore this email. Your password will remain unchanged. This reset link is valid for 1 hour.
            </p>
            """.formatted(
                safeName,
                code != null && !code.isBlank() ? """
                    <div style="background-color: #F7F4EC; border: 1px dashed #A9BDA3; border-radius: 12px; padding: 16px; text-align: center; margin: 20px 0;">
                        <span style="font-size: 13px; color: #66786D; display: block; margin-bottom: 4px;">Security Reset Code:</span>
                        <span style="font-size: 28px; font-weight: 700; letter-spacing: 4px; color: #173F2B;">%s</span>
                    </div>
                """.formatted(code) : "",
                resetUrl
        );

        return wrapInBaseLayout("Reset Your Password — Flora Fusion", content);
    }

    // ==========================================
    // BASE BRANDED HTML SHELL
    // ==========================================
    private String wrapInBaseLayout(String title, String bodyContent) {
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>%s</title>
            </head>
            <body style="margin: 0; padding: 24px 12px; background-color: #F7F4EC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(23, 63, 43, 0.08); border: 1px solid #EAE5D9;">
                    
                    <!-- Brand Header -->
                    <div style="background-color: #173F2B; padding: 28px 32px; text-align: center;">
                        <h1 style="font-family: Georgia, serif; font-size: 26px; color: #FFFFFF; margin: 0; letter-spacing: 0.5px;">Flora Fusion</h1>
                        <span style="font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; color: #A9BDA3; display: block; margin-top: 4px;">Nature Meets Your Space</span>
                    </div>

                    <!-- Main Email Content -->
                    <div style="padding: 36px 32px;">
                        %s
                    </div>

                    <!-- Botanical Brand Footer -->
                    <div style="background-color: #FBF9F4; border-top: 1px solid #EAE5D9; padding: 24px 32px; text-align: center;">
                        <p style="font-family: Georgia, serif; font-style: italic; font-size: 14px; color: #173F2B; margin: 0 0 8px 0;">
                            "Nature Looks Good On You"
                        </p>
                        <p style="font-size: 12px; color: #8A9A90; margin: 0; line-height: 1.5;">
                            Flora Fusion Premium Nursery · Plants · Pots · Seeds<br/>
                            Need assistance? Chat with us on WhatsApp or reply directly to this email.
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(title, bodyContent);
    }

    private String sanitize(String input) {
        if (input == null) return "";
        return input.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }

    private String formatCurrency(BigDecimal amount) {
        if (amount == null) return "₹0.00";
        NumberFormat nf = NumberFormat.getCurrencyInstance(INDIA_LOCALE);
        return nf.format(amount).replace("INR", "₹").replace("Rs.", "₹");
    }

    private String getRecipientName(Order order) {
        if (order.getUser() != null && order.getUser().getName() != null) {
            return sanitize(order.getUser().getName());
        }
        ShippingAddressDto address = parseShippingAddress(order.getShippingAddressSnapshot());
        if (address != null && address.name() != null) {
            return sanitize(address.name());
        }
        return "Valued Customer";
    }

    private ShippingAddressDto parseShippingAddress(String json) {
        if (json == null || json.isBlank()) return null;
        try {
            return objectMapper.readValue(json, ShippingAddressDto.class);
        } catch (Exception e) {
            return null;
        }
    }
}
