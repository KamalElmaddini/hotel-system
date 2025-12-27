package com.hotelsystem.booking_service.application;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookingCommand {
    private String guestId;
    private Long roomId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
}
