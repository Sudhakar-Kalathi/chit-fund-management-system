package com.chitfund.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class CustomerDetailedDTO {
    private CustomerResponseDTO customerDetails;
    private List<ChitGroupResponseDTO> groups;
    private List<PaymentDTO> payments;
}
