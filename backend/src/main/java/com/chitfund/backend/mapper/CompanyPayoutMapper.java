package com.chitfund.backend.mapper;

import com.chitfund.backend.domain.CompanyPayout;
import com.chitfund.backend.dto.CompanyPayoutDTO;
import org.springframework.stereotype.Component;

@Component
public class CompanyPayoutMapper {

    public CompanyPayoutDTO toDTO(CompanyPayout payout) {
        CompanyPayoutDTO dto = new CompanyPayoutDTO();
        dto.setId(payout.getId());
        dto.setChitGroupId(payout.getChitGroup().getId());
        dto.setGroupName(payout.getChitGroup().getGroupName());
        dto.setChitCycleId(payout.getChitCycle().getId());
        dto.setMonthNumber(payout.getChitCycle().getMonthNumber());
        dto.setCustomerId(payout.getCustomer().getId());
        dto.setCustomerName(payout.getCustomer().getName());
        dto.setTargetAmount(payout.getTargetAmount());
        dto.setPaidAmount(payout.getPaidAmount());
        dto.setBalanceAmount(payout.getBalanceAmount());
        dto.setPayoutDate(payout.getPayoutDate());
        dto.setStatus(payout.getStatus());
        dto.setRemarks(payout.getRemarks());
        return dto;
    }
}
