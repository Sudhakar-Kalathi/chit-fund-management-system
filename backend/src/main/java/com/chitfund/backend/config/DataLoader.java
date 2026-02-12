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
        // Create default admin user if not exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setRole("ADMIN");
            admin.setEnabled(true);
            userRepository.save(admin);
            System.out.println("✅ Default admin user created: admin/admin");
        }

        // Create default staff user if not exists
        if (!userRepository.existsByUsername("staff")) {
            User staff = new User();
            staff.setUsername("staff");
            staff.setPassword(passwordEncoder.encode("staff"));
            staff.setRole("STAFF");
            staff.setEnabled(true);
            userRepository.save(staff);
            System.out.println("✅ Default staff user created: staff/staff");
        }
    }
}
