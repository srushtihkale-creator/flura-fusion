package com.florafusion.repository;

import com.florafusion.entity.SecurityToken;
import com.florafusion.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SecurityTokenRepository extends JpaRepository<SecurityToken, UUID> {

    Optional<SecurityToken> findTopByUserAndTokenTypeOrderByCreatedAtDesc(User user, String tokenType);

    Optional<SecurityToken> findTopByTokenTypeAndTokenHashAndUsedAtIsNull(String tokenType, String tokenHash);

    Optional<SecurityToken> findTopByUserAndTokenTypeAndTokenHashAndUsedAtIsNull(User user, String tokenType, String tokenHash);

    void deleteAllByUserAndTokenType(User user, String tokenType);
}
