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
        dto.setCustomerName(payment.getCustomerName());
        dto.setAmountGave(payment.getAmountGave());
        dto.setBalance(payment.getBalance());
        dto.setPaymentTime(payment.getPaymentTime());
        dto.setPaymentDate(payment.getPaymentDate());
        dto.setRemarks(payment.getRemarks());
        return dto;
    }

    public Payment toPayment(PaymentDTO dto) {
        Payment payment = new Payment();
        payment.setCustomerName(dto.getCustomerName());
        payment.setAmountGave(dto.getAmountGave());
        payment.setBalance(dto.getBalance());
        payment.setPaymentTime(dto.getPaymentTime());
        payment.setPaymentDate(dto.getPaymentDate());
        payment.setRemarks(dto.getRemarks());
        return payment;
    }

    public DayBookEntry toDayBookEntry(DayBookEntryDTO dto) {
        DayBookEntry entry = new DayBookEntry();
        entry.setEntryDate(dto.getEntryDate());
        entry.setDescription(dto.getDescription());
        entry.setAmount(dto.getAmount());
        entry.setType(dto.getType());
        entry.setRemarks(dto.getRemarks());
        entry.setEnteredBy(dto.getEnteredBy());
        return entry;
    }

    public DayBookEntryDTO toDayBookEntryDTO(DayBookEntry entry) {
        DayBookEntryDTO dto = new DayBookEntryDTO();
        dto.setId(entry.getId());
        dto.setEntryDate(entry.getEntryDate());
        dto.setDescription(entry.getDescription());
        dto.setAmount(entry.getAmount());
        dto.setType(entry.getType());
        dto.setRemarks(entry.getRemarks());
        dto.setEnteredBy(entry.getEnteredBy());
        return dto;
    }
}
