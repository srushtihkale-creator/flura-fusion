package com.florafusion.service.email;

import com.florafusion.entity.Order;
import com.florafusion.service.email.provider.EmailProvider;
import com.florafusion.service.email.provider.EmailProvider.EmailAttachment;
import com.florafusion.service.email.provider.EmailProvider.EmailMessage;
import com.florafusion.service.email.provider.EmailProvider.EmailSendResult;
import com.florafusion.service.email.template.EmailTemplateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * High-level Email Service Implementation.
 * Orchestrates template generation and delegates dispatch asynchronously to the active EmailProvider.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final EmailProvider emailProvider;
    private final EmailTemplateService templateService;

    @Value("${application.frontend.url:${FRONTEND_URL:http://localhost:3000}}")
    private String frontendUrl;

    @Override
    @Async
    public CompletableFuture<EmailSendResult> sendVerificationEmail(String toEmail, String userName, String token) {
        if (toEmail == null || toEmail.isBlank()) {
            return CompletableFuture.completedFuture(EmailSendResult.fail("Recipient email is empty"));
        }
        try {
            String verificationUrl = frontendUrl.replaceAll("/+$", "") + "/verify-email?token=" + token;
            String subject = "Verify your email — Flora Fusion 🌿";
            String html = templateService.buildVerificationEmail(userName, verificationUrl, token);

            EmailMessage message = new EmailMessage(toEmail.trim().toLowerCase(), subject, html);
            EmailSendResult result = emailProvider.sendEmail(message);
            return CompletableFuture.completedFuture(result);
        } catch (Exception e) {
            log.error("[EmailService] Failed to send verification email to {}: {}", toEmail, e.getMessage(), e);
            return CompletableFuture.completedFuture(EmailSendResult.fail(e.getMessage()));
        }
    }

    @Override
    @Async
    public CompletableFuture<EmailSendResult> sendWelcomeEmail(String toEmail, String userName) {
        if (toEmail == null || toEmail.isBlank()) {
            return CompletableFuture.completedFuture(EmailSendResult.fail("Recipient email is empty"));
        }
        try {
            String exploreCatalogUrl = frontendUrl.replaceAll("/+$", "") + "/plants";
            String subject = "Welcome to Flora Fusion! 🍃";
            String html = templateService.buildWelcomeEmail(userName, exploreCatalogUrl);

            EmailMessage message = new EmailMessage(toEmail.trim().toLowerCase(), subject, html);
            EmailSendResult result = emailProvider.sendEmail(message);
            return CompletableFuture.completedFuture(result);
        } catch (Exception e) {
            log.error("[EmailService] Failed to send welcome email to {}: {}", toEmail, e.getMessage(), e);
            return CompletableFuture.completedFuture(EmailSendResult.fail(e.getMessage()));
        }
    }

    @Override
    @Async
    public CompletableFuture<EmailSendResult> sendOrderConfirmationEmail(Order order, byte[] invoicePdf) {
        String recipientEmail = resolveOrderRecipientEmail(order);
        if (recipientEmail == null || recipientEmail.isBlank()) {
            log.warn("[EmailService] Cannot send order confirmation: Order {} has no recipient email", order.getOrderNumber());
            return CompletableFuture.completedFuture(EmailSendResult.fail("No recipient email found on order"));
        }

        try {
            String trackingUrl = frontendUrl.replaceAll("/+$", "") + "/account/orders/" + order.getOrderNumber();
            String subject = "Order Confirmed: " + order.getOrderNumber() + " 🌿 Flora Fusion";
            String html = templateService.buildOrderConfirmationEmail(order, trackingUrl);

            List<EmailAttachment> attachments = new ArrayList<>();
            if (invoicePdf != null && invoicePdf.length > 0) {
                attachments.add(new EmailAttachment(
                        "Flora_Fusion_Invoice_" + order.getOrderNumber() + ".pdf",
                        invoicePdf,
                        "application/pdf"
                ));
            }

            EmailMessage message = new EmailMessage(recipientEmail, subject, html, attachments);
            EmailSendResult result = emailProvider.sendEmail(message);
            return CompletableFuture.completedFuture(result);
        } catch (Exception e) {
            log.error("[EmailService] Failed to send order confirmation for {}: {}", order.getOrderNumber(), e.getMessage(), e);
            return CompletableFuture.completedFuture(EmailSendResult.fail(e.getMessage()));
        }
    }

    @Override
    @Async
    public CompletableFuture<EmailSendResult> sendInvoiceEmail(Order order, byte[] invoicePdf) {
        String recipientEmail = resolveOrderRecipientEmail(order);
        if (recipientEmail == null || recipientEmail.isBlank()) {
            return CompletableFuture.completedFuture(EmailSendResult.fail("No recipient email found on order"));
        }

        try {
            String trackingUrl = frontendUrl.replaceAll("/+$", "") + "/account/orders/" + order.getOrderNumber();
            String subject = "Tax Invoice for Order " + order.getOrderNumber() + " — Flora Fusion";
            String html = templateService.buildInvoiceEmail(order, trackingUrl);

            List<EmailAttachment> attachments = new ArrayList<>();
            if (invoicePdf != null && invoicePdf.length > 0) {
                attachments.add(new EmailAttachment(
                        "Flora_Fusion_Invoice_" + order.getOrderNumber() + ".pdf",
                        invoicePdf,
                        "application/pdf"
                ));
            }

            EmailMessage message = new EmailMessage(recipientEmail, subject, html, attachments);
            EmailSendResult result = emailProvider.sendEmail(message);
            return CompletableFuture.completedFuture(result);
        } catch (Exception e) {
            log.error("[EmailService] Failed to send invoice email for {}: {}", order.getOrderNumber(), e.getMessage(), e);
            return CompletableFuture.completedFuture(EmailSendResult.fail(e.getMessage()));
        }
    }

    @Override
    @Async
    public CompletableFuture<EmailSendResult> sendOrderStatusUpdateEmail(Order order, String previousStatus, String newStatus) {
        String recipientEmail = resolveOrderRecipientEmail(order);
        if (recipientEmail == null || recipientEmail.isBlank()) {
            log.warn("[EmailService] Cannot send status update: Order {} has no recipient email", order.getOrderNumber());
            return CompletableFuture.completedFuture(EmailSendResult.fail("No recipient email found on order"));
        }

        try {
            String trackingUrl = frontendUrl.replaceAll("/+$", "") + "/account/orders/" + order.getOrderNumber();
            String subject = "Order " + order.getOrderNumber() + " Status: " + newStatus + " 📦";
            String html = templateService.buildOrderStatusUpdateEmail(order, previousStatus, newStatus, trackingUrl);

            EmailMessage message = new EmailMessage(recipientEmail, subject, html);
            EmailSendResult result = emailProvider.sendEmail(message);
            return CompletableFuture.completedFuture(result);
        } catch (Exception e) {
            log.error("[EmailService] Failed to send status update email for {}: {}", order.getOrderNumber(), e.getMessage(), e);
            return CompletableFuture.completedFuture(EmailSendResult.fail(e.getMessage()));
        }
    }

    @Override
    @Async
    public CompletableFuture<EmailSendResult> sendPasswordResetEmail(String toEmail, String userName, String resetToken) {
        if (toEmail == null || toEmail.isBlank()) {
            return CompletableFuture.completedFuture(EmailSendResult.fail("Recipient email is empty"));
        }
        try {
            String resetUrl = frontendUrl.replaceAll("/+$", "") + "/reset-password?token=" + resetToken;
            String subject = "Reset your password — Flora Fusion 🔐";
            String html = templateService.buildPasswordResetEmail(userName, resetUrl, resetToken);

            EmailMessage message = new EmailMessage(toEmail.trim().toLowerCase(), subject, html);
            EmailSendResult result = emailProvider.sendEmail(message);
            return CompletableFuture.completedFuture(result);
        } catch (Exception e) {
            log.error("[EmailService] Failed to send password reset email to {}: {}", toEmail, e.getMessage(), e);
            return CompletableFuture.completedFuture(EmailSendResult.fail(e.getMessage()));
        }
    }

    private String resolveOrderRecipientEmail(Order order) {
        if (order.getUser() != null && order.getUser().getEmail() != null && !order.getUser().getEmail().isBlank()) {
            return order.getUser().getEmail().trim().toLowerCase();
        }
        if (order.getGuestEmail() != null && !order.getGuestEmail().isBlank()) {
            return order.getGuestEmail().trim().toLowerCase();
        }
        return null;
    }
}
