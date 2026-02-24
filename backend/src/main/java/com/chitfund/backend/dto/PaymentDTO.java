package com.chitfund.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class PaymentDTO {
    private Long id;

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotNull(message = "Amount is required")
    private BigDecimal amountGave;

    private BigDecimal balance;

    private LocalTime paymentTime;

    @NotNull(message = "Payment date is required")
    private LocalDate paymentDate;

    private String remarks;

    private String createdAt;
    private String updatedAt;
}
