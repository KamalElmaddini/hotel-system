package com.hotelsystem.booking_service.application;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBookingCommand {
    private Long bookingId;
    private Long roomId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private com.hotelsystem.booking_service.model.BookingStatus status;
}
