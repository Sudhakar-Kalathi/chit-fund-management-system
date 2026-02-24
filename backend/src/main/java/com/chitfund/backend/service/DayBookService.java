package com.chitfund.backend.service;

import com.chitfund.backend.domain.DayBookEntry;
import com.chitfund.backend.dto.DayBookEntryDTO;
import com.chitfund.backend.mapper.FinanceMapper;
import com.chitfund.backend.repository.DayBookEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
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

    @Transactional
    public DayBookEntryDTO updateEntry(Long id, DayBookEntryDTO dto) {
        DayBookEntry entry = dayBookEntryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entry not found"));
        entry.setEntryDate(dto.getEntryDate());
        entry.setDescription(dto.getDescription());
        entry.setAmount(dto.getAmount());
        entry.setType(dto.getType());
        entry.setRemarks(dto.getRemarks());
        entry.setEnteredBy(dto.getEnteredBy());
        return financeMapper.toDayBookEntryDTO(dayBookEntryRepository.save(entry));
    }

    public Map<String, Object> getDailyDayBook(LocalDate date) {
        List<DayBookEntry> entries = dayBookEntryRepository.findByEntryDate(date);

        BigDecimal totalCredit = entries.stream()
                .filter(e -> e.getType() == DayBookEntry.EntryType.CREDIT)
                .map(DayBookEntry::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalDebit = entries.stream()
                .filter(e -> e.getType() == DayBookEntry.EntryType.DEBIT)
                .map(DayBookEntry::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal netBalance = totalCredit.subtract(totalDebit);
        String status = netBalance.compareTo(BigDecimal.ZERO) >= 0 ? "GAIN" : "LOSS";

        List<DayBookEntryDTO> credits = entries.stream()
                .filter(e -> e.getType() == DayBookEntry.EntryType.CREDIT)
                .map(financeMapper::toDayBookEntryDTO).collect(Collectors.toList());

        List<DayBookEntryDTO> debits = entries.stream()
                .filter(e -> e.getType() == DayBookEntry.EntryType.DEBIT)
                .map(financeMapper::toDayBookEntryDTO).collect(Collectors.toList());

        List<DayBookEntryDTO> suspense = entries.stream()
                .filter(e -> e.getType() == DayBookEntry.EntryType.SUSPENSE)
                .map(financeMapper::toDayBookEntryDTO).collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("credits", credits);
        response.put("debits", debits);
        response.put("suspense", suspense);
        response.put("totalCredit", totalCredit);
        response.put("totalDebit", totalDebit);
        response.put("netBalance", netBalance);
        response.put("status", status);

        return response;
    }
}
