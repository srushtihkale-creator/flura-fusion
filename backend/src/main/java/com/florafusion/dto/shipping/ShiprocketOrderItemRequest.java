package com.florafusion.dto.shipping;

import java.math.BigDecimal;

public record ShiprocketOrderItemRequest(
        String name,
        String sku,
        int units,
        BigDecimal selling_price,
        BigDecimal discount,
        BigDecimal tax,
        String hsn
) {}
