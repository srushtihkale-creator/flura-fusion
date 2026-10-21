package com.florafusion.service.email.template;

import com.florafusion.entity.EmailCampaign;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class PromotionalEmailTemplateBuilder {

    @Value("${application.frontend.url:${FRONTEND_URL:https://flura-fusion.vercel.app}}")
    private String frontendUrl;

    public String buildPromotionalHtml(EmailCampaign campaign, String recipientName, String unsubscribeUrl) {
        String cleanFrontendUrl = frontendUrl.replaceAll("/+$", "");
        String name = (recipientName != null && !recipientName.isBlank()) ? recipientName : "Plant Lover";
        String unsubUrl = (unsubscribeUrl != null && !unsubscribeUrl.isBlank()) 
                ? unsubscribeUrl 
                : cleanFrontendUrl + "/unsubscribe";

        String couponBox = "";
        String ctaLink = cleanFrontendUrl + "/plants";
        if (campaign.getTargetCategory() != null && !"all".equalsIgnoreCase(campaign.getTargetCategory())) {
            ctaLink = cleanFrontendUrl + "/" + campaign.getTargetCategory().toLowerCase().trim();
        }

        if (campaign.getCoupon() != null) {
            var c = campaign.getCoupon();
            String discountDesc = c.getTitle() != null ? c.getTitle() : c.getBannerText();
            if (discountDesc == null || discountDesc.isBlank()) {
                if ("PERCENTAGE".equalsIgnoreCase(c.getDiscountType())) {
                    discountDesc = c.getDiscountValue() + "% OFF";
                } else if ("FIXED_AMOUNT".equalsIgnoreCase(c.getDiscountType())) {
                    discountDesc = "Flat ₹" + c.getDiscountValue() + " OFF";
                } else {
                    discountDesc = "Special Promotional Voucher";
                }
            }

            String minOrder = (c.getMinCartValue() != null && c.getMinCartValue().doubleValue() > 0)
                    ? "Valid on orders above ₹" + c.getMinCartValue().intValue()
                    : "No minimum purchase required";

            couponBox = """
                <div style="background-color: #F7F4EC; border: 2px dashed #A9BDA3; border-radius: 12px; padding: 24px; text-align: center; margin: 28px 0;">
                    <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #B9825B; margin-bottom: 6px;">
                        Exclusive Botanical Offer
                    </div>
                    <div style="font-family: Georgia, serif; font-size: 28px; font-weight: 700; color: #173F2B; margin-bottom: 12px;">
                        %s
                    </div>
                    <div style="display: inline-block; background-color: #FFFFFF; border: 1px solid #173F2B; padding: 10px 24px; border-radius: 999px; margin-bottom: 12px;">
                        <span style="font-family: monospace; font-size: 20px; font-weight: 700; letter-spacing: 0.15em; color: #173F2B;">%s</span>
                    </div>
                    <div style="font-size: 13px; color: #4A5568;">
                        %s
                    </div>
                </div>
            """.formatted(discountDesc, c.getCode(), minOrder);
        }

        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>%s</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #F7F4EC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2D3748; line-height: 1.6;">
                <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background-color: #F7F4EC; padding: 32px 16px;">
                    <tr>
                        <td align="center">
                            <!-- Main Container -->
                            <table role="presentation" width="100%%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(23, 63, 43, 0.08); border: 1px solid #E2E8F0;" cellspacing="0" cellpadding="0">
                                
                                <!-- Brand Header -->
                                <tr>
                                    <td style="background-color: #173F2B; padding: 28px 32px; text-align: center;">
                                        <div style="font-family: Georgia, serif; font-size: 26px; color: #FFFFFF; font-weight: 700; letter-spacing: 0.05em; margin: 0;">
                                            Flora Fusion
                                        </div>
                                        <div style="font-size: 12px; color: #A9BDA3; letter-spacing: 0.12em; text-transform: uppercase; margin-top: 4px;">
                                            Nature Meets Your Space
                                        </div>
                                    </td>
                                </tr>

                                <!-- Body Content -->
                                <tr>
                                    <td style="padding: 36px 32px;">
                                        <div style="font-size: 16px; color: #2D3748; margin-bottom: 16px;">
                                            Hello <strong>%s</strong>, 🌿
                                        </div>

                                        <div style="font-size: 15px; color: #4A5568; line-height: 1.7; margin-bottom: 20px;">
                                            %s
                                        </div>

                                        %s

                                        <!-- Call to Action Button -->
                                        <div style="text-align: center; margin: 32px 0 20px;">
                                            <a href="%s" style="background-color: #173F2B; color: #FFFFFF; padding: 14px 32px; border-radius: 999px; text-decoration: none; font-weight: 600; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(23, 63, 43, 0.2);">
                                                Explore Botanical Collection →
                                            </a>
                                        </div>

                                        <!-- Trust Strip -->
                                        <div style="border-top: 1px solid #E2E8F0; margin-top: 32px; padding-top: 20px; text-align: center; font-size: 12px; color: #718096;">
                                            🚚 Free delivery above ₹799 &bull; 🪴 100%% Transit Safe Packaging &bull; 🌱 Pure Greenery
                                        </div>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="background-color: #FBF9F4; padding: 24px 32px; text-align: center; border-top: 1px solid #E2E8F0; font-size: 12px; color: #718096; line-height: 1.6;">
                                        <p style="margin: 0 0 8px;">
                                            You are receiving this botanical announcement because you opted into Flora Fusion updates.
                                        </p>
                                        <p style="margin: 0 0 12px;">
                                            &copy; %s Flora Fusion. Nature Meets Your Space. All rights reserved.
                                        </p>
                                        <p style="margin: 0;">
                                            Don't want to receive seasonal offers? 
                                            <a href="%s" style="color: #B9825B; text-decoration: underline; font-weight: 600;">
                                                Unsubscribe here
                                            </a>
                                        </p>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        """.formatted(
                campaign.getSubject(),
                name,
                campaign.getPromotionalMessage().replace("\n", "<br/>"),
                couponBox,
                ctaLink,
                java.time.Year.now().getValue(),
                unsubUrl
        );
    }
}
