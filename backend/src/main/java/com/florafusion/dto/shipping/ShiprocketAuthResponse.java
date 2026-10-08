package com.florafusion.dto.shipping;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ShiprocketAuthResponse(
        String token,
        Long id,
        String first_name,
        String last_name,
        String email
) {}
