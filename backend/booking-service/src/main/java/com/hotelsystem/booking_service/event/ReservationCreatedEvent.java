package com.hotelsystem.booking_service.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationCreatedEvent {
    private Long bookingId;
    private String guestId;
    private Long roomId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private BigDecimal totalPrice;
}
