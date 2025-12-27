package com.hotelsystem.booking_service.application;

import com.hotelsystem.booking_service.model.Booking;
import com.hotelsystem.booking_service.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetBookingQueryHandler {

    private final BookingRepository bookingRepository;

    @Transactional(readOnly = true)
    public Booking handle(GetBookingQuery query) {
        return bookingRepository.findById(query.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + query.getBookingId()));
    }
}
