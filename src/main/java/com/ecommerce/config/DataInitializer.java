package com.ecommerce.config;

import com.ecommerce.model.Role;
import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create Business Admin account if it doesn't exist
        if (!userRepository.existsByUsername("businessadmin")) {
            User businessAdmin = new User();
            businessAdmin.setUsername("businessadmin");
            businessAdmin.setPassword(passwordEncoder.encode("admin123"));
            businessAdmin.setEmail("businessadmin@example.com");
            businessAdmin.setFullName("Business Admin");
            
            Set<Role> roles = new HashSet<>();
            roles.add(Role.BUSINESS_ADMIN);
            businessAdmin.setRoles(roles);
            
            userRepository.save(businessAdmin);
            System.out.println("Business Admin account created");
        }

        // Create Admin account if it doesn't exist
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@example.com");
            admin.setFullName("Admin User");
            
            Set<Role> roles = new HashSet<>();
            roles.add(Role.ADMIN);
            admin.setRoles(roles);
            
            userRepository.save(admin);
            System.out.println("Admin account created");
        }

        // Create a regular user account if it doesn't exist
        if (!userRepository.existsByUsername("user")) {
            User user = new User();
            user.setUsername("user");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setEmail("user@example.com");
            user.setFullName("Regular User");
            
            Set<Role> roles = new HashSet<>();
            roles.add(Role.USER);
            user.setRoles(roles);
            
            userRepository.save(user);
            System.out.println("User account created");
        }
    }
} 