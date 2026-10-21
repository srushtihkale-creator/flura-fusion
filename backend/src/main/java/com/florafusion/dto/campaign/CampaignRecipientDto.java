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
public class CampaignRecipientDto {

    private UUID recipientId;
    private String email;
    private String name;
    private String unsubscribeToken;
    private String unsubscribeUrl;
}
