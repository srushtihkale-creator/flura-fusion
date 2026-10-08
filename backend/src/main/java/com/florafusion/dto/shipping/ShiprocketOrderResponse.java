package com.florafusion.dto.shipping;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ShiprocketOrderResponse(
        Long order_id,
        Long shipment_id,
        String status,
        Integer status_code,
        String onboarding_completed_now,
        String awb_code,
        String courier_name
) {}
