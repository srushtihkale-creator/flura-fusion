package com.florafusion.repository;

import com.florafusion.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByUnsubscribeToken(String unsubscribeToken);
    java.util.List<User> findByEmailVerifiedTrueAndMarketingConsentTrueAndUnsubscribedAtIsNull();
    long countByEmailVerifiedTrueAndMarketingConsentTrueAndUnsubscribedAtIsNull();
}
