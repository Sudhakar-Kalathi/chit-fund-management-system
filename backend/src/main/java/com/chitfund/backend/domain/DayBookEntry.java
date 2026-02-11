package com.chitfund.backend.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "day_book_entries")
public class DayBookEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate entryDate;

    private String description;

    private Double amount;

    @Enumerated(EnumType.STRING)
    private EntryType type; // CREDIT, DEBIT

    private String category; // SUSPENSE, EXPENSE, INCOME, etc.

    public enum EntryType {
        CREDIT,
        DEBIT
    }
}
