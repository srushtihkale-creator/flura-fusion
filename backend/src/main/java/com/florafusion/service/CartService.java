package com.florafusion.service;

import com.florafusion.dto.cart.AddToCartRequest;
import com.florafusion.dto.cart.CartItemResponse;
import com.florafusion.dto.cart.CartResponse;
import com.florafusion.entity.Cart;
import com.florafusion.entity.CartItem;
import com.florafusion.entity.Product;
import com.florafusion.entity.User;
import com.florafusion.exception.OutOfStockException;
import com.florafusion.exception.ResourceNotFoundException;
import com.florafusion.repository.CartItemRepository;
import com.florafusion.repository.CartRepository;
import com.florafusion.repository.ProductRepository;
import com.florafusion.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Value("${application.commerce.free-shipping-threshold:799.00}")
    private BigDecimal freeShippingThreshold;

    @Value("${application.commerce.standard-shipping-fee:79.00}")
    private BigDecimal standardShippingFee;

    @Transactional
    public CartResponse getCart(UUID userId) {
        Cart cart = getOrCreateCart(userId);
        return mapToCartResponse(cart);
    }

    @Transactional
    public CartResponse addToCart(UUID userId, AddToCartRequest request) {
        Product product = null;
        try {
            UUID prodId = UUID.fromString(request.productId());
            product = productRepository.findById(prodId).orElse(null);
        } catch (IllegalArgumentException ignored) {
        }
        if (product == null) {
            product = productRepository.findBySlug(request.productId())
                    .or(() -> productRepository.findBySku(request.productId()))
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.productId()));
        }
        UUID productId = product.getId();
        Cart cart = getOrCreateCart(userId);

        if (!product.isInStock() || product.getStockQuantity() < request.quantity()) {
            throw new OutOfStockException("Product " + product.getName() + " is currently out of stock.");
        }

        final Product finalProduct = product;
        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseGet(() -> CartItem.builder()
                        .cart(cart)
                        .product(finalProduct)
                        .quantity(0)
                        .build());

        int newQuantity = item.getQuantity() + request.quantity();
        if (product.getStockQuantity() < newQuantity) {
            throw new OutOfStockException("Only " + product.getStockQuantity() + " units of " + product.getName() + " are available.");
        }

        item.setQuantity(newQuantity);
        cartItemRepository.save(item);

        return mapToCartResponse(cartRepository.findById(cart.getId()).orElse(cart));
    }

    @Transactional
    public CartResponse updateCartItem(UUID userId, UUID cartItemId, int quantity) {
        Cart cart = getOrCreateCart(userId);

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found: " + cartItemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new ResourceNotFoundException("Cart item not found in user cart.");
        }

        if (quantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            if (item.getProduct().getStockQuantity() < quantity) {
                throw new OutOfStockException("Only " + item.getProduct().getStockQuantity() + " units available.");
            }
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return mapToCartResponse(cartRepository.findById(cart.getId()).orElse(cart));
    }

    @Transactional
    public CartResponse removeCartItem(UUID userId, UUID cartItemId) {
        return updateCartItem(userId, cartItemId, 0);
    }

    @Transactional
    public void clearCart(UUID userId) {
        Cart cart = getOrCreateCart(userId);
        cartItemRepository.deleteByCartId(cart.getId());
    }

    private Cart getOrCreateCart(UUID userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
                    return cartRepository.save(Cart.builder().user(user).build());
                });
    }

    private CartResponse mapToCartResponse(Cart cart) {
        List<CartItemResponse> itemResponses = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        int totalItems = 0;

        if (cart.getItems() != null) {
            for (CartItem item : cart.getItems()) {
                Product p = item.getProduct();
                BigDecimal lineTotal = p.getBasePrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                subtotal = subtotal.add(lineTotal);
                totalItems += item.getQuantity();

                String image = p.getImages() != null && !p.getImages().isEmpty()
                        ? p.getImages().get(0).getMediaUrl()
                        : null;

                itemResponses.add(new CartItemResponse(
                        item.getId(),
                        p.getId().toString(),
                        p.getName(),
                        p.getSlug(),
                        image,
                        p.getCategory() != null ? p.getCategory().getSlug() : null,
                        p.getBasePrice(),
                        item.getQuantity(),
                        lineTotal
                ));
            }
        }

        boolean isFree = subtotal.compareTo(freeShippingThreshold) >= 0;
        BigDecimal shipping = (subtotal.compareTo(BigDecimal.ZERO) == 0 || isFree)
                ? BigDecimal.ZERO
                : standardShippingFee;
        BigDecimal total = subtotal.add(shipping);

        return new CartResponse(
                itemResponses,
                totalItems,
                subtotal,
                shipping,
                freeShippingThreshold,
                isFree,
                total
        );
    }
}
