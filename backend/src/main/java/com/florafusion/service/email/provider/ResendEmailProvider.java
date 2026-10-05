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
 * Resend implementation of EmailProvider.
 * Communicates directly with the Resend REST API (https://api.resend.com/emails).
 */
@Slf4j
@Component("resendEmailProvider")
public class ResendEmailProvider implements EmailProvider {

    private static final String RESEND_API_URL = "https://api.resend.com/emails";

    @Value("${application.email.resend.api-key:${RESEND_API_KEY:}}")
    private String apiKey;

    @Value("${application.email.from:${EMAIL_FROM:Flora Fusion <onboarding@resend.dev>}}")
    private String defaultFrom;

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public ResendEmailProvider(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    @Override
    public String getProviderName() {
        return "RESEND";
    }

    @Override
    public EmailSendResult sendEmail(EmailMessage message) {
        if (apiKey == null || apiKey.isBlank() || apiKey.startsWith("re_placeholder") || apiKey.equals("your_resend_api_key_here")) {
            log.warn("[ResendEmailProvider] RESEND_API_KEY is not configured or using placeholder. Simulating email dispatch to: {}", message.to());
            return EmailSendResult.ok("resend-simulated-" + UUID.randomUUID());
        }

        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("from", defaultFrom);
            payload.put("to", Collections.singletonList(message.to()));
            payload.put("subject", message.subject());
            payload.put("html", message.htmlBody());

            if (message.textBody() != null && !message.textBody().isBlank()) {
                payload.put("text", message.textBody());
            }

            if (message.attachments() != null && !message.attachments().isEmpty()) {
                List<Map<String, String>> attachmentList = new ArrayList<>();
                for (EmailAttachment att : message.attachments()) {
                    if (att.data() != null && att.data().length > 0) {
                        Map<String, String> attMap = new HashMap<>();
                        attMap.put("filename", att.filename());
                        attMap.put("content", Base64.getEncoder().encodeToString(att.data()));
                        attachmentList.add(attMap);
                    }
                }
                if (!attachmentList.isEmpty()) {
                    payload.put("attachments", attachmentList);
                }
            }

            String jsonBody = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(RESEND_API_URL))
                    .timeout(Duration.ofSeconds(15))
                    .header("Authorization", "Bearer " + apiKey.trim())
                    .header("Content-Type", "application/json")
                    .header("User-Agent", "FloraFusion-Backend/1.0.0")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            log.info("[ResendEmailProvider] Sending email to '{}' with subject '{}' via Resend API", message.to(), message.subject());
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                JsonNode root = objectMapper.readTree(response.body());
                String id = root.has("id") ? root.get("id").asText() : UUID.randomUUID().toString();
                log.info("[ResendEmailProvider] Successfully sent email to '{}', messageId: {}", message.to(), id);
                return EmailSendResult.ok(id);
            } else {
                log.error("[ResendEmailProvider] Resend API error (status {}): {}", response.statusCode(), response.body());
                return EmailSendResult.fail("Resend API HTTP " + response.statusCode() + ": " + response.body());
            }
        } catch (Exception e) {
            log.error("[ResendEmailProvider] Failed to dispatch email via Resend to '{}': {}", message.to(), e.getMessage(), e);
            return EmailSendResult.fail("Resend dispatch exception: " + e.getMessage());
        }
    }
}
