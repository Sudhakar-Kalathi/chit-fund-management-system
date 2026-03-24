package com.chitfund.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ChitCycleDTO {
    private Long id;
    private Integer monthNumber;
    private LocalDate auctionDate;
    private Long winnerId; // ID of the winner customer
    private String winnerName; // Name of the winner
    private BigDecimal chitPayoutAmount;
    private BigDecimal auctionAmount;
    private BigDecimal commissionAmount;
    private BigDecimal dividendAmount;
    private BigDecimal finalMonthlyAmount;
    private String status;
}
