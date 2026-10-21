package com.florafusion.service.campaign;

import com.florafusion.dto.campaign.*;

import java.util.List;
import java.util.UUID;

public interface CampaignService {

    List<CampaignResponse> getAllCampaigns();

    CampaignResponse getCampaignById(UUID id);

    CampaignResponse createCampaign(CampaignCreateRequest request);

    CampaignResponse updateCampaign(UUID id, CampaignCreateRequest request);

    CampaignResponse approveCampaign(UUID id);

    CampaignResponse triggerCampaign(UUID id, boolean testMode, String testRecipient);

    CampaignResponse cancelCampaign(UUID id);

    CampaignPreviewResponse getCampaignPreview(UUID id);

    List<CampaignRecipientDto> getEligibleRecipientsForN8n(UUID campaignId);

    void recordRecipientResult(UUID campaignId, CampaignLogRequest logRequest);

    CampaignResponse completeCampaign(UUID campaignId, CampaignCompleteRequest completeRequest);

    boolean unsubscribeUser(String token);

    long countEligibleSubscribers();
}
