package com.florafusion.service.email;

import com.florafusion.entity.Order;
import com.florafusion.service.email.provider.EmailProvider.EmailSendResult;

import java.util.concurrent.CompletableFuture;

/**
 * High-level business Email Service interface.
 * Decouples domain services (AuthService, OrderService, etc.) completely from any specific email provider.
 */
public interface EmailService {

    CompletableFuture<EmailSendResult> sendVerificationEmail(String toEmail, String userName, String token);

    CompletableFuture<EmailSendResult> sendWelcomeEmail(String toEmail, String userName);

    CompletableFuture<EmailSendResult> sendOrderConfirmationEmail(Order order, byte[] invoicePdf);

    CompletableFuture<EmailSendResult> sendInvoiceEmail(Order order, byte[] invoicePdf);

    CompletableFuture<EmailSendResult> sendOrderStatusUpdateEmail(Order order, String previousStatus, String newStatus);

    CompletableFuture<EmailSendResult> sendPasswordResetEmail(String toEmail, String userName, String resetToken);
}
