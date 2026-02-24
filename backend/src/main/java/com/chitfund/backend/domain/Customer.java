package com.chitfund.backend.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "customers", uniqueConstraints = {
        @UniqueConstraint(columnNames = "customerCode"),
        @UniqueConstraint(columnNames = "name"),
        @UniqueConstraint(columnNames = "phone")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String customerCode; // Example: CUST-001

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(length = 100)
    private String keyName; // Introducer name (duplicates allowed)

    @Column(nullable = false, unique = true, length = 15)
    private String phone;

    @Column(length = 255)
    private String email; // Optional

    @Column(length = 15)
    private String whatsappNo; // Optional, can be same as phone

    @Column(length = 255)
    private String address;

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
