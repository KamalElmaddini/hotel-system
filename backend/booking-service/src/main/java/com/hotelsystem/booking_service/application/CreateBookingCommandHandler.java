package com.hotelsystem.booking_service.application;

import com.hotelsystem.booking_service.model.Booking;
import com.hotelsystem.booking_service.model.BookingStatus;
import com.hotelsystem.booking_service.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class CreateBookingCommandHandler {

    private final BookingRepository bookingRepository;
    private final org.springframework.web.client.RestTemplate restTemplate;

    @Transactional
    public Long handle(CreateBookingCommand command) {
        Booking booking = new Booking();
        booking.setGuestId(command.getGuestId());
        booking.setRoomId(command.getRoomId());
        booking.setCheckInDate(command.getCheckInDate());
        booking.setCheckOutDate(command.getCheckOutDate());
        
        // Default Status
        booking.setStatus(BookingStatus.PENDING);
        
        // Fetch Room Price from Room Service
        String roomServiceUrl = "http://localhost:10004/api/rooms/" + command.getRoomId();
        com.hotelsystem.booking_service.application.dto.RoomDTO room = restTemplate.getForObject(roomServiceUrl, com.hotelsystem.booking_service.application.dto.RoomDTO.class);
        
        if (room == null || room.getPricePerNight() == null) {
            throw new RuntimeException("Failed to fetch room details for price calculation.");
        }

        // Calculate Price: Room Price * Days
        long days = ChronoUnit.DAYS.between(command.getCheckInDate(), command.getCheckOutDate());
        if (days < 1) days = 1; // Minimum 1 night
        
        booking.setTotalPrice(room.getPricePerNight().multiply(BigDecimal.valueOf(days)));
        
        Booking savedBooking = bookingRepository.save(booking);
        return savedBooking.getId();
    }
}
