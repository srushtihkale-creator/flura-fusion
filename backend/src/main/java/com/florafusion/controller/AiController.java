package com.florafusion.controller;

import com.florafusion.dto.ai.AiRecommendationRequest;
import com.florafusion.dto.ai.AiRecommendationResponse;
import com.florafusion.service.GeminiRecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@Tag(name = "Flora AI Recommendations", description = "Google Gemini Powered Botanical Guidance & Recommendations")
public class AiController {

    private final GeminiRecommendationService geminiRecommendationService;

    @PostMapping("/recommend")
    @Operation(summary = "Generate botanical guidance and matched plant recommendations via Gemini API")
    public ResponseEntity<AiRecommendationResponse> getRecommendation(@Valid @RequestBody AiRecommendationRequest request) {
        AiRecommendationResponse response = geminiRecommendationService.getRecommendation(request.message());
        return ResponseEntity.ok(response);
    }
}
