package com.florafusion.repository;

import com.florafusion.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    Optional<Product> findBySlug(String slug);

    Optional<Product> findBySku(String sku);

    boolean existsBySlugAndIdNot(String slug, UUID id);

    boolean existsBySkuAndIdNot(String sku, UUID id);

    boolean existsBySlug(String slug);

    boolean existsBySku(String sku);

    @Query("SELECT p FROM Product p WHERE LOWER(p.category.slug) = LOWER(:categorySlug) AND p.category.isActive = TRUE AND p.status = :status")
    Page<Product> findByCategorySlugAndStatus(@Param("categorySlug") String categorySlug, @Param("status") String status, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.category.isActive = TRUE AND p.status = :status")
    Page<Product> findByStatus(@Param("status") String status, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.category.isActive = TRUE AND p.status = 'ACTIVE' AND (" +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.tagline) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.subCategory) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Product> searchProducts(@Param("query") String query, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId AND p.category.isActive = TRUE AND p.id != :excludeId AND p.status = 'ACTIVE'")
    List<Product> findRelatedProducts(@Param("categoryId") UUID categoryId, @Param("excludeId") UUID excludeId, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE " +
           "(:categorySlug IS NULL OR :categorySlug = '' OR :categorySlug = 'all' OR LOWER(p.category.slug) = LOWER(:categorySlug)) AND " +
           "(:status IS NULL OR :status = '' OR :status = 'all' OR p.status = :status) AND " +
           "(:query IS NULL OR :query = '' OR (" +
           "  LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "  LOWER(p.sku) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "  LOWER(p.tagline) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "  LOWER(p.subCategory) LIKE LOWER(CONCAT('%', :query, '%'))" +
           "))")
    Page<Product> findForAdmin(
            @Param("categorySlug") String categorySlug,
            @Param("status") String status,
            @Param("query") String query,
            Pageable pageable
    );
}
