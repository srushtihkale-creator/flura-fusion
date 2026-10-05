package com.florafusion.controller;

import com.florafusion.dto.catalog.ProductResponse;
import com.florafusion.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Catalog Retrieval, Multi-Angle Gallery, and Search")
public class ProductController {

    private final ProductService productService;

    @GetMapping("/products")
    @Operation(summary = "List catalog products with category, sort, and pagination")
    public ResponseEntity<Page<ProductResponse>> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false, defaultValue = "featured") String sort,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "50") int size
    ) {
        return ResponseEntity.ok(productService.getProducts(category, sort, page, size));
    }

    @GetMapping("/products/{slug}")
    @Operation(summary = "Get detailed product specifications and multi-angle studio images by slug")
    public ResponseEntity<ProductResponse> getProductBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(productService.getProductBySlug(slug));
    }

    @GetMapping("/products/{slug}/related")
    @Operation(summary = "Get frequently paired or related products in the same category")
    public ResponseEntity<List<ProductResponse>> getRelatedProducts(
            @PathVariable String slug,
            @RequestParam(required = false, defaultValue = "4") int limit
    ) {
        return ResponseEntity.ok(productService.getRelatedProducts(slug, limit));
    }

    @GetMapping("/search")
    @Operation(summary = "Full-text search across catalog names, taglines, and descriptions")
    public ResponseEntity<Page<ProductResponse>> searchProducts(
            @RequestParam(required = false, defaultValue = "") String q,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "50") int size
    ) {
        return ResponseEntity.ok(productService.searchProducts(q, page, size));
    }
}
