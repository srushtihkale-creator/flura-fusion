package com.florafusion.dto.order;

import jakarta.validation.constraints.NotBlank;

public record ShippingAddressDto(
    @NotBlank(message = "Recipient name is required")
    String name,

    @NotBlank(message = "Phone number is required")
    String phone,

    @NotBlank(message = "Delivery address is required")
    String address,

    @NotBlank(message = "City is required")
    String city,

    String state,

    @NotBlank(message = "Pincode is required")
    String pincode
) {}
