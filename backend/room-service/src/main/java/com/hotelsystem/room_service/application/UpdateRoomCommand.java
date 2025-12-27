package com.hotelsystem.room_service.application;

import com.hotelsystem.room_service.model.RoomType;
import com.hotelsystem.room_service.model.RoomView;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class UpdateRoomCommand {
    private Long id;
    private String roomNumber;
    private RoomType type;
    private BigDecimal pricePerNight;
    private String description;
    private String imageUrl;
    private List<String> amenities;

    // Extended
    private RoomView viewType;
    private Integer maxGuests;
    private Integer bedCount;
}
