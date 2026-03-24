package com.chitfund.backend.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "chit_cycles")
public class ChitCycle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chit_group_id", nullable = false)
    private ChitGroup chitGroup;

    private Integer monthNumber;

    private LocalDate auctionDate;

    // "Amount taken by (Customer)"
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "winner_id")
    private Customer winner;

    @Column(precision = 15, scale = 2)
    private BigDecimal chitPayoutAmount; // Actual amount given to winner
    @Column(precision = 15, scale = 2)
    private BigDecimal auctionAmount; // The bid amount (deduction)
    @Column(precision = 15, scale = 2)
    private BigDecimal commissionAmount; // Company commission
    @Column(precision = 15, scale = 2)
    private BigDecimal dividendAmount; // Distributed to members
    @Column(precision = 15, scale = 2)
    private BigDecimal finalMonthlyAmount; // Amount each member has to pay this month

    private String status; // PENDING, COMPLETED
}
