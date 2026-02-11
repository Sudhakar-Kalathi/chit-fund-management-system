package com.chitfund.backend.service;

import com.chitfund.backend.domain.ChitGroup;
import com.chitfund.backend.domain.Customer;
import com.chitfund.backend.domain.Payment;
import com.chitfund.backend.dto.PaymentDTO;
import com.chitfund.backend.exception.ResourceNotFoundException;
import com.chitfund.backend.mapper.FinanceMapper;
import com.chitfund.backend.repository.ChitGroupRepository;
import com.chitfund.backend.repository.CustomerRepository;
import com.chitfund.backend.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final CustomerRepository customerRepository;
    private final ChitGroupRepository chitGroupRepository;
    private final FinanceMapper financeMapper;

    @Transactional
    public PaymentDTO createPayment(PaymentDTO dto) {
        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        ChitGroup chitGroup = chitGroupRepository.findById(dto.getChitGroupId())
                .orElseThrow(() -> new ResourceNotFoundException("Chit Group not found"));

        Payment payment = new Payment();
        payment.setCustomer(customer);
        payment.setChitGroup(chitGroup);
        payment.setCycleNumber(dto.getCycleNumber());
        payment.setAmountPaid(dto.getAmountPaid());
        payment.setPaymentDate(dto.getPaymentDate());
        payment.setPaymentMode(dto.getPaymentMode());
        payment.setRemarks(dto.getRemarks());

        Payment saved = paymentRepository.save(payment);
        return financeMapper.toPaymentDTO(saved);
    }

    public List<PaymentDTO> getPaymentsByDate(LocalDate date) {
        return paymentRepository.findByPaymentDate(date).stream()
                .map(financeMapper::toPaymentDTO)
                .collect(Collectors.toList());
    }

    public List<PaymentDTO> getPaymentsByMonth(int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        return paymentRepository.findByPaymentDateBetween(startDate, endDate).stream()
                .map(financeMapper::toPaymentDTO)
                .collect(Collectors.toList());
    }
}
