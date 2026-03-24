package com.chitfund.backend.service;

import com.chitfund.backend.domain.Payment;
import com.chitfund.backend.dto.PaymentDTO;
import com.chitfund.backend.exception.BusinessException;
import com.chitfund.backend.exception.ResourceNotFoundException;
import com.chitfund.backend.mapper.FinanceMapper;
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
    private final FinanceMapper financeMapper;

    @Transactional
    public PaymentDTO createPayment(PaymentDTO dto) {
        Payment payment = financeMapper.toPayment(dto);
        Payment saved = paymentRepository.save(payment);
        return financeMapper.toPaymentDTO(saved);
    }

    @Transactional
    public PaymentDTO updatePayment(Long id, PaymentDTO dto) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        // Enforce 2-week edit restriction
        if (payment.getPaymentDate().isBefore(LocalDate.now().minusWeeks(2))) {
            throw new BusinessException("This payment cannot be edited as it is older than 2 weeks.");
        }

        payment.setCustomerName(dto.getCustomerName());
        payment.setAmountGave(dto.getAmountGave());
        payment.setBalance(dto.getBalance());
        payment.setPaymentTime(dto.getPaymentTime());
        payment.setPaymentDate(dto.getPaymentDate());
        payment.setRemarks(dto.getRemarks());

        return financeMapper.toPaymentDTO(paymentRepository.save(payment));
    }

    @Transactional(readOnly = true)
    public List<PaymentDTO> getPaymentsByDate(LocalDate date) {
        return paymentRepository.findByPaymentDate(date).stream()
                .map(financeMapper::toPaymentDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PaymentDTO> getPaymentsByMonth(int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        return paymentRepository.findByPaymentDateBetweenOrderByPaymentDateAsc(startDate, endDate).stream()
                .map(financeMapper::toPaymentDTO)
                .collect(Collectors.toList());
    }
}
