package com.florafusion.service;

import com.florafusion.dto.cms.CmsBannerResponse;
import com.florafusion.dto.cms.CmsPageResponse;
import com.florafusion.exception.ResourceNotFoundException;
import com.florafusion.repository.CmsBannerRepository;
import com.florafusion.repository.CmsPageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CmsService {

    private final CmsBannerRepository cmsBannerRepository;
    private final CmsPageRepository cmsPageRepository;

    @Transactional(readOnly = true)
    public List<CmsBannerResponse> getActiveBanners() {
        return cmsBannerRepository.findAllByIsActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(CmsBannerResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CmsPageResponse> getPublishedPages() {
        return cmsPageRepository.findAllByIsPublishedTrueOrderByCreatedAtDesc()
                .stream()
                .map(CmsPageResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public CmsPageResponse getPageBySlug(String slug) {
        return cmsPageRepository.findBySlugAndIsPublishedTrue(slug)
                .map(CmsPageResponse::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("CMS Page not found: " + slug));
    }
}
