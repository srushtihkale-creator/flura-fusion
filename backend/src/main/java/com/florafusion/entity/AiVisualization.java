package com.florafusion.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "ai_visualizations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiVisualization {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "guest_identifier", length = 100)
    private String guestIdentifier;

    @Column(name = "input_image_url", nullable = false, length = 500)
    private String inputImageUrl;

    @Column(name = "prompt_text", nullable = false, columnDefinition = "TEXT")
    private String promptText;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "selected_product_ids", nullable = false, columnDefinition = "jsonb")
    @Builder.Default
    private String selectedProductIds = "[]";

    @Column(name = "output_image_url", length = 500)
    private String outputImageUrl;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "COMPLETED"; // PENDING, PROCESSING, COMPLETED, FAILED

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
