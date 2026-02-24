package com.chitfund.backend.service;

import com.chitfund.backend.domain.Customer;
import com.chitfund.backend.dto.CustomerRequestDTO;
import com.chitfund.backend.dto.CustomerResponseDTO;
import com.chitfund.backend.dto.CustomerDetailedDTO;
import com.chitfund.backend.exception.ResourceNotFoundException;
import com.chitfund.backend.mapper.CustomerMapper;
import com.chitfund.backend.mapper.ChitGroupMapper;
import com.chitfund.backend.mapper.FinanceMapper;
import com.chitfund.backend.repository.CustomerRepository;
import com.chitfund.backend.repository.ChitGroupMemberRepository;
import com.chitfund.backend.repository.PaymentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final ChitGroupMemberRepository chitGroupMemberRepository;
    private final PaymentRepository paymentRepository;
    private final CustomerMapper customerMapper;
    private final ChitGroupMapper chitGroupMapper;
    private final FinanceMapper financeMapper;

    public CustomerResponseDTO createCustomer(CustomerRequestDTO dto) {
        if (customerRepository.existsByNameIgnoreCase(dto.getName())) {
            throw new com.chitfund.backend.exception.DuplicateResourceException(
                    "Customer already exists with name: " + dto.getName());
        }

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

    public CustomerDetailedDTO getCustomerDetails(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));

        CustomerDetailedDTO detailedDTO = new CustomerDetailedDTO();
        detailedDTO.setCustomerDetails(customerMapper.toResponse(customer));

        detailedDTO.setGroups(chitGroupMemberRepository.findByCustomerId(id).stream()
                .map(member -> chitGroupMapper.toResponse(member.getChitGroup()))
                .collect(Collectors.toList()));

        detailedDTO.setPayments(paymentRepository.findByCustomerNameContainingIgnoreCase(customer.getName()).stream()
                .map(financeMapper::toPaymentDTO)
                .collect(Collectors.toList()));

        return detailedDTO;
    }

    public Page<CustomerResponseDTO> searchCustomers(String query, Pageable pageable) {
        return customerRepository.findByActiveTrueAndNameContainingIgnoreCaseOrPhoneContaining(query, query, pageable)
                .map(customerMapper::toResponse);
    }

    public CustomerResponseDTO updateCustomer(Long id, CustomerRequestDTO dto) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));

        if (customerRepository.existsByNameIgnoreCaseAndIdNot(dto.getName(), id)) {
            throw new com.chitfund.backend.exception.DuplicateResourceException(
                    "Customer already exists with name: " + dto.getName());
        }

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
