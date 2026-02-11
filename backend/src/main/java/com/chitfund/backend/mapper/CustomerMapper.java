package com.chitfund.backend.mapper;

import com.chitfund.backend.domain.Customer;
import com.chitfund.backend.dto.CustomerRequestDTO;
import com.chitfund.backend.dto.CustomerResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper {

    public Customer toEntity(CustomerRequestDTO dto) {
        Customer customer = new Customer();
        customer.setName(dto.getName());
        customer.setPhone(dto.getPhone());
        customer.setAddress(dto.getAddress());
        // active and customerCode are handled in Service
        return customer;
    }

    public CustomerResponseDTO toResponse(Customer customer) {
        CustomerResponseDTO response = new CustomerResponseDTO();
        response.setId(customer.getId());
        response.setCustomerCode(customer.getCustomerCode());
        response.setName(customer.getName());
        response.setPhone(customer.getPhone());
        response.setAddress(customer.getAddress());
        response.setActive(customer.isActive());
        response.setCreatedAt(customer.getCreatedAt());
        response.setUpdatedAt(customer.getUpdatedAt());
        return response;
    }

    public void updateEntity(Customer customer, CustomerRequestDTO dto) {
        customer.setName(dto.getName());
        customer.setPhone(dto.getPhone());
        customer.setAddress(dto.getAddress());
    }
}
