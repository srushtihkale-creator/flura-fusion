package com.florafusion.dto.cart;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record CartItemResponse(
    UUID id,
    String productId,
    String name,
    String slug,
    String image,
    String category,
    BigDecimal price,
    int quantity,
    BigDecimal lineTotal
) {}
