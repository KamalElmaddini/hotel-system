package com.hotelsystem.room_service.application;

import com.hotelsystem.room_service.model.RoomType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetAvailableRoomsQuery {
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private RoomType type;
    private com.hotelsystem.room_service.model.RoomStatus status;
    private Double minPrice;
    private Double maxPrice;
    
    // New Filters
    private com.hotelsystem.room_service.model.RoomView viewType;
    private Integer maxGuests;
    private Integer bedCount;
}
