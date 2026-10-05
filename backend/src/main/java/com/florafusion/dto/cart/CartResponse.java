package com.florafusion.dto.cart;

import java.math.BigDecimal;
import java.util.List;

public record CartResponse(
    List<CartItemResponse> items,
    int totalItems,
    BigDecimal subtotal,
    BigDecimal shipping,
    BigDecimal freeShippingThreshold,
    boolean isFreeShipping,
    BigDecimal total
) {}
