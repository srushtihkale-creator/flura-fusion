package com.florafusion.dto.cart;

import jakarta.validation.constraints.Min;

public record UpdateCartItemRequest(
    @Min(value = 0, message = "Quantity must be at least 0 (0 removes item)")
    int quantity
) {}
