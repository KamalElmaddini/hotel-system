package com.hotelsystem.booking_service.application;

import com.hotelsystem.booking_service.model.Booking;
import com.hotelsystem.booking_service.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.hotelsystem.booking_service.application.dto.RoomDTO;
import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class UpdateBookingCommandHandler {

    private final BookingRepository bookingRepository;
    private final org.springframework.web.client.RestTemplate restTemplate;

    @Transactional
    public void handle(UpdateBookingCommand command) {
        Booking booking = bookingRepository.findById(command.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + command.getBookingId()));

        boolean reciprocityNeeded = false;

        // Update fields if present
        if (command.getRoomId() != null) {
            booking.setRoomId(command.getRoomId());
            reciprocityNeeded = true;
        }
        if (command.getCheckInDate() != null) {
            booking.setCheckInDate(command.getCheckInDate());
            reciprocityNeeded = true;
        }
        if (command.getCheckOutDate() != null) {
            booking.setCheckOutDate(command.getCheckOutDate());
            reciprocityNeeded = true;
        }
        if (command.getStatus() != null) {
            booking.setStatus(command.getStatus());
        }

        // Recalculate price if critical fields changed
        if (reciprocityNeeded) {
            // Fetch Room Details to get Price
            String roomServiceUrl = "http://localhost:10004/api/rooms/" + booking.getRoomId();
            try {
                RoomDTO room = restTemplate.getForObject(roomServiceUrl, RoomDTO.class);
                
                if (room != null) {
                    long days = java.time.temporal.ChronoUnit.DAYS.between(booking.getCheckInDate(), booking.getCheckOutDate());
                    if (days < 1) days = 1; // Minimum 1 night
                    
                    java.math.BigDecimal total = room.getPricePerNight().multiply(java.math.BigDecimal.valueOf(days));
                    booking.setTotalPrice(total);
                }
            } catch (Exception e) {
                // Log error but maybe don't fail the whole update? Or do fail? 
                // For safety, let's throw so data doesn't get corrupted with wrong price
                throw new RuntimeException("Failed to fetch room details for price recalculation: " + e.getMessage());
            }
        }
        
        bookingRepository.save(booking);
    }
}
