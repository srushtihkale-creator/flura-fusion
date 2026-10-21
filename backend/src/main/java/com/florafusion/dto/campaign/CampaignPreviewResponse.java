package com.florafusion.dto.campaign;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampaignPreviewResponse {

    private UUID campaignId;
    private String title;
    private String subject;
    private String renderedHtml;
    private int eligibleRecipientCount;
    private String sampleRecipientEmail;
    private String couponCode;
    private String discountSummary;
    private String targetCategory;
    private String status;
}
