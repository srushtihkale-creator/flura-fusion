package com.florafusion.dto.ai;

import com.florafusion.dto.catalog.ProductResponse;

import java.util.List;

public record AiRecommendationResponse(
    String text,
    List<ProductResponse> recommendations,
    String source
) {}
