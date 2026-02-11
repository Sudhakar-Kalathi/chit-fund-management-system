package com.chitfund.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class ChitGroupDetailedDTO {
    private ChitGroupResponseDTO groupDetails;
    private List<ChitCycleDTO> cycles;
    private List<CustomerResponseDTO> members;
}
