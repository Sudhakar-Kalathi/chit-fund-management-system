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

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

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

    // ADMIN + STAFF - View with Pagination
    @GetMapping("/api/customers")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<ApiResponse<Page<CustomerResponseDTO>>> getAllCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<CustomerResponseDTO> customers = customerService.getAllCustomers(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success("Customers fetched successfully", customers));
    }

    // ADMIN + STAFF - Search
    @GetMapping("/api/customers/search")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<ApiResponse<Page<CustomerResponseDTO>>> searchCustomers(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<CustomerResponseDTO> customers = customerService.searchCustomers(query, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success("Search results fetched successfully", customers));
    }

    // ADMIN + STAFF - Get By ID
    @GetMapping("/api/customers/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<ApiResponse<CustomerResponseDTO>> getCustomerById(@PathVariable Long id) {
        CustomerResponseDTO customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(ApiResponse.success("Customer fetched successfully", customer));
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
