package com.chitfund.backend.repository;

import com.chitfund.backend.domain.DayBookEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface DayBookEntryRepository extends JpaRepository<DayBookEntry, Long> {
    List<DayBookEntry> findByEntryDate(LocalDate entryDate);

    List<DayBookEntry> findByEntryDateBetween(LocalDate startDate, LocalDate endDate);
}
