package com.chitfund.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "chit_groups", uniqueConstraints = {
        @UniqueConstraint(columnNames = "groupName")
})
public class ChitGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String groupName;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal chitAmount;

    @Column(nullable = false)
    private Integer totalMembers;

    @Column(nullable = false)
    private Integer totalMonths; // Must equal totalMembers per business rule

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal monthlyAmount;

    private LocalDate startDate;

    @Column(nullable = false)
    private String status; // ACTIVE, COMPLETED

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (status == null)
            status = "ACTIVE";
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
