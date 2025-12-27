package com.hotelsystem.booking_service.application.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class RoomDTO {
    private Long id;
    private String roomNumber;
    private String type;
    private BigDecimal pricePerNight;
}
