package com.chitfund.backend.service;

import com.chitfund.backend.domain.Customer;
import com.chitfund.backend.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    public Customer createCustomer(Customer customer) {

        // Duplicate check (business rule)
        if (customerRepository.existsByCustomerCode(customer.getCustomerCode())) {
            throw new RuntimeException("Customer code already exists");
        }

        // Active must always start true (business safety)
        customer.setActive(true);

        return customerRepository.save(customer);
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }
}
