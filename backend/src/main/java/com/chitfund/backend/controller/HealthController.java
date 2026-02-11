package com.chitfund.backend.controller;

import com.chitfund.backend.common.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/health")
    public ApiResponse<String> healthCheck() {
        return ApiResponse.success("Backend is running", "OK");
    }
}
