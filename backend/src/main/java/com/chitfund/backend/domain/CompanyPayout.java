package com.chitfund.backend.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "company_payouts")
public class CompanyPayout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chit_group_id", nullable = false)
    private ChitGroup chitGroup;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chit_cycle_id", nullable = false, unique = true)
    private ChitCycle chitCycle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal targetAmount;

    @Column(precision = 15, scale = 2)
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @Column(precision = 15, scale = 2)
    private BigDecimal balanceAmount;

    private LocalDate payoutDate;

    // PENDING, PARTIAL, COMPLETED
    @Column(nullable = false)
    private String status = "PENDING";

    private String remarks;

    private Boolean active = true;
}
