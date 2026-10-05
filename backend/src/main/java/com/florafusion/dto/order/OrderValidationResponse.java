package com.florafusion.dto.order;

import java.math.BigDecimal;
import java.util.List;

public record OrderValidationResponse(
    boolean valid,
    BigDecimal subtotal,
    BigDecimal discount,
    BigDecimal shipping,
    BigDecimal total,
    BigDecimal freeShippingThreshold,
    boolean isFreeDelivery,
    String appliedCoupon,
    List<String> errors
) {}
