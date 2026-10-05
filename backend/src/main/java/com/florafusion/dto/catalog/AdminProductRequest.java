package com.florafusion.dto.catalog;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record AdminProductRequest(
    @NotBlank(message = "Product name is required")
    String name,

    String slug,

    @NotBlank(message = "Category slug is required (e.g. plants, pots, seeds)")
    String categorySlug,

    String subCategory,
    String tagline,

    @NotBlank(message = "Product description is required")
    String description,

    @NotBlank(message = "Product SKU is required")
    String sku,

    @NotNull(message = "Base selling price is required")
    @DecimalMin(value = "0.0", message = "Base price cannot be negative")
    BigDecimal price,

    BigDecimal originalPrice,
    String badge,

    @Min(value = 0, message = "Stock quantity cannot be negative")
    Integer stockQuantity,

    Boolean inStock,
    String status,

    String primaryImage,
    List<String> images,
    List<String> images360,

    Map<String, Object> metadata,
    Map<String, Object> careGuide
) {}
