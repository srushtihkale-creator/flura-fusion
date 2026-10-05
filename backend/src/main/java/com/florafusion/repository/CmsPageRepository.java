package com.florafusion.repository;

import com.florafusion.entity.CmsPage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CmsPageRepository extends JpaRepository<CmsPage, UUID> {
    Optional<CmsPage> findBySlugAndIsPublishedTrue(String slug);
    List<CmsPage> findAllByIsPublishedTrueOrderByCreatedAtDesc();
}
