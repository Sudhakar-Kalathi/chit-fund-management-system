package com.chitfund.backend.repository;

import com.chitfund.backend.domain.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByCustomerCode(String customerCode);

    boolean existsByCustomerCode(String customerCode);

    Page<Customer> findByActiveTrue(Pageable pageable);

    Page<Customer> findByNameContainingIgnoreCaseOrPhoneContaining(String name, String phone, Pageable pageable);

    Page<Customer> findByActiveTrueAndNameContainingIgnoreCaseOrPhoneContaining(String name, String phone,
            Pageable pageable);

}
