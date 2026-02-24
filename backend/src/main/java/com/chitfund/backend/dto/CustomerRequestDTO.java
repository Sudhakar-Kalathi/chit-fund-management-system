package com.chitfund.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CustomerRequestDTO {

    @NotBlank(message = "Name is required")
    private String name;

    private String keyName; // Introducer name, optional, duplicates allowed

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\d{10}$", message = "Phone number must be 10 digits")
    private String phone;

    @Email(message = "Please enter a valid email address")
    private String email; // Optional

    private String whatsappNo; // Optional, can be same as phone

    private String address;
}
