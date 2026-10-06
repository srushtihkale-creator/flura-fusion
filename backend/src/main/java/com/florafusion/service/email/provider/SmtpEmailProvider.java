package com.florafusion.service.email.provider;

import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import java.util.Properties;
import java.util.UUID;

/**
 * Standard SMTP implementation of EmailProvider.
 * Connects to standard SMTP mail servers (Gmail, custom domain, AWS SES SMTP, Brevo, SendGrid, etc.)
 * using JavaMailSender with full HTML and Base64 attachment support.
 */
@Slf4j
@Component("smtpEmailProvider")
public class SmtpEmailProvider implements EmailProvider {

    @Value("${application.email.smtp.host:${SMTP_HOST:}}")
    private String host;

    @Value("${application.email.smtp.port:${SMTP_PORT:587}}")
    private int port;

    @Value("${application.email.smtp.username:${SMTP_USERNAME:}}")
    private String username;

    @Value("${application.email.smtp.password:${SMTP_PASSWORD:}}")
    private String password;

    @Value("${application.email.smtp.auth:${SMTP_AUTH:true}}")
    private boolean auth;

    @Value("${application.email.smtp.starttls:${SMTP_STARTTLS:true}}")
    private boolean starttls;

    @Value("${application.email.from:${EMAIL_FROM:Flora Fusion <noreply@florafusion.com>}}")
    private String defaultFrom;

    @Override
    public String getProviderName() {
        return "SMTP";
    }

    @Override
    public EmailSendResult sendEmail(EmailMessage message) {
        if (host == null || host.isBlank() || username == null || username.isBlank()
                || password == null || password.isBlank() || username.contains("your_") || password.contains("your_")) {
            log.warn("[SmtpEmailProvider] SMTP credentials not configured or placeholder. Simulating email dispatch to: {}", message.to());
            return EmailSendResult.ok("smtp-simulated-" + UUID.randomUUID());
        }

        try {
            JavaMailSenderImpl mailSender = createMailSender();
            MimeMessage mimeMessage = mailSender.createMimeMessage();

            boolean hasAttachments = message.attachments() != null && !message.attachments().isEmpty();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, hasAttachments, "UTF-8");

            // Parse From header
            if (defaultFrom != null && defaultFrom.contains("<") && defaultFrom.contains(">")) {
                int start = defaultFrom.indexOf('<');
                int end = defaultFrom.indexOf('>');
                String personal = defaultFrom.substring(0, start).trim();
                String address = defaultFrom.substring(start + 1, end).trim();
                helper.setFrom(new InternetAddress(address, personal, "UTF-8"));
            } else {
                helper.setFrom(defaultFrom != null && !defaultFrom.isBlank() ? defaultFrom.trim() : username.trim());
            }

            helper.setTo(message.to().trim());
            helper.setSubject(message.subject());

            if (message.htmlBody() != null && !message.htmlBody().isBlank()) {
                if (message.textBody() != null && !message.textBody().isBlank()) {
                    helper.setText(message.textBody(), message.htmlBody());
                } else {
                    helper.setText(message.htmlBody(), true);
                }
            } else if (message.textBody() != null) {
                helper.setText(message.textBody(), false);
            }

            // Attachments
            if (hasAttachments) {
                for (EmailAttachment attachment : message.attachments()) {
                    if (attachment.data() != null && attachment.data().length > 0) {
                        String contentType = attachment.contentType() != null ? attachment.contentType() : "application/octet-stream";
                        helper.addAttachment(
                                attachment.filename(),
                                new ByteArrayResource(attachment.data()),
                                contentType
                        );
                    }
                }
            }

            log.info("[SmtpEmailProvider] Dispatching email to '{}' with subject '{}' via SMTP host '{}:{}'",
                    message.to(), message.subject(), host, port);

            mailSender.send(mimeMessage);

            String messageId = UUID.randomUUID().toString();
            log.info("[SmtpEmailProvider] Successfully dispatched email to '{}', generated messageId: {}", message.to(), messageId);
            return EmailSendResult.ok(messageId);

        } catch (Exception e) {
            log.error("[SmtpEmailProvider] Failed to dispatch email via SMTP to '{}': {}", message.to(), e.getMessage(), e);
            return EmailSendResult.fail("SMTP dispatch exception: " + e.getMessage());
        }
    }

    private JavaMailSenderImpl createMailSender() {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost(host.trim());
        sender.setPort(port > 0 ? port : 587);
        sender.setUsername(username.trim());

        String cleanPassword = password != null ? password.trim() : "";
        if (cleanPassword.contains(" ") && (host != null && host.toLowerCase().contains("gmail") || cleanPassword.length() == 19)) {
            // Google displays App Passwords as 'xxxx yyyy zzzz aaaa' - strip inner spaces for SMTP authentication
            cleanPassword = cleanPassword.replace(" ", "");
        }
        sender.setPassword(cleanPassword);
        sender.setDefaultEncoding("UTF-8");

        Properties props = sender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", String.valueOf(auth));
        props.put("mail.smtp.starttls.enable", String.valueOf(starttls));
        props.put("mail.smtp.starttls.required", String.valueOf(starttls));
        props.put("mail.smtp.connectiontimeout", "10000");
        props.put("mail.smtp.timeout", "10000");
        props.put("mail.smtp.writetimeout", "10000");

        return sender;
    }
}
