package com.hotelsystem.room_service.application;

import com.hotelsystem.room_service.model.Room;
import com.hotelsystem.room_service.model.RoomStatus;
import com.hotelsystem.room_service.model.RoomView;
import com.hotelsystem.room_service.model.BedType;
import com.hotelsystem.room_service.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CreateRoomCommandHandler {

    private final RoomRepository roomRepository;
    private final com.hotelsystem.room_service.repository.AmenityRepository amenityRepository;

    @Transactional
    public Long handle(CreateRoomCommand command) {
        if (roomRepository.findByRoomNumber(command.getRoomNumber()).isPresent()) {
            throw new RuntimeException("Room with number " + command.getRoomNumber() + " already exists.");
        }

        Room room = new Room();
        room.setRoomNumber(command.getRoomNumber());
        room.setType(command.getType());
        room.setPricePerNight(command.getPricePerNight());
        room.setStatus(RoomStatus.AVAILABLE);
        room.setDescription(command.getDescription());
        room.setImageUrl(command.getImageUrl());

        // Extended Fields
        room.setViewType(command.getViewType());
        room.setMaxGuests(command.getMaxGuests());
        room.setBedCount(command.getBedCount());

        if (command.getAmenities() != null) {
            java.util.List<com.hotelsystem.room_service.model.Amenity> amenityEntities = new java.util.ArrayList<>();
            for (String amenityName : command.getAmenities()) {
                String trimmedName = amenityName.trim();
                if (!trimmedName.isEmpty()) {
                    com.hotelsystem.room_service.model.Amenity amenity = amenityRepository.findByName(trimmedName)
                        .orElseGet(() -> amenityRepository.save(new com.hotelsystem.room_service.model.Amenity(null, trimmedName, "Description for " + trimmedName)));
                    amenityEntities.add(amenity);
                }
            }
            room.setAmenities(amenityEntities);
        }

        Room savedRoom = roomRepository.save(room);
        return savedRoom.getId();
    }
}
