package com.florafusion.controller;

import com.florafusion.dto.cms.CmsBannerResponse;
import com.florafusion.dto.cms.CmsPageResponse;
import com.florafusion.service.CmsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "CMS & Content", description = "Dynamic Promotional Banners and Plant Care Knowledge Hub")
public class CmsController {

    private final CmsService cmsService;

    @GetMapping("/cms/banners")
    @Operation(summary = "Get active homepage and promotional banners")
    public ResponseEntity<List<CmsBannerResponse>> getActiveBanners() {
        return ResponseEntity.ok(cmsService.getActiveBanners());
    }

    @GetMapping("/cms/pages")
    @Operation(summary = "Get published editorial CMS pages")
    public ResponseEntity<List<CmsPageResponse>> getPages() {
        return ResponseEntity.ok(cmsService.getPublishedPages());
    }

    @GetMapping({"/cms/pages/{slug}", "/plant-care/{slug}"})
    @Operation(summary = "Get plant care or editorial article by slug")
    public ResponseEntity<CmsPageResponse> getPageBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(cmsService.getPageBySlug(slug));
    }
}
