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
        customer.setKeyName(dto.getKeyName());
        customer.setPhone(dto.getPhone());
        customer.setEmail(dto.getEmail());
        customer.setWhatsappNo(dto.getWhatsappNo());
        customer.setAddress(dto.getAddress());
        return customer;
    }

    public CustomerResponseDTO toResponse(Customer customer) {
        CustomerResponseDTO response = new CustomerResponseDTO();
        response.setId(customer.getId());
        response.setCustomerCode(customer.getCustomerCode());
        response.setName(customer.getName());
        response.setKeyName(customer.getKeyName());
        response.setPhone(customer.getPhone());
        response.setEmail(customer.getEmail());
        response.setWhatsappNo(customer.getWhatsappNo());
        response.setAddress(customer.getAddress());
        response.setActive(customer.isActive());
        response.setCreatedAt(customer.getCreatedAt());
        response.setUpdatedAt(customer.getUpdatedAt());
        return response;
    }

    public void updateEntity(Customer customer, CustomerRequestDTO dto) {
        customer.setName(dto.getName());
        customer.setKeyName(dto.getKeyName());
        customer.setPhone(dto.getPhone());
        customer.setEmail(dto.getEmail());
        customer.setWhatsappNo(dto.getWhatsappNo());
        customer.setAddress(dto.getAddress());
    }
}
