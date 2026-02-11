package com.chitfund.backend.controller;

import com.chitfund.backend.dto.ApiResponse;
import com.chitfund.backend.dto.DayBookEntryDTO;
import com.chitfund.backend.service.DayBookService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/daybook")
@RequiredArgsConstructor
public class DayBookController {

    private final DayBookService dayBookService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DayBookEntryDTO>> createEntry(@RequestBody DayBookEntryDTO dto) {
        DayBookEntryDTO created = dayBookService.createEntry(dto);
        return ResponseEntity.ok(ApiResponse.success("DayBook entry created successfully", created));
    }

    @GetMapping("/date/{date}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDailySummary(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Map<String, Object> summary = dayBookService.getDailyDayBook(date);
        return ResponseEntity.ok(ApiResponse.success("Daily summary fetched successfully", summary));
    }
}
