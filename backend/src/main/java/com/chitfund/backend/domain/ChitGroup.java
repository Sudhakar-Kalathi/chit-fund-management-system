package com.chitfund.backend.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "chit_groups")
public class ChitGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String groupName;

    private Double chitAmount;

    private Integer totalMembers;

    private Integer totalMonths;

    private Double monthlyAmount;

    private LocalDate startDate;

    private String status; // ACTIVE, COMPLETED

    private Integer currentMonth; // Default 1

    @PrePersist
    protected void onCreate() {
        if (currentMonth == null)
            currentMonth = 1;
        if (status == null)
            status = "ACTIVE";
    }
}
