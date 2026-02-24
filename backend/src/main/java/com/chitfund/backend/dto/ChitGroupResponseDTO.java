package com.chitfund.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ChitGroupResponseDTO {
    private Long id;
    private String groupName;
    private BigDecimal chitAmount;
    private Integer totalMembers;
    private Integer totalMonths;
    private BigDecimal monthlyAmount;
    private LocalDate startDate;
    private String status;
    private boolean active;
    private LocalDateTime createdAt;
}
