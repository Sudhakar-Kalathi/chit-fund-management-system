package com.chitfund.backend.controller;

import com.chitfund.backend.dto.CustomerRequestDTO;
import com.chitfund.backend.dto.CustomerResponseDTO;
import com.chitfund.backend.dto.ApiResponse;
import jakarta.validation.Valid;
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
    public ResponseEntity<ApiResponse<CustomerResponseDTO>> createCustomer(@Valid @RequestBody CustomerRequestDTO dto) {
        CustomerResponseDTO saved = customerService.createCustomer(dto);
        return ResponseEntity.ok(ApiResponse.success("Customer created successfully", saved));
    }

    // ADMIN + STAFF - View
    @GetMapping("/api/customers")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<ApiResponse<List<CustomerResponseDTO>>> getAllCustomers() {
        List<CustomerResponseDTO> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(ApiResponse.success("Customers fetched successfully", customers));
    }

    // ADMIN ONLY - Update
    @PutMapping("/api/admin/customers/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CustomerResponseDTO>> updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody CustomerRequestDTO dto) {
        CustomerResponseDTO updated = customerService.updateCustomer(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Customer updated successfully", updated));
    }

    // ADMIN ONLY - Soft Delete
    @DeleteMapping("/api/admin/customers/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCustomer(@PathVariable Long id) {
        customerService.softDeleteCustomer(id);
        return ResponseEntity.ok(ApiResponse.success("Customer deleted successfully", null));
    }
}
