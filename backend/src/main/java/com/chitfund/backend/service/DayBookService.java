package com.chitfund.backend.service;

import com.chitfund.backend.domain.DayBookEntry;
import com.chitfund.backend.dto.DayBookEntryDTO;
import com.chitfund.backend.exception.ResourceNotFoundException;
import com.chitfund.backend.mapper.FinanceMapper;
import com.chitfund.backend.repository.DayBookEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DayBookService {

    private final DayBookEntryRepository dayBookEntryRepository;
    private final FinanceMapper financeMapper;

    @Transactional
    public DayBookEntryDTO createEntry(DayBookEntryDTO dto) {
        DayBookEntry entry = financeMapper.toDayBookEntry(dto);
        DayBookEntry saved = dayBookEntryRepository.save(entry);
        return financeMapper.toDayBookEntryDTO(saved);
    }

    public Map<String, Object> getDailyDayBook(LocalDate date) {
        List<DayBookEntry> entries = dayBookEntryRepository.findByEntryDate(date);

        double totalCredit = entries.stream()
                .filter(e -> e.getType() == DayBookEntry.EntryType.CREDIT)
                .mapToDouble(DayBookEntry::getAmount)
                .sum();

        double totalDebit = entries.stream()
                .filter(e -> e.getType() == DayBookEntry.EntryType.DEBIT)
                .mapToDouble(DayBookEntry::getAmount)
                .sum();

        Map<String, Object> response = new HashMap<>();
        response.put("entries", entries.stream().map(financeMapper::toDayBookEntryDTO).collect(Collectors.toList()));
        response.put("totalCredit", totalCredit);
        response.put("totalDebit", totalDebit);
        response.put("balance", totalCredit - totalDebit);

        return response;
    }
}
