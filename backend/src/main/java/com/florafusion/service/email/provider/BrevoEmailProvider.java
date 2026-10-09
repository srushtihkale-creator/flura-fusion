package com.florafusion.service.email.provider;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;

/**
 * Brevo (formerly Sendinblue) REST API v3 implementation of EmailProvider.
 * Communicates directly with https://api.brevo.com/v3/smtp/email using native Java 11+ HttpClient.
 * Supports HTML body, text fallback, and Base64 PDF attachments.
 */
@Slf4j
@Component("brevoEmailProvider")
public class BrevoEmailProvider implements EmailProvider {

    private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

    @Value("${application.email.brevo.api-key:${BREVO_API_KEY:}}")
    private String apiKey;

    @Value("${application.email.brevo.sender-email:${BREVO_SENDER_EMAIL:}}")
    private String senderEmail;

    @Value("${application.email.brevo.sender-name:${BREVO_SENDER_NAME:Flora Fusion}}")
    private String senderName;

    @Value("${application.email.from:${EMAIL_FROM:}}")
    private String defaultFrom;

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public BrevoEmailProvider(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    @Override
    public String getProviderName() {
        return "BREVO";
    }

    @Override
    public EmailSendResult sendEmail(EmailMessage message) {
        if (apiKey == null || apiKey.isBlank() || apiKey.startsWith("your_") || apiKey.contains("placeholder")) {
            log.error("[BrevoEmailProvider] BREVO_API_KEY is not configured or using placeholder. Cannot send email to: {}", message.to());
            return EmailSendResult.fail("Brevo API key is not configured. Please set BREVO_API_KEY in the environment.");
        }

        try {
            // Resolve effective sender name and email
            String effectiveSenderEmail = resolveSenderEmail();
            String effectiveSenderName = resolveSenderName();

            if (effectiveSenderEmail == null || effectiveSenderEmail.isBlank()) {
                log.error("[BrevoEmailProvider] Sender email is not configured. Set BREVO_SENDER_EMAIL or EMAIL_FROM.");
                return EmailSendResult.fail("Brevo sender email is not configured. Please set BREVO_SENDER_EMAIL in the environment.");
            }

            Map<String, Object> payload = new HashMap<>();

            // Sender
            payload.put("sender", Map.of(
                    "name", effectiveSenderName,
                    "email", effectiveSenderEmail
            ));

            // Recipient (to)
            payload.put("to", List.of(Map.of(
                    "email", message.to().trim()
            )));

            // Subject & Body
            payload.put("subject", message.subject());
            payload.put("htmlContent", message.htmlBody());

            if (message.textBody() != null && !message.textBody().isBlank()) {
                payload.put("textContent", message.textBody());
            }

            // Attachments (e.g. PDF invoices)
            if (message.attachments() != null && !message.attachments().isEmpty()) {
                List<Map<String, String>> attachmentList = new ArrayList<>();
                for (EmailAttachment att : message.attachments()) {
                    if (att.data() != null && att.data().length > 0) {
                        Map<String, String> attMap = new HashMap<>();
                        attMap.put("name", att.filename());
                        attMap.put("content", Base64.getEncoder().encodeToString(att.data()));
                        attachmentList.add(attMap);
                    }
                }
                if (!attachmentList.isEmpty()) {
                    payload.put("attachment", attachmentList);
                }
            }

            String jsonBody = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(BREVO_API_URL))
                    .timeout(Duration.ofSeconds(15))
                    .header("api-key", apiKey.trim())
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .header("User-Agent", "FloraFusion-Backend/1.0.0")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            log.info("[BrevoEmailProvider] Dispatching email to '{}' with subject '{}' via Brevo REST API", message.to(), message.subject());
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                JsonNode root = objectMapper.readTree(response.body());
                String messageId = root.has("messageId") ? root.get("messageId").asText() : UUID.randomUUID().toString();
                log.info("[BrevoEmailProvider] Successfully sent email to '{}', Brevo messageId: {}", message.to(), messageId);
                return EmailSendResult.ok(messageId);
            } else {
                log.error("[BrevoEmailProvider] Brevo API error (status {}): {}", response.statusCode(), response.body());
                String errorDetail = extractErrorMessage(response.body(), response.statusCode());
                return EmailSendResult.fail("Brevo API error (" + response.statusCode() + "): " + errorDetail);
            }

        } catch (Exception e) {
            log.error("[BrevoEmailProvider] Failed to dispatch email via Brevo to '{}': {}", message.to(), e.getMessage(), e);
            return EmailSendResult.fail("Brevo dispatch exception: " + e.getMessage());
        }
    }

    private String resolveSenderEmail() {
        if (senderEmail != null && !senderEmail.isBlank()) {
            return senderEmail.trim();
        }
        if (defaultFrom != null && !defaultFrom.isBlank()) {
            if (defaultFrom.contains("<") && defaultFrom.contains(">")) {
                int start = defaultFrom.indexOf('<');
                int end = defaultFrom.indexOf('>');
                return defaultFrom.substring(start + 1, end).trim();
            }
            return defaultFrom.trim();
        }
        return "noreply@florafusion.com";
    }

    private String resolveSenderName() {
        if (senderName != null && !senderName.isBlank()) {
            return senderName.trim();
        }
        if (defaultFrom != null && defaultFrom.contains("<") && defaultFrom.contains(">")) {
            int start = defaultFrom.indexOf('<');
            return defaultFrom.substring(0, start).trim();
        }
        return "Flora Fusion";
    }

    private String extractErrorMessage(String responseBody, int statusCode) {
        if (responseBody == null || responseBody.isBlank()) {
            return "HTTP " + statusCode;
        }
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            if (root.has("message")) {
                return root.get("message").asText();
            }
        } catch (Exception ignored) {}
        return responseBody;
    }
}
