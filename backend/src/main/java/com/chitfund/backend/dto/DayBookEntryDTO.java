package com.chitfund.backend.dto;

import com.chitfund.backend.domain.DayBookEntry;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class DayBookEntryDTO {
    private Long id;

    @NotNull(message = "Entry date is required")
    private LocalDate entryDate;

    private String description;

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    @NotNull(message = "Type is required (CREDIT, DEBIT, or SUSPENSE)")
    private DayBookEntry.EntryType type;

    private String remarks;

    private String enteredBy;

    private String createdAt;
    private String updatedAt;
}
