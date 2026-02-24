package com.chitfund.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CompanyPayoutDTO {
    private Long id;
    private Long chitGroupId;
    private String groupName;
    private Long chitCycleId;
    private Integer monthNumber;
    private Long customerId;
    private String customerName;
    private BigDecimal targetAmount;
    private BigDecimal paidAmount;
    private BigDecimal balanceAmount;
    private LocalDate payoutDate;
    private String status;
    private String remarks;
}
