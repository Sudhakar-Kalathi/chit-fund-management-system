package com.chitfund.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CustomerResponseDTO {
    private Long id;
    private String customerCode;
    private String name;
    private String phone;
    private String address;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
