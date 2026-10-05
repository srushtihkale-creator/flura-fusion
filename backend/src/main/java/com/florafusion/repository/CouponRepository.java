package com.florafusion.repository;

import com.florafusion.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, UUID> {
    Optional<Coupon> findByCodeIgnoreCaseAndIsActiveTrue(String code);
    Optional<Coupon> findByCodeIgnoreCase(String code);
    List<Coupon> findAllByIsActiveTrueOrderByDisplayOrderAsc();
    List<Coupon> findAllByOrderByDisplayOrderAscCreatedAtDesc();
}

