package com.florafusion.controller;

import com.florafusion.dto.campaign.*;
import com.florafusion.service.campaign.CampaignService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/internal/campaigns")
@RequiredArgsConstructor
@Tag(name = "Internal / n8n Automation", description = "Protected Automation Bridge Endpoints for n8n Cloud Workflow")
public class InternalCampaignController {

    private final CampaignService campaignService;

    @Value("${application.n8n.internal-secret:flora-internal-n8n-secret-2026}")
    private String internalSecret;

    private void validateInternalSecret(String headerSecret) {
        if (headerSecret == null || headerSecret.isBlank()) {
            log.warn("[Internal Campaign API] Missing internal automation secret.");
            throw new AccessDeniedException("Invalid or missing internal automation secret.");
        }
        byte[] expected = internalSecret.trim().getBytes(java.nio.charset.StandardCharsets.UTF_8);
        byte[] provided = headerSecret.trim().getBytes(java.nio.charset.StandardCharsets.UTF_8);
        if (!java.security.MessageDigest.isEqual(expected, provided)) {
            log.warn("[Internal Campaign API] Unauthorized internal access attempt rejected.");
            throw new AccessDeniedException("Invalid or missing internal automation secret.");
        }
    }

    @GetMapping("/{id}/recipients")
    @Operation(summary = "Get eligible recipient list for n8n workflow execution")
    public ResponseEntity<List<CampaignRecipientDto>> getCampaignRecipients(
            @PathVariable UUID id,
            @RequestHeader(value = "X-Flora-Internal-Secret", required = false) String secret
    ) {
        validateInternalSecret(secret);
        return ResponseEntity.ok(campaignService.getEligibleRecipientsForN8n(id));
    }

    @GetMapping("/{id}/details")
    @Operation(summary = "Get campaign promotional content, subject, and rendered HTML for n8n email dispatch")
    public ResponseEntity<CampaignPreviewResponse> getCampaignDetails(
            @PathVariable UUID id,
            @RequestHeader(value = "X-Flora-Internal-Secret", required = false) String secret
    ) {
        validateInternalSecret(secret);
        return ResponseEntity.ok(campaignService.getCampaignPreview(id));
    }

    @PostMapping("/{id}/log")
    @Operation(summary = "Record delivery status, messageId, or error for an individual recipient")
    public ResponseEntity<Map<String, String>> logRecipientResult(
            @PathVariable UUID id,
            @RequestHeader(value = "X-Flora-Internal-Secret", required = false) String secret,
            @Valid @RequestBody CampaignLogRequest logRequest
    ) {
        validateInternalSecret(secret);
        campaignService.recordRecipientResult(id, logRequest);
        return ResponseEntity.ok(Map.of("message", "Recipient status logged successfully"));
    }

    @PostMapping("/{id}/complete")
    @Operation(summary = "Finalize campaign status and delivery totals after n8n batch run finishes")
    public ResponseEntity<CampaignResponse> completeCampaign(
            @PathVariable UUID id,
            @RequestHeader(value = "X-Flora-Internal-Secret", required = false) String secret,
            @RequestBody CampaignCompleteRequest completeRequest
    ) {
        validateInternalSecret(secret);
        return ResponseEntity.ok(campaignService.completeCampaign(id, completeRequest));
    }
}
