package com.chitfund.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ChitGroupResponseDTO {
    private Long id;
    private String groupName;
    private Double chitAmount;
    private Integer totalMembers;
    private Integer totalMonths;
    private Double monthlyAmount;
    private LocalDate startDate;
    private String status;
    private Integer currentMonth;
}
