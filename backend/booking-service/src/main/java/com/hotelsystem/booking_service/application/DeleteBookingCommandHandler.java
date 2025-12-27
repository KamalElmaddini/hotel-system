package com.hotelsystem.booking_service.application;

import com.hotelsystem.booking_service.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeleteBookingCommandHandler {

    private final BookingRepository bookingRepository;

    @Transactional
    public void handle(Long bookingId) {
        if (!bookingRepository.existsById(bookingId)) {
            throw new RuntimeException("Booking not found with id: " + bookingId);
        }
        bookingRepository.deleteById(bookingId);
    }
}
