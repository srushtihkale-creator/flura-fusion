package com.florafusion.service.email.provider;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Mock implementation of EmailProvider for testing and offline local development.
 * Captures all dispatched emails in memory without requiring external API credentials.
 */
@Slf4j
@Component("mockEmailProvider")
public class MockEmailProvider implements EmailProvider {

    private final List<EmailMessage> sentMessages = new CopyOnWriteArrayList<>();

    @Override
    public String getProviderName() {
        return "MOCK";
    }

    @Override
    public EmailSendResult sendEmail(EmailMessage message) {
        String messageId = "mock-" + UUID.randomUUID();
        sentMessages.add(message);
        
        int attachmentCount = message.attachments() != null ? message.attachments().size() : 0;
        log.info("[MockEmailProvider] 🌿 Captured Mock Email [id: {}] -> To: '{}', Subject: '{}', Body Length: {} chars, Attachments: {}",
                messageId, message.to(), message.subject(), message.htmlBody() != null ? message.htmlBody().length() : 0, attachmentCount);

        return EmailSendResult.ok(messageId);
    }

    public List<EmailMessage> getSentMessages() {
        return List.copyOf(sentMessages);
    }

    public void clearSentMessages() {
        sentMessages.clear();
    }
}
