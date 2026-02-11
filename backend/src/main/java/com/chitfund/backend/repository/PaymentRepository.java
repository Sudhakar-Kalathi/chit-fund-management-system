package com.chitfund.backend.repository;

import com.chitfund.backend.domain.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Page<Payment> findByCustomerId(Long customerId, Pageable pageable);

    Page<Payment> findByChitGroupId(Long chitGroupId, Pageable pageable);

    List<Payment> findByPaymentDateBetween(LocalDate startDate, LocalDate endDate);

    // For specific date view
    List<Payment> findByPaymentDate(LocalDate date);
}
