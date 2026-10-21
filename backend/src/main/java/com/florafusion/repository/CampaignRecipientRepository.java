package com.florafusion.repository;

import com.florafusion.entity.CampaignRecipient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CampaignRecipientRepository extends JpaRepository<CampaignRecipient, UUID> {

    List<CampaignRecipient> findByCampaignId(UUID campaignId);

    List<CampaignRecipient> findByCampaignIdAndStatus(UUID campaignId, String status);

    Optional<CampaignRecipient> findByCampaignIdAndEmail(UUID campaignId, String email);

    long countByCampaignIdAndStatus(UUID campaignId, String status);

    boolean existsByCampaignIdAndEmail(UUID campaignId, String email);
}
