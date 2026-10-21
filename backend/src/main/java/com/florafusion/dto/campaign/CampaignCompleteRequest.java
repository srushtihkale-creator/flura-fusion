package com.florafusion.dto.campaign;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampaignCompleteRequest {

    private int sentCount;
    private int failedCount;
    private String status; // SENT, PARTIALLY_FAILED, FAILED
}
