package com.florafusion.dto.coupon;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.Instant;

public record AdminOfferRequest(
    @NotBlank(message = "Coupon / offer code is required")
    String code,

    String title,

    String bannerText,

    @NotBlank(message = "Discount type is required (PERCENTAGE, FIXED_AMOUNT, BUNDLE, FREE_SHIPPING)")
    String discountType,

    @NotNull(message = "Discount value is required")
    BigDecimal discountValue,

    BigDecimal minCartValue,

    BigDecimal maxDiscount,

    Integer bundleQty,

    BigDecimal bundlePrice,

    String applicableCategory,

    String applicableProductIds,

    String targetLink,

    Instant startDate,

    Instant endDate,

    Integer usageLimit,

    Boolean isActive,

    Boolean autoApply,

    Integer displayOrder
) {}
