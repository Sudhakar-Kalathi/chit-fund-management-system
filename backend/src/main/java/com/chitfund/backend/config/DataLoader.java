package com.chitfund.backend.config;

import com.chitfund.backend.domain.User;
import com.chitfund.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create unique admin user if not exists
        if (!userRepository.existsByUsername("admin_master")) {
            User admin = new User();
            admin.setUsername("admin_master");
            admin.setPassword(passwordEncoder.encode("SecureAdmin@2026"));
            admin.setRole("ADMIN");
            admin.setEnabled(true);
            userRepository.save(admin);
            System.out.println("✅ Unique admin user created: admin_master / SecureAdmin@2026");
        }

        // Create unique staff user if not exists
        if (!userRepository.existsByUsername("staff_user")) {
            User staff = new User();
            staff.setUsername("staff_user");
            staff.setPassword(passwordEncoder.encode("StaffPass#2026"));
            staff.setRole("STAFF");
            staff.setEnabled(true);
            userRepository.save(staff);
            System.out.println("✅ Unique staff user created: staff_user / StaffPass#2026");
        }
    }
}
