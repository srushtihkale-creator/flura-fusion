package com.florafusion.service;

import com.florafusion.dto.catalog.ProductResponse;
import com.florafusion.entity.Product;
import com.florafusion.exception.ResourceNotFoundException;
import com.florafusion.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public Page<ProductResponse> getProducts(String categorySlug, String sortKey, int page, int size) {
        Sort sort = resolveSort(sortKey);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Product> productPage;
        if (categorySlug != null && !categorySlug.isBlank()) {
            productPage = productRepository.findByCategorySlugAndStatus(categorySlug.toLowerCase().trim(), "ACTIVE", pageable);
        } else {
            productPage = productRepository.findByStatus("ACTIVE", pageable);
        }

        return productPage.map(ProductResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
        return ProductResponse.fromEntity(product);
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> searchProducts(String query, int page, int size) {
        if (query == null || query.isBlank()) {
            return getProducts(null, "featured", page, size);
        }
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "rating"));
        return productRepository.searchProducts(query.trim(), pageable).map(ProductResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getRelatedProducts(String slug, int limit) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));

        Pageable pageable = PageRequest.of(0, limit);
        return productRepository.findRelatedProducts(product.getCategory().getId(), product.getId(), pageable)
                .stream()
                .map(ProductResponse::fromEntity)
                .toList();
    }

    private Sort resolveSort(String sortKey) {
        if (sortKey == null) return Sort.by(Sort.Direction.DESC, "rating");
        return switch (sortKey.toLowerCase()) {
            case "price-low" -> Sort.by(Sort.Direction.ASC, "basePrice");
            case "price-high" -> Sort.by(Sort.Direction.DESC, "basePrice");
            case "rating" -> Sort.by(Sort.Direction.DESC, "rating");
            case "name" -> Sort.by(Sort.Direction.ASC, "name");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }
}
