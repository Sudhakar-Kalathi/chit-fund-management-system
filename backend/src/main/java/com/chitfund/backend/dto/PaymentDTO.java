package com.chitfund.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PaymentDTO {
    private Long id;
    private Long customerId;
    private String customerName;
    private Long chitGroupId;
    private String chitGroupName;
    private Integer cycleNumber;
    private Double amountPaid;
    private LocalDate paymentDate;
    private String paymentMode;
    private String remarks;
}
