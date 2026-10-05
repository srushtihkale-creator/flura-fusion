package com.florafusion.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.florafusion.entity.Order;
import com.florafusion.entity.OrderItem;
import com.florafusion.entity.User;
import com.florafusion.service.email.EmailService;
import com.florafusion.service.email.EmailServiceImpl;
import com.florafusion.service.email.provider.EmailProvider;
import com.florafusion.service.email.provider.EmailProvider.EmailMessage;
import com.florafusion.service.email.provider.EmailProvider.EmailSendResult;
import com.florafusion.service.email.provider.MockEmailProvider;
import com.florafusion.service.email.provider.ResendEmailProvider;
import com.florafusion.service.email.template.EmailTemplateService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    private MockEmailProvider mockEmailProvider;
    private EmailTemplateService templateService;
    private EmailServiceImpl emailService;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        mockEmailProvider = new MockEmailProvider();
        templateService = new EmailTemplateService(objectMapper);
        emailService = new EmailServiceImpl(mockEmailProvider, templateService);
        ReflectionTestUtils.setField(emailService, "frontendUrl", "http://localhost:3000");
    }

    @Test
    @DisplayName("1. Verification Email should format correctly and be dispatched via provider")
    void testSendVerificationEmail() throws Exception {
        CompletableFuture<EmailSendResult> future = emailService.sendVerificationEmail(
                "srushti@florafusion.com",
                "Srushti Kale",
                "test-verify-token-12345"
        );

        EmailSendResult result = future.get();
        assertTrue(result.success());
        assertEquals(1, mockEmailProvider.getSentMessages().size());

        EmailMessage message = mockEmailProvider.getSentMessages().get(0);
        assertEquals("srushti@florafusion.com", message.to());
        assertTrue(message.subject().contains("Verify your email"));
        assertTrue(message.htmlBody().contains("Srushti Kale"));
        assertTrue(message.htmlBody().contains("test-verify-token-12345"));
        assertTrue(message.htmlBody().contains("http://localhost:3000/verify-email?token=test-verify-token-12345"));
    }

    @Test
    @DisplayName("2. Welcome Email should include brand welcoming and WELCOME50 coupon")
    void testSendWelcomeEmail() throws Exception {
        CompletableFuture<EmailSendResult> future = emailService.sendWelcomeEmail(
                "aarav@example.com",
                "Aarav Sharma"
        );

        EmailSendResult result = future.get();
        assertTrue(result.success());
        assertEquals(1, mockEmailProvider.getSentMessages().size());

        EmailMessage message = mockEmailProvider.getSentMessages().get(0);
        assertEquals("aarav@example.com", message.to());
        assertTrue(message.subject().contains("Welcome to Flora Fusion"));
        assertTrue(message.htmlBody().contains("Aarav Sharma"));
        assertTrue(message.htmlBody().contains("WELCOME50"));
        assertTrue(message.htmlBody().contains("http://localhost:3000/plants"));
    }

    @Test
    @DisplayName("3. Order Confirmation Email should include line items, totals, and attached PDF invoice")
    void testSendOrderConfirmationEmail() throws Exception {
        User user = User.builder()
                .id(UUID.randomUUID())
                .name("Rupali Deshmukh")
                .email("rupali@example.com")
                .build();

        Order order = Order.builder()
                .id(UUID.randomUUID())
                .orderNumber("FF-789123")
                .user(user)
                .subtotal(new BigDecimal("999.00"))
                .discountAmount(new BigDecimal("100.00"))
                .shippingAmount(BigDecimal.ZERO)
                .totalAmount(new BigDecimal("899.00"))
                .paymentMethod("UPI")
                .paymentStatus("COMPLETED")
                .orderStatus("Placed")
                .createdAt(Instant.now())
                .shippingAddressSnapshot("{\"name\":\"Rupali Deshmukh\",\"phone\":\"9876543210\",\"address\":\"Flat 402, Green Valley\",\"city\":\"Pune\",\"state\":\"Maharashtra\",\"pincode\":\"411038\"}")
                .build();

        OrderItem item = OrderItem.builder()
                .productNameSnapshot("Monstera Deliciosa")
                .skuSnapshot("PLANT-MONSTERA-001")
                .quantity(1)
                .unitPrice(new BigDecimal("999.00"))
                .lineTotal(new BigDecimal("999.00"))
                .build();
        order.setItems(List.of(item));

        byte[] fakePdfBytes = "%PDF-1.4 Mock Invoice Data".getBytes();

        CompletableFuture<EmailSendResult> future = emailService.sendOrderConfirmationEmail(order, fakePdfBytes);
        EmailSendResult result = future.get();

        assertTrue(result.success());
        assertEquals(1, mockEmailProvider.getSentMessages().size());

        EmailMessage message = mockEmailProvider.getSentMessages().get(0);
        assertEquals("rupali@example.com", message.to());
        assertTrue(message.subject().contains("Order Confirmed: FF-789123"));
        assertTrue(message.htmlBody().contains("Monstera Deliciosa"));
        assertTrue(message.htmlBody().contains("FF-789123"));
        assertEquals(1, message.attachments().size());
        assertEquals("Flora_Fusion_Invoice_FF-789123.pdf", message.attachments().get(0).filename());
    }

    @Test
    @DisplayName("4. Invoice Email should format standalone invoice summary and attach PDF")
    void testSendInvoiceEmail() throws Exception {
        Order order = Order.builder()
                .id(UUID.randomUUID())
                .orderNumber("FF-456789")
                .guestEmail("guest@florafusion.com")
                .subtotal(new BigDecimal("499.00"))
                .discountAmount(BigDecimal.ZERO)
                .shippingAmount(new BigDecimal("79.00"))
                .totalAmount(new BigDecimal("578.00"))
                .paymentStatus("COMPLETED")
                .orderStatus("Confirmed")
                .build();

        byte[] fakePdfBytes = "%PDF-1.4 Mock Invoice".getBytes();

        CompletableFuture<EmailSendResult> future = emailService.sendInvoiceEmail(order, fakePdfBytes);
        EmailSendResult result = future.get();

        assertTrue(result.success());
        assertEquals(1, mockEmailProvider.getSentMessages().size());

        EmailMessage message = mockEmailProvider.getSentMessages().get(0);
        assertEquals("guest@florafusion.com", message.to());
        assertTrue(message.subject().contains("Tax Invoice for Order FF-456789"));
        assertEquals(1, message.attachments().size());
    }

    @Test
    @DisplayName("5. Order Status Update Email should deliver delivery progress updates")
    void testSendOrderStatusUpdateEmail() throws Exception {
        Order order = Order.builder()
                .id(UUID.randomUUID())
                .orderNumber("FF-112233")
                .guestEmail("customer@garden.in")
                .totalAmount(new BigDecimal("1299.00"))
                .build();

        CompletableFuture<EmailSendResult> future = emailService.sendOrderStatusUpdateEmail(
                order,
                "Packed",
                "Dispatched"
        );

        EmailSendResult result = future.get();
        assertTrue(result.success());
        assertEquals(1, mockEmailProvider.getSentMessages().size());

        EmailMessage message = mockEmailProvider.getSentMessages().get(0);
        assertEquals("customer@garden.in", message.to());
        assertTrue(message.subject().contains("Order FF-112233 Status: Dispatched"));
        assertTrue(message.htmlBody().contains("Dispatched"));
        assertTrue(message.htmlBody().contains("logistics partner"));
    }

    @Test
    @DisplayName("6. Password Reset Email should include secure reset link and security advisory")
    void testSendPasswordResetEmail() throws Exception {
        CompletableFuture<EmailSendResult> future = emailService.sendPasswordResetEmail(
                "srushti@florafusion.com",
                "Srushti",
                "secret-reset-token-xyz"
        );

        EmailSendResult result = future.get();
        assertTrue(result.success());
        assertEquals(1, mockEmailProvider.getSentMessages().size());

        EmailMessage message = mockEmailProvider.getSentMessages().get(0);
        assertEquals("srushti@florafusion.com", message.to());
        assertTrue(message.subject().contains("Reset your password"));
        assertTrue(message.htmlBody().contains("secret-reset-token-xyz"));
        assertTrue(message.htmlBody().contains("http://localhost:3000/reset-password?token=secret-reset-token-xyz"));
        assertTrue(message.htmlBody().contains("valid for 1 hour"));
    }

    @Test
    @DisplayName("7. Provider Swappability: ResendEmailProvider fallback test")
    void testResendEmailProviderFallback() {
        ResendEmailProvider resendProvider = new ResendEmailProvider(objectMapper);
        ReflectionTestUtils.setField(resendProvider, "apiKey", "re_placeholder_test_key");
        ReflectionTestUtils.setField(resendProvider, "defaultFrom", "Flora Fusion <onboarding@resend.dev>");

        assertEquals("RESEND", resendProvider.getProviderName());

        EmailMessage msg = new EmailMessage("test@example.com", "Test Subject", "<p>Hello</p>");
        EmailSendResult result = resendProvider.sendEmail(msg);

        assertTrue(result.success());
        assertTrue(result.messageId().startsWith("resend-simulated-"));
    }
}
