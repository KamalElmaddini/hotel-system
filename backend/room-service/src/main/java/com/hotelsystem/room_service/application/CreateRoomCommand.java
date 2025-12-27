package com.hotelsystem.room_service.application;

import com.hotelsystem.room_service.model.RoomType;
import com.hotelsystem.room_service.model.RoomView;
import com.hotelsystem.room_service.model.BedType;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateRoomCommand {
    private String roomNumber;
    private RoomType type;
    private BigDecimal pricePerNight;
    private String description;
    private String imageUrl;
    private java.util.List<String> amenities;

    // Extended fields
    private RoomView viewType;
    private Integer maxGuests;
    private Integer bedCount;
    private BedType bedType;
}
