package com.chitfund.backend.service;

import com.chitfund.backend.domain.Customer;
import com.chitfund.backend.repository.CustomerRepository;
import com.chitfund.backend.dto.CustomerRequestDTO;
import com.chitfund.backend.dto.CustomerResponseDTO;
import com.chitfund.backend.exception.ResourceNotFoundException;
import com.chitfund.backend.mapper.CustomerMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    public CustomerResponseDTO createCustomer(CustomerRequestDTO dto) {
        // Validation for duplicate logic could be enhanced here

        Customer customer = customerMapper.toEntity(dto);
        customer.setCustomerCode("CUST-" + System.currentTimeMillis());
        customer.setActive(true);

        Customer saved = customerRepository.save(customer);
        return customerMapper.toResponse(saved);
    }

    public Page<CustomerResponseDTO> getAllCustomers(Pageable pageable) {
        return customerRepository.findByActiveTrue(pageable)
                .map(customerMapper::toResponse);
    }

    public CustomerResponseDTO getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        return customerMapper.toResponse(customer);
    }

    public Page<CustomerResponseDTO> searchCustomers(String query, Pageable pageable) {
        return customerRepository.findByActiveTrueAndNameContainingIgnoreCaseOrPhoneContaining(query, query, pageable)
                .map(customerMapper::toResponse);
    }

    public CustomerResponseDTO updateCustomer(Long id, CustomerRequestDTO dto) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));

        customerMapper.updateEntity(customer, dto);

        Customer updated = customerRepository.save(customer);
        return customerMapper.toResponse(updated);
    }

    public void softDeleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));

        customer.setActive(false);
        customerRepository.save(customer);
    }
}
