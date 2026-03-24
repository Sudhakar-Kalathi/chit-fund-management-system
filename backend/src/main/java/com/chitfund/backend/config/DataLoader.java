package com.chitfund.backend.config;

import com.chitfund.backend.domain.User;
import com.chitfund.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // --- ADMIN user ---
        Optional<User> adminOpt = userRepository.findByUsername("admin_master");
        if (adminOpt.isPresent()) {
            User admin = adminOpt.get();
            admin.setPassword(passwordEncoder.encode("admin123"));
            userRepository.save(admin);
            System.out.println("✅ admin_master password reset to 'admin123'.");
        } else {
            User admin = User.builder()
                    .username("admin_master")
                    .password(passwordEncoder.encode("admin123"))
                    .role("ADMIN")
                    .enabled(true)
                    .build();
            userRepository.save(admin);
            System.out.println("✅ Created default admin_master user (password: admin123).");
        }

        // --- STAFF user ---
        Optional<User> staffOpt = userRepository.findByUsername("staff_user");
        if (staffOpt.isPresent()) {
            User staff = staffOpt.get();
            staff.setPassword(passwordEncoder.encode("staff123"));
            userRepository.save(staff);
            System.out.println("✅ staff_user password reset to 'staff123'.");
        } else {
            User staff = User.builder()
                    .username("staff_user")
                    .password(passwordEncoder.encode("staff123"))
                    .role("STAFF")
                    .enabled(true)
                    .build();
            userRepository.save(staff);
            System.out.println("✅ Created default staff_user user (password: staff123).");
        }
    }
}
