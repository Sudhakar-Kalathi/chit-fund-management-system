package com.chitfund.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ChitGroupRequestDTO {

    @NotBlank(message = "Group name is required")
    private String groupName;

    @NotNull(message = "Chit amount is required")
    @DecimalMin(value = "1.00", message = "Chit amount must be greater than 0")
    private BigDecimal chitAmount;

    @NotNull(message = "Total months is required")
    @Min(value = 1, message = "Total months must be at least 1")
    private Integer totalMonths;

    private LocalDate startDate;
}
