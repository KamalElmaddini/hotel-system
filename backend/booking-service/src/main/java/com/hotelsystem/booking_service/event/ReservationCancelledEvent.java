package com.hotelsystem.booking_service.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationCancelledEvent {
    private Long bookingId;
    private String reason;
    private LocalDateTime cancelledAt;
}
