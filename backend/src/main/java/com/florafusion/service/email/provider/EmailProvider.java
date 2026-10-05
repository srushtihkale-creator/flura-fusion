package com.florafusion.service.email.provider;

import java.util.List;

/**
 * Provider-agnostic abstraction for sending transactional and marketing emails.
 * Allows seamless switching between Resend, SMTP, Gmail SMTP, AWS SES, or Mock providers
 * via configuration without modifying business logic.
 */
public interface EmailProvider {

    EmailSendResult sendEmail(EmailMessage message);

    String getProviderName();

    record EmailAttachment(
        String filename,
        byte[] data,
        String contentType
    ) {}

    record EmailMessage(
        String to,
        String subject,
        String htmlBody,
        String textBody,
        List<EmailAttachment> attachments
    ) {
        public EmailMessage(String to, String subject, String htmlBody) {
            this(to, subject, htmlBody, null, List.of());
        }

        public EmailMessage(String to, String subject, String htmlBody, List<EmailAttachment> attachments) {
            this(to, subject, htmlBody, null, attachments != null ? attachments : List.of());
        }
    }

    record EmailSendResult(
        boolean success,
        String messageId,
        String error
    ) {
        public static EmailSendResult ok(String messageId) {
            return new EmailSendResult(true, messageId, null);
        }

        public static EmailSendResult fail(String error) {
            return new EmailSendResult(false, null, error);
        }
    }
}
