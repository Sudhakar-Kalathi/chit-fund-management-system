package com.chitfund.backend.service;

import com.chitfund.backend.domain.ChitCycle;
import com.chitfund.backend.domain.CompanyPayout;
import com.chitfund.backend.dto.CompanyPayoutDTO;
import com.chitfund.backend.exception.ResourceNotFoundException;
import com.chitfund.backend.mapper.CompanyPayoutMapper;
import com.chitfund.backend.repository.ChitCycleRepository;
import com.chitfund.backend.repository.CompanyPayoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyPayoutService {

    private final CompanyPayoutRepository payoutRepository;
    private final ChitCycleRepository cycleRepository;
    private final CompanyPayoutMapper mapper;

    @Transactional
    public void generatePayoutForCycle(Long cycleId) {
        ChitCycle cycle = cycleRepository.findById(cycleId)
                .orElseThrow(() -> new ResourceNotFoundException("Cycle not found"));

        if (cycle.getWinner() == null || cycle.getChitPayoutAmount() == null) {
            return; // Not ready for payout
        }

        // Check if already exists
        if (payoutRepository.findByChitCycleIdAndActiveTrue(cycleId).isEmpty()) {
            CompanyPayout payout = new CompanyPayout();
            payout.setChitGroup(cycle.getChitGroup());
            payout.setChitCycle(cycle);
            payout.setCustomer(cycle.getWinner());
            payout.setTargetAmount(cycle.getChitPayoutAmount());
            payout.setBalanceAmount(cycle.getChitPayoutAmount());
            payoutRepository.save(payout);
        } else {
            CompanyPayout payout = payoutRepository.findByChitCycleIdAndActiveTrue(cycleId).get();
            // Update target amount if admin changed the payout amount
            BigDecimal newTarget = cycle.getChitPayoutAmount();
            if (payout.getTargetAmount().compareTo(newTarget) != 0) {
                payout.setTargetAmount(newTarget);
                payout.setBalanceAmount(newTarget.subtract(payout.getPaidAmount()));
                payout.setCustomer(cycle.getWinner()); // In case winner changed
                payoutRepository.save(payout);
            }
        }
    }

    public List<CompanyPayoutDTO> getPayoutsForGroup(Long groupId) {
        return payoutRepository.findByChitGroupIdAndActiveTrueOrderByChitCycleMonthNumberAsc(groupId)
                .stream().map(mapper::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public CompanyPayoutDTO recordPayment(Long id, BigDecimal amount, LocalDate date, String remarks) {
        CompanyPayout payout = payoutRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payout not found"));

        payout.setPaidAmount(payout.getPaidAmount().add(amount));
        payout.setBalanceAmount(payout.getTargetAmount().subtract(payout.getPaidAmount()));
        payout.setPayoutDate(date);

        if (payout.getRemarks() != null && !payout.getRemarks().isEmpty()) {
            payout.setRemarks(payout.getRemarks() + " | " + remarks);
        } else {
            payout.setRemarks(remarks);
        }

        if (payout.getBalanceAmount().compareTo(BigDecimal.ZERO) <= 0) {
            payout.setStatus("COMPLETED");
            payout.setBalanceAmount(BigDecimal.ZERO);
        } else {
            payout.setStatus("PARTIAL");
        }

        return mapper.toDTO(payoutRepository.save(payout));
    }
}
