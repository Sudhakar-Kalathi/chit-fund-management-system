package com.chitfund.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthFilter jwtAuthFilter;
        private final JwtAuthEntryPoint jwtAuthEntryPoint;

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

                http
                                .cors(org.springframework.security.config.Customizer.withDefaults())
                                // No CSRF for JWT
                                .csrf(csrf -> csrf.disable())

                                // Stateless API
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                                // Proper 401 handling
                                .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthEntryPoint))

                                // 🔐 ROLE-BASED AUTHORIZATION
                                .authorizeHttpRequests(auth -> auth

                                                // Public endpoints only
                                                .requestMatchers(
                                                                "/auth/**",
                                                                "/health",
                                                                "/error")
                                                .permitAll()

                                                // ADMIN only - write operations
                                                .requestMatchers("/api/admin/**")
                                                .hasRole("ADMIN")

                                                // ADMIN or STAFF - read operations
                                                .requestMatchers("/api/staff/**")
                                                .hasAnyRole("ADMIN", "STAFF")

                                                // All other /api/** routes require authentication
                                                .requestMatchers("/api/**")
                                                .authenticated()

                                                // Anything else → must be logged in
                                                .anyRequest().authenticated())

                                // Disable default login mechanisms
                                .formLogin(form -> form.disable())
                                .httpBasic(basic -> basic.disable())

                                // JWT filter
                                .addFilterBefore(
                                                jwtAuthFilter,
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public AuthenticationManager authenticationManager(
                        AuthenticationConfiguration config) throws Exception {
                return config.getAuthenticationManager();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }
}
