package com.hotelsystem.user_service.config;

import com.hotelsystem.user_service.model.Employee;
import com.hotelsystem.user_service.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;

    public DataSeeder(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Check if admin exists
        // Since we don't have findByUsername yet, let's just create one if count is 0
        // Or better, add findByName to Repo? No, User has name but maybe we use email as username?
        // Let's create an Employee with name "admin"
        
        // Simple check: fetch all and see if any matches. For now, if empty, seed.
        if (userRepository.count() == 0) {
            Employee admin = new Employee();
            admin.setName("admin");
            admin.setPassword("password"); // In real app, use BCrypt
            admin.setEmail("admin@hotel.com");
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("Admin user created: admin / password");
        }
    }
}
