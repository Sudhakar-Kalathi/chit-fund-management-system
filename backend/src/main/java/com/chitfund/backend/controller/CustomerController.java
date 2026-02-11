package com.chitfund.backend.controller;

import com.chitfund.backend.domain.Customer;
import com.chitfund.backend.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    // ADMIN ONLY - Create
    @PostMapping("/api/admin/customers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) {
        Customer saved = customerService.createCustomer(customer);
        return ResponseEntity.ok(saved);
    }

    // ADMIN + STAFF - View
    @GetMapping("/api/customers")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomers();
    }
}
