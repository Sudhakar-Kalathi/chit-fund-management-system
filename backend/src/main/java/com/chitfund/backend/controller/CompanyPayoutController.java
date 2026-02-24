package com.chitfund.backend.controller;

import com.chitfund.backend.dto.ApiResponse;
import com.chitfund.backend.dto.CompanyPayoutDTO;
import com.chitfund.backend.service.CompanyPayoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CompanyPayoutController {

    private final CompanyPayoutService payoutService;

    @GetMapping("/payouts/group/{groupId}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<ApiResponse<List<CompanyPayoutDTO>>> getGroupPayouts(@PathVariable Long groupId) {
        return ResponseEntity.ok(ApiResponse.success("Payouts retrieved", payoutService.getPayoutsForGroup(groupId)));
    }

    @PutMapping("/admin/payouts/{id}/pay")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CompanyPayoutDTO>> recordPayoutPayment(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload) {

        BigDecimal amount = new BigDecimal(payload.get("amount").toString());
        LocalDate date = LocalDate.parse(payload.get("date").toString());
        String remarks = payload.getOrDefault("remarks", "").toString();

        return ResponseEntity
                .ok(ApiResponse.success("Payout updated", payoutService.recordPayment(id, amount, date, remarks)));
    }
}
