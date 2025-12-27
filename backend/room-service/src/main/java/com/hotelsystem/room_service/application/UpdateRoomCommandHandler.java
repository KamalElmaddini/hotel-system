package com.hotelsystem.room_service.application;

import com.hotelsystem.room_service.model.Amenity;
import com.hotelsystem.room_service.model.Room;
import com.hotelsystem.room_service.repository.AmenityRepository;
import com.hotelsystem.room_service.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UpdateRoomCommandHandler {

    private final RoomRepository roomRepository;
    private final AmenityRepository amenityRepository;

    @Transactional
    public void handle(UpdateRoomCommand command) {
        Room room = roomRepository.findById(command.getId())
                .orElseThrow(() -> new RuntimeException("Room not found with ID: " + command.getId()));

        if (command.getRoomNumber() != null) {
            // Check for duplicates if room number changes
            if (!room.getRoomNumber().equals(command.getRoomNumber()) &&
                    roomRepository.findByRoomNumber(command.getRoomNumber()).isPresent()) {
                throw new RuntimeException("Room with number " + command.getRoomNumber() + " already exists.");
            }
            room.setRoomNumber(command.getRoomNumber());
        }

        if (command.getType() != null) {
            room.setType(command.getType());
        }

        if (command.getPricePerNight() != null) {
            room.setPricePerNight(command.getPricePerNight());
        }

        if (command.getDescription() != null) {
            room.setDescription(command.getDescription());
        }

        // Extended Fields
        if (command.getViewType() != null) {
            room.setViewType(command.getViewType());
        }
        if (command.getMaxGuests() != null) {
            room.setMaxGuests(command.getMaxGuests());
        }
        if (command.getBedCount() != null) {
            room.setBedCount(command.getBedCount());
        }

        // Always update image URL if provided (allow empty string to clear?)
        // For now, only update if not null/empty to allow partial updates if needed,
        // but typically PUT replaces. Let's assume partial update for safety or check
        // frontend.
        if (command.getImageUrl() != null) {
            room.setImageUrl(command.getImageUrl());
        }

        if (command.getAmenities() != null) {
            List<Amenity> amenityEntities = new ArrayList<>();
            for (String amenityName : command.getAmenities()) {
                String trimmedName = amenityName.trim();
                if (!trimmedName.isEmpty()) {
                    Amenity amenity = amenityRepository.findByName(trimmedName)
                            .orElseGet(() -> amenityRepository
                                    .save(new Amenity(null, trimmedName, "Description for " + trimmedName)));
                    amenityEntities.add(amenity);
                }
            }
            room.setAmenities(amenityEntities);
        }

        roomRepository.save(room);
    }
}
