package com.hotelsystem.booking_service.application;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class GetBookingsQuery {
    private String guestId;
}
