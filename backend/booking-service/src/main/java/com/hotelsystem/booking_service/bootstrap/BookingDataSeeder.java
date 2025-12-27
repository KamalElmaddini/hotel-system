package com.hotelsystem.booking_service.bootstrap;

import com.hotelsystem.booking_service.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BookingDataSeeder implements CommandLineRunner {

    private final BookingRepository bookingRepository;

    @Override
    public void run(String... args) throws Exception {
        // Optional: Add seeding logic for bookings if needed
        System.out.println("--- Booking Service Initialized ---");
    }
}
