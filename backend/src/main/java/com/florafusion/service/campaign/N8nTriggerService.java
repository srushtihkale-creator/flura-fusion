package com.florafusion.service.campaign;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.florafusion.entity.EmailCampaign;
import com.florafusion.service.email.template.PromotionalEmailTemplateBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class N8nTriggerService {

    private final ObjectMapper objectMapper;
    private final PromotionalEmailTemplateBuilder templateBuilder;

    @Value("${application.n8n.webhook-url:}")
    private String webhookUrl;

    @Value("${application.n8n.webhook-secret:flora-n8n-secret-token}")
    private String webhookSecret;

    public boolean triggerWorkflow(EmailCampaign campaign) {
        if (webhookUrl == null || webhookUrl.isBlank() || webhookUrl.contains("placeholder") || webhookUrl.startsWith("your_")) {
            log.warn("[n8n Trigger] n8n webhook URL is not configured yet (N8N_WEBHOOK_URL). Campaign #{} set to PROCESSING. Ready for n8n execution.", campaign.getId());
            return true;
        }

        try {
            HttpClient client = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(10))
                    .build();

            String htmlTemplate = templateBuilder.buildPromotionalHtml(campaign, "{{RECIPIENT_NAME}}", "{{UNSUBSCRIBE_URL}}");

            Map<String, Object> payload = new HashMap<>();
            payload.put("campaignId", campaign.getId().toString());
            payload.put("title", campaign.getTitle());
            payload.put("subject", campaign.getSubject());
            payload.put("htmlContent", htmlTemplate);
            payload.put("couponCode", campaign.getCoupon() != null ? campaign.getCoupon().getCode() : null);
            payload.put("discountPercent", campaign.getCoupon() != null ? campaign.getCoupon().getDiscountValue() : null);
            payload.put("testMode", campaign.isTestMode());
            payload.put("testRecipient", campaign.getTestRecipient() != null ? campaign.getTestRecipient() : "");
            payload.put("timestamp", Instant.now().toString());

            String jsonBody = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(webhookUrl.trim()))
                    .header("Content-Type", "application/json")
                    .header("X-Flora-Secret", webhookSecret.trim())
                    .timeout(Duration.ofSeconds(15))
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            log.info("[n8n Trigger] Dispatching campaign trigger for #{} to {}", campaign.getId(), webhookUrl);
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("[n8n Trigger] Successfully triggered n8n workflow for campaign #{}. HTTP {}", campaign.getId(), response.statusCode());
                return true;
            } else {
                log.error("[n8n Trigger] n8n webhook responded with HTTP {}: {}", response.statusCode(), response.body());
                return false;
            }
        } catch (Exception e) {
            log.error("[n8n Trigger] Failed to send trigger to n8n webhook: {}", e.getMessage(), e);
            return false;
        }
    }
}
