package com.chitfund.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Override
    public void run(String... args) throws Exception {
        // Removed hardcoded default credentials for production readiness.
        // In a real system, the first admin should be populated via a secure DB
        // migration
        // script or environment variables, rather than hardcoded in the application
        // layer.
    }
}
