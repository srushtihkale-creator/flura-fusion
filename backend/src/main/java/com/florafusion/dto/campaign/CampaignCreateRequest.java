package com.florafusion.dto.campaign;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampaignCreateRequest {

    @NotBlank(message = "Campaign title is required")
    @Size(max = 150, message = "Campaign title must be under 150 characters")
    private String title;

    @NotBlank(message = "Email subject is required")
    @Size(max = 200, message = "Subject must be under 200 characters")
    private String subject;

    @NotBlank(message = "Promotional message content is required")
    private String promotionalMessage;

    private String couponCode;

    @Builder.Default
    private String targetCategory = "all";

    private String targetProductIds;

    private Instant startDate;

    private Instant endDate;

    @Builder.Default
    private boolean testMode = false;

    private String testRecipient;
}
