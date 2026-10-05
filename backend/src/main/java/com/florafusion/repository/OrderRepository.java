package com.florafusion.repository;

import com.florafusion.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    Optional<Order> findByOrderNumber(String orderNumber);
    Optional<Order> findByIdempotencyKey(String idempotencyKey);
    Page<Order> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);
    Page<Order> findByGuestEmailOrderByCreatedAtDesc(String guestEmail, Pageable pageable);
    List<Order> findByGuestEmailIgnoreCaseAndUserIsNull(String guestEmail);
    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
