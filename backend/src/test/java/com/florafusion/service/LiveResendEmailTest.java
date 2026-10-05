package com.florafusion.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.florafusion.entity.Order;
import com.florafusion.entity.OrderItem;
import com.florafusion.entity.User;
import com.florafusion.service.email.EmailServiceImpl;
import com.florafusion.service.email.provider.EmailProvider.EmailSendResult;
import com.florafusion.service.email.provider.ResendEmailProvider;
import com.florafusion.service.email.template.EmailTemplateService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.File;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class LiveResendEmailTest {

    private static String loadEnvVariable(String key) {
        File envFile = new File(".env");
        if (!envFile.exists()) {
            envFile = new File("backend/.env");
        }
        if (envFile.exists()) {
            try {
                for (String line : Files.readAllLines(envFile.toPath())) {
                    String trimmed = line.trim();
                    if (trimmed.startsWith(key + "=")) {
                        return trimmed.substring((key + "=").length()).trim();
                    }
                }
            } catch (Exception ignored) {}
        }
        return System.getenv(key);
    }

    @Test
    @DisplayName("Send live Welcome Email to Srushti via Resend API")
    void sendLiveWelcomeEmail() throws Exception {
        String apiKey = loadEnvVariable("RESEND_API_KEY");
        org.junit.jupiter.api.Assumptions.assumeTrue(
                apiKey != null && !apiKey.isBlank() && !apiKey.contains("your_"),
                "Skipping live Resend test: RESEND_API_KEY not configured"
        );
        String fromEmail = loadEnvVariable("EMAIL_FROM");
        if (fromEmail == null || fromEmail.isBlank()) {
            fromEmail = "Flora Fusion <onboarding@resend.dev>";
        }

        System.out.println("🌱 Testing live Resend email dispatch with API key: " + (apiKey != null ? apiKey.substring(0, Math.min(7, apiKey.length())) + "..." : "null"));

        ObjectMapper objectMapper = new ObjectMapper();
        ResendEmailProvider resendProvider = new ResendEmailProvider(objectMapper);
        ReflectionTestUtils.setField(resendProvider, "apiKey", apiKey);
        ReflectionTestUtils.setField(resendProvider, "defaultFrom", fromEmail);

        EmailTemplateService templateService = new EmailTemplateService(objectMapper);
        EmailServiceImpl emailService = new EmailServiceImpl(resendProvider, templateService);
        ReflectionTestUtils.setField(emailService, "frontendUrl", "http://localhost:3000");

        String recipient = "srushti.h.kale2004@gmail.com";

        // 1. Send Welcome Email
        CompletableFuture<EmailSendResult> welcomeFuture = emailService.sendWelcomeEmail(
                recipient,
                "Srushti Kale"
        );

        EmailSendResult welcomeResult = welcomeFuture.get();
        System.out.println("✅ Welcome Email Dispatch Result -> Success: " + welcomeResult.success() + ", MessageId: " + welcomeResult.messageId() + ", Error: " + welcomeResult.error());
        assertTrue(welcomeResult.success(), "Welcome email should succeed: " + welcomeResult.error());

        // 2. Send Order Confirmation Email with PDF Tax Invoice
        InvoiceService invoiceService = new InvoiceService(objectMapper);

        User user = User.builder()
                .id(UUID.randomUUID())
                .name("Srushti Kale")
                .email(recipient)
                .build();

        Order order = Order.builder()
                .id(UUID.randomUUID())
                .orderNumber("FF-884920")
                .user(user)
                .subtotal(new BigDecimal("999.00"))
                .discountAmount(new BigDecimal("100.00"))
                .shippingAmount(BigDecimal.ZERO)
                .totalAmount(new BigDecimal("899.00"))
                .paymentMethod("UPI")
                .paymentStatus("COMPLETED")
                .orderStatus("Confirmed")
                .createdAt(Instant.now())
                .shippingAddressSnapshot("{\"name\":\"Srushti Kale\",\"phone\":\"+91 9890414379\",\"address\":\"Flora Fusion Studio, Lane 5\",\"city\":\"Pune\",\"state\":\"Maharashtra\",\"pincode\":\"411038\"}")
                .build();

        OrderItem item = OrderItem.builder()
                .productNameSnapshot("Monstera Deliciosa (4-Angle Studio Edition)")
                .skuSnapshot("PLANT-MONSTERA-001")
                .quantity(1)
                .unitPrice(new BigDecimal("999.00"))
                .lineTotal(new BigDecimal("999.00"))
                .build();
        order.setItems(List.of(item));

        byte[] invoicePdf = invoiceService.generateInvoicePdf(order);
        System.out.println("📄 Generated sample PDF Tax Invoice bytes: " + invoicePdf.length + " bytes");

        CompletableFuture<EmailSendResult> orderFuture = emailService.sendOrderConfirmationEmail(order, invoicePdf);
        EmailSendResult orderResult = orderFuture.get();

        System.out.println("✅ Order Confirmation Dispatch Result -> Success: " + orderResult.success() + ", MessageId: " + orderResult.messageId() + ", Error: " + orderResult.error());
        assertTrue(orderResult.success(), "Order confirmation email should succeed: " + orderResult.error());
    }
}
