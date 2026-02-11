package com.chitfund.backend.controller;

import com.chitfund.backend.dto.ApiResponse;
import com.chitfund.backend.dto.PaymentDTO;
import com.chitfund.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PaymentDTO>> createPayment(@RequestBody PaymentDTO dto) {
        PaymentDTO created = paymentService.createPayment(dto);
        return ResponseEntity.ok(ApiResponse.success("Payment recorded successfully", created));
    }

    @GetMapping("/date/{date}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<ApiResponse<List<PaymentDTO>>> getPaymentsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<PaymentDTO> payments = paymentService.getPaymentsByDate(date);
        return ResponseEntity.ok(ApiResponse.success("Payments fetched successfully", payments));
    }

    @GetMapping("/month")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<ApiResponse<List<PaymentDTO>>> getPaymentsByMonth(
            @RequestParam int year, @RequestParam int month) {
        List<PaymentDTO> payments = paymentService.getPaymentsByMonth(year, month);
        return ResponseEntity.ok(ApiResponse.success("Monthly payments fetched successfully", payments));
    }
}
