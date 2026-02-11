package com.chitfund.backend.dto;

import com.chitfund.backend.domain.DayBookEntry;
import lombok.Data;
import java.time.LocalDate;

@Data
public class DayBookEntryDTO {
    private Long id;
    private LocalDate entryDate;
    private String description;
    private Double amount;
    private DayBookEntry.EntryType type;
    private String category;
}
