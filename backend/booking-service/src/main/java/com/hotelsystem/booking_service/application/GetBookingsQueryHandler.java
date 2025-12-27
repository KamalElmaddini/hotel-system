package com.hotelsystem.booking_service.application;

import com.hotelsystem.booking_service.model.Booking;
import com.hotelsystem.booking_service.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetBookingsQueryHandler {

    private final BookingRepository bookingRepository;

    @Transactional(readOnly = true)
    public List<Booking> handle(GetBookingsQuery query) {
        if (query.getGuestId() != null && !query.getGuestId().isEmpty()) {
            // In a real app, use a custom repository method findByGuestId
            return bookingRepository.findAll().stream()
                    .filter(booking -> query.getGuestId().equals(booking.getGuestId()))
                    .toList();
        }
        return bookingRepository.findAll();
    }
}
