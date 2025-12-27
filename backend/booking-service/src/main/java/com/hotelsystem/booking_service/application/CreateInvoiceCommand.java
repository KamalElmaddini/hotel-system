package com.hotelsystem.booking_service.application;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateInvoiceCommand {
    private Long bookingId;
}
