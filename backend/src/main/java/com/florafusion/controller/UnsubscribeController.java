package com.florafusion.controller;

import com.florafusion.service.campaign.CampaignService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/unsubscribe")
@RequiredArgsConstructor
@Tag(name = "Customer / Unsubscribe", description = "Public Secure Unsubscribe Endpoints for Email Recipients")
public class UnsubscribeController {

    private final CampaignService campaignService;

    @GetMapping
    @Operation(summary = "Unsubscribe customer from promotional emails using secure unguessable token")
    public ResponseEntity<Map<String, Object>> unsubscribeGet(@RequestParam String token) {
        boolean success = campaignService.unsubscribeUser(token);
        if (success) {
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "You have been successfully unsubscribed from Flora Fusion promotional emails."
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Invalid or expired unsubscribe token."
            ));
        }
    }

    @PostMapping
    @Operation(summary = "Unsubscribe customer via POST request")
    public ResponseEntity<Map<String, Object>> unsubscribePost(@RequestBody Map<String, String> body) {
        String token = body != null ? body.get("token") : null;
        boolean success = campaignService.unsubscribeUser(token);
        if (success) {
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "You have been successfully unsubscribed from Flora Fusion promotional emails."
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Invalid or expired unsubscribe token."
            ));
        }
    }
}
