package com.chitfund.backend.mapper;

import com.chitfund.backend.domain.ChitCycle;
import com.chitfund.backend.domain.ChitGroup;
import com.chitfund.backend.dto.ChitCycleDTO;
import com.chitfund.backend.dto.ChitGroupRequestDTO;
import com.chitfund.backend.dto.ChitGroupResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class ChitGroupMapper {

    public ChitGroup toEntity(ChitGroupRequestDTO dto) {
        ChitGroup group = new ChitGroup();
        group.setGroupName(dto.getGroupName());
        group.setChitAmount(dto.getChitAmount());
        group.setTotalMonths(dto.getTotalMonths());
        group.setTotalMembers(dto.getTotalMonths()); // As per requirement: Total members = Total Months
        group.setMonthlyAmount(dto.getChitAmount().divide(java.math.BigDecimal.valueOf(dto.getTotalMonths()), 2,
                java.math.RoundingMode.HALF_UP));
        group.setStartDate(dto.getStartDate());
        return group;
    }

    public ChitGroupResponseDTO toResponse(ChitGroup group) {
        ChitGroupResponseDTO response = new ChitGroupResponseDTO();
        response.setId(group.getId());
        response.setGroupName(group.getGroupName());
        response.setChitAmount(group.getChitAmount());
        response.setTotalMembers(group.getTotalMembers());
        response.setTotalMonths(group.getTotalMonths());
        response.setMonthlyAmount(group.getMonthlyAmount());
        response.setStartDate(group.getStartDate());
        response.setStatus(group.getStatus());
        // currentMonth not stored in entity; omitted intentionally
        return response;
    }

    public ChitCycleDTO toCycleDTO(ChitCycle cycle) {
        ChitCycleDTO dto = new ChitCycleDTO();
        dto.setId(cycle.getId());
        dto.setMonthNumber(cycle.getMonthNumber());
        dto.setAuctionDate(cycle.getAuctionDate());
        if (cycle.getWinner() != null) {
            dto.setWinnerId(cycle.getWinner().getId());
            dto.setWinnerName(cycle.getWinner().getName());
        }
        dto.setChitPayoutAmount(cycle.getChitPayoutAmount());
        dto.setAuctionAmount(cycle.getAuctionAmount());
        dto.setCommissionAmount(cycle.getCommissionAmount());
        dto.setDividendAmount(cycle.getDividendAmount());
        dto.setFinalMonthlyAmount(cycle.getFinalMonthlyAmount());
        dto.setStatus(cycle.getStatus());
        return dto;
    }
}
