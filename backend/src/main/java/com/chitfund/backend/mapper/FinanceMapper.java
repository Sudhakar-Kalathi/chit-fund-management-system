package com.chitfund.backend.mapper;

import com.chitfund.backend.domain.DayBookEntry;
import com.chitfund.backend.domain.Payment;
import com.chitfund.backend.dto.DayBookEntryDTO;
import com.chitfund.backend.dto.PaymentDTO;
import org.springframework.stereotype.Component;

@Component
public class FinanceMapper {

    public PaymentDTO toPaymentDTO(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setCustomerId(payment.getCustomer().getId());
        dto.setCustomerName(payment.getCustomer().getName());
        dto.setChitGroupId(payment.getChitGroup().getId());
        dto.setChitGroupName(payment.getChitGroup().getGroupName());
        dto.setCycleNumber(payment.getCycleNumber());
        dto.setAmountPaid(payment.getAmountPaid());
        dto.setPaymentDate(payment.getPaymentDate());
        dto.setPaymentMode(payment.getPaymentMode());
        dto.setRemarks(payment.getRemarks());
        return dto;
    }

    public DayBookEntry toDayBookEntry(DayBookEntryDTO dto) {
        DayBookEntry entry = new DayBookEntry();
        entry.setEntryDate(dto.getEntryDate());
        entry.setDescription(dto.getDescription());
        entry.setAmount(dto.getAmount());
        entry.setType(dto.getType());
        entry.setCategory(dto.getCategory());
        return entry;
    }

    public DayBookEntryDTO toDayBookEntryDTO(DayBookEntry entry) {
        DayBookEntryDTO dto = new DayBookEntryDTO();
        dto.setId(entry.getId());
        dto.setEntryDate(entry.getEntryDate());
        dto.setDescription(entry.getDescription());
        dto.setAmount(entry.getAmount());
        dto.setType(entry.getType());
        dto.setCategory(entry.getCategory());
        return dto;
    }
}
