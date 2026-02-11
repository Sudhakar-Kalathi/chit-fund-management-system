package com.chitfund.backend.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/admin/test")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminTest() {
        return "ADMIN ACCESS OK";
    }

    @GetMapping("/staff/test")
    @PreAuthorize("hasRole('STAFF')")
    public String staffTest() {
        return "STAFF ACCESS OK";
    }

    @GetMapping("/test")
    public String generalTest() {
        return "JWT WORKING";
    }
}
