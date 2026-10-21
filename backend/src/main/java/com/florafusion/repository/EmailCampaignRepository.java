package com.florafusion.repository;

import com.florafusion.entity.EmailCampaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmailCampaignRepository extends JpaRepository<EmailCampaign, UUID> {

    List<EmailCampaign> findAllByOrderByCreatedAtDesc();

    List<EmailCampaign> findByStatus(String status);

    @Query("SELECT c FROM EmailCampaign c LEFT JOIN FETCH c.coupon WHERE c.id = :id")
    Optional<EmailCampaign> findByIdWithDetails(@Param("id") UUID id);
}
