package com.chitfund.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/debug")
@RequiredArgsConstructor
public class PasswordDebugController {

    private final PasswordEncoder passwordEncoder;

    @GetMapping("/encode/{raw}")
    public String encode(@PathVariable String raw) {
        return passwordEncoder.encode(raw);
    }
}
