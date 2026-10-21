package com.florafusion.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.florafusion.entity.Coupon;
import com.florafusion.entity.EmailCampaign;
import com.florafusion.service.campaign.N8nTriggerService;
import com.florafusion.service.email.template.PromotionalEmailTemplateBuilder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class N8nTriggerServiceTest {

    @Mock
    private PromotionalEmailTemplateBuilder templateBuilder;

    private ObjectMapper objectMapper;
    private N8nTriggerService triggerService;
    private EmailCampaign testCampaign;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        triggerService = new N8nTriggerService(objectMapper, templateBuilder);

        Coupon coupon = Coupon.builder()
                .id(UUID.randomUUID())
                .code("FLORA10")
                .discountValue(BigDecimal.valueOf(10))
                .discountType("PERCENTAGE")
                .build();

        testCampaign = EmailCampaign.builder()
                .id(UUID.randomUUID())
                .title("Monsoon Plant Sale")
                .subject("Special Offers Inside 🌿")
                .coupon(coupon)
                .targetCategory("plants")
                .testMode(true)
                .testRecipient("srushti.h.kale2004@gmail.com")
                .status("PROCESSING")
                .build();
    }

    @Test
    @DisplayName("Should skip network call and return true when webhook URL is blank or placeholder")
    void triggerWorkflow_UnconfiguredWebhook_ReturnsTrue() {
        ReflectionTestUtils.setField(triggerService, "webhookUrl", "");

        boolean result = triggerService.triggerWorkflow(testCampaign);

        assertTrue(result, "Should return true gracefully when webhook URL is unconfigured");
    }

    @Test
    @DisplayName("Should invoke templateBuilder to supply htmlContent with personalization tokens")
    void triggerWorkflow_InvokesTemplateBuilder() {
        // Mock template builder output
        when(templateBuilder.buildPromotionalHtml(eq(testCampaign), eq("{{RECIPIENT_NAME}}"), eq("{{UNSUBSCRIBE_URL}}")))
                .thenReturn("<html><body>Hello {{RECIPIENT_NAME}}, <a href=\"{{UNSUBSCRIBE_URL}}\">Unsub</a></body></html>");

        // Set unreachable mock port so it catches network failure but executes template generation
        ReflectionTestUtils.setField(triggerService, "webhookUrl", "http://127.0.0.1:59999/webhook");
        ReflectionTestUtils.setField(triggerService, "webhookSecret", "test-secret-token");

        triggerService.triggerWorkflow(testCampaign);

        // Verify templateBuilder was called with exact placeholder tokens expected by n8n Node 4
        verify(templateBuilder).buildPromotionalHtml(eq(testCampaign), eq("{{RECIPIENT_NAME}}"), eq("{{UNSUBSCRIBE_URL}}"));
    }
}
