package com.chitfund.backend.repository;

import com.chitfund.backend.domain.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Search by customer name (case-insensitive)
    List<Payment> findByCustomerNameContainingIgnoreCase(String customerName);

    // View by specific date
    List<Payment> findByPaymentDate(LocalDate date);

    // View by date range (for monthly view)
    List<Payment> findByPaymentDateBetweenOrderByPaymentDateAsc(LocalDate startDate, LocalDate endDate);
}
