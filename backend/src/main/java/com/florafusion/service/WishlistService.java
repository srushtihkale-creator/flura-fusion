package com.florafusion.service;

import com.florafusion.dto.catalog.ProductResponse;
import com.florafusion.entity.Product;
import com.florafusion.entity.User;
import com.florafusion.entity.Wishlist;
import com.florafusion.entity.WishlistItem;
import com.florafusion.exception.ResourceNotFoundException;
import com.florafusion.repository.ProductRepository;
import com.florafusion.repository.UserRepository;
import com.florafusion.repository.WishlistItemRepository;
import com.florafusion.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public List<ProductResponse> getWishlist(UUID userId) {
        Wishlist wishlist = getOrCreateWishlist(userId);
        List<ProductResponse> products = new ArrayList<>();
        if (wishlist.getItems() != null) {
            for (WishlistItem item : wishlist.getItems()) {
                products.add(ProductResponse.fromEntity(item.getProduct()));
            }
        }
        return products;
    }

    @Transactional
    public boolean toggleWishlist(UUID userId, String productIdStr) {
        Wishlist wishlist = getOrCreateWishlist(userId);
        Product product = null;
        try {
            UUID prodId = UUID.fromString(productIdStr);
            product = productRepository.findById(prodId).orElse(null);
        } catch (IllegalArgumentException ignored) {
        }
        if (product == null) {
            product = productRepository.findBySlug(productIdStr)
                    .or(() -> productRepository.findBySku(productIdStr))
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productIdStr));
        }

        UUID productId = product.getId();
        if (wishlistItemRepository.existsByWishlistIdAndProductId(wishlist.getId(), productId)) {
            wishlistItemRepository.deleteByWishlistIdAndProductId(wishlist.getId(), productId);
            return false; // Removed
        } else {
            wishlistItemRepository.save(WishlistItem.builder()
                    .wishlist(wishlist)
                    .product(product)
                    .build());
            return true; // Added
        }
    }

    private Wishlist getOrCreateWishlist(UUID userId) {
        return wishlistRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
                    return wishlistRepository.save(Wishlist.builder().user(user).build());
                });
    }
}
