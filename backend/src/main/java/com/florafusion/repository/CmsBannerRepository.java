package com.florafusion.repository;

import com.florafusion.entity.CmsBanner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CmsBannerRepository extends JpaRepository<CmsBanner, UUID> {
    List<CmsBanner> findAllByIsActiveTrueOrderByDisplayOrderAsc();
    Optional<CmsBanner> findBySlotKey(String slotKey);
}
