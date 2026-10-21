package com.florafusion.dto.campaign;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampaignLogRequest {

    @NotBlank(message = "Recipient email is required")
    private String email;

    @NotBlank(message = "Delivery status is required")
    private String status; // SENT, FAILED, SUPPRESSED

    private String messageId;

    private String errorMessage;
}
