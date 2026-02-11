package com.chitfund.backend.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "chit_cycles")
public class ChitCycle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "chit_group_id", nullable = false)
    private ChitGroup chitGroup;

    private Integer monthNumber;

    private LocalDate auctionDate;

    // "Amount taken by (Customer)"
    @ManyToOne
    @JoinColumn(name = "winner_id")
    private Customer winner;

    private Double chitPayoutAmount; // Actual amount given to winner
    private Double auctionAmount; // The bid amount (deduction)
    private Double commissionAmount; // Company commission
    private Double dividendAmount; // Distributed to members
    private Double finalMonthlyAmount; // Amount each member has to pay this month

    private String status; // PENDING, COMPLETED
}
