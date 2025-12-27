package com.hotelsystem.user_service.bootstrap;

import com.hotelsystem.user_service.model.Client;
import com.hotelsystem.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserDataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;

    public void run(String... args) throws Exception {
        userRepository.findAll()
                .forEach(u -> System.out.println("Existing user: " + u.getName() + " (" + u.getRole() + ")"));

        if (userRepository.count() == 0) {
            seedUsers();
        }

        // Ensure admin always exists
        if (userRepository.findAll().stream().noneMatch(u -> "admin".equals(u.getName()))) {
            com.hotelsystem.user_service.model.Employee admin = new com.hotelsystem.user_service.model.Employee();
            admin.setName("admin");
            admin.setEmail("admin@grandeur.com");
            admin.setPassword("password");
            admin.setRole("ADMIN");
            admin.setEmployeeId("EMP-001");
            admin.setSalary(90000.0);
            admin.setHireDate(java.time.LocalDate.now());
            userRepository.save(admin);
            userRepository.save(admin);
            System.out.println("Admin User Created: " + admin.getName() + " / " + admin.getPassword());
        } else {
            System.out.println("Admin user already exists.");
        }
    }

    private void seedUsers() {
        Client guest1 = new Client();
        guest1.setName("Robert Ford");
        guest1.setEmail("robert.ford@delos.com");
        guest1.setPassword("password"); // In real app, hash this
        guest1.setPhone("555-0101");

        Client guest2 = new Client();
        guest2.setName("Maeve Millay");
        guest2.setEmail("maeve@butterfly.com");
        guest2.setPassword("password");
        guest2.setPhone("555-0102");

        Client guest3 = new Client();
        guest3.setName("Dolores Abernathy");
        guest3.setEmail("dolores@sweetwater.com");
        guest3.setPassword("password");
        guest3.setPhone("555-0103");

        userRepository.save(guest1);
        userRepository.save(guest2);
        userRepository.save(guest3);

        System.out.println("User Data Seeding Completed.");
    }
}
