package com.chitfund.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ChitCycleDTO {
    private Long id;
    private Integer monthNumber;
    private LocalDate auctionDate;
    private Long winnerId; // ID of the winner customer
    private String winnerName; // Name of the winner
    private Double chitPayoutAmount;
    private Double auctionAmount;
    private Double commissionAmount;
    private Double dividendAmount;
    private Double finalMonthlyAmount;
    private String status;
}
