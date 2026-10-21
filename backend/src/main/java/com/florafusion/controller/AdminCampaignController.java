package com.florafusion.controller;

import com.florafusion.dto.campaign.*;
import com.florafusion.service.campaign.CampaignService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/campaigns")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Admin / Promotional Campaigns", description = "Administrative Promotional Email Automation Management APIs")
public class AdminCampaignController {

    private final CampaignService campaignService;

    @GetMapping
    @Operation(summary = "Get all promotional email campaigns sorted by newest first")
    public ResponseEntity<List<CampaignResponse>> getAllCampaigns() {
        return ResponseEntity.ok(campaignService.getAllCampaigns());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single promotional campaign by ID")
    public ResponseEntity<CampaignResponse> getCampaignById(@PathVariable UUID id) {
        return ResponseEntity.ok(campaignService.getCampaignById(id));
    }

    @GetMapping("/{id}/preview")
    @Operation(summary = "Get live rendered HTML email preview and recipient count")
    public ResponseEntity<CampaignPreviewResponse> getCampaignPreview(@PathVariable UUID id) {
        return ResponseEntity.ok(campaignService.getCampaignPreview(id));
    }

    @GetMapping("/subscribers/count")
    @Operation(summary = "Get count of registered customers who have opted into promotional emails")
    public ResponseEntity<Map<String, Object>> getEligibleSubscriberCount() {
        long count = campaignService.countEligibleSubscribers();
        return ResponseEntity.ok(Map.of("eligibleSubscribers", count));
    }

    @PostMapping
    @Operation(summary = "Create a new promotional email campaign (saved as DRAFT)")
    public ResponseEntity<CampaignResponse> createCampaign(@Valid @RequestBody CampaignCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(campaignService.createCampaign(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing promotional email campaign")
    public ResponseEntity<CampaignResponse> updateCampaign(
            @PathVariable UUID id,
            @Valid @RequestBody CampaignCreateRequest request
    ) {
        return ResponseEntity.ok(campaignService.updateCampaign(id, request));
    }

    @PatchMapping("/{id}/approve")
    @Operation(summary = "Approve a promotional email campaign for sending")
    public ResponseEntity<CampaignResponse> approveCampaign(@PathVariable UUID id) {
        return ResponseEntity.ok(campaignService.approveCampaign(id));
    }

    @PostMapping("/{id}/trigger")
    @Operation(summary = "Explicitly trigger campaign dispatch through n8n Cloud and Gmail SMTP")
    public ResponseEntity<CampaignResponse> triggerCampaign(
            @PathVariable UUID id,
            @RequestParam(required = false, defaultValue = "false") boolean testMode,
            @RequestParam(required = false) String testRecipient
    ) {
        return ResponseEntity.ok(campaignService.triggerCampaign(id, testMode, testRecipient));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel a promotional campaign")
    public ResponseEntity<CampaignResponse> cancelCampaign(@PathVariable UUID id) {
        return ResponseEntity.ok(campaignService.cancelCampaign(id));
    }
}
